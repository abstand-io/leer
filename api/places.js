const axios = require('axios');
const locale = require('locale');

const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',').map(o => o.startsWith('/') ? new RegExp(o.slice(1)) : o);
const SUPPORTED_LOCALES = new locale.Locales(['en', 'de']);

const getPlacesUrl = (lat, lon, r, f, c, key) => c === 'de' && f === 'hardware_store'
  ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${r}&keyword=baumarkt&key=${key}`
  : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${r}&type=${f}&key=${key}`;

const busyHours = async (place) => {
  if (!place) {
    return { status: 'error', message: 'Place ID missing' };
  }

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
    const {
      name,
      place_id,
      vicinity,
      geometry: { location },
      opening_hours: { open_now },
    } = place;
    const html = await fetch_html(
      `https://google.com/maps/search/?api=1&query=x&query_place_id=${place.place_id}`
    );
    if (html.status === 'error') {
      return html;
    }
    return Object.assign(
      {
        name,
        vicinity,
        place_id,
        geometry: { location },
        opening_hours: { open_now },
      },
      process_html(html)
    );
  } catch (err) {
    let status = err;
    if (err.json) {
      status = err.json.status;
    }
    return { status: 'error', message: 'Error: ' + status };
  }
};

function status(place) {
  if (place.opening_hours && !place.opening_hours.open_now) {
    return -1;
  }
  const now = place.now;
  const week = place.week;
  if (now) {
    if (now.percentage <= 30) {
      return 110;
    }
    if (now.percentage <= 60) {
      return 60;
    }
    return 20;
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

function isString(s) {
  return typeof s === 'string' || s instanceof String;
}

function isOriginAllowed(origin, allowedOrigin) {
  if (Array.isArray(allowedOrigin)) {
    for (var i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (isString(allowedOrigin)) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
}


module.exports = (req, res) => {
  const origin = req.headers['origin'];
  const originAllowed = isOriginAllowed(origin, ALLOWED_ORIGINS);
  if (!originAllowed) {
    return res.sendStatus(403);
  } else {
    res.setHeader('Access-Control-Request-Method', 'POST');
    res.setHeader('Access-Control-Request-Headers', origin);
  }

  const locales = new locale.Locales(req.headers['accept-language']);
  const bestLocale = locales.best(SUPPORTED_LOCALES);
  const { body } = req;
  let placesQuery = Promise.resolve({
    data: {
      results: [],
    },
  });
  if (body.favorites) {
    placesQuery = Promise.resolve({
      data: {
        results: body.favorites.map(f => ({ ...f, opening_hours: { open_now: true } })),
      },
    });
  } else {
    const search = {
      f: body.f,
      r: body.r,
      lat: body.lat,
      lon: body.lon,
    };
    const url = getPlacesUrl(
      search.lat,
      search.lon,
      search.r,
      search.f,
      bestLocale.code,
      API_KEY
    );
    placesQuery = axios({
      method: 'get',
      url,
    });
  }
  placesQuery
    .then((response) => {
      const places = response.data.results.map((place) =>
        busyHours(place, API_KEY)
      );
      Promise.all(places).then((p) => {
        p = p.filter((p) => p.status !== 'error');
        p.sort((a, b) => {
          const statusA = status(a);
          const statusB = status(b);
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
