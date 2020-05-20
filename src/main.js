import Vue from 'vue';
import Editor from 'v-markdown-editor';
import App from './App.vue';
import router from './router';
import store from '@/store/store';

Vue.config.productionTip = false;

Vue.use(Editor);

// This provides a $bubble method that emits an event on ALL parent components.
Vue.use((vue) => {
  // eslint-disable-next-line no-param-reassign
  vue.prototype.$bubble = function $bubble(eventName, ...args) {
    let component = this;
    do {
      component.$emit(eventName, ...args);
      component = component.$parent;
    } while (component);
  };
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
