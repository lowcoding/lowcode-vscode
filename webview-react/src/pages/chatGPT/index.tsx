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
      <div className={styles.footer}>
        <div className={styles.formWrapper}>
          <TextArea
            className={styles.input}
            bordered={false}
            autoSize
            value={model.inputChatPrompt}
            onChange={(e) => {
              const { value } = e.target;
              model.setInputChatPrompt(value);
            }}
          ></TextArea>
          <div className={styles.btn} onClick={presenter.handleSubmit}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3334 1.66669L9.16675 10.8334"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.3334 1.66669L12.5001 18.3334L9.16675 10.8334L1.66675 7.50002L18.3334 1.66669Z"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* <Button onClick={presenter.handleSubmit}>确定</Button> */}
      </div>
    </div>
  );
};

export default View;
