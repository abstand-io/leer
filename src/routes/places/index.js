import { h, Component } from 'preact';
import style from './style';
import Loading from '../../components/loading';

export default class Places extends Component {

	constructor() {
		super();
		this.state = {
			loading: true,
			places: []
		};
	}

	componentDidMount() {
		const query = atob(this.props.query + '==');
		fetch('/api/places', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				body: query
			}
		})
		.then((response) => response.status === 200 ? response.json() : [])
		.then((data) => {
			this.setState({
				loading: false,
				places: data
			});
		});
	}

	toStatus(percentage) {
		if (percentage <= 30) {
			return 'green';
		}
		if (percentage <= 60) {
			return 'yellow';
		}
		return 'red';
	}

	render({ query }, { loading, places }) {
		return (
			<div class={style.places}>
				<h1>Places</h1>
				{ 
					loading
					? (<Loading />)
					: (<ul>
							{ places.map(place => (
									<li>
										<div class={place.status}></div>
										<div class={style.place}>
											<div class={style.placeName}>{place.name}</div>
											<div class={style.placeAddress}>{place.formatted_address}</div>
										</div>
									</li>
								))
							}
						</ul>)
				}
				{ !loading && places.length === 0 ? <p>No places found.</p> : null}
			</div>
		);
	}
}
