import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EnhancedApp from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EnhancedApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
