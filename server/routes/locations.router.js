const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');


/**
 * GET all locations for user
 */
router.get('/',rejectUnauthenticated, (req, res) => {
  const user = req.user;
  console.log('user:', JSON.stringify(user));
  const sqlText = `
    SELECT * FROM location
      WHERE user_id = $1
      ORDER BY CASE 
                WHEN is_master_default_location = true THEN 1
                ELSE id
               END ASC;
    `;
    pool.query(sqlText, [user.id])
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
    console.log('getting master loc! req.body', JSON.stringify(req.body))
    const sqlText = `
      SELECT * FROM location
        WHERE user_id = $1 
            AND is_master_default_location = TRUE;
      `;
      pool.query(sqlText, [user.id])
      .then(dbResponse => {
        console.log('GET route for /api/location/master sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/master failed', dbError);
        res.sendStatus(500);
      })
  });

  /**
   * Get current location data for a list number
   */
  router.get('/current_list', rejectUnauthenticated, (req, res) => {
    console.log('in get of current location! ')
    console.log('req.user', req.user);
    console.log('req.query', req.query);
    const user = req.user;
    const listId = req.query.list_id;
    const sqlText = `
      SELECT *
        FROM location
        INNER JOIN list
            ON list.location_id = location.id
        WHERE location.user_id = $1
            AND list.id = $2;
      `;
      pool.query(sqlText, [user.id, listId])
      .then(dbResponse => {
        console.log('GET route for /api/location/current_list sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/current_list failed', dbError);
        res.sendStatus(500);
      })
  });

router.put('/current_list/:list_id', rejectUnauthenticated, (req, res) => {
  console.log('in current list put, req.body, req.params', req.body, req.params);
  const user = req.user;
  let locationId = req.body.locationId;
  const listId = req.params.list_id;
  // preprocessing for no location selected
  if (locationId === "0") {
    locationId = null;
  }
  const sqlText = `
    UPDATE list
      SET location_id = $1
      WHERE id = $2 
        AND user_id = $3;
    `;
    pool.query(sqlText, [locationId, listId, user.id])
    .then(dbResponse => {
      console.log('PUT route for /api/locations/current_list sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('PUT route for /api/locations/current_list failed', dbError);
      res.sendStatus(500);
    })
});

router.put('/master', rejectUnauthenticated, (req, res) => {
  const user = req.user;
  let locationId = req.body.locationId;
  console.log('locationid',locationId)
  console.log(JSON.stringify(req.user))
  let sqlText;
  console.log('In put of master loc req.body', JSON.stringify(req.body));
  // preprocessing for no location selected
  // If no location / blanked out location:
  //    - remove all default locations for that user from location table
  if (locationId === '0') {
    locationId = false;
    sqlText = `
      UPDATE location
        SET is_master_default_location = false
        WHERE user_id = $1;
      `;
    pool.query(sqlText, [user.id])
    .then(dbResponse => {
      console.log('GET route for /api/location/master sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/location/master failed', dbError);
      res.sendStatus(500);
    })
  // Else if an actual location is sent up:
  //    1. set the selected location as the default (is_master_def = true) 
  //    2. set all other locations to NOT the default (is_master_def = false)
  } else {
  //need to remove old default location and add new default location
    console.log('over here, location is not zero!!!')
    console.log('user,loc', user.id, locationId)
    sqlText = `
      UPDATE location 
        SET is_master_default_location = 
          CASE
            WHEN id = $2 THEN true
            WHEN is_master_default_location = true THEN false
            WHEN is_master_default_location = false THEN false
          END
        WHERE user_id = $1;
      `;
      pool.query(sqlText, [user.id, locationId])
      .then(dbResponse => {
        console.log('GET route for /api/location/master sucessful!', dbResponse.rows);
        res.send(dbResponse.rows);
      })
      .catch(dbError => {
        console.log('GET route for /api/location/master failed', dbError);
        res.sendStatus(500);
      })
    } 
});

module.exports = router;