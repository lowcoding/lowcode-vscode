import { defineComponent, onMounted, watch } from 'vue';
import { Input, Row, Col, Button, Tooltip } from 'ant-design-vue';
import './index.scss';
import useRefreshPage from '../../model/refreshPage';
import router from './../../router';
import useModel from './model';
import { getLocalMaterials } from '../../vscode/service';

export default defineComponent({
  setup() {
    const { refresh } = useRefreshPage();
    const { materials, search, initModel } = useModel();
    onMounted(() => {
      fetchData();
    });
    watch(refresh, () => {
      fetchData();
    });
    const fetchData = () => {
      getLocalMaterials('blocks').then((res) => {
        initModel(res);
      });
    };
    return () => (
      <div class="snippets-materials">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Input.Search
            placeholder="输入关键字查询"
            onSearch={(value) => {
              search(value);
            }}
          />
        </div>
        <Row gutter={[16, 16]}>
          {() => {
            return materials.list.map((s) => {
              return (
                <Col span={24} sm={24} md={12} key={s.name}>
                  {() => (
                    <div
                      style={{
                        backgroundImage: `url(${s.preview.img})`,
                        backgroundPosition: 'center',
                      }}
                      class="snippets-materials-item"
                    >
                      <div class="snippets-materials-item-title">
                        {s.preview.title || s.name}
                        <div class="control">
                          <Button
                            type="primary"
                            style={{ width: '50%', borderRadius: 'none' }}
                            onClick={() => {
                              router.push(`/blocks/detail/${s.name}`);
                            }}
                          >
                            {() => '添加'}
                          </Button>
                          <Tooltip
                            title={s.preview.description || s.preview.title || s.name}
                            placement="top"
                          >
                            {() => (
                              <Button type="primary" style={{ width: '50%', borderRadius: 'none' }}>
                                {() => '详情'}
                              </Button>
                            )}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              );
            });
          }}
        </Row>
      </div>
    );
  },
});
