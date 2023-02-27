import { GandiExt } from './utils/ext'
import { ArgumentType } from './utils/types/argument'
import { BlockType } from './utils/types/block'
import type { ExportInfo } from './utils/types/export'
export default ((): ExportInfo<unknown> => {
  // 描述你的插件
  const ext = new GandiExt()
  /**
   * 一个段落定义一类插件。
   */
  ext.describe('测试', sec => {
    sec.describe(
      'minifyJSON',
      (_, args) => {
        const v = args['json']
        if (typeof v == 'string') {
          try {
            return JSON.stringify(JSON.parse(v))
          } catch (_) {
            return
          }
        }
        return
      },
      {
        blockType: BlockType.REPORTER,
        text: ext.translate('Example.minifyJSON', {
          'zh-cn': '【测试】最小化 [json]',
          en: '【Test】Minify [json]'
        }),
        arguments: {
          json: {
            type: ArgumentType.STRING,
            defaultValue: '{}'
          }
        }
      }
    )
  })

  // metadata
  return {
    Extension: ext.export({
      id: 'Example' /* 扩展 id */,
      name: ext.translate('Example.extensionName', {
        'zh-cn': '测试',
        en: '测试'
      }) /* 拓展名 */,
      color1: '#8A8A8A' /* 颜色 */,
      menuIconURI: '',
      blockIconURI: ''
    }),
    info: {
      name: 'Example.extensionName',
      description: 'Example.description',
      extensionId: 'Example',
      iconURL: '',
      insetIconURL: '',
      featured: true,
      disabled: false,
      collaborator: 'FurryR'
    },
    l10n: {
      'zh-cn': {
        'Example.extensionName': 'Gandi-Ext 测试',
        'Example.description': '又一个 Typescript Gandi 插件模板！'
      },
      en: {
        'notjs.extensionName': 'Gandi-Ext Test',
        'notjs.description': 'Yet another Typescript extension template for Gandi IDE.'
      }
    }
  }
})()
