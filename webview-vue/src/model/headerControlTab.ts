import { reactive } from 'vue';

const model = reactive({
  tab: '/snippets',
});

export default function useHeaderControlTab() {
  const updateTab = (tab: string) => {
    model.tab = tab;
  };
  return {

  }
}
