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

export default (props: {
  blockItem: Model['materials'][0];
  onDefaultClick: () => void;
}) => {
  const viewer = useRef<Viewer | undefined>();

  useEffect(() => {
    const v = new Viewer(
      document.getElementById(`images_${props.blockItem.name}`)!,
      {
        hidden() {
          viewer.current?.destroy();
        },
        title: false,
      },
    );
    viewer.current = v;
  }, [props.blockItem]);

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
    <Col span={24} sm={24} md={12} key={props.blockItem.name}>
      <div className={styles.item}>
        <div className={styles.itemImage}>
          {props.blockItem.preview.img && (
            <Swiper
              className={styles.swiper}
              direction={'vertical'}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              id={`images_${props.blockItem.name}`}
            >
              {props.blockItem.preview.img?.map((img) => (
                <SwiperSlide key={img}>
                  <div
                    className={styles.itemBg}
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
        <div className={styles.itemWrapper}>
          <div className={styles.scroll}>
            <div className={styles.content}>
              <div className={styles.title}>
                {props.blockItem.preview.title || props.blockItem.name}
              </div>
              {props.blockItem.preview.description && (
                <div className={styles.remark}>
                  {props.blockItem.preview.description}
                </div>
              )}
            </div>
          </div>
          <div className={styles.control}>
            <Button
              type="primary"
              style={{ width: '34%' }}
              onClick={() => {
                history.push(`/blocks/detail/${props.blockItem.name}`);
              }}
            >
              添加
            </Button>
            <Button
              type="primary"
              style={{ width: '34%' }}
              onClick={() => {
                props.onDefaultClick();
              }}
            >
              使用默认数据
            </Button>
            <Button
              type="primary"
              style={{ width: '32%' }}
              icon={<EyeOutlined />}
              onClick={showViewer}
            ></Button>
          </div>
        </div>
      </div>
    </Col>
  );
};
