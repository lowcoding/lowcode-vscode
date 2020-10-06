declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

interface IVscode {
  postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare let vscode: IVscode;

declare module 'form-render/lib/antd' {
  import React from 'react';
  export interface FRProps {
    schema?: object;
    formData?: object;
    onChange?(data?: object): void;
    onMount?(data?: object): void;
    name?: string;
    column?: number;
    uiSchema?: object;
    widgets?: any;
    FieldUI?: any;
    fields?: any;
    mapping?: object;
    showDescIcon?: boolean;
    showValidate?: boolean;
    displayType?: string;
    onValidate?: any;
    readOnly?: boolean;
    labelWidth?: number | string;
  }
  class FormRender extends React.Component<FRProps> {}
  export default FormRender;
}
