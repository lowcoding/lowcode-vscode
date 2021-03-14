import { defineComponent, onMounted, PropType, watch } from 'vue';
import codemirror from 'codemirror';
import './jsonlint.js';
import './mode/javascript/javascript.js';
import './addon/lint/lint.js';
//require('codemirror/addon/lint/javascript-lint.js');
import './addon/lint/json-lint.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/lint/lint.css';

export default defineComponent({
  props: {
    domId: {
      type: String,
      required: true,
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
    },
    defaultValue: {
      type: String,
    },
    value: {
      type: String,
    },
    mode: {
      type: String as PropType<'application/json' | 'javascript'>,
      default: 'application/json',
    },
    lint: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props, context) {
    let codeMirrorInstant: CodeMirror.EditorFromTextArea;
    onMounted(() => {
      codeMirrorInstant = codemirror.fromTextArea(document.getElementById(props.domId) as any, {
        value: props.defaultValue || props.value,
        //lineNumbers: true,
        mode: props.mode,
        // gutters: ['CodeMirror-lint-markers'],
        lint: props.lint,
        theme: 'monokai',
      });
      codeMirrorInstant.on('change', () => {
        const value = codeMirrorInstant.getValue();
        if (props.mode === 'application/json' && props.lint) {
          try {
            JSON.parse(value);
            context.emit('change', value);
          } catch (ex) {
			  console.error(ex)
		  }
        } else {
          context.emit('change', value);
        }
      });
    });
    watch(
      () => props.value,
      () => {
        if (props.value !== codeMirrorInstant.getValue()) {
          codeMirrorInstant.setValue(props.value || '');
        }
      },
    );
    return () => <textarea id={props.domId}></textarea>;
  },
});
