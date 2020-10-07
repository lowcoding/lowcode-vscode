import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Tooltip, Button, Space } from 'antd';
import { history } from 'umi';
import { callVscode } from '@/webview';
import './index.less';

const Search = Input.Search;

export default () => {
  const [materials, setMaterials] = useState<
    {
      path: string;
      name: string;
      model: object;
      schema: object;
      preview: {
        title?: string;
        description?: string;
        img?: string;
      };
    }[]
  >([]);
  const [oriMaterials, setOriMaterials] = useState<typeof materials>([]);

  useEffect(() => {
    callVscode({ cmd: 'getLocalMaterials', data: 'snippets' }, data => {
      setMaterials(data);
      setOriMaterials(data);
    });
  }, []);

  return (
    <div className="snippets-materials">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Search
          placeholder="输入关键字查询"
          onSearch={value => {
            if (!value.trim()) {
              setMaterials(oriMaterials);
            } else {
              setMaterials(
                oriMaterials.filter(s => {
                  return (
                    s.name.indexOf(value) > -1 ||
                    (s.preview.title && s.preview.title.indexOf(value) > -1) ||
                    (s.preview.description &&
                      s.preview.description.indexOf(value) > -1)
                  );
                }),
              );
            }
          }}
        />
      </div>
      <Row gutter={[16, 16]}>
        {materials.map(s => {
          return (
            <Col span={24} sm={24} md={12} key={s.name}>
              <div
                style={{
                  backgroundImage: `url(${s.preview.img})`,
                }}
                className="snippets-materials-item"
              >
                <div className="snippets-materials-item-title">
                  {s.preview.title || s.name}
                  <div className="control">
                    <Button
                      type="primary"
                      style={{ width: '33.33%', borderRadius: 'none' }}
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
          );
        })}
      </Row>
    </div>
  );
};
