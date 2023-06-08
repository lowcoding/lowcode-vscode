import { Drawer, List, message } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import styles from './index.less';
import { exportSession, useChatStore } from '../../store';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ChatList: React.FC<IProps> = (props) => {
  const chatStore = useChatStore();

  return (
    <Drawer
      className={styles.drawer}
      visible={props.visible}
      onClose={props.onClose}
      placement="left"
      width="100vw"
      bodyStyle={{ backgroundColor: '#343541', color: '#ffffff' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={chatStore.sessions}
        renderItem={(item, index) => {
          const actions = [];
          if (
            chatStore.currentSessionIndex !== index &&
            chatStore.sessions.length > 1
          ) {
            actions.push(
              <a
                key="切换"
                onClick={() => {
                  chatStore.changeSession(index);
                  props.onClose();
                }}
              >
                切换
              </a>,
            );
          }
          actions.push(
            <a
              key="导出"
              onClick={() => {
                exportSession(item).then(() => {
                  message.success('导出成功');
                });
              }}
            >
              导出
            </a>,
          );
          if (
            chatStore.currentSessionIndex !== index &&
            chatStore.sessions.length > 1
          ) {
            actions.push(
              <a
                key="删除"
                onClick={() => {
                  chatStore.delSeesion(item.id);
                  message.success('删除成功');
                }}
              >
                删除
              </a>,
            );
          }
          return (
            <List.Item actions={actions}>
              <List.Item.Meta
                avatar={<div />}
                title={item.topic}
                description={
                  <span>
                    {item.messages.length}条对话
                    <span style={{ marginLeft: '10px' }}>
                      {dayjs(item.id).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </Drawer>
  );
};

export default ChatList;
