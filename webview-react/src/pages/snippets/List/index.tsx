import React from 'react';
import { Input, Row, Col, Tooltip, Button, message } from 'antd';
import { history } from 'umi';
import './index.less';
import useController from './useController';
import { insertSnippet } from '@/webview/service';

const Search = Input.Search;

export default () => {
  const controller = useController();
  const { service } = controller;
  const { model } = service;

  return (
    <div className="snippets-materials">
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
            <div
              style={{
                backgroundImage: `url(${s.preview.img})`,
                backgroundPosition: 'center',
              }}
              className="snippets-materials-item"
            >
              <div className="snippets-materials-item-title">
                {s.preview.title || s.name}
                <div className="control">
                  <Button
                    type="primary"
                    style={{ width: '33.33%', borderRadius: 'none' }}
                    onClick={() => {
                      if (!s.template) {
                        message.error('添加失败，模板为空');
                        return;
                      }
                      insertSnippet({
                        template: s.template,
                      }).then(() => {
                        message.success('添加成功');
                      });
                    }}
                  >
                    直接添加
                  </Button>
                  <Button
                    type="primary"
                    style={{ width: '33.33%', borderRadius: 'none' }}
                    onClick={() => {
                      history.push(`/snippets/detail/${s.name}`);
                    }}
                  >
                    使用模板
                  </Button>
                  <Tooltip
                    title={s.preview.description || s.preview.title || s.name}
                    placement="top"
                  >
                    <Button
                      type="primary"
                      style={{ width: '33.33%', borderRadius: 'none' }}
                    >
                      详情
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
