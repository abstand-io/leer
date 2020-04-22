const axios = require('axios');

const testData = JSON.parse(
  '[{"place_id": "test", "name":"Edeka AG & Co. KG","formatted_address":"Imanuel-Maier-Straße 2, 73257 Köngen, Germany","location":{"lat":48.67384370000001,"lng":9.360903599999999},"status":"ok","week":[{"day":"Sun","hours":[]},{"day":"Mon","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":0},{"hour":8,"percentage":7},{"hour":9,"percentage":16},{"hour":10,"percentage":25},{"hour":11,"percentage":29},{"hour":12,"percentage":25},{"hour":13,"percentage":19},{"hour":14,"percentage":17},{"hour":15,"percentage":20},{"hour":16,"percentage":26},{"hour":17,"percentage":28},{"hour":18,"percentage":24},{"hour":19,"percentage":15},{"hour":20,"percentage":7},{"hour":21,"percentage":1},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Tue","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":0},{"hour":8,"percentage":3},{"hour":9,"percentage":14},{"hour":10,"percentage":26},{"hour":11,"percentage":29},{"hour":12,"percentage":22},{"hour":13,"percentage":15},{"hour":14,"percentage":15},{"hour":15,"percentage":19},{"hour":16,"percentage":23},{"hour":17,"percentage":23},{"hour":18,"percentage":19},{"hour":19,"percentage":11},{"hour":20,"percentage":4},{"hour":21,"percentage":2},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Wed","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":0},{"hour":8,"percentage":4},{"hour":9,"percentage":13},{"hour":10,"percentage":20},{"hour":11,"percentage":21},{"hour":12,"percentage":17},{"hour":13,"percentage":13},{"hour":14,"percentage":15},{"hour":15,"percentage":21},{"hour":16,"percentage":27},{"hour":17,"percentage":27},{"hour":18,"percentage":22},{"hour":19,"percentage":14},{"hour":20,"percentage":7},{"hour":21,"percentage":1},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Thu","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":0},{"hour":8,"percentage":6},{"hour":9,"percentage":25},{"hour":10,"percentage":42},{"hour":11,"percentage":38},{"hour":12,"percentage":21},{"hour":13,"percentage":14},{"hour":14,"percentage":21},{"hour":15,"percentage":30},{"hour":16,"percentage":36},{"hour":17,"percentage":35},{"hour":18,"percentage":26},{"hour":19,"percentage":15},{"hour":20,"percentage":7},{"hour":21,"percentage":2},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Fri","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":0},{"hour":8,"percentage":2},{"hour":9,"percentage":32},{"hour":10,"percentage":64},{"hour":11,"percentage":44},{"hour":12,"percentage":30},{"hour":13,"percentage":41},{"hour":14,"percentage":45},{"hour":15,"percentage":45},{"hour":16,"percentage":56},{"hour":17,"percentage":69},{"hour":18,"percentage":62},{"hour":19,"percentage":38},{"hour":20,"percentage":15},{"hour":21,"percentage":2},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Sat","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":8},{"hour":8,"percentage":25},{"hour":9,"percentage":52},{"hour":10,"percentage":81},{"hour":11,"percentage":100},{"hour":12,"percentage":100},{"hour":13,"percentage":86},{"hour":14,"percentage":75},{"hour":15,"percentage":75},{"hour":16,"percentage":80},{"hour":17,"percentage":77},{"hour":18,"percentage":61},{"hour":19,"percentage":37},{"hour":20,"percentage":17},{"hour":21,"percentage":4},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]}]},{"place_id": "test", "name":"Kaufland","formatted_address":"Wertstraße 12, 73240 Wendlingen am Neckar, Germany","location":{"lat":48.6727219,"lng":9.364180499999998},"status":"ok","week":[{"day":"Sun","hours":[]},{"day":"Mon","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":16},{"hour":8,"percentage":29},{"hour":9,"percentage":38},{"hour":10,"percentage":44},{"hour":11,"percentage":51},{"hour":12,"percentage":55},{"hour":13,"percentage":50},{"hour":14,"percentage":44},{"hour":15,"percentage":46},{"hour":16,"percentage":56},{"hour":17,"percentage":63},{"hour":18,"percentage":59},{"hour":19,"percentage":46},{"hour":20,"percentage":28},{"hour":21,"percentage":14},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Tue","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":11},{"hour":8,"percentage":20},{"hour":9,"percentage":29},{"hour":10,"percentage":40},{"hour":11,"percentage":51},{"hour":12,"percentage":53},{"hour":13,"percentage":47},{"hour":14,"percentage":41},{"hour":15,"percentage":41},{"hour":16,"percentage":46},{"hour":17,"percentage":47},{"hour":18,"percentage":41},{"hour":19,"percentage":29},{"hour":20,"percentage":18},{"hour":21,"percentage":8},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Wed","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":11},{"hour":8,"percentage":17},{"hour":9,"percentage":21},{"hour":10,"percentage":27},{"hour":11,"percentage":37},{"hour":12,"percentage":42},{"hour":13,"percentage":35},{"hour":14,"percentage":30},{"hour":15,"percentage":36},{"hour":16,"percentage":45},{"hour":17,"percentage":48},{"hour":18,"percentage":41},{"hour":19,"percentage":27},{"hour":20,"percentage":14},{"hour":21,"percentage":5},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Thu","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":10},{"hour":8,"percentage":19},{"hour":9,"percentage":27},{"hour":10,"percentage":38},{"hour":11,"percentage":51},{"hour":12,"percentage":57},{"hour":13,"percentage":51},{"hour":14,"percentage":43},{"hour":15,"percentage":45},{"hour":16,"percentage":53},{"hour":17,"percentage":58},{"hour":18,"percentage":53},{"hour":19,"percentage":40},{"hour":20,"percentage":25},{"hour":21,"percentage":12},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Fri","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":15},{"hour":8,"percentage":25},{"hour":9,"percentage":38},{"hour":10,"percentage":49},{"hour":11,"percentage":57},{"hour":12,"percentage":61},{"hour":13,"percentage":62},{"hour":14,"percentage":66},{"hour":15,"percentage":74},{"hour":16,"percentage":84},{"hour":17,"percentage":86},{"hour":18,"percentage":76},{"hour":19,"percentage":56},{"hour":20,"percentage":34},{"hour":21,"percentage":17},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]},{"day":"Sat","hours":[{"hour":6,"percentage":0},{"hour":7,"percentage":20},{"hour":8,"percentage":38},{"hour":9,"percentage":55},{"hour":10,"percentage":72},{"hour":11,"percentage":88},{"hour":12,"percentage":98},{"hour":13,"percentage":100},{"hour":14,"percentage":96},{"hour":15,"percentage":96},{"hour":16,"percentage":99},{"hour":17,"percentage":98},{"hour":18,"percentage":88},{"hour":19,"percentage":68},{"hour":20,"percentage":45},{"hour":21,"percentage":25},{"hour":22,"percentage":0},{"hour":23,"percentage":0}]}],"now":{"hour":17,"percentage":33}}]'
);

