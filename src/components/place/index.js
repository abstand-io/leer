import { h, Component, createRef } from 'preact';
import Chart from 'chart.js';
import style from './style';

import { CountUp } from '../count-up';
import { getFavorites, toggleFavorite } from '../../utils/local';

export default class Place extends Component {
  ref = createRef();

  constructor() {
    super();
    this.state = {
      collapsed: true,
      favorite: false,
      toiletPaperAmount: -1,
      fetching: false
    };
  }

  toggleCollapsed = () => {
    const collapsed = !this.state.collapsed;
    if (
      collapsed === false &&
      this.props.place.name.indexOf('dm-drogerie') !== -1 &&
      this.state.toiletPaperAmount === -1
    ) {
      this.setState({ collapsed, fetching: true });
      const query = `/api/toiletpaper?type=dm&place_id=${this.props.place.place_id}`;
      fetch(query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) =>
          response.status === 200 ? response.json() : { amount: -1 }
        )
        .then((data) =>
          this.setState({
            toiletPaperAmount: data.amount,
            fetching: false
          })
        ).catch(() => this.setState({
          toiletPaperAmount: -1,
          fetching: false
        }));
    } else {
      this.setState({ collapsed });
    }
  };

  toStatus(place) {
    if (place.opening_hours && !place.opening_hours.open_now) {
      return 'closed';
    }
    const now = place.now;
    const week = place.week;
    if (now) {
      if (now.percentage <= 30) {
        return 'green greenpulse';
      }
      if (now.percentage <= 60) {
        return 'yellow yellowpulse';
      }
      return 'red redpulse';
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

  componentDidMount() {
    getFavorites().then((favorites) =>
      this.setState({
        favorite: favorites.some(
          (f) => f.place_id === this.props.place.place_id
        ),
      })
    );

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

  toggleFav(ev, place) {
    ev.preventDefault();
    ev.stopPropagation();
    toggleFavorite(place).then((favorite) => this.setState({ favorite }));
  }

  openMaps = (ev, placeId) => {
    ev.preventDefault();
    ev.stopPropagation();
    window.open(
      `https://www.google.com/maps/search/?api=1&query=x&query_place_id=${placeId}`
    );
  };

  render({ place }, { collapsed, favorite, toiletPaperAmount, fetching }) {
    return (
      <div class={style.place} onClick={this.toggleCollapsed}>
        <div class={style.placeHeader}>
          <div class={this.toStatus(place)}></div>
          <div class={style.placeDetails}>
            <div class={style.placeName}>{place.name}</div>
            <div class={style.placeAddress}>{place.vicinity || '-'}</div>
            {favorite ? (
              <button
                class={style.fav}
                onClick={(ev) => this.toggleFav(ev, place)}
              >
                <img src="/assets/fav.svg" />
              </button>
            ) : (
              <button
                class={style.notfav}
                onClick={(ev) => this.toggleFav(ev, place)}
              >
                <img src="/assets/fav.svg" />
              </button>
            )}
          </div>
        </div>
        <div class={collapsed ? style.moreCollapsed : style.more}>
          {place.now ? <span class={style.live}>live</span> : null}
          <canvas ref={this.ref} width="400" height="120"></canvas>
          {toiletPaperAmount > -1 || fetching ? (
            <div class={style.toiletpaper}>
              <img class={fetching ? style.bounce : style.noBounce} src="/assets/toiletpaper.svg" />
              <p>
                { toiletPaperAmount > -1 ? <CountUp>{toiletPaperAmount}</CountUp> : null }
              </p>
            </div>
          ) : null}
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
