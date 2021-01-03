import { defineComponent, onMounted, watch } from 'vue';
import { Input, Row, Col, Button, message, Tooltip } from 'ant-design-vue';
import './index.scss';
import useRefreshPage from '../../model/refreshPage';
import router from './../../router';
import useModel from './model';
import { getLocalMaterials, insertSnippet } from '../../vscode/service';

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
      getLocalMaterials('snippets').then((res) => {
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
                            style={{ width: '33.33%', borderRadius: 'none' }}
                            onClick={() => {
                              if (!s.template) {
                                message.error('添加失败,模板为空');
                                return;
                              }
                              insertSnippet({ template: s.template }).then(() => {
                                message.success('添加成功');
                              });
                            }}
                          >
                            {() => '直接添加'}
                          </Button>
                          <Button
                            type="primary"
                            style={{ width: '33.33%', borderRadius: 'none' }}
                            onClick={() => {
                              router.push(`/snippets/detail/${s.name}`);
                            }}
                          >
                            {() => '使用模板'}
                          </Button>
                          <Tooltip
                            title={s.preview.description || s.preview.title || s.name}
                            placement="top"
                          >
                            {() => (
                              <Button
                                type="primary"
                                style={{ width: '33.33%', borderRadius: 'none' }}
                              >
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
