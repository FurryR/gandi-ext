import { Argument } from './types/argument'
import type {
  BlockInfo,
  BlockType,
  DynamicMenu,
  ExtensionMenuItem,
  ReporterScope
} from './types/block'
import type { ExtensionInfo } from './types/export'
import type { Runtime, TranslationMap } from './types/runtime'
export interface ExtBlockInfo<T extends BlockType> {
  /** the type of block (command, reporter, etc.) being described. */
  blockType: T
  /** the text on the block, with [PLACEHOLDERS] for arguments. */
  text: string
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
}
export interface Metadata {
  /** 扩展 id。 */
  id: string
  /** 扩展名。 */
  name: string /* 扩展名 */
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
  private _blocks: Map<
    string,
    {
      conf: ExtBlockInfo<BlockType>
      func: (runtime: Runtime, args: { [key: string]: unknown }) => unknown
    }
  >
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
  describe<T extends BlockType>(
    id: string,
    func: (runtime: Runtime, args: { [key: string]: unknown }) => unknown,
    conf: ExtBlockInfo<T>
  ): Section {
    this._blocks.set(id, {
      conf,
      func
    })
    return this
  }
  /**
   * 获得 Section 目前的语句块。
   */
  get blocks(): Map<
    string,
    {
      conf: ExtBlockInfo<BlockType>
      func: (runtime: Runtime, args: { [key: string]: unknown }) => unknown
    }
  > {
    return this._blocks
  }
}
export class GandiExt {
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
  describe(name: string, func: (section: Section) => void): GandiExt {
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
  translate(id: string, t: { [key: string]: string }): string {
    for (const key of Object.keys(t)) {
      let v = this._l10n[key]
      if (v === undefined) {
        v = this._l10n[key] = {}
      }
      v[id] = t[key]
    }
    return 'EXT_FORMAT#' + id
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
    if (func instanceof Function) {
      this._menus.set(id, func)
    } else {
      this._menus.set(id, func)
    }
    return id
  }
  /**
   * @brief 导出插件为匿名类；可用于 ExportInfo<unknown>。
   * @param data 插件元数据。
   * @returns 匿名类。
   */
  export(data: Metadata): { new (runtime: Runtime): unknown } {
    const _l10n = this._l10n
    const _sec = this._section
    const _menus = this._menus
    return class {
      private formatMessage: (id: string) => string
      private runtime: Runtime
      private _blocks: (BlockInfo<BlockType> | string)[]
      private _menus: {
        [key: string]: ExtensionMenuItem[] | DynamicMenu
      };
      [key: string]: unknown
      constructor(runtime: Runtime) {
        const fmt = runtime.getFormatMessage(_l10n)
        this.runtime = runtime
        this._blocks = []
        this._menus = {}
        this.formatMessage = (id: string) =>
          fmt({ id, default: id, description: id })
        // data
        if (data.name.startsWith('EXT_FORMAT#')) {
          data.name = this.formatMessage(data.name.substring(11))
        }
        // menus
        for (const [key, value] of _menus.entries()) {
          if (value instanceof Function) {
            this._menus[key] = { items: key }
            this[key] = (): unknown[] => {
              return value(this.runtime)
            }
          } else {
            this._menus[key] = value
          }
        }
        // blocks
        for (const [key, value] of _sec.entries()) {
          if (key == '') {
            for (const [key, value2] of value.blocks.entries()) {
              this._blocks.push(
                Object.assign(value2.conf, {
                  opcode: key,
                  text: value2.conf.text.startsWith('EXT_FORMAT#')
                    ? this.formatMessage(value2.conf.text.substring(11))
                    : value2.conf.text
                })
              )
              this[key] = (args: { [key: string]: unknown }): unknown => {
                return value2.func(this.runtime, args)
              }
            }
          } else {
            this._blocks.push(`---${key}`)
            for (const [key, value2] of value.blocks.entries()) {
              this._blocks.push(
                Object.assign(value2.conf, {
                  opcode: key,
                  text: value2.conf.text.startsWith('EXT_FORMAT#')
                    ? this.formatMessage(value2.conf.text.substring(11))
                    : value2.conf.text
                })
              )
              this[key] = (args: { [key: string]: unknown }): unknown => {
                return value2.func(this.runtime, args)
              }
            }
          }
        }
      }
      getInfo(): ExtensionInfo {
        return Object.assign(data, {
          blocks: this._blocks,
          l10n: _l10n,
          menus: this._menus
        })
      }
    }
  }
}
