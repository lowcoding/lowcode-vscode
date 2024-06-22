import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
} from '@formily/antd';
import { Card, Slider, Rate, Button } from 'antd';
import * as ICONS from '@ant-design/icons';
import { onFormValuesChange } from '@formily/core/esm/effects';
import { useState } from '@/hooks/useImmer';
import RunScript from '../RunScript';

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value || content);
};

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
  },
  scope: {
    icon(name: string) {
      return React.createElement((ICONS as any)[name]);
    },
  },
});

interface IProps {
  schema: {
    form: object;
    schema: object;
  };
  initialValues: object;
  path: string;
  onFormChange: (values: object) => void;
}

export default forwardRef((props: IProps, ref) => {
  const [init, setInit] = useState(false);
  const [scriptModalVisible, setScriptModalVisible] = useState(false);
  const [model, setModel] = useState({} as object);
  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFormValuesChange((f) => {
            props.onFormChange(JSON.parse(JSON.stringify(f.values)));
            setModel(JSON.parse(JSON.stringify(f.values)));
          });
        },
      }),
    [],
  );

  useImperativeHandle(ref, () => ({
    getValues: () => form.values,
    setValues: (values: object) => {
      form.setValues(values);
    },
  }));

  useEffect(() => {
    if (
      props.initialValues &&
      Object.keys(props.initialValues).length &&
      !init
    ) {
      form.setInitialValues(props.initialValues);
      setModel(props.initialValues);
      setInit(true);
    }
  }, [props.initialValues]);

  const handleRunScriptResult = (result: object) => {
    setModel(props.initialValues);
    props.onFormChange(result);
    form.setValues(result);
    setScriptModalVisible(false);
  };

  return (
    <div>
      <Form {...props.schema.form} form={form}>
        <SchemaField schema={props.schema.schema} />
      </Form>
      {/* <Space>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setScriptModalVisible(true);
          }}
        >
          执行脚本
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            props.onFormChange(JSON.parse(JSON.stringify(form.values)));
          }}
        >
          重新生成模板数据
        </Button>
      </Space> */}
      {/* <RunScript
        visible={scriptModalVisible}
        materialPath={props.path}
        model={model}
        scripts={props.scripts}
        onCancel={() => {
          setScriptModalVisible(false);
        }}
        onOk={handleRunScriptResult}
      /> */}
    </div>
  );
});
