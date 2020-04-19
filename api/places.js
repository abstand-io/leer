const axios = require('axios');
const busyHours = require('busy-hours');

const API_KEY = process.env.API_KEY || 'test';
const getPlacesUrl = (lat, lon, r, f, key) => 
  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}, ${lon}&radius=${r}&type=${f}&key=${key}`;

module.exports = (req, res) => {
  return res.json([
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
  const search = {
    f: req.body.f,
    r: req.body.r,
    lat: req.body.lat,
    lon: req.body.lon
  };
  axios({
    method: 'get',
    url: getPlacesUrl(search.lat, search.lon, search.r * 1000, search.f, API_KEY),
  })
  .then((response) => {
    const places = response.data.results.slice(0, 5).map(place => busyHours(place.id, API_KEY));
    Promise.all(places).then(p => res.json(p));
  })
  .catch(err => {
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
