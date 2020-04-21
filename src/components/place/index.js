import { h, Component } from 'preact';
import style from './style';

export default class Place extends Component {

	constructor() {
		super();
  }

  toStatus(now) {
		if (!now) {
			return 'closed';
		}
		if (now.percentage <= 30) {
			return 'green';
		}
		if (now.percentage <= 60) {
			return 'yellow';
		}
		return 'red';
  }
  
  toAddress(address) {
    const lastComma = address.lastIndexOf(',');
    return address.slice(0, lastComma);
  }

  render({ place }) {
    return (
      <div class={style.place}>
        <div class={this.toStatus(place.now)}></div>
        <div class={style.placeDetails}>
          <div class={style.placeName}>{place.name}</div>
          <div class={style.placeAddress}>{this.toAddress(place.formatted_address)}</div>
        </div>
      </div>
    )
  }
}
