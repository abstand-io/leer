import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

import Home from '../routes/home';
import Places from '../routes/places';

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<main>
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Places path="/places/:query" />
					</Router>
				</main>
			</div>
		);
	}
}