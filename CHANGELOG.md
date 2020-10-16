# Change Log

## 0.1.0

- 支持下载 npm 物料包
- 支持通过可视化更新插件配置项

## 0.0.19

- 支持快速添加代码片段

## 0.0.18

- 支持可视化操作
- 支持物料功能

## 0.0.17

- 改用 `webpack` 打包，减小插件包大小

## 0.0.16

- 支持直接在 `package.json` 中配置，优先级比 `settings.json` 高

## 0.0.15

- 如果通过 vs 编辑器中选中的文本无法解析出 `typeName`，通过 `funcName` 拼凑出 `typeName`，比如 `funcName` 为 `fetch`，则 `typeName` 为 `IFetchResult`。
- 输出变量 `rawSelectedText`，方便在模板中取到 vs 编辑器中选中的原始文本。
- 输出变量 `rawClipboardText`，方便在模板中取到系统剪切板中的原始文本。
- 编辑器右键菜单插件标题由 `YAPI-CODE->生成代码` 改为 `LOW-CODE->生成代码`。

## 0.0.12

- 支持复制对象类型变量作为 json 数据，不需要标准 json 格式。
- 生成的类型可选字段全部转为必选（替换 ?: 为 :）
- 添加配置项，支持配置：根据 json key 关键字生成相应 mock 数据
- 模板中可从 jsonData 取到 json 数据，jsonKeys 取到 json 数据 key 数组
