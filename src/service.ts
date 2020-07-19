import axios from 'axios';

interface IApiDetailInfo {
  data: {
    query_path: { path: string };
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
