import React from 'react';
import { Row, Col, Spin, Button, Tooltip } from 'antd';
import { SyncOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import useController from './useController';
import './index.less';
import FormModal from '../FormModal';
import DownloadModal from '../DownloadModal';
import LocalProjectModal from '../LocalProjectModal';

const View = () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <Spin
      spinning={model.loading.fetch || model.loading.download}
      tip={model.loading.download ? '正在下载模板...' : undefined}
    >
      <div className="scaffold">
        <Row className="header">
          <Col span={20}>
            选择模板创建应用{' '}
            <Tooltip title="分享物料可提交到https://github.com/lowcoding/scaffold">
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
          <Col span={4} className="control">
            <SyncOutlined
              spin={model.loading.fetch}
              onClick={() => {
                controller.fetchScaffolds();
              }}
            />
          </Col>
        </Row>
        <Row className="content">
          <Col>
            <div className="category">
              {model.categories.map((item) => (
                <div
                  className={`category-item ${
                    model.currentCategory === item.uuid ? 'checked-item' : ''
                  }`}
                  key={item.uuid}
                  onClick={() => {
                    controller.changeCategory(item.uuid);
                  }}
                >
                  <div className="icon">
                    <img src={item.icon} />
                  </div>
                  <div className="title">{item.name}</div>
                  {model.currentCategory === item.uuid && (
                    <div className="badge">
                      <span className="tick">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              style={{ width: '45%', borderRadius: '0px' }}
              type="primary"
              onClick={() => {
                model.setDownloadVisible(true);
              }}
            >
              更多模板
            </Button>
            <Button
              style={{ width: '45%', borderRadius: '0px' }}
              onClick={() => {
                model.setLocalProjectModalVisible(true);
              }}
            >
              本地调试
            </Button>
          </Col>
          <Col>
            <div className="scaffold">
              {model.scaffolds.map((s) => (
                <div
                  key={s.uuid}
                  className="scaffold-item"
                  onClick={() => {
                    controller.downloadScaffold(s);
                  }}
                >
                  <div className="screenshot">
                    <img
                      src={
                        s.screenshot?.includes('gitee.')
                          ? 'https://cdn.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg'
                          : s.screenshot
                      }
                    />
                  </div>
                  <div className="title">{s.title}</div>
                  <div className="description">{s.description}</div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <FormModal
        visible={model.formModal.visible}
        config={model.formModal.config}
        onClose={() => {
          model.setFormModal((s) => {
            s.visible = false;
          });
        }}
      />
      <DownloadModal
        visible={model.downloadVisible}
        onClose={() => {
          model.setDownloadVisible(false);
        }}
      />
      <LocalProjectModal
        visible={model.localProjectModalVisible}
        onClose={() => {
          model.setLocalProjectModalVisible(false);
        }}
      />
    </Spin>
  );
};

export default View;
