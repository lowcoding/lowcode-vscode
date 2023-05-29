import React, { useEffect } from 'react';
import { useLocation, history } from 'umi';
import { Spin, message as antdMessage } from 'antd';
import styles from './index.less';
import { getTask } from '@/webview/service';
import { taskHandler } from '@/webview/handleTask';

const RouteWrapper: React.FC = (props) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/index.html' || location.pathname === '/') {
      // 初始化，获取 task，进行路由跳转
      getTask().then((res) => {
        if (res && res.task) {
          if (taskHandler[res.task]) {
            taskHandler[res.task](res.data);
          } else {
            antdMessage.error(`未找到名为 ${res.task} 回调方法!`);
          }
        } else {
          history.push('/snippets');
        }
      });
    }
  }, []);

  if (location.pathname === '/index.html' || location.pathname === '/') {
    return (
      <Spin spinning>
        <div className={styles.wrapper}></div>;
      </Spin>
    );
  }
  return <>{props.children}</>;
};

export default RouteWrapper;
