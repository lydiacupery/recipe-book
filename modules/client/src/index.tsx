import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EnhancedApp from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <EnhancedApp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
