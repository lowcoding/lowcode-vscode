import React from 'react';
import { Button, Input } from 'antd';
import { usePresenter } from './presenter';
import Marked from '@/components/Marked';
import styles from './index.less';
import 'animate.css';

const { TextArea } = Input;

const View = () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div className={styles.chatGpt}>
      <div className={styles.list} ref={model.listRef}>
        {model.chatList.map((s) => (
          <div key={s.key}>
            <div className={styles.promptWrapper}>
              <div className={styles.prompt}>{s.prompt}</div>
            </div>
            {s.res && (
              <div className={styles.resWrapper}>
                <div className={styles.res}>
                  <Marked text={s.res}></Marked>
                </div>
              </div>
            )}
          </div>
        ))}
        {model.current.prompt && (
          <>
            <div className={styles.promptWrapper}>
              <div
                className={`${styles.prompt} animate__animated animate__backInUp`}
              >
                {model.current.prompt}
              </div>
            </div>
            {model.current.res && (
              <div className={styles.resWrapper}>
                <div className={styles.res}>
                  <Marked text={model.current.res}></Marked>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.formWrapper}>
          <TextArea
            className={styles.input}
            bordered={false}
            autoSize={{ maxRows: 6 }}
            value={model.inputChatPrompt}
            placeholder="请输入"
            onChange={(e) => {
              const { value } = e.target;
              model.setInputChatPrompt(value);
            }}
          ></TextArea>
          <div className={styles.btn} onClick={presenter.handleSubmit}>
            {!model.loading && (
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3334 1.66669L12.5001 18.3334L9.16675 10.8334L1.66675 7.50002L18.3334 1.66669Z"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {model.loading && (
              <svg
                className={styles.animateSpin}
                style={{ animation: 'spin 1s linear infinite' }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="0.4"
                stroke="currentColor"
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g>
                  <path
                    fill="currentColor"
                    d="M12 22C6.49 22 2 17.51 2 12c0-1.87.52-3.69 1.5-5.27a1.003 1.003 0 0 1 1.7 1.06A8.008 8.008 0 0 0 4 12c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8c-.55 0-1-.45-1-1s.45-1 1-1c5.51 0 10 4.49 10 10s-4.49 10-10 10z"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            )}
          </div>
        </div>

        {/* <Button onClick={presenter.handleSubmit}>确定</Button> */}
      </div>
    </div>
  );
};

export default View;