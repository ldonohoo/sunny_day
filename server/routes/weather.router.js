const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
require('dotenv').config()

const VISUAL_CROSSING_API_KEY = process.env.VISUAL_CROSSING_API_KEY
const visualCrossRequest = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const visualCrossIconSet = 'icons2';

// Get today's date
let today = new Date();
today = today.toISOString().split('T')[0];
// Get the date 6 days from today (for seven day forecast)
let seventhDay = new Date();
seventhDay.setDate(seventhDay.getDate() + 6);
seventhDay = seventhDay.toISOString().split('T')[0];
console.log('today,seventhday', today, seventhDay);


/**
 * GET all preferred weather types for selection dropdown 
 */
router.get('/types/',rejectUnauthenticated, (req, res) => {
  console.log('in get of weather types!')
  const sqlText = `
    SELECT * FROM preferred_weather_type
        ORDER BY id;
    `;
    pool.query(sqlText)
    .then(dbResponse => {
      console.log('GET route for /api/weather/types sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/weather/types failed', dbError);
      res.sendStatus(500);
    })
});

router.get('/forecast/', rejectUnauthenticated, (req, res) => {
  console.log('in get of forecast!')
  const userId = Number(req.user.id);
  const locationId = Number(req.query.id);
  console.log('locationid', locationId, 'userId', userId)
  // use location and user to get lat/long coordinates
  const sqlText = `
    SELECT *
      FROM location
      WHERE id = $1 
        AND user_id = $2;
    `;
    pool.query(sqlText, [locationId, userId])
    .then(dbResponse => {
      console.log('Get of location lat/long in /api/weather/forecast/ worked!', JSON.stringify(dbResponse.rows));
      // then use that to query visualcrossing with axios get!!
      
      const { name, country, latitude, longitude } = dbResponse.rows[0];
      let utcOffset = Number(dbResponse.rows[0].utc_offset);
      console.log('utc offset, name, country, lat, long', utc_offset, name, country, latitude, longitude);
      // sample format (visual crossing timeline weather api)
      //    https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY 
      axios({
        method: 'GET',
        url: `${visualCrossRequest}${latitude},${longitude}/${today}/${seventhDay}?key=${VISUAL_CROSSING_API_KEY}&iconSet=${visualCrossIconSet}&timezone=${utcOffset}`
      })
      .then(apiResponse => {
        console.log('GET of data from visual crossing worked at /api/weather/forecast/!', apiResponse.data);
        res.send(apiResponse.data);
      })
      .catch(apiError => {
        console.log('GET of API data from visual crossing failed in /api/weather/forecast/, please try again later', apiError);
        res.sendStatus(500);
      })
    })
    .catch(dbError => {
      console.log('Get of location lat/log in api/weather/forecast/ failed', dbError);
      res.sendStatus(500);
    })
})


module.exports = router;