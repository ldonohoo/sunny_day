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
  // i need to insert the max sort order ( or elese 0) +1 
  // i need to insert the default location if it exists for 
  // this user (else null)
  const sqlText = `
  INSERT INTO list
    (description,  user_id, location_id, sort_order)
    VALUES ($1, $2,
          CASE WHEN (SELECT is_master_default_location
                       FROM location
                       WHERE location.user_id = $2       
                        AND is_master_default_location = true)
               THEN (SELECT id 
                       FROM location
                       WHERE location.user_id = $2 
                        AND is_master_default_location = true)
               ELSE null
          END,
          COALESCE((SELECT MAX(sort_order) 
                    FROM list 
                    WHERE user_id = $2), 0) + 1);
    `;
//   const sqlText = `
//   WITH location_subquery AS (
//     SELECT id, is_master_default_location
//     FROM location
//     WHERE user_id = $3
//     LIMIT 1
//   ), sort_order_subquery AS (
//     SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
//     FROM list
//     WHERE user_id = $3
//   )
//   INSERT INTO list (description, user_id, location_id, sort_order)
//   VALUES (
//     $1, 
//     $2, 
//     (SELECT CASE 
//               WHEN is_master_default_location = true THEN id 
//               ELSE null 
//             END 
//      FROM location_subquery),
//     (SELECT next_sort_order FROM sort_order_subquery)
//   );
// `;
    pool.query(sqlText, [ item.description, 
                          user.id ])
    .then(dbResponse => {
      console.log('POST route for /api/lists sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('POST route for /api/lists failed', dbError);
      res.sendStatus(500);
    })
});

module.exports = router;
