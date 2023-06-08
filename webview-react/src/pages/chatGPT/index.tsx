import React from 'react';
import { Input, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { usePresenter } from './presenter';
import Marked from '@/components/Marked';
import styles from './index.less';
import ChatList from './components/ChatList';

const { TextArea } = Input;

const View = () => {
  const presenter = usePresenter();
  const { model, chatStore } = presenter;

  return (
    <div className={styles.chatGpt}>
      <div className={styles.list} ref={model.listRef}>
        {chatStore
          .currentSession()
          ?.messages.filter((s) => s.role !== 'system')
          .map((s) => (
            <div key={`${s.role}-${s.id}`} className={styles.itemContainer}>
              {s.role === 'user' && (
                <>
                  <div className={styles.promptIcon}>
                    <img
                      width="20"
                      height="20"
                      src="https://gitee.com/img-host/img-host/raw/master/2023/06/07/1686145202178.svg"
                    ></img>
                  </div>
                  <div className={styles.promptWrapper}>
                    <div className={styles.prompt}>{s.content}</div>
                  </div>
                </>
              )}
              {s.role === 'assistant' && (
                <div className={styles.resItem}>
                  <div className={styles.resHeader}>
                    <img
                      width="20"
                      height="20"
                      src="https://gitee.com/img-hosting/img-hosting/raw/master/2023/05/31/1685511791755.svg"
                    ></img>
                    {s.loading && (
                      <img
                        style={{ marginLeft: '10px', height: '20px' }}
                        src="https://gitee.com/img-host/img-host/raw/master/2023/06/06/1686064559649.svg"
                      ></img>
                    )}
                    <div className={styles.itemBtns}>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          presenter.handleCopy(s);
                        }}
                      >
                        复制
                      </div>
                      <div
                        className={styles.btn}
                        onClick={() => {
                          presenter.handleRetry(s);
                        }}
                      >
                        重试
                      </div>
                      {!s.loading && (
                        <div
                          className={styles.btn}
                          onClick={() => {
                            presenter.handleUpdateAsContext(s);
                          }}
                        >
                          {s.asContext ? '从上下文移除' : '加入上下文'}
                        </div>
                      )}
                      {!s.loading && (
                        <div
                          className={styles.btn}
                          onClick={() => {
                            presenter.handleDel(s.id);
                          }}
                        >
                          删除
                        </div>
                      )}
                    </div>
                  </div>
                  {s.content && (
                    <div className={styles.resWrapper}>
                      <div className={styles.res}>
                        <Marked text={s.content} complete></Marked>
                      </div>
                    </div>
                  )}
                  <div> {dayjs(s.id).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              )}
            </div>
          ))}
      </div>
      <div className={styles.actionPanel}>
        <Tooltip placement="topLeft" title="会话列表" arrowPointAtCenter>
          <div className={styles.action} onClick={presenter.handleOpenList}>
            <img src="https://gitee.com/img-host/img-host/raw/master/2023/06/01/1685629856184.svg"></img>
          </div>
        </Tooltip>
        <Tooltip placement="top" title="导出当前回话" arrowPointAtCenter>
          <div
            className={styles.action}
            onClick={presenter.handleExportContent}
          >
            <img src="https://gitee.com/img-host/img-host/raw/master/2023/06/01/1685631928751.svg"></img>
          </div>
        </Tooltip>
        <Tooltip placement="top" title="清除上下文" arrowPointAtCenter>
          <div className={styles.action} onClick={presenter.handleClearContext}>
            <img src="https://gitee.com/img-host/img-host/raw/master/2023/06/01/1685631448493.svg"></img>
          </div>
        </Tooltip>
        <Tooltip placement="top" title="新建会话" arrowPointAtCenter>
          <div className={styles.action} onClick={presenter.handleNewSession}>
            <img src="https://gitee.com/img-host/img-host/raw/master/2023/06/08/1686155702318.svg"></img>
          </div>
        </Tooltip>
      </div>
      <div className={styles.footer}>
        <div className={styles.formWrapper}>
          <TextArea
            className={styles.input}
            bordered={false}
            autoSize={{ maxRows: 6 }}
            value={model.inputChatPrompt}
            placeholder="Ctrl + Enter 或 ⌘ + Enter 发送"
            onChange={(e) => {
              const { value } = e.target;
              model.setInputChatPrompt(value);
            }}
            onKeyDown={presenter.handleInputKeyDown}
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
      </div>
      <ChatList
        visible={model.listVisible}
        onClose={() => {
          model.setListVisible(false);
        }}
      ></ChatList>
    </div>
  );
};

export default View;
