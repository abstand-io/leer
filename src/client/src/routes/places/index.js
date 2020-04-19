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
		console.log(query);
		setTimeout(() => {

			this.setState({
				loading: false,
				places: [
					{
						name: 'Lidl',
						address: 'Vaihiger Str. 115 70567 Stuttgart',
						status: 'green'
					},
					{
						name: 'Biomarkt Erdi',
						address: 'Widmaier Str. 110 70567 Stuttgart',
						status: 'green'
					},
					{
						name: 'Naturgut',
						address: 'Vaihiger Str. 37 70567 Stuttgart',
						status: 'green'
					},
					{
						name: 'Rewe',
						address: 'Widmaier Str. 110 70567 Stuttgart',
						status: 'yellow'
					},
					{
						name: 'Aldi Süd',
						address: 'Widmaier Str. 110 70567 Stuttgart',
						status: 'red'
					}
				]
			})
		}, 2000);
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
											<div class={style.placeAddress}>{place.address}</div>
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
