import React, { useEffect, useRef } from 'react';
import { Col, Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import Viewer from 'viewerjs';
import { history } from 'umi';
import { Autoplay } from 'swiper';
import { Model } from '../../model';
import styles from './index.less';
import 'swiper/swiper.css';
import 'viewerjs/dist/viewer.css';
import { insertSnippet } from '@/webview/service';

export default (props: { snippetItem: Model['materials'][0] }) => {
  const viewer = useRef<Viewer | undefined>();

  useEffect(() => {
    const v = new Viewer(
      document.getElementById(`images_${props.snippetItem.name}`)!,
      {
        hidden() {
          viewer.current?.destroy();
        },
        title: false,
      },
    );
    viewer.current = v;
  }, [props.snippetItem]);

  useEffect(
    () => () => {
      if (viewer.current) {
        viewer.current.destroy();
      }
    },
    [],
  );

  const showViewer = () => {
    viewer.current?.show();
  };

  return (
    <Col span={24} sm={24} md={12} key={props.snippetItem.name}>
      <div className={styles.snippetsMaterialsItem}>
        <div className={styles.snippetsMaterialsItemImg}>
          {props.snippetItem.preview.img && (
            <Swiper
              className={styles.swiper}
              direction={'vertical'}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              id={`images_${props.snippetItem.name}`}
            >
              {props.snippetItem.preview.img?.map((img) => (
                <SwiperSlide key={img}>
                  <div
                    className={styles.snippetsMaterialsItemBg}
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundPosition: 'center',
                    }}
                  >
                    <img className={styles.img} src={img}></img>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className={styles.snippetsMaterialsItemWrapper}>
          <div className={styles.scroll}>
            <div className={styles.content}>
              <div className={styles.title}>
                {props.snippetItem.preview.title || props.snippetItem.name}
              </div>
              {props.snippetItem.preview.description && (
                <div className={styles.remark}>
                  {props.snippetItem.preview.description}
                </div>
              )}
            </div>
          </div>
          <div className={styles.control}>
            <Button
              type="primary"
              style={{ width: '34%', borderRadius: 'none' }}
              onClick={() => {
                if (!props.snippetItem.template) {
                  message.error('添加失败，模板为空');
                  return;
                }
                insertSnippet({
                  template: props.snippetItem.template,
                }).then(() => {
                  message.success('添加成功');
                });
              }}
            >
              直接添加
            </Button>
            <Button
              type="primary"
              style={{ width: '34%', borderRadius: 'none' }}
              onClick={() => {
                history.push(`/snippets/detail/${props.snippetItem.name}`);
              }}
            >
              使用模板
            </Button>
            <Button
              type="primary"
              style={{ width: '32%', borderRadius: 'none' }}
              icon={<EyeOutlined />}
              onClick={showViewer}
            ></Button>
          </div>
        </div>
      </div>
    </Col>
  );
};
