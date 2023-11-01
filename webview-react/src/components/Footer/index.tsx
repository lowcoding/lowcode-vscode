import React, { FC } from 'react';
import styles from './index.less';

const Footer: FC = (props) => (
  <div>
    <div className={styles.footer}>{props.children}</div>
    <div className={styles.placeholder}></div>
  </div>
);

export default Footer;
