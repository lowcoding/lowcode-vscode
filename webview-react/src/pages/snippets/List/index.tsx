import React from 'react';
import { Input, Row, Col, Button, message, Select } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { usePresenter } from './presenter';
import { insertSnippet } from '@/webview/service';

const Search = Input.Search;

export default () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div className={styles.snippetsMaterials}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Search
          placeholder="输入关键字查询"
          value={model.searchValue}
          onChange={(el) => {
            const { value } = el.target;
            model.setSearchValue(value);
            presenter.handleSearch();
          }}
        />
        <div style={{ textAlign: 'left', marginTop: '5px' }}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择分类"
            value={model.selectedCategory}
            notFoundContent="没有分类"
            onChange={(value) => {
              model.setSelectedCategory(value);
              presenter.handleSearch();
            }}
          >
            {model.categoryList.map((s) => (
              <Select.Option value={s} key={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        {model.materials.map((s) => (
          <Col span={24} sm={24} md={12} key={s.name}>
            <div className={styles.snippetsMaterialsItem}>
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
                <div className={styles.control}>
                  <Button
                    type="primary"
                    style={{ width: '50%', borderRadius: 'none' }}
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
                    style={{ width: '50%', borderRadius: 'none' }}
                    onClick={() => {
                      history.push(`/snippets/detail/${s.name}`);
                    }}
                  >
                    使用模板
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
