import { h, Component } from 'preact';
import style from './style';

export default class Places extends Component {
	showQuery = (query) => {
		return atob(query + '==');
	}

	// Note: `user` comes from the URL, courtesy of our router
	render({ query }) {
		return (
			<div class={style.places}>
				<h1>Places</h1>
				<div>{this.showQuery(query)}</div>
			</div>
		);
	}
}
