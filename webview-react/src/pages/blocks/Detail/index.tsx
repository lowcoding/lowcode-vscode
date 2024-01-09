import React from 'react';
import { Button, message, Form, Space, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FormRender from 'form-render';
import { history } from 'umi';
import YapiModal from '@/components/YapiModal';
import SelectDirectory from '@/components/SelectDirectory';
import CodeMirror from '@/components/CodeMirror';
import JsonToTs from '@/components/JsonToTs';
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
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      model.setScriptModalVisible(true);
                    }}
                  >
                    执行脚本
                  </Button>
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
                </Space>
              </>
            )}
            {model.selectedMaterial.preview.schema === 'amis' && (
              <AmisComponent
                schema={model.selectedMaterial.schema}
                path={model.selectedMaterial.path}
                scripts={model.selectedMaterial.preview.scripts}
                onFormChange={(values) => {
                  model.setSelectedMaterial((s) => ({
                    ...s,
                    model: values,
                  }));
                }}
              />
            )}
            {model.selectedMaterial.preview.schema === 'formily' && (
              <FormilyComponent
                initialValues={model.formData}
                schema={model.selectedMaterial.schema}
                path={model.selectedMaterial.path}
                scripts={model.selectedMaterial.preview.scripts}
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
        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>模板数据</span>}
          style={{ display: model.selectedMaterial.path ? 'flex' : 'none' }}
        >
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={JSON.stringify(model.selectedMaterial.model, null, 2)}
            onChange={(value) => {
              model.setSelectedMaterial((s) => ({
                ...s,
                model: JSON.parse(value),
              }));
            }}
          />
        </Form.Item>
      </Form>
      <Footer>
        <Space style={{ width: '100%' }}>
          <Dropdown overlay={presenter.menu}>
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
          </Dropdown>
          <Button
            type="primary"
            block
            onClick={() => {
              model.setDirectoryModalVsible(true);
            }}
          >
            生成代码
          </Button>
          <Button type="primary" block onClick={presenter.handleAskChatGPT}>
            Ask ChatGPT
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
      <YapiModal
        visible={model.yapiModalVsible}
        onOk={(m) => {
          model.setSelectedMaterial((s) => ({
            ...s,
            model: { ...model.selectedMaterial.model, ...m },
          }));
          model.setYapiModalVsible(false);
        }}
        onCancel={() => {
          model.setYapiModalVsible(false);
        }}
      />
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
      <JsonToTs
        visible={model.jsonToTsModalVisble}
        json={model.selectedMaterial}
        onCancel={() => {
          model.setJsonToTsModalVisble(false);
        }}
        onOk={(type) => {
          model.setSelectedMaterial((s) => ({
            ...s,
            model: { ...model.selectedMaterial.model, type },
          }));
          model.setJsonToTsModalVisble(false);
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
    </div>
  );
};
