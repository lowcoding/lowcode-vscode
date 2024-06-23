import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { useState } from '@/hooks/useImmer';
import { runScript } from '@/webview/service';
import { getClipboardImage } from '@/utils/clipboard';

interface IProps {
  visible: boolean;
  materialPath: string;
  model: object;
  scripts?: [{ method: string; remark: string; readClipboardImage?: boolean }];
  privateMaterials?: boolean;
  onCancel: () => void;
  onOk: (result: {
    /** 立即更新 model */
    updateModelImmediately: boolean;
    /** 仅更新参数 */
    onlyUpdateParams: boolean;
    /** 要更新的参数 */
    params?: string;
    model: object;
  }) => void;
}

const RunScript: React.FC<IProps> = (props) => {
  const [script, setScript] = useState('');
  const [params, setParams] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.visible) {
      setLoading(false);
    }
  }, [props.visible]);

  const handleOk = async () => {
    setLoading(true);
    const image = await getClipboardImage().catch((e) => console.log(e));
    runScript({
      script,
      params,
      clipboardImage: image || '',
      model: props.model,
      materialPath: props.materialPath,
      privateMaterials: props.privateMaterials,
      createBlockPath: localStorage.getItem('selectedFolder') || undefined,
    })
      .then((result) => {
        if (result.model) {
          if (result.onlyUpdateParams) {
            setParams(result.params || '');
          } else {
            props.onOk(result);
          }
        } else {
          props.onOk({
            updateModelImmediately: false,
            onlyUpdateParams: false,
            model: result, // 旧版本只返回 model
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title="执行脚本"
      visible={props.visible}
      okButtonProps={{ loading, disabled: !script }}
      maskClosable={false}
      onCancel={props.onCancel}
      onOk={handleOk}
      okText="确定"
      cancelText="取消"
    >
      <Form layout="vertical">
        <Form.Item label="方法">
          <Select
            placeholder="请输入或选择"
            value={script || undefined}
            onChange={(value) => {
              setScript(value);
            }}
          >
            {props.scripts?.map((item) => (
              <Select.Option value={item.method} key={item.method}>
                {`${item.method}${item.remark ? `（${item.remark}）` : ''}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="参数">
          <Input.TextArea
            value={params}
            rows={6}
            onChange={(e) => {
              const value = e.target.value;
              setParams(value);
            }}
          ></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RunScript;
