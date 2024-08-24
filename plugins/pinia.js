import { createPinia } from 'pinia';

export default ({ app }) => {
  app.pinia = createPinia();
};