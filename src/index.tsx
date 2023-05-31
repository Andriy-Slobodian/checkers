import { createRoot } from 'react-dom/client';
import { App } from '@components/App/App';
import { store } from './redux/store';
import { Provider } from 'react-redux'

const $root = document.getElementById("root");
const root = createRoot($root);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
