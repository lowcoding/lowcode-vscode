import React from 'react';
import { history } from 'umi';
import { Button, Empty, Input, Row, Select, Space } from 'antd';
import styles from './index.less';
import { usePresenter } from './presenter';
import SnippetItem from './components/SnippetItem';
import { executeVscodeCommand } from '@/webview/service';

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
        {model.materials?.map((s) => (
          <SnippetItem snippetItem={s} key={s.id}></SnippetItem>
        ))}
      </Row>
      {model.materials?.length === 0 && (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span>暂无数据</span>}
        >
          <Space>
            <Button
              type="primary"
              onClick={() => {
                history.push('/snippets/add/10086');
              }}
            >
              添加代码片段
            </Button>
            <Button
              type="primary"
              onClick={() => {
                executeVscodeCommand({
                  command: 'lowcode.openDownloadMaterials',
                });
              }}
            >
              下载物料
            </Button>
          </Space>
        </Empty>
      )}
    </div>
  );
};
