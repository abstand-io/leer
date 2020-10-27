const axios = require('axios');

const API_KEY = process.env.API_KEY;

const dmApi =
  'https://products.dm.de/store-availability/DE/availability?dans=595420,708997,137425,28171,485698,799358,863567,452740,610544,846857,709006,452753,879536,452744,485695,853483,594080,504606,593761,525943,842480,535981,127048,524535&storeNumbers=';

const getPlaceUrl = (key, placeId) =>
  `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${key}&fields=website`;

const fetchToiletpaperAmountFromDM = async (storeId) => {
  try {
    const result = await axios({
      url: `${dmApi}${storeId}`,
      method: 'get',
    });
    if (
      result != null &&
      result.data != null &&
      result.data.storeAvailabilities != null
    ) {
      let stockLevel = 0;
      const storeAvailabilities = result.data.storeAvailabilities;
      for (const key in storeAvailabilities) {
        if (storeAvailabilities.hasOwnProperty(key)) {
          const product = storeAvailabilities[key];
          stockLevel += product
            .map((p) => p.stockLevel || 0)
            .reduce((p, c) => p + c, 0);
        }
      }
      return stockLevel;
    } else {
      console.log('No store availabilities');
      return -1;
    }
  } catch (err) {
    console.log('Cannot get store details');
    return -1;
  }
};

module.exports = (req, res) => {
  const { query } = req;
  if (query != null && query.type === 'dm' && query.place_id != null) {
    axios({
      method: 'get',
      url: getPlaceUrl(API_KEY, query.place_id),
    }).then((dm) => {
      if (
        dm != null &&
        dm.data != null &&
        dm.data.result != null &&
        dm.data.result.website != null
      ) {
        const website = dm.data.result.website;
        const start = website.indexOf('de-');
        if (start != -1) {
          let storeId = website.slice(start + 3);
          const end = storeId.indexOf('/');
          storeId = storeId.slice(0, end);
          fetchToiletpaperAmountFromDM(storeId).then((amount) => {
            res.json({ amount });
          });
        } else {
          console.log('Cannot get store id');
          res.json({ amount: -1 });
        }
      } else {
        console.log('Cannot get result');
        res.json({ amount: -1 });
      }
    });
  } else {
    console.log('Cannot get query');
    res.json({ amount: -1 });
  }
};
