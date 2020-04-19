const axios = require('axios');

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
    const data = { status: 'ok' };
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

module.exports = (req, res) => {
  /*return res.json([
    {
      name: 'Lidl',
      formatted_address: 'Vaihiger Str. 115 70567 Stuttgart',
      status: 'green'
    },
    {
      name: 'Biomarkt Erdi',
      formatted_address: 'Widmaier Str. 110 70567 Stuttgart',
      status: 'green'
    },
    {
      name: 'Naturgut',
      formatted_address: 'Vaihiger Str. 37 70567 Stuttgart',
      status: 'green'
    },
    {
      name: 'Rewe',
      formatted_address: 'Widmaier Str. 110 70567 Stuttgart',
      status: 'yellow'
    },
    {
      name: 'Aldi Süd',
      formatted_address: 'Widmaier Str. 110 70567 Stuttgart',
      status: 'red'
    }
  ]);
  */
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
        .slice(0, 5)
        .map((place) => busyHours(place.place_id, API_KEY));
      Promise.all(places).then((p) => res.json(p));
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
