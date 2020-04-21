import { h, Component, createRef } from 'preact';
import Chart from 'chart.js';
import style from './style';

export default class Place extends Component {
  ref = createRef();

  constructor() {
    super();
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toStatus(now, week) {
    if (now) {
      if (now.percentage <= 30) {
        return 'green';
      }
      if (now.percentage <= 60) {
        return 'yellow';
      }
      return 'red';
    }
    if (week) {
      const today = new Date();
      const weekday = today.getDay();
      const hours = today.getHours();
      const weekHours = week[weekday];
      if (weekHours) {
        const hour = weekHours.hours.find((h) => h.hour === hours);
        if (hour) {
          if (hour.percentage <= 30) {
            return 'green';
          }
          if (hour.percentage <= 60) {
            return 'yellow';
          }
          return 'red';
        }
      }
    }
    return 'closed';
  }

  toAddress(address) {
    const lastComma = address.lastIndexOf(',');
    return address.slice(0, lastComma);
  }

  componentDidMount() {
    const canvas = this.ref.current;
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    });
  }

  render({ place }, { collapsed }) {
    return (
      <div class={style.place} onClick={this.toggleCollapsed}>
        <div class={style.placeHeader}>
          <div class={this.toStatus(place.now, place.week)}></div>
          <div class={style.placeDetails}>
            <div class={style.placeName}>{place.name}</div>
            <div class={style.placeAddress}>
              {this.toAddress(place.formatted_address)}
            </div>
          </div>
        </div>
        <div class={collapsed ? style.moreCollapsed : style.more}>
          <canvas ref={this.ref} width="400" height="120"></canvas>
        </div>
      </div>
    );
  }
}
