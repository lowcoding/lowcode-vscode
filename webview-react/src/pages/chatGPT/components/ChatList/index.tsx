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
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <List.Item.Meta
              avatar={45454}
              title={item.topic}
              description={item.messages.length}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default ChatList;
