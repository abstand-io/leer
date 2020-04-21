import { h, Component } from 'preact';
import style from './style';
import Loading from '../../components/loading';
import Place from '../../components/place';

export default class Places extends Component {

	constructor() {
		super();
		this.state = {
			loading: true,
			places: [],
			geo: false
		};
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition((position) => {
			this.setState({
				lat: position.coords.latitude,
				lon: position.coords.longitude,
				geo: true
			}, () => {
				const query = JSON.parse(atob(this.props.query));
				query.lat = this.state.lat;
				query.lon = this.state.lon;
				fetch('/api/places', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: query
				})
				.then((response) => response.status === 200 ? response.json() : [])
				.then((data) => {
					this.setState({
						loading: false,
						places: data
					});
				});
			});
		}, (err) => {
			this.setState({
				geo: false
			});
		});
		
	}

	render({ query }, { geo, loading, places }) {
		return (
			<div class={style.places}>
				{
					!geo && loading
					? <p class="title">Bitte aktiviere nun dein GPS.</p>
					: geo && loading
						? (<Loading />)
						: (<ul>
								{ places.map(place => (
										<li>
											<Place place={place} />
										</li>
									))
								}
							</ul>)
				}
				{ !loading && places.length === 0 ? <p>Leider ergab unsere Suche keinen Treffer.</p> : null}
				{ !loading && !geo
					? <p>Wir können ohne GPS keine Suche durchführen.</p>
					: null}
			</div>
		);
	}
}
