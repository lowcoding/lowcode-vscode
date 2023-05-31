import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import 'highlight.js/styles/agate.css';
import hljs from 'highlight.js';
import { useState } from '@/hooks/useImmer';
import styles from './index.less';
import { insertCode } from '@/webview/service';

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
  complete?: boolean;
}

const Marked: React.FC<IProps> = (props) => {
  const [parsedContent, setParsedContent] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const inCodeBlock =
      props.text.includes('```') && props.text.split('```').length % 2 === 0;
    setParsedContent(marked.parse(props.text + (inCodeBlock ? '\n```' : '')));
    if (props.complete) {
      setTimeout(() => {
        addCodeCopyBtn();
        addCodeInsertBtn();
      }, 200);
    }
  }, [props.text, props.complete]);

  const addCodeCopyBtn = () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<div class="tooltip-copy"><img src="https://gitee.com/img-host/img-host/raw/master/2023/05/31/1685464158512.svg" class="icon-copy" title="Click to Copy" /></div>';
    div.className = 'div-copy';

    const allPres = containerRef.current?.querySelectorAll('pre');
    allPres?.forEach((pre) => {
      const copy = div.cloneNode(true) as HTMLDivElement;
      pre.appendChild(copy);
      pre.addEventListener('mouseover', () => {
        copy.classList.add('active');
      });
      pre.addEventListener('mouseleave', () => {
        copy.classList.remove('active');
      });
      copy.onclick = function () {
        navigator.clipboard.writeText(pre.textContent || '');
        message.success({
          content: '内容已写入剪切板',
        });
      };
    });
  };

  const addCodeInsertBtn = () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<div class="tooltip-insert"><img src="https://gitee.com/img-host/img-host/raw/master/2023/05/31/1685465149082.svg" class="icon-insert" title="Click to Insert" /></div>';
    div.className = 'div-insert';

    const allPres = containerRef.current?.querySelectorAll('pre');
    allPres?.forEach((pre) => {
      const insert = div.cloneNode(true) as HTMLDivElement;
      pre.appendChild(insert);
      pre.addEventListener('mouseover', () => {
        insert.classList.add('active');
      });
      pre.addEventListener('mouseleave', () => {
        insert.classList.remove('active');
      });
      insert.onclick = function () {
        insertCode(pre.textContent || '').then(() => {
          message.success({
            content: '内容已插入',
          });
        });
      };
    });
  };

  return (
    <div className={styles.marked} ref={containerRef}>
      {/* <div className={styles.header}>1212</div> */}
      <div dangerouslySetInnerHTML={{ __html: parsedContent }}></div>
    </div>
  );
};

export default Marked;
