import React, { useRef } from 'react';
import { Button, Space } from 'antd';
import { render } from 'amis';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import axios from 'axios';

interface IProps {
  schema: object;
  onFormChange: (values: object) => void;
}

export default (props: IProps) => {
  const amisScoped = useRef<any>();
  const env = {
    // 下面三个接口必须实现
    fetcher: ({
      url, // 接口地址
      method, // 请求方法 get、post、put、delete
      data, // 请求数据
      responseType,
      config, // 其他配置
      headers, // 请求头
    }: any) => {
      config = config || {};
      config.withCredentials = true;
      responseType && (config.responseType = responseType);

      if (config.cancelExecutor) {
        config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor);
      }

      config.headers = headers || {};

      if (method !== 'post' && method !== 'put' && method !== 'patch') {
        if (data) {
          config.params = data;
        }
        return (axios as any)[method](url, config);
      }
      if (data && data instanceof FormData) {
        config.headers = config.headers || {};
        config.headers['Content-Type'] = 'multipart/form-data';
      } else if (
        data &&
        typeof data !== 'string' &&
        !(data instanceof Blob) &&
        !(data instanceof ArrayBuffer)
      ) {
        data = JSON.stringify(data);
        config.headers = config.headers || {};
        config.headers['Content-Type'] = 'application/json';
      }

      return (axios as any)[method](url, data, config);
    },
    isCancel: (value: any) => (axios as any).isCancel(value),
  };
  return (
    <>
      {render(
        props.schema as any,
        {
          scopeRef: (ref: any) => {
            amisScoped.current = ref;
          },
        },
        env,
      )}
      <br></br>
      <Space>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            const values = amisScoped.current
              .getComponentByName('page.form')
              .getValues();
            props.onFormChange(values);
          }}
        >
          重新生成模板数据
        </Button>
      </Space>
    </>
  );
};
