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
    if (address) {
      const lastComma = address.lastIndexOf(',');
      return address.slice(0, lastComma);
    }
    return '-';
  }

  componentDidMount() {
    const week = this.props.place.week;
    const canvas = this.ref.current;
    if (week) {
      const today = new Date();
      const weekday = today.getDay();
      const weekHours = week[weekday];
      const hours = today.getHours();
      const ctx = canvas.getContext('2d');
      const options = {
        type: 'bar',
        data: {
          labels: weekHours.hours.map((h) => h.hour),
          datasets: [
            {
              order: 2,
              data: weekHours.hours.map((h) => h.percentage),
              backgroundColor: weekHours.hours.map((h) =>
                h.hour === hours ? '#c0c0c0' : '#dddddd'
              ),
              hoverBackgroundColor: weekHours.hours.map((h) =>
                h.hour === hours ? '#c0c0c0' : '#dddddd'
              ),
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontSize: 10,
                  beginAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: false,
                gridLines: {
                  display: false,
                },
                ticks: {
                  display: false,
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
      const now = this.props.place.now;
      if (now) {
        const n = weekHours.hours.findIndex((h) => h.hour === now.hour);
        options.data.datasets.push({
          order: 1,
          data: weekHours.hours.map((h, i) => (i === n ? now.percentage : 0)),
          backgroundColor: '#dafffb',
          hoverBackgroundColor: '#dafffb',
          type: 'bar',
        });
      }
      const busyHourChart = new Chart(ctx, options);
    } else {
      canvas.style.display = 'none';
    }
  }

  openMaps = (ev, placeId) => {
    ev.preventDefault();
    ev.stopPropagation();
    window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`);
  };

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
          {place.now ? <span class={style.live}>live</span> : null}
          <canvas ref={this.ref} width="400" height="120"></canvas>
          <button
            class="btn primary"
            onClick={(e) => this.openMaps(e, place.place_id)}
          >
            Google Maps öffnen
          </button>
        </div>
      </div>
    );
  }
}
