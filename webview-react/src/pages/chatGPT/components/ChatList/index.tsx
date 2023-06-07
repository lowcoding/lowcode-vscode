import { Drawer, List } from 'antd';
import React from 'react';
import styles from './index.less';
import { useChatStore } from '../../store';

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
        renderItem={(item, index) => (
          <List.Item
            actions={[
              chatStore.currentSessionIndex !== index && (
                <a
                  key="切换"
                  onClick={() => {
                    chatStore.changeSession(index);
                    props.onClose();
                  }}
                >
                  切换
                </a>
              ),
              <a key="导出">导出</a>,
              <a key="删除">删除</a>,
            ]}
          >
            <List.Item.Meta
              avatar={<div />}
              title={item.topic}
              description={`${item.messages.length}条对话`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default ChatList;
