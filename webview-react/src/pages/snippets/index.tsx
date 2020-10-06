import React from 'react';
import { Button, message } from 'antd';
import { callVscode } from '@/webview';

export default () => {
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          callVscode({ cmd: 'alert', data: '来自webview的消息' }, data => {
            message.success(data);
          });
        }}
      >
        请求VSCODE
      </Button>
    </div>
  );
};
