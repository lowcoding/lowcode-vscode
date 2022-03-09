import { history } from 'umi';

export const taskHandler: {
  [propName: string]: (data: any) => void;
} = {
  addSnippets: (data: { content: string }) => {
    localStorage.setItem('addSnippets', data.content || '');
    history.push(`/snippets/add/${new Date().getTime()}`);
  },
  openSnippet: (data: { name: string }) => {
    history.push(`/snippets/detail/${data.name}`);
  },
  route: (data: { path: string }) => {
    history.push(data.path);
  },
  updateSelectedFolder: (data: { selectedFolder: string }) => {
    localStorage.setItem('selectedFolder', data.selectedFolder || '');
  },
};
