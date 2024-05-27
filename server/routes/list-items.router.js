const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');




function getWeekNumber(date) {
  // Copy date so don't modify original
  date = new Date(date);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNumber = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
  // Return week number
  return weekNumber;
}



/**
 * GET all list items for list
 */
router.get('/:list_id',rejectUnauthenticated, (req, res) => {
  console.log('Listid in GET route:')
  console.log('query params', req.query)
  const listId = Number(req.params.list_id);
  let groupByHeading = 'week';
  if (req.query.group) {
    groupByHeading = req.query.group;
  }
  console.log('listId', listId);
  let groupByFieldName = groupByHeading + '_to_work_on';
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth();
  const currentWeek = getWeekNumber(d);
  if (groupByHeading === 'week') {
    console.log('gropubyHeading', groupByHeading)
    itemToCompare = 'week_to_work_on';
    currentNumber = currentWeek;
    weekCompareString = '';
    monthCompareString = 'NULL::int AS ';
    yearCompareString = 'NULL::int AS ';
  } else if (groupByHeading === 'month') {
    itemToCompare = 'month_to_work_on';
    currentNumber = currentMonth;
  } else {
    itemToCompare = 'year_to_work_on';
    currentNumber = currentYear;
  }
    console.log('currentNumber:', currentNumber);
    console.log('itemtocompare', itemToCompare)
    const sqlText = `
    SELECT * FROM (
      WITH group_headers AS (
        SELECT 
          NULL::int AS id,
          NULL::text AS description,
          NULL::date AS completed_date,
          NULL::int AS priority,
          NULL::int AS preferred_weather_type,
          NULL::date AS due_date,
          ${yearCompareString} year_to_work_on,
          ${monthCompareString} month_to_work_on,
          ${weekCompareString} week_to_work_on,
          NULL::text AS preferred_time_of_day,
          MIN(list_id) AS list_id, 
          MIN(sort_order) AS sort_order,
          (${itemToCompare} - $2) AS group_header, 
          MIN(ctid) AS ctid
        FROM list_item
        WHERE list_id = $1
        GROUP BY ${itemToCompare}
    ),
    original_rows AS (
        SELECT 
          id,
          description,
          completed_date,
          priority,
          preferred_weather_type,
          due_date,
          year_to_work_on,
          month_to_work_on,
          week_to_work_on,
          preferred_time_of_day,
          sort_order,
          list_id,
          NULL::int AS group_header,
          ctid
        FROM 
            list_item
        WHERE list_id = $1
    )
    SELECT 
      id,
      description,
      completed_date,
      priority,
      preferred_weather_type,
      due_date,
      year_to_work_on,
      month_to_work_on,
      week_to_work_on,
      preferred_time_of_day,
      sort_order,
      list_id,
      group_header
    FROM ( SELECT   
            id,
            description,
            completed_date,
            priority,
            preferred_weather_type,
            due_date,
            year_to_work_on,
            month_to_work_on,
            week_to_work_on,
            preferred_time_of_day,
            sort_order,
            list_id,
            group_header,
            ctid
          FROM group_headers
            UNION ALL
          SELECT 
            id,
            description,
            completed_date,
            priority,
            preferred_weather_type,
            due_date,
            year_to_work_on,
            month_to_work_on,
            week_to_work_on,
            preferred_time_of_day,
            sort_order,
            list_id,
            group_header,
            ctid
          FROM original_rows ) AS combined
    ORDER BY 
      sort_order,
      ${itemToCompare}, 
      ctid   
        )
        ORDER BY sort_order,
             group_header;
    `;
    console.log(sqlText)
    pool.query(sqlText, [ listId, currentNumber])
    .then(dbResponse => {
      console.log('GET route for /api/list_items/:list_id without completed items sucessful!', dbResponse.rows);
      const listItemsWithGroupBy = dbResponse.rows;
      console.log('itemtocompare', itemToCompare);
      console.log('ALLROWS:::::::::::::::', dbResponse.rows);
      console.log('ONE ROW:::::::::::::::', listItemsWithGroupBy[0]);
      console.log('listid:', listId);
      console.log('currentNumber', currentNumber)
      const sqlTextGetInfo = `
        SELECT MAX(id) AS max_id, 
               MAX(sort_order) AS max_sort_order,
               (${itemToCompare} - ${currentNumber} ) AS group_header_no
        FROM list_item
        WHERE list_id = $1
        GROUP BY ${itemToCompare}
        ORDER BY max_id DESC;
        `;
        // SELECT MAX(id) AS max_id,
        //        MAX(SELECT sort_order
        //             FROM list_item
        //             WHERE ${itemToCompare} 
        //        ) FROM list_item
      pool.query(sqlTextGetInfo, [listId])
      .then(dbResponse2 => {
        // modify header rows:
        //    make sure there is a 0, 1, 2, 3 but no 4
        //      (any numbers after 4, change first to 4 if no 4, 
        //        delete rest of number records)
        const maxNumbers = dbResponse.rows;
        console.log('results of getinfoquery',maxNumbers);
        let nextId = maxNumbers[0].max_id;

        if (maxNumbers.at(-1).group_header === 0) {
          currentMax0 = maxNumbers.at(-1).max_sort_order;
        } else {
          currentMax0 = 1;
        }
        for (i  = maxNumbers.length-1; i>=0; i--) {
          if (maxNumbers[i].group_header === 0) {
            currentMax0 = maxNumbers[i].max_sort_order;
          } 
          if (maxNumbers[i].group_header === 1) {
            currentMax1 = maxNumbers[i].max_sort_order;
          }
          if (maxNumbers[i].group_header === 2) {
            currentMax2 = maxNumbers[i].max_sort_order;
          }
        }
        
     
        let currentMax0 = 0;
        let currentMax1 = 0;
        let currentMax2 = 0;
        let headerNotFound0 = true;
        let headerNotFound1 = true;
        let headerNotFound2 = true;
        let headerNotFound3 = true;
        for (const row of listItemsWithGroupBy) {
          // set item to compare and current number 
          //    (fields used to find the max sort order by heading below)
          if (groupByHeading === 'week') {
            itemToCompare = row.week_to_do;
            currentNumber = currentWeek;
          } else if (groupByHeading === 'month') {
            itemToCompare = row.month_to_do;
            currentNumber = currentMonth;
          } else {
            itemToCompare = row.year_to_do;
            currentNumber = currentYear;
          }
          // if null rows, they are header rows, check if all headers exist
          if (row.id === null) {
            switch (row.group_header) {
              case 0:
                headerNotFound0 = false;
                break;
              case 1:
                headerNotFound1 = false;
                break;
              case 2:
                headerNotFound2 = false;
                break;
              case 3:
                headerNotFound3 = false;
                break;
            }  
          // else if not null rows, they are item rows
          //    - find the max sort order for each header category
          } else {
            console.log(`comparing ${row[itemToCompare]} = ${currentNumber}`);
            console.log(`then checking if ${currentMax0} < ${row.sort_order}`);
            if (row[itemToCompare] === currentNumber) {
              if (currentMax0 < row.sort_order) {
                currentMax0 = row.sort_order;
                console.log('currentmax0', currentMax0)
              }
            } else if (row[itemToCompare] === currentNumber + 1) {
              if (currentMax1 < row.sort_order) {
                currentMax1 = row.sort_order;
              }
            } else if (row[itemToCompare] === currentNumber + 2) {
              if (currentMax2 < row.sort_order) {
                currentMax2 = row.sort_order;
              }
            } 
          }   //end not null rows
        }   // end for loop
        console.log('max results 0 1 2 : ', currentMax0, 'dd', currentMax1, 'dd', currentMax2);
        if (headerNotFound0) {
          //create 0 header row
          //    group_header is 0
          //    list_id populate from any list_id
          //    sort order set to 1
          //    id leave null, will populate next step
          listItemsWithGroupBy.push({
            id : null,
            description : null,
            completed_date : null,
            priority : null,
            preferred_weather_type : null,
            due_date : null,
            year_to_work_on : null,
            month_to_work_on : null,
            week_to_work_on : null,
            preferred_time_of_day : null,
            sort_order : listItemsWithGroupBy[0].sort_order,
            list_id : listItemsWithGroupBy[0].list_id,
            group_header : 0
          });
        }
        if (headerNotFound1) {
          //create 1 header row
          //    group_header is 1
          //    list_id populate from any list_id
          //    sort order set to max sort order of 0 +1
          //    id leave null, will populate next step
          listItemsWithGroupBy.push({
            id : null,
            description : null,
            completed_date : null,
            priority : null,
            preferred_weather_type : null,
            due_date : null,
            year_to_work_on : null,
            month_to_work_on : null,
            week_to_work_on : null,
            preferred_time_of_day : null,
            sort_order : currentMax0 + 1,
            list_id : listItemsWithGroupBy[0].list_id,
            group_header : 1
          });
        }
        if (headerNotFound2) {
          //create 2 header row
          //    group_header is 0
          //    list_id populate from any list_id
          //    sort order set to max sort order of 1 +1
          //    id leave null, will populate next step
          listItemsWithGroupBy.push({
            id : null,
            description : null,
            completed_date : null,
            priority : null,
            preferred_weather_type : null,
            due_date : null,
            year_to_work_on : null,
            month_to_work_on : null,
            week_to_work_on : null,
            preferred_time_of_day : null,
            sort_order : currentMax1 + 1,
            list_id : listItemsWithGroupBy[0].list_id,
            group_header : 2
          });
        }
        if (headerNotFound3) {
          //create 3 header row
          //    group_header is 0
          //    list_id populate from any list_id
          //    sort order set to max sort order of 2 +1
          //    id leave null, will populate next step
          listItemsWithGroupBy.push({
            id : null,
            description : null,
            completed_date : null,
            priority : null,
            preferred_weather_type : null,
            due_date : null,
            year_to_work_on : null,
            month_to_work_on : null,
            week_to_work_on : null,
            preferred_time_of_day : null,
            sort_order : currentMax2 + 1,
            list_id : listItemsWithGroupBy[0].list_id,
            group_header : 3
          }); 
        }
      //   })
      // })
        // add ids to new header rows
        console.log('ROWSSS RETURNED::::::::', dbResponse2.rows)
        console.log('NEXT ID:::::::::', nextId);
        for (const row of listItemsWithGroupBy) {
          if (row.id === null) {
            row.id = nextId;
            nextId++;
          }
        }
        listItemsWithGroupBy.sort((a, b) => {
          // Compare primary properties
          if (a.sort_order < b.sort_order) return -1;
          if (a.sort_order > b.sort_order) return +1;         
          // If primary properties are equal, compare secondary properties
          if (a.group_header < b.group_header) return -1;
          if (a.group_header > b.group_header) return 1;
          // If both primary and secondary properties are equal
          return 0;
      });
        // re-sort array based on sort_order, 
        console.log('FINAL BEFORE SEND:::::::::::::', listItemsWithGroupBy);
        res.send(listItemsWithGroupBy);
      })
      .catch(dbError2 => {
        console.log('Error in GET of list_items in next ID select query', dbError2);
        res.send(500);
      })
    })
    .catch(dbError1 => {
      console.log('GET route for /api/list_items/:list_id without completed itemsfailed', dbError1);
      res.sendStatus(500);
    })
});

