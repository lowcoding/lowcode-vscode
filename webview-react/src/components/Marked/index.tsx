import React, { useEffect } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import 'highlight.js/styles/agate.css';
import hljs from 'highlight.js';
import { useState } from '@/hooks/useImmer';
import styles from './index.less';

marked.use({
  mangle: false,
  headerIds: false,
});

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

interface IProps {
  text: string;
}

const Marked: React.FC<IProps> = (props) => {
  const [parsedContent, setParsedContent] = useState('');

  useEffect(() => {
    const inCodeBlock =
      props.text.includes('```') && props.text.split('```').length % 2 === 0;
    setParsedContent(marked.parse(props.text + (inCodeBlock ? '\n```' : '')));
  }, [props.text]);

  return (
    <div className={styles.marked}>
      {/* <div className={styles.header}>1212</div> */}
      <div dangerouslySetInnerHTML={{ __html: parsedContent }}></div>
    </div>
  );
};

export default Marked;
