const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all preferred weather types for selection dropdown 
 */
router.get('/types/',rejectUnauthenticated, (req, res) => {
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
  const user = user.id;
  const locationId = req.query.id;
  // use location and user to get lat/long coordinates
  const sqlText = `
    SELECT latitude, longitude
      FROM location
      WHERE id = $1 
        AND user_id = $2;
    `;
    pool.query(sqlText, [locationId, user.id])
    .then(dbResponse => {
      console.log('Get of location lat/long in /api/weather/forecast/ worked!', dbResponse.rows);
      // then use that to query visualcrossing with axios get!!
      axios({
        method: 'GET',
        url: `stuff`
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