// old query:
// router.get('/:list_id',rejectUnauthenticated, (req, res) => {
//   console.log('Listid in GET route:')
//   console.log('query params', req.query)
//   const listId = Number(req.params.list_id);
//   console.log('listId', listId);
//   let groupByHeading = 'year';
//   if (req.query.group) {
//     groupByHeading = req.query.group;
//   }
//   let groupByFieldName = groupByHeading + '_to_work_on';
//     const sqlText = `
//     SELECT filtered_list_item.*,
//       CASE
//         WHEN ROW_NUMBER() OVER (ORDER BY ${groupByFieldName}) = 1
//             THEN $2
//         WHEN ${groupByFieldName} <> LAG(${groupByFieldName}, 1) OVER (ORDER BY ${groupByFieldName})
//             THEN $2
//         ELSE ''
//       END AS group_header
//     FROM
//     ( SELECT list_item.*, list.description AS list_description
//         FROM list_item
//         INNER JOIN list
//           ON list.id = list_item.list_id
//         WHERE list.id = $1 ) AS filtered_list_item
//     ORDER BY
//       sort_order;
//     `;
//     pool.query(sqlText, [ listId,
//                                          groupByHeading])
//     .then(dbResponse => {
//       console.log('GET route for /api/list_items/:list_id without completed items sucessful!', dbResponse.rows);
//       res.send(dbResponse.rows);
//     })
//     .catch(dbError => {
//       console.log('GET route for /api/list_items/:list_id without completed itemsfailed', dbError);
//       res.sendStatus(500);
//     })
// });


