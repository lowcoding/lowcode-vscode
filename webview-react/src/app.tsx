import { history } from 'umi';
export function render(oldRender: () => {}) {
  history.push('/');
  oldRender();
}
