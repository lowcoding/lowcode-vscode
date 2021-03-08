import React from 'react';
import { Row, Col, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import useController from './useController';
import './index.less';

const View = () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <Spin spinning={model.loading.fetch || model.loading.download}>
      <div className="scaffold">
        <Row className="header">
          <Col span={20}>选择模板创建应用</Col>
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
              {model.categories.map(item => {
                return (
                  <div
                    className={`category-item ${
                      model.currentCategory === item.name ? 'checked-item' : ''
                    }`}
                    key={item.name}
                    onClick={() => {
                      controller.changeCategory(item.name);
                    }}
                  >
                    <div className="icon">
                      <img src={item.icon} />
                    </div>
                    <div className="title">{item.name}</div>
                    {model.currentCategory === item.name && (
                      <div className="badge">
                        <span className="tick">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col>
            <div className="scaffold">
              <Row>
                {model.scaffolds.map(s => {
                  return (
                    <div
                      key={s.title}
                      className="scaffold-item"
                      onClick={() => {
                        controller.downloadScaffold(s);
                      }}
                    >
                      <div className="screenshot">
                        <img src={s.screenshot} />
                      </div>
                      <div className="title">{s.title}</div>
                      <div className="description">{s.description}</div>
                    </div>
                  );
                })}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default View;
