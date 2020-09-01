import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  setup(prop) {
    const count = ref(0)
    return () => (
      <>
        <h1>{prop.msg}</h1>
        <button onClick={() => {count.value ++}}>count is: { count.value }</button>
        <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
      </>
    );
  },
});