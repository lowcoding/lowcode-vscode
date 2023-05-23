import React from 'react';
import { Button, Input } from 'antd';
import { usePresenter } from './presenter';

const { TextArea } = Input;

const View = () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div>
      <div>
        {model.chatList.map((s) => (
          <div>
            <div>{s.prompt}</div>
            <div>{s.res}</div>
          </div>
        ))}
        {model.current.prompt && (
          <div>
            <div>{model.current.prompt}</div>
            <div>{model.current.res}</div>
          </div>
        )}
      </div>
      <TextArea
        value={model.inputChatPrompt}
        onChange={(e) => {
          const { value } = e.target;
          model.setInputChatPrompt(value);
        }}
      ></TextArea>
      <Button onClick={presenter.handleSubmit}>确定</Button>
    </div>
  );
};

export default View;
