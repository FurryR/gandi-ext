import { ScratchExt, Reporter, StringArg } from './turbowarp/utils/ext'
import { Runtime } from './turbowarp/utils/types/runtime'
/*
Scratch example
*/
export default ((): { new (runtime: Runtime): unknown } => {
  // 描述你的插件
  const ext = new ScratchExt()
  /**
   * 一个段落定义一类插件。
   */
  ext.describe('测试', sec => {
    sec.describe(
      'minifyJSON',
      Reporter(
        ext.translate('Example.minifyJSON', {
          'zh-cn': '【测试】最小化 [json]',
          en: '【Test】Minify [json]'
        }),
        { json: StringArg('{}') }
      ).done((_, args) => {
        const v = args['json']
        if (typeof v == 'string') {
          try {
            return JSON.stringify(JSON.parse(v))
          } catch (_) {
            return
          }
        }
        return
      })
    )
  })

  // metadata
  return ext.export({
    id: 'Example' /* 扩展 id */,
    name: ext.translate('Example.extensionName', {
      'zh-cn': '测试',
      en: 'test'
    }) /* 拓展名 */,
    color1: '#8A8A8A' /* 颜色 */,
    menuIconURI: '',
    blockIconURI: ''
  })
})()
