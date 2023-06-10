## 关于

低代码工具，支持 ChatGPT

[详细文档](https://lowcoding.gitee.io/)

> 文档不经常更新，新功能使用方法可查看 [releases](https://github.com/lowcoding/lowcode-vscode/releases)

## 支持 ChatGPT

![gpt1.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c30eede4784e4f81a61102c3e85ed06c~tplv-k3u1fbpfcp-zoom-1.image?)

[清晰动图点这里](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c30eede4784e4f81a61102c3e85ed06c~tplv-k3u1fbpfcp-zoom-1.image?)

![gpt2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e27171a5e6f4d128f6193628a48adb5~tplv-k3u1fbpfcp-zoom-1.image?)

[清晰动图点这里](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e27171a5e6f4d128f6193628a48adb5~tplv-k3u1fbpfcp-zoom-1.image?)

### 配置 ChatGPT

![gpt.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/647980a8dddd403bab7fd15194ee16f2~tplv-k3u1fbpfcp-zoom-1.image?)

### 预置 Prompt 模板

使用 lowcode 原有代码片段功能，可以随意预置 Prompt，支持 EJS 模板语法，可快速创建分析代码、重构代码、代码添加注释等 Prompt。

![gpt1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c121c1cf260e4f96b2b68bbcdc3cd5d4~tplv-k3u1fbpfcp-zoom-1.image?)

拉到最底部，配置 chatGPT 字段：

![gpt2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9366c6928c445eb984e9eb036c3d55d~tplv-k3u1fbpfcp-zoom-1.image?)

commandPrompt 既右键菜单选择模板后发送的内容，支持 EJS 模板语法。

viewPrompt 为 代码片段或者区块物料可视化详情页点 Ask ChatGPT 按钮后发送的内容。

### lowcode 代码生成功能结合 ChatGPT

很好的解决了代码变量的命名难题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e74e5ce7c3c4462e8ad7ff099b3dca80~tplv-k3u1fbpfcp-zoom-1.image?)

[清晰动图点这里](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e74e5ce7c3c4462e8ad7ff099b3dca80~tplv-k3u1fbpfcp-zoom-1.image?)

## 不用 ChatGPT ，也可以使用一些常用功能

### 快速创建组件

<p align="center"><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a4d59c06c364d86b9bffb964844b87f~tplv-k3u1fbpfcp-zoom-1.image"/></p>

### 根据 yapi 接口文档生成请求方法

复制接口 id

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e61758ab997d4d5ab81bb5cef3702b11~tplv-k3u1fbpfcp-zoom-1.image)

写好接口方法，选中然后右键
![56.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31ec37302871463b8164fede1f35c845~tplv-k3u1fbpfcp-zoom-1.image?)

> 生成的 ts 类型可能不完全正确，需要手动调整

### 根据 json 生成 api 请求方法

复制 json 数据，比如：

```json
{
  "code": 0,
  "message": "成功",
  "result": {
    "records": [
      {
        "id": 137,
        "code": "mechanisms",
        "name": "外部机构",
        "internalType": 0,
        "needArea": 0,
        "assetTypes": [],
        "serviceLines": [
          {
            "serviceLineCode": "CESHI",
            "serviceLineName": "测试勿动",
            "status": 1
          }
        ]
      }
    ],
    "total": 105,
    "size": 10,
    "current": 1,
    "orders": [],
    "optimizeCountSql": true,
    "hitCount": false,
    "countId": null,
    "maxLimit": null,
    "searchCount": true,
    "pages": 11
  }
}
```

写好接口方法，选中然后右键，选择相应的命令选项
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c587f449465f48f3b9b585e6486557c9~tplv-k3u1fbpfcp-zoom-1.image)

> 需要手动调整参数，接口地址

### 根据 ts 类型生成 api 请求方法

复制 ts 类型，比如：

```ts
[{ name: string; code: string }]
```

写好接口方法，选中然后右键，选择相应的命令选项
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63a96ba4cfb749e6af4daefe00e43b71~tplv-k3u1fbpfcp-zoom-1.image)

### 根据 json 生成 ts 类型

复制 json 数据，比如：

```json
{
  "code": 0,
  "message": "成功",
  "result": {
    "records": [
      {
        "id": 137,
        "code": "mechanisms",
        "name": "外部机构",
        "internalType": 0,
        "needArea": 0,
        "assetTypes": [],
        "serviceLines": [
          {
            "serviceLineCode": "CESHI",
            "serviceLineName": "测试勿动",
            "status": 1
          }
        ]
      }
    ],
    "total": 105,
    "size": 10,
    "current": 1,
    "orders": [],
    "optimizeCountSql": true,
    "hitCount": false,
    "countId": null,
    "maxLimit": null,
    "searchCount": true,
    "pages": 11
  }
}
```

写好类型名称，选中然后右键，选择相应的命令选项
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d101d4fe73846cfb353db53a6fda857~tplv-k3u1fbpfcp-zoom-1.image)

根据 json 替换字段类型
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8525c8ea8e274132ab983e6ce76f6ce0~tplv-k3u1fbpfcp-zoom-1.image)

## mock

下载 mock 项目

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71c5f5f22c19444d9042e2b7feaf25e6~tplv-k3u1fbpfcp-zoom-1.image)

因为墙的原因下载不了的话，可以使用下面仓库地址下载：

https://gitee.com/lowcode-scaffold/lowcode-mock.git (不要直接 clone，用下图的方式)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c32bb3dfbd14f59a6cf40c215e9b373~tplv-k3u1fbpfcp-zoom-1.image)

