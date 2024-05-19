const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET all list items for list
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const sqlText = `
    SELECT * FROM list_item
      WHERE user_id = $1
      ORDER BY sort_order;
    `;
    pool.query(sqlText, [userId])
    .then(dbResponse => {
      console.log('GET route for /api/list_items sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/list_items failed', dbError);
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
  INSERT INTO list_item
    (description, 
     priority,
     preferred_weather_type,
     due_date,
     year_to_complete,
     list_id,
     sort_order)
    VALUES ($1, $2, $3, $4, $5, $6, 
          COALESCE((SELECT MAX(sort_order) 
                    FROM list_item
                    WHERE user_id = $3), 0) + 1);
    `;f
    pool.query(sqlText, [ newListItem.description, 
                          newListItem.priority,
                          newListItem.preferred_weather_type,
                          newListItem.due_date,
                          newListItem.year_to_complete,
                          newListItem.list_id,
                          newListItem.sort_order ])
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