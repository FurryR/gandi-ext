import { BlockInfo, BlockType, DynamicMenu, ExtensionMenuItem } from './block'
import { Runtime, TranslationMap } from './runtime'

/**
 * @brief 插件的类型描述。
 */
export interface ExtensionInfo {
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
  blocks: (BlockInfo<BlockType> | string)[] /* 语句表 */
  /** map of menu name to metadata for each of this extension's menus. */
  menus?: {
    [key: string]: ExtensionMenuItem[] | DynamicMenu
  }
}
export interface ExportInfo<T> {
  Extension: { new (runtime: Runtime): T }
  info: {
    name: string
    description: string
    extensionId: string
    iconURL: string
    insetIconURL: string
    featured: boolean
    disabled: boolean
    collaborator: string
    doc?: string
  }
  l10n: TranslationMap
}
