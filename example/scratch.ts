import { Reporter, ScratchExt, StringArg } from '../src/scratch/utils/ext'
import { Scratch } from '../src/scratch/utils/types/export'

declare const Scratch: Scratch
const ext = new ScratchExt()
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
Scratch.extensions.register(
  ext.export({
    id: 'Example' /* 扩展 id */,
    name: ext.translate('Example.extensionName', {
      'zh-cn': '测试',
      en: '测试'
    }) /* 拓展名 */,
    color1: '#8A8A8A' /* 颜色 */,
    menuIconURI: '',
    blockIconURI: ''
  })
)
