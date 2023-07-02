import React from 'react';
import { Input, Row, Select } from 'antd';
import styles from './index.less';
import { usePresenter } from './presenter';
import SnippetItem from './components/SnippetItem';

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
          <SnippetItem snippetItem={s} key={s.id}></SnippetItem>
        ))}
      </Row>
    </div>
  );
};
