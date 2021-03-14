import React from 'react';
import { Input, Row, Col, Tooltip, Button, message } from 'antd';
import { history } from 'umi';
import './index.less';
import useController from './useController';
import { genCodeByBlockMaterial } from '@/webview/service';
import SelectDirectory from '@/components/SelectDirectory';

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
          onSearch={value => {
            service.search.run(value);
          }}
          onChange={el => {
            service.search.run(el.target.value);
          }}
        />
      </div>
      <Row gutter={[16, 16]}>
        {model.materials.map(s => {
          return (
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
                      style={{ width: '33.33%' }}
                      onClick={() => {
                        history.push(`/blocks/detail/${s.name}`);
                      }}
                    >
                      添加
                    </Button>
                    <Button
                      type="primary"
                      style={{ width: '33.33%' }}
                      onClick={() => {
                        model.setDirectoryModalVsible(true);
                        model.setSelectedMaterial(s);
                      }}
                    >
                      使用默认数据
                    </Button>
                    <Tooltip
                      title={s.preview.description || s.preview.title || s.name}
                      placement="top"
                    >
                      <Button type="primary" style={{ width: '33.33%' }}>
                        详情
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
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
            path: path,
            createPath: createPath,
          }).then(() => {
            message.success('生成成功');
          });
        }}
      />
    </div>
  );
};
