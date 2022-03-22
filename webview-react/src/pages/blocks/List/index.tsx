import React from 'react';
import { Input, Row, Col, Button, message } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import useController from './useController';
import { genCodeByBlockMaterial } from '@/webview/service';
import SelectDirectory from '@/components/SelectDirectory';

const Search = Input.Search;

export default () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div className={styles.materials}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Search
          placeholder="输入关键字查询"
          onSearch={(value) => {
            service.search.run(value);
          }}
          onChange={(el) => {
            service.search.run(el.target.value);
          }}
        />
      </div>
      <Row gutter={[16, 16]}>
        {model.materials.map((s) => (
          <Col span={24} sm={24} md={12} key={s.name}>
            <div className={styles.item}>
              <div
                className={styles.itemBg}
                style={{
                  backgroundImage: `url(${s.preview.img})`,
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className={styles.itemWrapper}>
                <div className={styles.scroll}>
                  <div className={styles.content}>
                    <div className={styles.title}>{s.preview.title || s.name}</div>
                    {s.preview.description && (
                      <div className={styles.remark}>{s.preview.description}</div>
                    )}
                  </div>
                </div>
                <div className={styles.scroll}>
                  <Button
                    type="primary"
                    style={{ width: '50%' }}
                    onClick={() => {
                      history.push(`/blocks/detail/${s.name}`);
                    }}
                  >
                    添加
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: '50%' }}
                    onClick={() => {
                      model.setDirectoryModalVsible(true);
                      model.setSelectedMaterial(s);
                    }}
                  >
                    使用默认数据
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <SelectDirectory
        visible={model.directoryModalVsible}
        onCancel={() => {
          model.setDirectoryModalVsible(false);
        }}
        onOk={(path, createPath = []) => {
          model.setDirectoryModalVsible(false);
          genCodeByBlockMaterial({
            material: model.selectedMaterial.name,
            model: model.selectedMaterial.model,
            path,
            createPath,
          }).then(() => {
            message.success('生成成功');
          });
        }}
      />
    </div>
  );
};
