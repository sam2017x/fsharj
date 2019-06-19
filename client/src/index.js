import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import store from './store';
import client from './apollo';
import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
