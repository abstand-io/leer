import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			r: 2,
			f: 'grocery_or_supermarket',
			lat: 48.596603,
			lon: 9.414554,
			geo: false
		};
	}

	search = () => {
		const query = {
			r: this.state.r,
			f: this.state.f,
			lat: this.state.lat,
			lon: this.state.lon
		};
		const q = btoa(JSON.stringify(query)).slice(0, -2);
		route(`/places/${q}`);
	}

	onRadiusChange = e => {
    this.setState({ r: +e.target.value });
	}
	
	onFilterChange = e => {
    this.setState({ f: e.target.value });
  }
	
	componentDidMount() {
		navigator.geolocation.getCurrentPosition((position) => {
			this.setState({
				lat: position.coords.latitude,
				lon: position.coords.longitude,
				geo: true
			});
		}, (err) => {
			this.setState({
				geo: false
			});
		});
	}

	render(_, { geo, f, r }) {
		return (
			<div class={style.home}>
				<h1>Search</h1>
				<p class="lead">We will search the places with the lowest amount of people based on your current geo position.
				<br/><br/>Let's go 🚶</p>
				{ !geo
					? <p>We need your geo position to proceed.<br/> Please activate your GPS.</p>
					: <div class={style.request}>
							<div class={style.group}>
								<label>Radius</label>
								<select value={r} onChange={this.onRadiusChange}>
									<option value="2">2 km</option>
									<option value="4">4 km</option>
									<option value="6">6 km</option>
									<option value="8">8 km</option>
									<option value="10">10 km</option>
								</select>
							</div>
							<div class={style.group}>
								<label>Filter</label>
								<select value={f} onChange={this.onFilterChange}>
									<option value="grocery_or_supermarket">Grocery</option>
									<option value="drugstore">Drugstore</option>
									<option value="grocery_or_supermarket,drugstore">Grocery & Drugstore</option>
								</select>
							</div>
							<div class={style.group}>
								<button class="btn primary" onClick={this.search}>Go</button>
							</div>
						</div>
				}
			</div>
		);
	}
}
