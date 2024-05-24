const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all time of day types for selection dropdown 
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  
  const sqlText = `
    SELECT * FROM time_of_day
        ORDER BY id;
    `;
    pool.query(sqlText)
    .then(dbResponse => {
      console.log('GET route for /api/time_of_day sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/time_of_day failed', dbError);
      res.sendStatus(500);
    })
});



module.exports = router;