import { request } from 'umi';

export interface IFetchMaterialRepositoryListResult {
  git: {
    title: string;
    repository: string;
  }[];
  npm: {
    title: string;
    repository: string;
  }[];
}

export function fetchMaterialRepositoryList() {
  return request<IFetchMaterialRepositoryListResult>(
    `https://fastly.jsdelivr.net/gh/lowcoding/material@latest/index.json`,
    {
      method: 'GET',
      skipErrorHandler: true,
    },
  );
}
