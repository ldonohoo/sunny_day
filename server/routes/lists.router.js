const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET all lists for user
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const sqlText = `
    SELECT * FROM list
      WHERE user_id = $1
      ORDER BY sort_order;
    `;
    pool.query(sqlText, [userId])
    .then(dbResponse => {
      console.log('GET route for /api/lists sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/lists failed', dbError);
      res.sendStatus(500);
    })
});

/**
 * POST a new list for user
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  const item = req.body;
  console.log('item:', item)
  const user = req.user;
  const sqlText = `
  INSERT INTO list
    (description, location_id, user_id, sort_order)
    VALUES ($1, $2, $3, 
          COALESCE((SELECT MAX(sort_order) 
                    FROM list 
                    WHERE user_id = $3), 0) + 1);
    `;
    pool.query(sqlText, [item.description, 
                          item.location,
                          user.id])
    .then(dbResponse => {
      console.log('GET route for /api/lists sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/lists failed', dbError);
      res.sendStatus(500);
    })
});

module.exports = router;
