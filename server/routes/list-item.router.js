const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET all list items for list
 */
router.get('/:list_id',rejectUnauthenticated, (req, res) => {
  console.log('listid in GET route:', req.params.list_id)
  const listId = req.params.list_id;
  const sqlText = `
    SELECT * FROM list_item
      WHERE list_id = $1
      ORDER BY sort_order;
    `;
    pool.query(sqlText, [listId])
    .then(dbResponse => {
      console.log('GET route for /api/list_items/:list_id sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/list_items/:list_id failed', dbError);
      res.sendStatus(500);
    })
});

/**
 * POST a new list for user
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  console.log('req.body in POST of new item:', JSON.stringify(req.body));
  const newItem = req.body.newItem;
  // pre-process data to assign nulls if unassigned
  if (newItem.dueDate === '') {
    newItem.dueDate = null;
  }
  if (newItem.priority === 0) {
    newItem.priority = null;
  }
  if (newItem.preferredWeatherType === 0) {
    newItem.preferredWeatherType = null;
  }
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
                    WHERE list_id = $6), 0) + 1);
    `;
    pool.query(sqlText, [ newItem.description, 
                          newItem.priority,
                          newItem.preferredWeatherType,
                          newItem.dueDate,
                          newItem.yearToComplete,
                          newItem.listId ])
    .then(dbResponse => {
      console.log('POST route for /api/list_items sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('POST route for /api/list_items failed', dbError);
      res.sendStatus(500);
    })
});

module.exports = router;