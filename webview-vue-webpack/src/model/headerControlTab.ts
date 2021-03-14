import { reactive, toRefs } from 'vue';

export const TabOptions = ['/snippets', '/blocks', '/config', 'more'] as const;

export type Tab = typeof TabOptions[number];

const model = reactive<{ tab: Tab }>({
  tab: '/snippets',
});

export default function useHeaderControlTab() {
  const updateTab = (tab: Tab) => {
    model.tab = tab;
  };
  return {
    ...toRefs(model),
    updateTab,
  };
}
