import { Drawer, List, message } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import styles from './index.less';
import { ChatSession, exportSession, useChatStore } from '../../store';
import { useState } from '@/hooks/useImmer';
import UpdateSeesionTitle from '../UpdateSeesionTitle';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ChatList: React.FC<IProps> = (props) => {
  const [updateTitleVisible, setUpdateTitleVisible] = useState(false);
  const [edit, setEdit] = useState({ sessionId: 0, title: '' });

  const chatStore = useChatStore();

  const handleEdit = (sesstion: ChatSession) => {
    setEdit((s) => {
      s.sessionId = sesstion.id;
      s.title = sesstion.topic;
    });
    setUpdateTitleVisible(true);
  };

  const handleEditOk = (title: string) => {
    chatStore.updateSessionTopic(title, edit.sessionId);
    setUpdateTitleVisible(false);
    message.success('修改成功');
  };

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
        style={{ marginTop: '20px' }}
        itemLayout="horizontal"
        dataSource={chatStore.sessions}
        renderItem={(item) => {
          const actions = [];
          if (
            chatStore.currentSessionIndex !== item.id &&
            chatStore.sessions.length > 1
          ) {
            actions.push(
              <a
                key="切换"
                onClick={() => {
                  chatStore.changeSession(item.id);
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
          actions.push(
            <a
              key="编辑"
              onClick={() => {
                handleEdit(item);
              }}
            >
              编辑
            </a>,
          );
          if (
            chatStore.currentSessionIndex !== item.id &&
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
      <UpdateSeesionTitle
        visible={updateTitleVisible}
        title={edit.title}
        onCancel={() => {
          setUpdateTitleVisible(false);
        }}
        onOk={handleEditOk}
      ></UpdateSeesionTitle>
    </Drawer>
  );
};

export default ChatList;
