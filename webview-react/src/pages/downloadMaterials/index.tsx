import React from 'react';
import { Layout, Radio, Button, Row, Col } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { usePresenter } from './presenter';
import DownloadMaterials from '@/components/DownloadMaterials';

const { Content } = Layout;

export default () => {
  const presenter = usePresenter();
  const { model } = presenter;
  return (
    <Layout className={styles.page}>
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Radio.Group
            value={model.tab}
            size="middle"
            onChange={(e) => {
              const { value } = e.target;
              model.setTab(value);
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="snippets">代码片段</Radio.Button>
            <Radio.Button value="blocks">区块</Radio.Button>
          </Radio.Group>
          <span style={{ display: 'inline-block', width: '20px' }}></span>
          <Radio.Group
            size="middle"
            value=""
            onChange={(e) => {
              const { value } = e.target;
              if (value === 'download') {
                model.setDownloadMaterialsVisible(true);
              } else {
                presenter.handleConfirm();
              }
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="download">
              <DownloadOutlined />
              &nbsp;下载
            </Radio.Button>
            {(model.materials.blocks.length > 0 ||
              model.materials.snippets.length > 0) && (
              <Radio.Button value="confirm">确定</Radio.Button>
            )}
          </Radio.Group>
          <DownloadMaterials
            visible={model.downloadMaterialsVisible}
            onOk={(data) => {
              presenter.handleDownloadMaterialsOk(data);
            }}
            onCancel={() => {
              model.setDownloadMaterialsVisible(false);
            }}
          />
        </div>
        <Content
          style={{
            padding: '24px',
            minHeight: 280,
          }}
        >
          <Row gutter={[16, 16]}>
            {model.materials[model.tab].map((s) => (
              <Col span={24} sm={24} md={12} key={s.name}>
                <div
                  className={`${styles.snippetsMaterialsItem} ${
                    model.selectedMaterials.blocks.includes(s.name) ||
                    model.selectedMaterials.snippets.includes(s.name)
                      ? styles.snippetsMaterialsItemCkecked
                      : ''
                  }`}
                  onClick={() => {
                    presenter.handleCheckItem(s.name);
                  }}
                >
                  <div
                    className={styles.snippetsMaterialsItemBg}
                    style={{
                      backgroundImage: `url(${s.preview.img})`,
                      backgroundPosition: 'center',
                    }}
                  ></div>
                  <div className={styles.snippetsMaterialsItemWrapper}>
                    <div className={styles.scroll}>
                      <div className={styles.content}>
                        <div className={styles.title}>
                          {s.preview.title || s.name}
                        </div>
                        {s.preview.description && (
                          <div className={styles.remark}>
                            {s.preview.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.badge}>
                    {(model.selectedMaterials.blocks.includes(s.name) ||
                      model.selectedMaterials.snippets.includes(s.name)) && (
                      <span className={styles.tick}>✓</span>
                    )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
