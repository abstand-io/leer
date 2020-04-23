import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			r: 1,
			f: 'grocery_or_supermarket'
		};
	}

	search = () => {
		const query = {
			r: this.state.r,
			f: this.state.f
		};
		const q = btoa(JSON.stringify(query));
		route(`/places/${q}`);
	}

	onRadiusChange = e => {
    this.setState({ r: +e.target.value });
	}
	
	onFilterChange = e => {
    this.setState({ f: e.target.value });
  }

	render(_, { geo, f, r }) {
		return (
			<div class={style.home}>
				<p class="lead">
					Hi! Wir zeigen dir in welchen Geschäften in deinem Umkreis gerade wieviel los ist.
					Dazu benötigen wir deine Geo-Position. Deine Position wird von uns nicht gespeichert oder
					für andere Zwecke verwendet.
				</p>
				<div class={style.request}>
					<div class={style.group}>
						<label>
							<span class="title">In welchem Radius soll gesucht werden?</span>
						</label>
						<select value={r} onChange={this.onRadiusChange}>
							<option value="500">500 m</option>
							<option value="1000">1 km</option>
							<option value="2000">2 km</option>
							<option value="4000">4 km</option>
							<option value="6000">6 km</option>
							<option value="8000">8 km</option>
							<option value="10000">10 km</option>
						</select>
					</div>
					<div class={style.group}>
						<label>
							<span class="title">Welche Geschäfte sollen berücksichtigt werden?</span>
						</label>
						<select value={f} onChange={this.onFilterChange}>
							<option value="grocery_or_supermarket">Supermärkte</option>
							<option value="drugstore">Drogerien</option>
						</select>
					</div>
					<div class={style.group}>
						<button class="btn primary" onClick={this.search}>Los geht's</button>
					</div>
				</div>
				<p class={style.safe}>#staysafe</p>
			</div>
		);
	}
}
