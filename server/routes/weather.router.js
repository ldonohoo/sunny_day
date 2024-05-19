const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all preferred weather types for selection dropdown 
 */
router.get('/types',rejectUnauthenticated, (req, res) => {
  const user = req.user;
  const sqlText = `
    SELECT * FROM preferred_weather_type;
    `;
    pool.query(sqlText, [user.id])
    .then(dbResponse => {
      console.log('GET route for /api/weather/types sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/weather/types failed', dbError);
      res.sendStatus(500);
    })
});



module.exports = router;