import { history } from 'umi';
import './app.less';
export function render(oldRender: () => {}) {
  history.push('/index');
  oldRender();
}