//suggestion:
// WITH filtered_list_item AS (
//   SELECT 
//       list_item.*, 
//       list.description AS list_description
//   FROM 
//       list_item
//   INNER JOIN 
//       list ON list.id = list_item.list_id
//   WHERE 
//       list.id = $1
// ),
// group_headers AS (
//   SELECT 
//       DISTINCT ON (${groupByFieldName})
//       ${groupByFieldName}, 
//       NULL AS sort_order, 
//       list_description, 
//       NULL::text AS other_column1, 
//       NULL::text AS other_column2, -- Replace these with actual column names from list_item
//       $2 AS group_header
//   FROM 
//       filtered_list_item
// ),
// original_rows AS (
//   SELECT 
//       *,
//       '' AS group_header
//   FROM 
//       filtered_list_item
// )
// SELECT 
//   ${groupByFieldName}, 
//   sort_order, 
//   list_description, 
//   other_column1, 
//   other_column2, 
//   group_header
// FROM (
//   SELECT * FROM group_headers
//   UNION ALL
//   SELECT * FROM original_rows
// ) AS combined
// ORDER BY 
//   ${groupByFieldName}, 
//   sort_order, 
//   ctid;






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
    (description, 
     priority,
     preferred_weather_type,
     preferred_time_of_day,
     due_date,
     list_id,
     year_to_work_on,
     month_to_work_on,
     week_to_work_on,
     sort_order)
    VALUES ($1, $2, $3, $4, $5, $6,
            COALESCE((SELECT MAX(year_to_work_on)
              FROM list_item
              WHERE list_id = $6), $7),
            COALESCE((SELECT MAX(month_to_work_on)
              FROM list_item
              WHERE list_id = $6), $8),
            COALESCE((SELECT MAX(week_to_work_on)
              FROM list_item
              WHERE list_id = $6), $9),
            COALESCE((SELECT MAX(sort_order) 
                    FROM list_item
                    WHERE list_id = $6), 0) + 1);
    `;
    pool.query(sqlText, [ newItem.description, 
                          newItem.priority,
                          newItem.weatherType,
                          newItem.timeOfDay,
                          newItem.dueDate,
                          newItem.listId,
                          newItem.currentYear,
                          newItem.currentMonth,
                          newItem.currentWeek ])
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


  // if show completed is off, add where clause to only select non-complete items
  // const sqlText = `
  //   SELECT
  //       CASE ( WHEN ROW_NUMBER() OVER (PARTITION BY sort_column ORDER BY sort_column ) = 1 )
  //            THEN 'Heading Value'
  //            ELSE ''
  //       END  AS group_header,
  //       other columns....
  //   FROM
  //       list_items
  //   ORDER BY
  //       sort_order
  //   $whereclause;
  //   `;

  // If there is a group by heading request, set up query to get header data
  //    added to the result table at the first line of each group type
  //      Example:  groupByHeading = 'month'
  //                    -ADDS heading label to the first record every time
  //                        a month changes
  //                groupByHeading = 'year'
  //                    -ADDs a heading label to the first record every time    
  //                  a year changes

  // 

    // old text:
    // const sqlText = `
    // SELECT list_item.*, list.description AS list_description
    //   FROM list_item
    //   INNER JOIN list
    //     ON list.id = list_item.list_id
    //   WHERE list_id = $1
    //   ORDER BY sort_order;
    // `;

