# yapi-code

根据 yapi 接口定义或 JSON 快速生成 Typescript 类型，以及 mock 数据，支持自定义模板（[handlebarsjs](https://handlebarsjs.com/zh/)，[ejs](https://ejs.bootcss.com/#promo)）。

![a9emPf.gif](https://s1.ax1x.com/2020/07/26/a9emPf.gif)

![aSRAyT.gif](https://s1.ax1x.com/2020/07/25/aSRAyT.gif)

## 配置

`0.0.16` 版本之后支持直接在 `package.json` 中配置，优先级比 `settings.json` 高：

```js
// package.json
"yapi-code.project": [
    {
      "name": "价值一个亿的项目",
      "token": "baf6748bf45cd1b924a03d56b8a74e3fb13e744bdxxxxxxxx"
    }
  ],
  "yapi-code.domain": "https://www.google.com",
  "yapi-code.mockKeyWordLike": {
    "icon": "Random.image('48x48')",
    "img": "Random.image('48x48')",
    "image": "Random.image('48x48')",
    "code": "200&&number",
  },
  "yapi-code.mockKeyWordEqual": {
    "total": 200
  },
  "yapi-code.mockString": "Random.cword(5, 6)",
  "yapi-code.mockBoolean": "Random.boolean()",
  "yapi-code.mockNumber": "Random.natural(100,1000)"
```

## 根据 yapi 接口定义生成代码

### 配置 yapi 接口文档域名

![aS6rdA.png](https://s1.ax1x.com/2020/07/25/aS6rdA.png)

或者在 `settings.json` 中配置

```json
"yapi-api.domain": "https://www.google.com"
```

### 配置项目

在 `settings.json` 中配置

```json
"yapi-code.project": [
	{
		"name": "价值一个亿的项目",
		"token": "baf6748bf45cd1b924a03d56b8a74e3fb13e744bd7dd49e222f3a97xxxxxx"
	}
],
```

`token` 在 `yapi` 中取得

![UhujW4.png](https://s1.ax1x.com/2020/07/20/UhujW4.png)

### 配置模板

配置模板路径

默认模板路径为 `codeTemplate` 文件夹下

```json
"yapi-code.templatePath": "codeTemplate/"
```

模板文件类型必须为 `ejs` 或 `hbs`。分别支持 [ejs](https://ejs.bootcss.com/#promo)，[handlebarsjs](https://handlebarsjs.com/zh/) 模板语法

以下为可以在模板中获取到的数据

```js
{
	type: string; // 生成的 ts 接口类型
	requestBodyType：string; // yapi 接口定义需要提交的数据的 ts 接口类型
    funcName: string; // vs 代码编辑器选中的文本通过空格' '分割后的第一个元素
    typeName: string; // vs 代码编辑器选中的文本通过空格' '分割后的第二个元素
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
	inputValues: string[]; // vscode 代码编辑器选中的文本通过空格' '分割后的数组，第一个元素就是`funcName`，第二个为 `typeName`
	mockCode：string; // 生成的 mock 代码，主要是 数组类型数据的生成代码
	mockData: string; // 生成的 mock 数据
	rawSelectedText: string; //编辑器中选中的原始文本
    rawClipboardText: string; //系统剪切板中的原始文本
}
```

支持的 `handlebarsjs` 自定义 `helper`

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

类似之前的需要配置模板。

复制需要生成 `ts` 接口类型的 `JSON` 数据到剪贴板中即可

## 执行插件命令生成代码

当剪贴板中复制了 `yapi` 接口 `id` 或者 `json` 数据

![U4Twvt.png](https://s1.ax1x.com/2020/07/20/U4Twvt.png)

vscode 中光标定位到要生成代码的地方，然后右键选择 "YAPI->生成代码" 菜单，插件内会判断剪贴板内的数据是 `yapi` 接口 `id` 还是 `JSON` 数据。

![U47wi4.png](https://s1.ax1x.com/2020/07/20/U47wi4.png)

![U4L8tU.gif](https://s1.ax1x.com/2020/07/20/U4L8tU.gif)

上面生成代码的模板为(handlebarsjs)

`\n{{type}}\n{{index inputValues 0}}\n{{index inputValues 1}}`

首图使用的模板：

`umi reqeust by yapi.ejs`

```js
<%= type %>
<% if (api.req_query.length > 0 || api.req_params.length > 0) { %>
export interface I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params {
<% api.req_query.map(query => { %><%= query.name %>: 请手动修改此类型;<% }) %>
<% api.req_params.map(query => { %><%= query.name %>: 请手动修改此类型;<% }) %>
}
<% } %>
<% if (requestBodyType) { %>
<%= requestBodyType %>
<% } %>

/**
* <%= api.title %>
* @author <%= api.username %>
*
<% if (api.req_query.length > 0 || api.req_params.length > 0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params} params<% } %>
<% if (requestBodyType) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data} data<% } %>
* @returns
*/
export const <%= funcName %> = (
<% if (api.req_query.length>0 || api.req_params.length > 0) { %>
params: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params,
<% } _%>
<% if (requestBodyType) { %>
data: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data
<% } %>
) => {
return request<<%= typeName %>>(`/galaxy<%= api.query_path.path.replace(/\{/g,"${params.") %><% if(api.req_query.length>0) { %>?=<% api.req_query.map(query => { %><%= query.name %>=${params.<%= query.name %>}&<% }) %><% } %>`, {
		method: '<%= api.method %>',
<% if (requestBodyType) {%>data,<% } %>
	})
}
```

`umi useRequest by yapi.ejs`

```js
<%= type %>
<% if (api.req_query.length > 0 || api.req_params.length > 0) { %>
export interface I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params {
<% api.req_query.map(query => { %><%= query.name %>: 请手动修改此类型;<% }) %>
<% api.req_params.map(query => { %><%= query.name %>: 请手动修改此类型;<% }) %>
}
<% } %>
<% if (requestBodyType) { %>
<%= requestBodyType %>
<% } %>

/**
* <%= api.title %>
* @author <%= api.username %>
*
<% if (api.req_query.length > 0 || api.req_params.length > 0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params} params<% } %>
<% if (requestBodyType) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data} data<% } %>
* @returns
*/
export const <%= funcName %> = (
<% if (api.req_query.length>0 || api.req_params.length > 0) { %>
params: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params,
<% } _%>
<% if (requestBodyType) { %>
data: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data
<% } %>
) => {
return {
    url: `/galaxy<%= api.query_path.path.replace(/\{/g,"${params.") %><% if(api.req_query.length>0) { %>?=<% api.req_query.map(query => { %><%= query.name %>=${params.<%= query.name %>}&<% }) %><% } %>`,
		method: '<%= api.method %>',
<% if (requestBodyType) {%>data,<% } %>
    }
}
```

`mock yapi.ejs`

```js
.<%= api.method.toLowerCase() %>(`<%= api.query_path.path %>`, async (ctx, next) => {
	<%- mockCode %> ctx.body = <%= mockData %>
})

```

# Change Log

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

**Enjoy!**
