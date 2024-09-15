import { createPinia, PiniaVuePlugin } from 'pinia';
import Vue from 'vue';

Vue.use(PiniaVuePlugin);

export default (context, inject) => {
  const pinia = createPinia();
  context.app.pinia = pinia;
  pinia.use(({ store }) => {
    store.$axios = context.app.$axios;
  });

  inject('pinia', pinia);
};