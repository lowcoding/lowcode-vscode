import React from 'react';
import { Button, message, Form, Space, Modal } from 'antd';
import FormRender from 'form-render';
import { history } from 'umi';
import SelectDirectory from '@/components/SelectDirectory';
import CodeMirror from '@/components/CodeMirror';
import { usePresenter } from './presenter';
import { genCodeByBlockMaterial } from '@/webview/service';
import AmisComponent from '@/components/AmisComponent';
import FormilyComponent from '@/components/FormilyComponent';
import RunScript from '@/components/RunScript';
import Footer from '@/components/Footer';

export default () => {
  const presenter = usePresenter();
  const { model } = presenter;

  return (
    <div>
      <Form layout="vertical">
        {Object.keys(model.selectedMaterial.schema).length > 0 && (
          <Form.Item
            label={<span style={{ fontWeight: 'bold' }}>Schema 表单</span>}
          >
            {model.selectedMaterial.preview.schema === 'form-render' && (
              <>
                <FormRender
                  form={presenter.form}
                  schema={model.selectedMaterial.schema}
                  watch={presenter.watch}
                />
                {/* <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      model.setSelectedMaterial((s) => ({
                        ...s,
                        model: model.formData,
                      }));
                    }}
                  >
                    重新生成模板数据
                  </Button>
                </Space> */}
              </>
            )}
            {model.selectedMaterial.preview.schema === 'amis' && (
              <AmisComponent
                ref={model.amisComponent}
                schema={model.selectedMaterial.schema}
                path={model.selectedMaterial.path}
              />
            )}
            {model.selectedMaterial.preview.schema === 'formily' && (
              <FormilyComponent
                ref={model.formilyComponent}
                initialValues={model.selectedMaterial.model}
                schema={model.selectedMaterial.schema}
                path={model.selectedMaterial.path}
                onFormChange={(values) => {
                  model.setSelectedMaterial((s) => ({
                    ...s,
                    model: values,
                  }));
                }}
              />
            )}
          </Form.Item>
        )}
      </Form>
      <Footer>
        <Space style={{ width: '100%' }}>
          {/* <Dropdown overlay={presenter.menu}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-block',
                textAlign: 'center',
                width: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              更多功能 <DownOutlined />
            </a>
          </Dropdown> */}
          <Button
            type="primary"
            block
            onClick={() => {
              if (
                model.selectedMaterial.preview.schema === 'amis' &&
                model.amisComponent.current
              ) {
                model.setSelectedMaterial((s) => {
                  s.model = model.amisComponent.current!.getValues();
                });
              }
              model.setScriptModalVisible(true);
            }}
          >
            执行脚本
          </Button>
          <Button
            type="primary"
            block
            onClick={presenter.handleUpdateModelOpen}
          >
            修改表单数据
          </Button>
          <Button
            type="primary"
            block
            onClick={() => {
              if (
                model.selectedMaterial.preview.schema === 'amis' &&
                model.amisComponent.current
              ) {
                model.setSelectedMaterial((s) => {
                  s.model = model.amisComponent.current!.getValues();
                });
              }
              model.setDirectoryModalVsible(true);
            }}
          >
            生成代码
          </Button>
          <Button
            onClick={() => {
              history.push('/blocks');
            }}
            block
          >
            返回
          </Button>
        </Space>
      </Footer>
      <SelectDirectory
        visible={model.directoryModalVsible}
        loading={model.loading}
        onCancel={() => {
          model.setDirectoryModalVsible(false);
        }}
        onOk={(path, createPath = []) => {
          model.setLoding(true);
          genCodeByBlockMaterial({
            material: model.selectedMaterial.name,
            model: model.selectedMaterial.model,
            path,
            createPath,
            privateMaterials: model.selectedMaterial.privateMaterials,
          })
            .then(() => {
              model.setDirectoryModalVsible(false);
              message.success('生成成功');
            })
            .finally(() => {
              model.setLoding(false);
            });
        }}
      />
      <RunScript
        visible={model.scriptModalVisible}
        materialPath={model.selectedMaterial.path}
        model={model.selectedMaterial.model}
        scripts={model.selectedMaterial.preview?.scripts}
        privateMaterials={model.selectedMaterial.privateMaterials}
        onCancel={() => {
          model.setScriptModalVisible(false);
        }}
        onOk={presenter.handleRunScriptResult}
      />
      <Modal
        title="修改表单数据"
        maskClosable={false}
        visible={model.tempFormDataModal.visible}
        onCancel={presenter.handleUpdateModelCancel}
        onOk={presenter.handleUpdateModelOk}
        okText="确定"
        cancelText="取消"
        zIndex={9999}
      >
        <CodeMirror
          domId="modelCodeMirror"
          lint
          value={JSON.stringify(model.tempFormDataModal.formData, null, 2)}
          onChange={(value) => {
            model.setTempFormDataModal((s) => {
              s.formData = JSON.parse(value);
            });
          }}
        />
      </Modal>
    </div>
  );
};
