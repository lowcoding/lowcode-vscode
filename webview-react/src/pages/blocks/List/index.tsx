import React from 'react';
import { Input, Row, message, Select, Empty, Button, Col } from 'antd';
import styles from './index.less';
import {
  executeVscodeCommand,
  genCodeByBlockMaterial,
} from '@/webview/service';
import SelectDirectory from '@/components/SelectDirectory';
import { usePresenter } from './presenter';
import BlockItem from './components/BlockItem';

const Search = Input.Search;

export default () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div className={styles.materials}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ textAlign: 'left', width: '100%' }}>
          <Row>
            <Col span={12}>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="选择项目"
                value={model.selectProject || undefined}
                notFoundContent="没有项目"
                onChange={(value) => {
                  model.setSelectProject(value);
                  presenter.handleSearch();
                }}
              >
                {model.projectList.map((s) => (
                  <Select.Option value={s} key={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '98%', marginLeft: '2%' }}
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
            </Col>
          </Row>
        </div>
        <Search
          style={{ marginTop: '5px' }}
          placeholder="输入关键字查询"
          value={model.searchValue}
          onChange={(el) => {
            const { value } = el.target;
            model.setSearchValue(value);
            presenter.handleSearch();
          }}
        />
      </div>
      <Row gutter={[16, 16]}>
        {model.materials?.map((s) => (
          <BlockItem
            key={s.id}
            blockItem={s}
            onDefaultClick={() => {
              model.setDirectoryModalVsible(true);
              model.setSelectedMaterial(s);
            }}
          ></BlockItem>
        ))}
      </Row>
      {model.materials?.length === 0 && (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>暂无数据，可点击上面更多菜单，选择创建区块模板</span>
          }
        >
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
        </Empty>
      )}
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