routes 目录下创建新的 mock 文件
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e52f09da64a3446baeb8cd179df19eaa~tplv-k3u1fbpfcp-zoom-1.image)

### 根据 yapi 接口文档生成 mock

复制接口 id

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0fa6a6f3ed7442cbf6798ae50893e6e~tplv-k3u1fbpfcp-zoom-1.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a21bf99aaca14b3ab6a530cec784b6c2~tplv-k3u1fbpfcp-zoom-1.image)

### 根据 ts 类型生成 mock

复制 ts 类型，比如（不需要复制 `export interface IFetchOrgnizationListResult`）：

```ts
{
  /**
   * 0:成功，其他：失败
   */
  code: number;
  message: string;
  result: {
    /**
     * 当前页数
     */
    current: number;
    hitCount: boolean;
    optimizeCountSql: boolean;
    orders: string[];
    /**
     * 总页数
     */
    pages: number;
    /**
     * 记录
     */
    records: {
      id: number;
      /**
       * 组织名称
       */
      orgNodeName: string;
      /**
       * 组织编码
       */
      orgNodeCode: string;
      /**
       * 组织名称全路径
       */
      fullPath: string;
    }[];
    searchCount: boolean;
    /**
     * 每页展示数
     */
    size: number;
    /**
     * 总数据条数
     */
    total: number;
  };
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e9e2934e844689bf4e28e40d7be63c~tplv-k3u1fbpfcp-zoom-1.image)

### 根据 json 生成 mock

同理，复制 json，选择对应的命令选项。

> 建议所有的前端项目共用同一个 mock 项目，避免频繁切换项目，以及接口冲突。不同的项目在 routes 目录下创建相应的文件。

[mockjs 文档](http://mockjs.com/examples.html)

## 提升列表页、表单开发效率

### 常规查询列表页

以下面原型为例
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/729bdeac96ca4bf78ca50ca41c3a4418~tplv-k3u1fbpfcp-zoom-1.image)

选择列表页区块

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35e5483596ee4a17b6abe1fe730ca160~tplv-k3u1fbpfcp-zoom-1.image)

配置表单

https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b24b7d804ac4db1a3673fd2aa4aa4cd~tplv-k3u1fbpfcp-zoom-1.image

生成代码

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8d4a0d04ba645e290ba787592d7d62f~tplv-k3u1fbpfcp-zoom-1.image)

若后端已经提供 yapi 接口文档，可以同时使用根据 yapi 接口文档生成请求方法的功能：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2f5863ce23b485bb1144c4d56829c6b~tplv-k3u1fbpfcp-zoom-1.image)
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/853eadf031e049c0ac22d63771b4ab7f~tplv-k3u1fbpfcp-zoom-1.image)

根据生成的 ts 类型，可直接生成对应 mock 服务。

```json
{
  "filters": [
    {
      "label": "商户",
      "key": "merchant",
      "component": "input",
      "placeholder": "输入查询"
    },
    {
      "key": "orderNo",
      "label": "订单号",
      "component": "input",
      "placeholder": "输入查询"
    },
    {
      "key": "status",
      "label": "订单状态",
      "component": "select",
      "placeholder": "请选择"
    },
    {
      "label": "收货手机号",
      "key": "mobile",
      "component": "select",
      "placeholder": "输入查询"
    },
    {
      "key": "time",
      "label": "时间",
      "component": "select"
    }
  ],
  "columns": [
    {
      "title": "订单号",
      "dataIndex": "orderNo",
      "key": "orderNo",
      "slot": true
    },
    {
      "title": "订单付款时间",
      "dataIndex": "payTime",
      "key": "payTime"
    },
    {
      "title": "订单状态",
      "dataIndex": "orderStatus",
      "key": "orderStatus"
    },
    {
      "title": "订单金额",
      "dataIndex": "orderAmount",
      "key": "orderAmount"
    },
    {
      "title": "商户",
      "dataIndex": "merchantInfo",
      "key": "merchantInfo",
      "slot": true
    },
    {
      "title": "客户信息",
      "dataIndex": "customerInfo",
      "key": "customerInfo",
      "slot": true
    },
    {
      "title": "关联合同",
      "dataIndex": "contractInfo",
      "key": "contractInfo",
      "slot": true
    }
  ],
  "includeModifyModal": false,
  "pagination": {
    "show": true,
    "page": "page",
    "size": "size",
    "total": "result.total"
  },
  "fetchName": "fetchTableList",
  "result": "[\"result\"][\"records\"]",
  "serviceName": "getTableList",
  "modifyModal": {
    "formItems": [
      {
        "showMore": true,
        "component": "textarea",
        "required": true
      }
    ]
  }
}
```

### 表单

选择表单区块，配置 Schema 表单

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a0c793a67924583a4cb83569483687c~tplv-k3u1fbpfcp-zoom-1.image)

## 自定义区块

创建新的区块

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48f22790459d49f7b708a7684f9d2321~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca76e8e939334df48d7bd3512dadf40a~tplv-k3u1fbpfcp-zoom-1.image)

配置 Schema 表单：复制旧区块的 schema.json 内容覆盖到当前区块的 schema.json 文件内。将 schema 字段内容导入网页 https://xrender.fun/~demos/docs-generator-demo-0 中重新配置。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ff82a358f9c4934859330099386d21d~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c7954e3951049a69eb29d938d9823ca~tplv-k3u1fbpfcp-zoom-1.image)
