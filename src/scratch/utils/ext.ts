import { Argument, ArgumentType } from './types/argument'
import {
  BlockInfo,
  BlockType,
  DynamicMenu,
  ExtensionMenuItem,
  ReporterScope
} from './types/block'
import type { ExtensionInfo } from './types/export'
import type { Runtime, TranslationMap } from './types/runtime'
export interface ExtBlockInfo {
  /** The function of the block. */
  func: (runtime: Runtime, args: { [key: string]: unknown }) => unknown
  /** the type of block (command, reporter, etc.) being described. */
  blockType: BlockType
  /** the text on the block, with [PLACEHOLDERS] for arguments. */
  text: string | FormatStr
  /** true if this block should not appear in the block palette. */
  hideFromPalette?: boolean
  /** true if the block ends a stack - no blocks can be connected after it. */
  isTerminal?: boolean
  /** true if this block is a reporter but should not allow a monitor. */
  disableMonitor?: boolean
  /** if this block is a reporter, this is the scope/context for its value. */
  reporterScope?: ReporterScope
  /** sets whether a hat block is edge-activated. */
  isEdgeActivated?: boolean
  /** sets whether a hat/event block should restart existing threads. */
  shouldRestartExistingThreads?: boolean
  /** for flow control blocks, the number of branches/substacks for this block. */
  branchCount?: number
  /** map of argument placeholder to metadata about each arg. */
  arguments?: {
    [key: string]: Argument
  }
  /** Block filter. */
  filter?: string[]
}
export interface Metadata {
  /** 扩展 id。 */
  id: string
  /** 扩展名。 */
  name: string | FormatStr /* 扩展名 */
  /** 主要颜色。 */
  color1?: string
  /** 次要颜色。 */
  color2?: string
  /** Block 前面图像的 URI。支持 Data URI。 */
  blockIconURI?: string
  /** 插件小图标图像的 URI。支持 Data URI。 */
  menuIconURI?: string
  /** Open Documentation 图标指向的路径(可不填)。 */
  docsURI?: string
}
export class Section {
  private _blocks: Map<string, ExtBlockInfo>
  constructor() {
    this._blocks = new Map()
  }
  /**
   * 描述语句块。
   * @param id 语句 ID。
   * @param func 语句对应的函数。
   * @param conf 配置。
   * @returns 自身
   */
  describe(id: string, conf: ExtBlockInfo): Section {
    this._blocks.set(id, conf)
    return this
  }
  /**
   * 获得 Section 目前的语句块。
   */
  get blocks(): Map<string, ExtBlockInfo> {
    return this._blocks
  }
}
export class FormatStr {
  str: string
  constructor(str: string) {
    this.str = str
  }
}
export class ScratchExt {
  private _l10n: TranslationMap
  private _section: Map<string, Section>
  private _menus: Map<
    string,
    ExtensionMenuItem[] | ((runtime: Runtime) => unknown[])
  >
  constructor() {
    void ([this._l10n, this._section, this._menus] = [{}, new Map(), new Map()])
  }
  /**
   * 描述段落。
   * @param name 段落名称
   * @param func 段落处理器
   * @returns 自身
   */
  describe(name: string, func: (section: Section) => void): ScratchExt {
    const sec = new Section()
    func(sec)
    this._section.set(name, sec)
    return this
  }
  /**
   * @brief 新建翻译文本。
   * @param id 翻译 id
   * @param t 翻译语言
   */
  translate(id: string, t: { [key: string]: string }): FormatStr {
    for (const key of Object.keys(t)) {
      let v = this._l10n[key]
      if (v === undefined) {
        v = this._l10n[key] = {}
      }
      v[id] = t[key]
    }
    return new FormatStr(id)
  }
  /**
   * @brief 新建菜单。
   * @param id 菜单 id。
   * @param func 动态菜单或菜单列表。
   */
  menu(
    id: string,
    func: ((runtime: Runtime) => unknown[]) | ExtensionMenuItem[]
  ): string {
    this._menus.set(id, func)
    return id
  }
  /**
   * @brief 导出插件为匿名类；可用于 ExportInfo<unknown>。
   * @param data 插件元数据。
   * @returns 匿名类。
   */
  export(data: Metadata): unknown {
    const _l10n = this._l10n
    const _sec = this._section
    const _menus = this._menus
    class temp {
      private _blocks: (BlockInfo | string)[]
      private _menus: {
        [key: string]: ExtensionMenuItem[] | DynamicMenu
      };
      [key: string]: unknown
      constructor() {
        this._blocks = []
        this._menus = {}
        // data
        if (data.name instanceof FormatStr) {
          data.name = data.name.str
        }
        // menus
        for (const [key, value] of _menus.entries()) {
          if (value instanceof Function) {
            this._menus[key] = { items: key }
            this[key] = (): unknown[] => {
              return value(undefined)
            }
          } else {
            this._menus[key] = value
          }
        }
        // blocks
        for (const [key, value] of _sec.entries()) {
          if (key == '') {
            for (const [key, value2] of value.blocks.entries()) {
              const fn = value2.func
              this._blocks.push(
                Object.assign(value2, {
                  opcode: key,
                  text:
                    value2.text instanceof FormatStr
                      ? value2.text.str
                      : value2.text,
                  func: undefined
                })
              )
              this[key] = (args: { [key: string]: unknown }): unknown => {
                return fn(undefined, args)
              }
            }
          } else {
            this._blocks.push(`---${key}`)
            for (const [key, value2] of value.blocks.entries()) {
              const fn = value2.func
              this._blocks.push(
                Object.assign(value2, {
                  opcode: key,
                  text:
                    value2.text instanceof FormatStr
                      ? value2.text.str
                      : value2.text,
                  func: undefined
                })
              )
              this[key] = (args: { [key: string]: unknown }): unknown => {
                return fn(undefined, args)
              }
            }
          }
        }
      }
      getInfo(): ExtensionInfo {
        const v = data.name
        if (typeof v == 'string') {
          return Object.assign(data, {
            blocks: this._blocks,
            translation_map: _l10n,
            menus: this._menus,
            name: v
          })
        } else {
          return Object.assign(data, {
            blocks: this._blocks,
            translation_map: _l10n,
            menus: this._menus,
            name: v.str
          })
        }
      }
    }
    return new temp()
  }
}
export function StringArg(defaultValue?: string, menu?: string): Argument {
  return { type: ArgumentType.STRING, menu, defaultValue }
}
export function NumberArg(defaultValue?: number, menu?: string): Argument {
  return { type: ArgumentType.NUMBER, menu, defaultValue }
}
interface _ArgBlockInfo {
  /** true if this block should not appear in the block palette. */
  hideFromPalette?: boolean
  /** true if the block ends a stack - no blocks can be connected after it. */
  isTerminal?: boolean
  /** true if this block is a reporter but should not allow a monitor. */
  disableMonitor?: boolean
  /** if this block is a reporter, this is the scope/context for its value. */
  reporterScope?: ReporterScope
  /** sets whether a hat block is edge-activated. */
  isEdgeActivated?: boolean
  /** sets whether a hat/event block should restart existing threads. */
  shouldRestartExistingThreads?: boolean
  /** for flow control blocks, the number of branches/substacks for this block. */
  branchCount?: number
  /** map of argument placeholder to metadata about each arg. */
  arguments?: {
    [key: string]: Argument
  }
  filter?: string[]
}
export class BlockFactory {
  private text: string | FormatStr
  private args: {
    [key: string]: Argument
  } = {}
  private config: _ArgBlockInfo = {}
  private type: BlockType
  constructor(
    type: BlockType,
    text: string | FormatStr,
    args: {
      [key: string]: Argument
    },
    config: _ArgBlockInfo
  ) {
    void ([this.type, this.text, this.args, this.config] = [
      type,
      text,
      args,
      config
    ])
  }
  done(
    func: (runtime: Runtime, args: { [key: string]: unknown }) => unknown
  ): ExtBlockInfo {
    return Object.assign(
      {
        blockType: this.type,
        text: this.text,
        arguments: this.args,
        func
      },
      this.config
    )
  }
}
export function Command(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.COMMAND, text, args, config)
}
export function Boolean(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.BOOLEAN, text, args, config)
}
export function Conditional(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.CONDITIONAL, text, args, config)
}
export function Event(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.EVENT, text, args, config)
}
export function Button(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.BUTTON, text, args, config)
}
export function Hat(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.HAT, text, args, config)
}
export function Loop(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.LOOP, text, args, config)
}
export function Reporter(
  text: string | FormatStr,
  args: {
    [key: string]: Argument
  } = {},
  config: _ArgBlockInfo = {}
): BlockFactory {
  return new BlockFactory(BlockType.REPORTER, text, args, config)
}
