import { history } from 'umi';
import { emitter } from '@/utils/emitter';

const toDefaultPage = () => {
  history.push('/snippets');
};

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
    toDefaultPage();
  },
  handleChatGPTChunk: (data: {
    text?: string | undefined;
    hasMore: boolean;
  }) => {
    emitter.emit('chatGPTChunk', data);
  },
  askChatGPT: (data: string) => {
    if (
      document.location.pathname === '/index.html' ||
      document.location.pathname === '/'
    ) {
      localStorage.setItem('askChatGPT', data);
      history.push('/chatGPT');
    } else {
      emitter.emit('askChatGPT', data);
    }
  },
};
