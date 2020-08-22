# Change Log

## 0.0.12

- 支持复制对象类型变量作为 json 数据，不需要标准 json 格式。
- 生成的类型可选字段全部转为必选（替换 ?: 为 :）
- 添加配置项，支持配置：根据 json key 关键字生成相应 mock 数据
- 模板中可从 jsonData 取到 json 数据，jsonKeys 取到 json 数据 key 数组
