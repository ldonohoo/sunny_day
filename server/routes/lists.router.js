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

router.put('/sort', rejectUnauthenticated, (req, res) => {
  console.log('in sort put');
  const user = req.user;
  const sortChange = req.body;

  // update list
  //  reset the sort_order! 
  //   sort the list by sort_order
  //   only select the records from 
  //          - indexToMove's sort_order THROUGH indexToReplace's sort_order

  //   if MOVING DOWN: indexToMove's sort_order is > indexToReplace's sort_order
  //          - if the list id = indexToMove,
  //                 then change list id's sort_order to indexToReplace's sort_order
  //          - if the list id != indexToMove, update the 
  //   if MOVING UP: indexToMove's sort_order is < indexToReplace's sort_order
  //            

  //      when the list id is equal to the index of the item to replace
  //          replace, replace the sort order of the list id with the sort order on 
  //          the replace list id
  //      when the list id is not equal to the index of the item to replace
  //          if the index  
  sqlText = `
    UPDATE list
      SET sort_order = 
        CASE ( WHEN id = $3 THEN $2's sort order  
               WHEN id != $3 AND id >= $2
      WHERE user_id = $1;
  `;
  pool.query(sqlText, [ user.id, Number(indexToMove), Number(indexToReplace) ])
  .then(dbResponse => {
    console.log('PUT of sort order data successful in /api/lists/sort');
    res.sendStatus(200);
  })
  .catch(dbError => {
    console.log('PUT of sort order data failed in /api/lists/sort');
    res.sendStatus(500);
  })
})


module.exports = router;
