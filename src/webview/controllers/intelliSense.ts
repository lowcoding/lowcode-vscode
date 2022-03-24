import { registerCompletion } from '../../commands/registerCompletion';
import { getExtensionContext } from '../../context';

export const refreshIntelliSense = () => {
  const context = getExtensionContext();
  if (context) {
    registerCompletion(context);
    return '刷新成功';
  }
  throw new Error('刷新失败');
};
