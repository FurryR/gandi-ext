# gandi-ext

gandi-ext 用于实现兼容 Turbowarp <=> Gandi 插件。
一次编写，两个平台运行。

# 用法

## Gandi

1. 请在 `index.js` 内写代码，然后编辑 `_gandi_export.ts`：

```ts
export default {
  Extension: async () => exportv,
  info: {
    name: '...',
    collaborator: '...'
  } /* 请在这里填写插件信息 */,
  l10n: {
    'sample.sample': '...'
  } /* 请在这里填写插件翻译 */
}
```

具体格式请参照 Gandi 官方示例。

2. 然后，请运行以下命令：

```bash
npm run gandi-build
```

即可在 `dist/static/js/main.js` 获得编译完成的插件。

## Turbowarp

1. 请在 `index.js` 内写代码。

2. 然后，请运行以下命令：

```bash
npm run turbowarp-build
```

即可在 `dist/static/js/main.js` 获得编译完成的插件。

## Gandi <=> Turbowarp

- 在 `index.js` 内，将所有 `./turbowarp/utils/` 的引用换为 `./gandi/utils/` 即可完成转换，反之同理。

# 注意

这个项目未经测试，不做安全性/稳定性保障。