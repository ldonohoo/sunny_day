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
 * POST a new list item for user
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
  if (newItem.weatherType === 0) {
    newItem.weatherType = null;
  }
  if (newItem.timeOfDay === 0) {
    newItem.timeOfDay = null;
  }
  const sqlText = `
  INSERT INTO list_item
  ( description,
    priority,
    preferred_weather_type,
    preferred_time_of_day,
    due_date,
    year_to_work_on,
    list_id,
    sort_order )  
    VALUES ($1, $2, $3, $4, $5, $6, $7,
          COALESCE((SELECT MAX(sort_order) 
                    FROM list_item
                    WHERE list_id = $7), 0) + 1);
    `;
    pool.query(sqlText, [ newItem.description, 
                          newItem.priority,
                          newItem.weatherType,
                          newItem.timeOfDay,
                          newItem.dueDate,
                          newItem.yearToComplete,
                          newItem.listId])
    .then(dbResponse => {
      console.log('POST route for /api/list_items sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('POST route for /api/list_items failed', dbError);
      res.sendStatus(500);
    })
});

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  const listItemId = req.params.id;
  console.log('indelete:',listItemId)
  sqlText = `
    DELETE FROM list_item
      WHERE id = $1
    `;
    pool.query(sqlText, [ listItemId ])
    .then(dbResponse => {
      console.log('DELETE of list in /api/list_itemss/:id successful:', dbResponse);
      res.sendStatus(200);
    })
    .catch(dbError => {
      console.log('DELETE of list in /api/list_items/:id failed:', dbError);
      res.sendStatus(500);
    })
});


router.put('/update_desc/:id', rejectUnauthenticated, (req, res) => {
  console.log('reqparams',req.params);
 const listId = Number(req.params.id);
 console.log('req.body', req.body);
 const newDescription = req.body.description;
 console.log(newDescription)
   sqlUpdateDescription = `
     UPDATE list_item
       SET description = $2
       WHERE id = $1;
     `;
   pool.query(sqlUpdateDescription, [listId, newDescription])
   .then(dbResponse => {
     console.log('PUT at /api/list_items/update_desc/:id successful updating description:', dbResponse);
     res.sendStatus(200);
   })
   .catch(dbError => {  
     console.log('Error in PUT at /api/list_items/update_desc/:id updating description', dbError);
     res.sendStatus(500);
   })
});


/**
 * Edit a list item
 */
