import { h, Component } from 'preact';
import style from './style';
import Loading from '../../components/loading';
import Gps from '../../components/gps';
import Place from '../../components/place';
import { getFavorites } from '../../utils/local';

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
				if (query.favorites) {
					query.favorites = getFavorites();
				} else {
					query.lat = this.state.lat;
					query.lon = this.state.lon;
				}
				fetch('/api/places', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(query)
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
				loading: false,
				geo: false
			});
		}, {
			timeout: 10000
		});
	}

	render({ query }, { geo, loading, places }) {
		return (
			<div class={style.places}>
				{
					!geo && loading
					? <Gps />
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
				{ !loading && geo && places.length === 0 ? <Loading error={true} /> : null}
				{ !loading && !geo
					? <Gps error={true} />
					: null}
			</div>
		);
	}
}
