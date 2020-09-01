# Vue3与TSX尝鲜版
## 涉及到的主要依赖
1. `vite@1.0.0-beta.11`：新一代脚手架
2. `vue@3.0.0-beta.22`：beta版
3. `vuex@4.0.0-beta.4`
4. `vue-router@4.0.0-beta.2`
5. `typescript@3.9.6`

## 准备工作
1. 确保安装`yarn`
```bash
npm install yarn -g
```
2. 确保安装`vite`脚手架
```bash
npm install -g create-vite-app
# or
yarn add -g create-vite-app
```

## 开始
### 项目初始化
```bash
yarn create vite-app <project-name>
```

### 集成TS
```bash
yarn add --dev typescript
```
项目根目录创建配置文件：`tsconfig.json`：
```js
{
  "include": ["./**/*.ts"],
  "compilerOptions": {
    "jsx": "react",
    "target": "es2020" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    // "lib": ["es2017.object"] /* Specify library files to be included in the compilation. */,
    // "declaration": true /* Generates corresponding '.d.ts' file. */,
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true /* Generates corresponding '.map' file. */,
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "./dist" /* Redirect output structure to the directory. */,

    "strict": true /* Enable all strict type-checking options. */,
    "noUnusedLocals": true /* Report errors on unused locals. */,
    "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,

    "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
  }
}
```

### 集成eslint
```bash
yarn add --dev eslint eslint-plugin-vue
```
项目根目录创建配置文件`.eslintrc.js`：
```js
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      // tsx: true, // Allows for the parsing of JSX
      jsx: true,
    },
  },
  // settings: {
  //   tsx: {
  //     version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
  //   }
  // },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
};
```

### 集成pritter
```bash
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
```
项目根目录创建配置文件：`.prettierrc.js`：
```js
module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  endOfLine:"auto"
};
```

到这一步，一个Vue3+TSX的项目就搭建起来了，以上配置文件的具体内容就不做解释了。

### 修改入口文件
因为默认项目模板是以`src/main.js`为入口的，我们需要把它修改为`src/main.ts`。  
在`根目录的index.html`中修改入口文件的引用即可：
```html
... ...
<body>
  ... ...
  <script type="module" src="/src/main.ts"></script>
</body>
</html>

```

### 优化TS类型推断
在src目录下，创建`shim.d.ts、source.d.ts`  

`shim.d.ts`: (这个其实不太需要，因为项目中全是通过tsx开发的)
```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```
`source.d.ts`: (优化编译器提示，声明静态资源文件)
```ts
declare const React: string;
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
```

### 集成vue-router
```bash
yarn add --dev vue-router@4.0.0-beta.2
```
这里可以去`npm官网`查找最新版本  
在src目录下，`新建router文件夹`，并在文件夹内`创建index.ts`
`index.ts`:
```js
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: import('../views/Home'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

```  
这里创建router的方式与之前不同，在vue3中，结合TS的类型推断，开发效率会高很多。  

### 集成vuex

```bash
yarn add --dev vuex@4.0.0-beta.4
```
在src目录下，新建store文件夹，并在文件夹内创建`index.ts`  

`index.ts`:  
```js
import { state } from './state';
import { createStore } from 'vuex';

export default createStore({
  state,
  mutations: {},
  actions: {},
  modules: {},
});
```
`state.js`:
```js
export interface State {
  title: string;
}

export const state: State = {
  title: 'Vue(v3) 与 tsx 的结合~',
};
```
### main.ts
最终main.ts中引入store、router：
```js
import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';

createApp(App).use(router).use(store).mount('#app');
```  
### TSX
最终我们的组件代码，都会是这样的：`App.tsx`:  
```js
import { defineComponent } from 'vue';
import {RouterLink, RouterView} from 'vue-router';
import './style/main.scss'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <div id="nav">
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/about">About</RouterLink>
        </div>
        <RouterView/>
      </>
    );
  }
});
```  
自我感觉TSX比模板好多了，并且html、组件标签的属性都带有类型推断。

## 结尾
vue3正式版的发布，势必导致vue2的周边框架的集体更新，例如UI框架、基于Vue2的指令库等，作为这么久的白嫖党，也要为vue3社区的建设出一份力了。
  
   
Vue3与TS的结合是大趋势，如果不适应TS，那还是建议使用Vue2吧。23333~
  

后续博主也将研究vite框架和vue3全家桶的新特性与API，争取输出有质量的文档。  
***
参考文章： [https://github.com/hyperMoss/vue-tsx](https://github.com/hyperMoss/vue-tsx)
