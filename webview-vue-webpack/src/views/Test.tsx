import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const title = reactive({ data: '121212' });
    return () => (
      <>
        <h1>Home</h1>
        <h1>{title.data}</h1>
      </>
    );
  },
});
