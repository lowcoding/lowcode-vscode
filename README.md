# yapi-code

根据 yap 接口定义或 JSON 快速生成 Typescript 类型，支持自定义模板。

## 根据 yapi 接口定义生成代码

### 配置 yapi 接口文档域名

![UhngC4.png](https://s1.ax1x.com/2020/07/20/UhngC4.png)

或者在 `settings.json` 中配置

```json
"yapi.domain": "https://www.google.com"
```

### 配置项目

在 `settings.json` 中配置

```json
"yapi.project": [
		{
			"name": "一个伟大的项目",
			"token": "baf6748bf45cd1b924a03d56b8a74e3fb13e744bd7dd49e222f3a97xxxxxx"
		}
	],
```

`token` 在 `yapi` 中取得

![UhujW4.png](https://s1.ax1x.com/2020/07/20/UhujW4.png)

### 配置模板

```json
"yapi.codeTemplate": [
		{
			"name": "json to ts",
			"template": "{{type}}"
		}
	]
```

`{{type}}` 为模板语法，取得生成的 `ts` 接口类型。内部使用 [handlebarsjs](https://handlebarsjs.com/zh/) 模板引擎解析模板，所以支持自定义模板。

以下为可以在模板中获取到的数据

```js
{
    type: string; // 生成的ts 接口类型
    funcName: string; // vs 代码编辑器选中的文本通过空格' '分割后的第一个元素
    typeName: string; // vs 代码编辑器选中的文本通过空格' '分割后的第一个元素
    api: {
        query_path: {
            path: string;
        };
        method: string;
        title: string;
        project_id: number;
        req_params: {
			name: string;
			desc: string;
		}[];
        _id: number;
        req_query: { required: '0' | '1'; name: string }[];
        res_body_type: "raw" | "json";
        res_body: string;
        username: string;
    }; // yapi 接口返回的信息，这里只列出可能需要的字段，模板中可以访问到全部
    inputValues: string[]; // vs 代码编辑器选中的文本通过空格' '分割后的数组，第一个元素就是`funcName`，第二个为 `typeName`
}
```

支持的 `handlebarsjs` 自定义助手

```js
registerHelper('notEmpty', (array: []) => {
  return array.length > 0;
});

registerHelper('eq', (arg1, arg2) => {
  return arg1 === arg2;
});

registerHelper('in', (item, array: any[], item2) => {
  return array.indexOf(item) > -1;
});

registerHelper('firstUpperCase', (value) => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
});

registerHelper('index', (array: any[], index: number) => {
  return array[index];
});
```

## 根据 JSON 生成代码

类似

**Enjoy!**
