# yapi-code

根据 yapi 接口定义或 JSON 快速生成 Typescript 类型，以及 mock 数据，支持自定义模板（[handlebarsjs](https://handlebarsjs.com/zh/)，[ejs](https://ejs.bootcss.com/#promo)）。

![U4j69U.gif](https://s1.ax1x.com/2020/07/20/U4j69U.gif)

![aSRAyT.gif](https://s1.ax1x.com/2020/07/25/aSRAyT.gif)

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

`umi request.hbs`

```js
{{type}}

{{#if (notEmpty api.req_query)}}
{{#if (eq api.method 'GET')}}
export interface I{{firstUpperCase funcName}}Params {
{{#each api.req_query}}
	{{this.name}}:string,
{{/each}}
}
{{else}}
export interface I{{firstUpperCase funcName}}Data {
{{#each api.req_query}}
	{{this.name}}:string,
{{/each}}
}
{{/if}}
{{/if}}

/**
* {{api.title}}
*
{{#if (eq api.method 'GET')}}
* @param {I{{firstUpperCase funcName}}Params} data
{{else}}
I{{firstUpperCase funcName}}Data} data
{{/if}}
* @returns
*/
export const {{funcName}} = (
{{#if (notEmpty api.req_query)}}
	data: {{#if (eq api.method 'GET')}}I{{firstUpperCase funcName}}Params{{else}}I{{firstUpperCase funcName}}Data{{/if}},
{{/if}}
  ) => {
	return request<{{typeName}}>(\`{{api.query_path.path}}\`, {
	  method: '{{api.method}}',
{{#if (notEmpty api.req_query)}}
{{#if (eq api.method 'GET')}}
      params:data,
{{else}}
	  data,
{{/if}}
{{/if}}
	});
  };
```

**Enjoy!**
