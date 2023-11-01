import { Button } from 'antd';
import React from 'react';
import styles from './index.less';
import { getClipboardImage } from '@/utils/clipboard';
import { putClipboardImage } from '@/webview/service';

export default () => {
  const handleClick = async () => {
    const image = await getClipboardImage();
    putClipboardImage(image);
  };

  return (
    <div className={styles.getClipboardImage}>
      <Button onClick={handleClick}>读取剪贴板截图</Button>
    </div>
  );
};
