// import axios from 'axios';

// axios.get('https://gitee.com/lowcoding/lowcode-materials-template/raw/master/package.json').then(res=>{
// 	console.log(res.data);
// });

class A {
  private name = 'ss';
  public getName() {
    return this.name;
  }
}
(global as any).A = A;
const className = 'A';
const getInstance = new Function(`return new global.${className}()`);
const a = getInstance();
console.log(a.getName());
