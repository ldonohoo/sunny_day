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

router.put('/:id', rejectUnauthenticated, (req, res) => {
  const listId = Number(req.params.id);
  const newList = req.body;
  const user = req.user;
  console.log('bool or string?', newList.changeShowOnOpen)
  if (newList.changeShowOnOpen === "false") {
    // update the description only for edit and add mode 
    sqlUpdateDescription = `
      UPDATE list
        SET description = $3
        WHERE id = $1 AND
          user_id = $2;
      `;
    pool.query(sqlUpdateDescription, [listId, user.id])
    .then(dbResponse1 => {
      console.log('PUT at /api/lists/:id successful updating description:', dbResponse1);
      res.sendStatus(200);
    })
    .catch(dbError1 => {  
      console.log('Error in PUT at /api/lists/:id updating description', dbError1);
      res.sendStatus(500);
    })
  } else {
    // can only update show_at_open thru radio buttons:
    // if show_at_open is false for this list, toggle to true
    //    AND toggle all other show_at_open for user o false
    // if show_at_open is true for this list, toggle to false
    //    AND toggle all other show_at_open for user to false (optional)
    sqlUpdateShowOnOpen = `
      UPDATE list
        SET show_on_open = 
          CASE WHEN id = $1 THEN NOT(show_on_open)
               WHEN id != $1 THEN false 
          END
        WHERE user_id = $2;   
      `;
      pool.query(sqlUpdateShowOnOpen, [listId, user.id])
      .then(dbResponse2 => {
        console.log('PUT at /api/lists/:id successful updating show_on_open:', dbResponse2);
        res.sendStatus(200);
      })
      .catch(dbError2 => {  
        console.log('Error in PUT at /api/lists/:id updating show_on_open', dbError2);
        res.sendStatus(500);
      })
  }
})

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const listId = req.params.id;
  console.log('indelete:',listId,userId)
  sqlText = `
    DELETE FROM list
      WHERE user_id = $1 
        AND id = $2
    `;
    pool.query(sqlText, [userId, listId])
    .then(dbResponse => {
      console.log('DELETE of list in /api/lists/:id successful:', dbResponse);
      res.sendStatus(200);
    })
    .catch(dbError => {
      console.log('DELETE of list in /api/lists/:id failed:', dbError);
      res.sendStatus(500);
    })
})

// router.put('/sort', rejectUnauthenticated, (req, res) => {
//   console.log('in sort put');
//   const user = req.user;
//   const indexToMove = req.body.indexToMove;
//   const indexToReplace = req.body.indexToReplace;

//   // update list
//   //  reset the sort_order! 
//   //   sort the list by sort_order
//   //   only select the records from 
//   //          - indexToMove's sort_order THROUGH indexToReplace's sort_order

//   //   if MOVING DOWN: indexToMove's sort_order is > indexToReplace's sort_order
//   //          - if the list id = indexToMove,
//   //                 then change list id's sort_order to indexToReplace's sort_order
//   //          - if the list id != indexToMove, update the 
//   //   if MOVING UP: indexToMove's sort_order is < indexToReplace's sort_order
//   //            
//   sqlText = `
//     UPDATE list
//       SET sort_order = 
//         CASE ( WHEN list.id = $2 THEN ( SELECT sort_order
//                                                    FROM list 
//                                                    WHERE list.id = $3)
//                WHEN list.id != $2 
//                  AND list.sort_order < ( SELECT sort_order
//                                             FROM list
//                                             WHERE list.id = $3 )
//                  THEN sort_order - 1
//                 END )
//       WHERE user_id = $1;
//   `;
//   pool.query(sqlText, [ user.id, indexToMove, indexToReplace ])
//   .then(dbResponse => {
//     console.log('PUT of sort order data successful in /api/lists/sort');
//     res.sendStatus(200);
//   })
//   .catch(dbError => {
//     console.log('PUT of sort order data failed in /api/lists/sort');
//     res.sendStatus(500);
//   })
// })
router.put('/sort', rejectUnauthenticated, (req, res) => {
  console.log('in sort put');
  const user = req.user;
  const indexToMove = req.body.indexToMove;
  const indexToReplace = req.body.indexToReplace;
  
  // First, get the sort_order values for indexToMove and indexToReplace
  const getSortOrdersQuery = `
    SELECT id, sort_order
    FROM list
    WHERE id IN ($1, $2) AND user_id = $3;
  `;

  pool.query(getSortOrdersQuery, [indexToMove, indexToReplace, user.id])
    .then(result => {
      const rows = result.rows;
      if (rows.length !== 2) {
        throw new Error('Could not find both items in the list.');
      }

      const itemToMove = rows.find(row => row.id == indexToMove);
      const itemToReplace = rows.find(row => row.id == indexToReplace);

      const sortOrderToMove = itemToMove.sort_order;
      const sortOrderToReplace = itemToReplace.sort_order;

      let updateSortOrderQuery;

      if (sortOrderToMove < sortOrderToReplace) {
        // Moving down
        updateSortOrderQuery = `
          UPDATE list
          SET sort_order = CASE 
            WHEN id = $1 THEN $2
            ELSE sort_order - 1
          END
          WHERE user_id = $3 AND sort_order BETWEEN $4 AND $5;
        `;
        pool.query(updateSortOrderQuery, [indexToMove, sortOrderToReplace, user.id, sortOrderToMove + 1, sortOrderToReplace])
          .then(() => {
            res.sendStatus(200);
          })
          .catch(dbError => {
            console.log('PUT of sort order data failed in /api/lists/sort', dbError);
            res.sendStatus(500);
          });
      } else if (sortOrderToMove > sortOrderToReplace) {
        // Moving up
        updateSortOrderQuery = `
          UPDATE list
          SET sort_order = CASE 
            WHEN id = $1 THEN $2
            ELSE sort_order + 1
          END
          WHERE user_id = $3 AND sort_order BETWEEN $4 AND $5;
        `;
        pool.query(updateSortOrderQuery, [indexToMove, sortOrderToReplace, user.id, sortOrderToReplace, sortOrderToMove - 1])
          .then(() => {
            res.sendStatus(200);
          })
          .catch(dbError => {
            console.log('PUT of sort order data failed in /api/lists/sort', dbError);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(400); // Bad request if sort orders are equal
      }
    })
    .catch(dbError => {
      console.log('Error retrieving sort order data in /api/lists/sort', dbError);
      res.sendStatus(500);
    });
});

module.exports = router;


module.exports = router;
