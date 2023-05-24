import React, { useEffect } from 'react';
import { marked } from 'marked';
import { useState } from '@/hooks/useImmer';
import styles from './index.less';

interface IProps {
  text: string;
}

const Marked: React.FC<IProps> = (props) => {
  const [parsedContent, setParsedContent] = useState('');

  useEffect(() => {
    marked.parse(props.text);
  }, [props.text]);

  return (
    <div className={styles.marked}>
      <div className={styles.header}>1212</div>
      <div dangerouslySetInnerHTML={{ __html: parsedContent }}></div>
    </div>
  );
};

export default Marked;
