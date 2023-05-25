import React from 'react';
import { Button, Input } from 'antd';
import { usePresenter } from './presenter';
import Marked from '@/components/Marked';
import styles from './index.less';

const { TextArea } = Input;

const View = () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div className={styles.chatGpt}>
      <div className={styles.list}>
        {model.chatList.map((s) => (
          <div>
            <div className={styles.promptWrapper}>
              <div className={styles.prompt}>{s.prompt}</div>
            </div>
            <div className={styles.resWrapper}>
              <div className={styles.res}>
                <Marked text={s.res}></Marked>
              </div>
            </div>
          </div>
        ))}
        {model.current.prompt && (
          <div>
            <div className={styles.promptWrapper}>
              <div className={styles.prompt}>{model.current.prompt}</div>
            </div>
            {model.current.res && (
              <div className={styles.resWrapper}>
                <div className={styles.res}>
                  <Marked text={model.current.res}></Marked>
                </div>
              </div>
            )}
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
