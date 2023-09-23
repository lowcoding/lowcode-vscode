import { Checkbox, Input, Modal } from 'antd';
import React, { FC, useEffect } from 'react';
import { useState } from '@/hooks/useImmer';
import styles from './index.less';

interface IProps {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onOk: (title: string) => void;
}

const UpdateSeesionTitle: FC<IProps> = (props) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (props.visible) {
      setTitle(props.title || '');
    }
  }, [props.visible]);

  const handleOk = () => {
    if (title) {
      props.onOk(title);
    }
  };

  return (
    <Modal
      visible={props.visible}
      closeIcon={' '}
      okText="确定"
      cancelText="取消"
      onCancel={props.onCancel}
      onOk={handleOk}
      className={styles.updateSessionTitle}
    >
      <Input
        bordered={false}
        placeholder="请输入会话标题"
        value={title}
        onChange={(e) => {
          const value = e.target.value;
          setTitle(value);
        }}
      ></Input>
    </Modal>
  );
};

export default UpdateSeesionTitle;
