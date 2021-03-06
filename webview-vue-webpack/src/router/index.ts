import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import Layout from '../layout';
import Snippet from '../views/snippet/List';
import SnippetDetail from '../views/snippet/Detail';
import Block from '../views/block';
import BlockDetail from '../views/block/Detail';
import Config from '../views/config';
import AddSnippet from '../views/snippet/AddSnippet';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/snippets',
        name: 'Snippet',
        component: Snippet,
      },
      {
        path: '/blocks',
        name: 'Block',
        component: Block,
      },
      {
        path: '/snippets/detail/:name',
        name: 'SnippetDetail',
        component: SnippetDetail,
      },
      {
        path: '/blocks/detail/:name',
        name: 'BlockDetail',
        component: BlockDetail,
      },
      {
        path: '/config',
        name: 'Config',
        component: Config,
      },
      {
        path: '/snippets/add/:time',
        name: 'AddSnippet',
        component: AddSnippet,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
