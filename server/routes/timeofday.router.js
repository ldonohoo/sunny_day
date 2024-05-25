const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all time of day types for selection dropdown 
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  console.log('In time of days GET route', )
  const userId = req.user.id;
  const sqlText = `
    SELECT * FROM time_of_day
        WHERE user_id = $1
        ORDER BY id;
    `;
    pool.query(sqlText, [userId])
    .then(dbResponse => {
      console.log('WOWSER GET route for /api/time_of_day sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('WOWSER GET route for /api/time_of_day failed', dbError);
      res.sendStatus(500);
    })
});



module.exports = router;