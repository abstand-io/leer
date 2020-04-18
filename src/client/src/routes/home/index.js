import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {

	search = () => {
		const query = {
			radius: 2,
			filter: 'grocery'
		};
		const q = btoa(JSON.stringify(query)).slice(0, -2);
		route(`/places/${q}`);
	}

	render() {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<button onClick={this.search}>Search</button>
			</div>
		);
	}
}
