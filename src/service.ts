import axios from 'axios';

interface IApiDetailInfo {
  data: {
    query_path: { path: string };
    path: string;
    method: string;
    title: string;
    project_id: number;
    req_params: {
      name: string;
      desc: string;
    }[];
    _id: number;
    req_query: { required: '0' | '1'; name: string }[];
    res_body_type: 'raw' | 'json';
    res_body: string;
    req_body_other: string;
    username: string;
  };
}

export const fetchApiDetailInfo = (
  domain: string,
  id: string,
  token: string,
) => {
  return axios.get<IApiDetailInfo>(
    `${domain}/api/interface/get?id=${id}&token=${token}`,
  );
};

export interface IFetchScaffoldsResult {
  category: string;
  icon: string;
  scaffolds: {
    title: string;
    description: string;
    screenshot: string;
    repository: string;
  }[];
}

export const fetchScaffolds = (url: string) => {
  return axios.get<IFetchScaffoldsResult>(url);
};
