import React from 'react';
import { Button, Input } from 'antd';
import { usePresenter } from './presenter';

const { TextArea } = Input;

const View = () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div>
      <div>result: {model.chatRes}</div>
      <TextArea
        value={model.chatPrompt}
        onChange={(e) => {
          const { value } = e.target;
          model.setChatPrompt(value);
        }}
      ></TextArea>
      <Button onClick={presenter.handleSubmit}>确定</Button>
    </div>
  );
};

export default View;
