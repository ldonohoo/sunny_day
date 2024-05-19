const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all lists for user
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  const user = req.user;
  const sqlText = `
    SELECT * FROM location
      WHERE user_id = $1;
    `;
    pool.query*(sqlText, [user.id])
    .then(dbResponse => {
      console.log('GET route for /api/location sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/location failed', dbError);
      res.sendStatus(500);
    })
});

router.get('/master', rejectUnauthenticated, (req, res) => {
    const user = req.user;
    const sqlText = `
      SELECT id, name FROM location
        WHERE user_id = $1 
            AND is_master_default_location = TRUE;
      `;
      pool.query*(sqlText, [user.id])
      .then(dbResponse => {
        console.log('GET route for /api/location/master sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/master failed', dbError);
        res.sendStatus(500);
      })
  });

  router.get('/current_list/:list_id', rejectUnauthenticated, (req, res) => {
    const user = req.user;
    const listId = req.params.list_id;
    const sqlText = `
      SELECT location.id, location.name 
        FROM location
        INNER JOIN list
            ON list.location = location.id
        WHERE user_id = $1
            AND list_id = $2;
      `;
      pool.query*(sqlText, [user.id, listId])
      .then(dbResponse => {
        console.log('GET route for /api/location/current_list sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/current_list failed', dbError);
        res.sendStatus(500);
      })
  });

/**
 * POST route template
 */
router.post('/', (req, res) => {
  
});

router.put('/master', rejectUnauthenticated, (req, res) => {
    const user = req.user;
    const changeLocation = req.body.location;    
    const sqlText = `
      UPDATE location
        //use a WHEN IN HERE!!!
        WHERE user_id = $1 
            AND is_master_default_location = TRUE;
      `;
      pool.query*(sqlText, [user.id])
      .then(dbResponse => {
        console.log('GET route for /api/location/master sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/master failed', dbError);
        res.sendStatus(500);
      })
  });



module.exports = router;