router.put('/edit/:id', rejectUnauthenticated, (req, res) => {
  console.log('req.body in PUT for edit of list item:', JSON.stringify(req.body));
  const listItemId = req.params.id;
  const changeItem = req.body;
  // pre-process data to assign nulls if unassigned
  if (changeItem.dueDate === '') {
    changeItem.dueDate = null;
  }
  if (changeItem.priority === 0) {
    changeItem.priority = null;
  }
  if (changeItem.weatherType === 0) {
    changeItem.weatherType = null;
  }
  if (changeItem.timeOfDay === 0) {
    changeItem.timeOfDay = null;
  }
  // future add yeartocomp, month, day to update when sort works
  const sqlText = `
  UPDATE list_item
     SET priority = $1,
         preferred_weather_type = $2,
         preferred_time_of_day = $3,
         due_date = $4
    WHERE id = $5;
    `;
    pool.query(sqlText, [ changeItem.priority,
                          changeItem.weatherType,
                          changeItem.timeOfDay,
                          changeItem.dueDate,
                          listItemId ])
    .then(dbResponse => {
      console.log('POST route for /api/list_items sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('POST route for /api/list_items failed', dbError);
      res.sendStatus(500);
    })
});


/**
 * Toggle the completed status on a list item
 */
router.put('/toggle_complete/:id', rejectUnauthenticated, (req, res) => {
  const listItemId = req.params.id;
  console.log('input:',listItemId);
  sqlText = `
    UPDATE list_item
      SET completed_date = 
        CASE WHEN completed_date IS NOT NULL THEN NULL
             WHEN completed_date IS NULL THEN CURRENT_DATE
      END
    WHERE id = $1;
  `;
  pool.query(sqlText, [listItemId])
  .then(dbResponse => {
    console.log('PUT toggle of completed status a success in /api/list_items/:id', dbResponse);
    res.sendStatus(200);
  })
  .catch(dbError => {
    console.log('PUT toggle of completed status a success in /api/list_items/:id', dbError);
  })

})

router.put('/sort/:id', rejectUnauthenticated, (req, res) => {
  console.log('in list_items sort put');
  console.log('req.body, req.params', req.body, req.params);
  const listId = req.params.id;
  const indexToMove = req.body.indexToMove;
  const indexToReplace = req.body.indexToReplace;
  // First, get the sort_order values for indexToMove and indexToReplace
  const getSortOrdersQuery = `
    SELECT id, sort_order
    FROM list_item
    WHERE id IN ($1, $2) AND list_id = $3;
  `;
  pool.query(getSortOrdersQuery, [indexToMove, indexToReplace, listId])
    .then(result => {
      console.log('result.rows here:', result.rows);
      const rows = result.rows;
      // send error if this doesn't select both items
      if (rows.length !== 2) {
        throw new Error('Could not find both items in the list.');
      }
      // grab the the corresponding sort orders from indexToMove and 
      //    indexToReplace
      const itemToMove = rows.find(row => row.id == indexToMove);
      const itemToReplace = rows.find(row => row.id == indexToReplace);
      const sortOrderToMove = itemToMove.sort_order;
      const sortOrderToReplace = itemToReplace.sort_order;
      console.log('itemToMove', itemToMove);
      console.log('itemToReplace', itemToReplace);
      console.log('sortOrderToMove', sortOrderToMove);
      console.log('sortOrderToReplace', sortOrderToReplace);
      let updateSortOrderQuery = '';
      // For moving an item down on the list
      if (sortOrderToMove < sortOrderToReplace) {
        console.log('moving down');
        updateSortOrderQuery = `
          UPDATE list_item
          SET sort_order = CASE 
            WHEN id = $1 THEN $2
            WHEN sort_order BETWEEN $3 AND $4 THEN sort_order - 1
            ELSE sort_order
          END
          WHERE list_id = $5;
        `;
        pool.query(updateSortOrderQuery, [indexToMove, sortOrderToReplace, sortOrderToMove + 1, sortOrderToReplace, listId])
          .then((dbResponse) => {
            console.log('PUT of sort order (move down) data successful in /api/list_items/sort/:id', dbResponse);
            res.sendStatus(200);
          })
          .catch(dbError => {
            console.log('PUT of sort order data failed in /api/list_items/sort/:id', dbError);
            res.sendStatus(500);
          });
      // For moving an item up on the list 
      } else if (sortOrderToMove > sortOrderToReplace) {
        console.log('moving up');
        updateSortOrderQuery = `
          UPDATE list_item
          SET sort_order = CASE 
            WHEN id = $1 THEN $2
            WHEN sort_order BETWEEN $3 AND $4 THEN sort_order + 1
            ELSE sort_order
          END
          WHERE list_id = $5;
        `;
        pool.query(updateSortOrderQuery, [indexToMove, sortOrderToReplace, sortOrderToReplace, sortOrderToMove - 1, listId])
          .then((dbResponse) => {
            console.log('PUT of sort order (move up) data successful in /api/list_items/sort/:id', dbResponse);
            res.sendStatus(200);
          })
          .catch(dbError => {
            console.log('PUT of sort order data failed in /api/list_items/sort/:id', dbError);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(400); // This shouldn't happen as we check if active != over
      }
    })
    .catch(dbError => {
      console.log('Error retrieving sort order data in /api/list_items/sort/:id', dbError);
      res.sendStatus(500);
    });
});

module.exports = router;