const API_KEY = process.env.API_KEY || 'test';
const getPlacesUrl = (lat, lon, r, f, key) =>
  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}, ${lon}&radius=${r}&type=${f}&key=${key}`;

const busyHours = async (place_id, key) => {
  if (!(place_id && key)) {
    return { status: 'error', message: 'Place ID / API key missing' };
  }

  const gmaps = require('@google/maps').createClient({
    key: key,
    Promise: Promise,
  });

  const format_output = (array) => {
    return {
      hour: array[0],
      percentage: array[1],
    };
  };

  const extract_data = (html) => {
    // ACHTUNG! HACKY AF
    let str = ['APP_INITIALIZATION_STATE=', 'window.APP_FLAGS'],
      script = html.substring(
        html.lastIndexOf(str[0]) + str[0].length,
        html.lastIndexOf(str[1])
      );
    // LET'S PARSE THAT MOFO
    let first = eval(script),
      second = eval(first[3][6].replace(")]}'", ''));

    return second[6][84];
  };

  const process_html = (html) => {
    const popular_times = extract_data(html);

    if (!popular_times) {
      return { status: 'error', message: 'Place has no popular hours' };
    }
    const data = {};
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.week = Array.from(Array(7).keys()).map((index) => {
      let hours = [];
      if (popular_times[0][index] && popular_times[0][index][1]) {
        hours = Array.from(popular_times[0][index][1]).map((array) =>
          format_output(array)
        );
      }
      return {
        day: weekdays[index],
        hours: hours,
      };
    });
    const crowded_now = popular_times[7];
    
    if (crowded_now !== undefined) {
      data.now = format_output(crowded_now);
    }
    return data;
  };

  const fetch_html = async (url) => {
    try {
      const html = await axios({
        url,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
        },
      });
      return html.data;
    } catch (err) {
      return { status: 'error', message: `Invalid url: "${url}"` };
    }
  };

  try {
    const place = await gmaps.place({ placeid: place_id }).asPromise();
    const result = place.json.result;
    const {
      name,
      formatted_address,
      place_id,
      geometry: { location },
    } = result;
    const html = await fetch_html(result.url);
    if (html.status === 'error') {
      return html;
    }
    return Object.assign(
      { name, formatted_address, location },
      process_html(html)
    );
  } catch (err) {
    return { status: 'error', message: 'Error: ' + err.json.status || err };
  }
};

function status(now, week) {
  if (now) {
    if (now.percentage <= 30) {
      return 100;
    }
    if (now.percentage <= 60) {
      return 50;
    }
    return 10;
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
          return 100;
        }
        if (hour.percentage <= 60) {
          return 50;
        }
        return 10;
      }
    }
  }
  return 0;
}

module.exports = (req, res) => {
  /*testData.sort((a, b) => {
    const statusA = status(a.now, a.week);
    const statusB = status(b.now, b.week);
    if (statusA < statusB) {
      return 1;
    }
    if (statusA > statusB) {
      return -1;
    }
    return 0;
  })
  return res.json(testData);*/
  const { body } = req;
  const search = {
    f: body.f,
    r: body.r,
    lat: body.lat,
    lon: body.lon,
  };
  const url = getPlacesUrl(
    search.lat,
    search.lon,
    search.r * 1000,
    search.f,
    API_KEY
  );
  axios({
    method: 'get',
    url,
  })
    .then((response) => {
      const places = response.data.results
        .map((place) => busyHours(place.place_id, API_KEY));
      Promise.all(places).then((p) => {
        p.sort((a, b) => {
          const statusA = status(a.now, a.week);
          const statusB = status(b.now, b.week);
          if (statusA < statusB) {
            return 1;
          }
          if (statusA > statusB) {
            return -1;
          }
          return 0;
        });
        res.json(p);
      });
    })
    .catch((err) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
};
