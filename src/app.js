/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
const {
	browserHistory,
  IndexRoute,
  Route,
  Router,
} = require('react-router');
import Index from './container/indexContainer';
import { Provider } from 'react-redux';
import store from './store/store';

type Props = {||};

class App extends React.Component<Props> {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
						<Route path="/" component={Index}/>
				</Router>
			</Provider>
		)
	}
}

const dom = document.getElementById('App')
if (dom === null) {
	//Error
	console.error("dom does not exist")
} else {
	ReactDOM.render(<App />, dom);
}
