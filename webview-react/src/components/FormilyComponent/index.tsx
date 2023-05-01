import React, { useEffect, useMemo } from 'react';
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
import { Card, Slider, Rate } from 'antd';
import * as ICONS from '@ant-design/icons';
import { onFormValuesChange } from '@formily/core/esm/effects';

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
  onFormChange: (values: object) => void;
}

export default (props: IProps) => {
  const form = useMemo(
    () =>
      createForm({
        effects() {
          onFormValuesChange((f) => {
            props.onFormChange(JSON.parse(JSON.stringify(f.values)));
          });
        },
      }),
    [],
  );

  useEffect(() => {
    form.setInitialValues(props.initialValues);
  }, []);

  return (
    <div>
      <Form {...props.schema.form} form={form}>
        <SchemaField schema={props.schema.schema} />
      </Form>
    </div>
  );
};
