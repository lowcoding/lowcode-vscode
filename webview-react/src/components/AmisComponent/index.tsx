import React, { useEffect, useRef } from 'react';
import { Button, Space, message } from 'antd';
import { MessageType } from 'antd/lib/message';
import { render } from 'amis';
import './cxd.css';
import './helper.css';
// import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import axios from 'axios';
import {
  ListenerAction,
  ListenerContext,
  registerAction,
  RendererAction,
  RendererEvent,
} from 'amis-core';
import RunScript from '../RunScript';
import { useState } from '@/hooks/useImmer';
import { runScript } from '@/webview/service';

const request: { count: number; hideLoading?: MessageType } = {
  count: 0,
  hideLoading: undefined,
};

interface IProps {
  schema: object;
  scripts?: [
    {
      method: string;
      remark: string;
    },
  ];
  path: string;
  onFormChange: (values: object) => void;
}

// 动作定义
interface IRunScriptAction extends ListenerAction {
  actionType: 'runScript';
  args: {
    method: string; // 动作参数1
    params: string; // 动作参数2
  };
}

const componentData = {
  model: {},
  materialPath: '',
  privateMaterials: false,
};
export class RunScriptAction implements RendererAction {
  // @ts-ignore
  run(
    action: IRunScriptAction,
    renderer: ListenerContext,
    event: RendererEvent<any>,
  ) {
    const props = renderer.props;
    const { method, params } = action.args;
    runScript({
      script: method,
      params,
      model: componentData.model,
      materialPath: componentData.materialPath,
      privateMaterials: componentData.privateMaterials,
      createBlockPath: localStorage.getItem('selectedFolder') || undefined,
      clipboardImage: '',
    });
  }
}

// 注册自定义动作
// @ts-ignore
registerAction('runScript', new RunScriptAction());

export default (props: IProps) => {
  const [scriptModalVisible, setScriptModalVisible] = useState(false);
  const [model, setModel] = useState({} as object);
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
        config.cancelToken = new axios.CancelToken(config.cancelExecutor);
      }

      config.headers = headers || {};
      if (request.count === 0) {
        request.count += 1;
        request.hideLoading = message.loading('loading...', 0);
      }
      if (method !== 'post' && method !== 'put' && method !== 'patch') {
        if (data) {
          config.params = data;
        }
        // (axios as any)[method](url, config)
        return axios
          .request({
            ...config,
            url,
            method,
          })
          .then((res) => {
            if (res.data?.code !== 0 || res.data?.code !== 200) {
              message.error(res.data?.msg || res.data?.message || '请求异常');
            }
            return res;
          })
          .catch((err) => {
            message.error(
              err?.response?.data?.msg ||
                err?.response?.data?.message ||
                err.message,
            );
            return Promise.reject(err);
          })
          .finally(() => {
            if (request.count > 0) {
              request.count -= 1;
            }
            if (request.count <= 0 && request.hideLoading) {
              request.hideLoading();
            }
          });
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

      return axios
        .request({
          ...config,
          url,
          method,
          data,
        })
        .then((res) => {
          if (res.data?.code !== 0 || res.data?.code !== 200) {
            message.error(res.data?.msg || res.data?.message || '请求异常');
          }
          return res;
        })
        .catch((err) => {
          message.error(
            err?.response?.data?.msg ||
              err?.response?.data?.message ||
              err.message,
          );
          return Promise.reject(err);
        })
        .finally(() => {
          if (request.count > 0) {
            request.count -= 1;
          }
          if (request.count <= 0 && request.hideLoading) {
            request.hideLoading();
          }
        });
    },
    isCancel: (value: any) => axios.isCancel(value),
    useMobileUI: false,
    copy: (contents: string, options?: any) => {
      navigator.clipboard.writeText(contents);
      message.success('已复制到剪贴板');
    },
  };

  useEffect(() => {
    componentData.model = model;
    componentData.materialPath = props.path;
  }, [model, props.path]);

  const handleOpenRunScriptModal = () => {
    const values = amisScoped.current
      .getComponentByName('page.form')
      .getValues();
    setModel(values);
    setScriptModalVisible(true);
  };

  const handleRunScriptResult = (result: object) => {
    amisScoped.current.getComponentByName('page.form').setValues(result);
    props.onFormChange(result);
    setScriptModalVisible(false);
  };

  return (
    <>
      {render(
        props.schema as any,
        {
          scopeRef: (ref: any) => {
            amisScoped.current = ref;
          },
          useMobileUI: false,
        },
        env,
      )}
      <br></br>
      <Space>
        <Button type="primary" size="small" onClick={handleOpenRunScriptModal}>
          执行脚本
        </Button>
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
          生成模板数据
        </Button>
      </Space>
      <RunScript
        visible={scriptModalVisible}
        materialPath={props.path}
        model={model}
        scripts={props.scripts}
        onCancel={() => {
          setScriptModalVisible(false);
        }}
        onOk={handleRunScriptResult}
      />
    </>
  );
};
