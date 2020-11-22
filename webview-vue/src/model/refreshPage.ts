import { reactive, toRefs } from 'vue';

const model = reactive<{ refresh: boolean }>({
  refresh: false,
});

export default function useRefreshPage() {
  const toggleRefresh = () => {
    model.refresh = !model.refresh;
  };
  return {
    ...toRefs(model),
    toggleRefresh,
  };
}
