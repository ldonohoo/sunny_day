const express = require('express');
const pool = require('../modules/pool');
const axios = require('axios');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const uuid = require('uuid');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const googleMapsAPIurl = `https://maps.googleapis.com/maps/api/geocode/json`;
const googlePlaceAutoCompleteAPIurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
const googlePlaceDetailsAPIurl =  `https://maps.googleapis.com/maps/api/place/details/json`;

// Set initial uuid for use for google place sessions, a unique uuid is 
//    used for each google session for billing (token) purposes
//        A complete session consists of:
//          - multiple calls (at least one up to n requests) to the google
//            place autocomplete endpoint to pull location/place possibilities
//          - a single call once the user has clicked on a place to the
//            google place details enpoint to send up the selected google 
//            place id and return the location's details
//    (See below /auto_complete/ routes for details)
let sessionToken = null;




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

/**
 * DELETE a single location for a user
 */
router.delete('/:id',rejectUnauthenticated, async (req, res) => {
  try {
    console.log('in delete!!!!!!!!!!!!!!!!!!!!')
    const userId = req.user.id;
    const locationId = req.params.id;
    console.log('locationId', locationId);
    let connection;

    connection = await pool.connect();
    // Start SQL transaction/committment control
    connection.query('BEGIN;')
    // First remove any dependant locations on current lists
    const sqlTextRemoveLocationItems = `
      UPDATE list
        SET location_id = NULL
        WHERE user_id = $1
          AND location_id = $2;
      `;
    let dbResponseUpdate = await connection.query(sqlTextRemoveLocationItems,[ userId, locationId ]);
    console.log(dbResponseUpdate);
    const sqlTextDeleteLocation = `
      DELETE FROM location
        WHERE user_id = $1
          AND id = $2;
      `;
    let dbResponseDelete = await connection.query(sqlTextDeleteLocation,[ userId, locationId ]);
    console.log('GET route for /api/location/delete/:id sucessful!', dbResponseDelete);
    connection.query('COMMIT;')
    res.sendStatus(200);
  } catch(dbError) {
    console.log('GET route for /api/location/delete/:id failed', dbError);
    connection.query('ROLLBACK;')
    res.sendStatus(500);
  }
});

router.get('/master/', rejectUnauthenticated, (req, res) => {
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
  router.get('/current_list/:id', rejectUnauthenticated, (req, res) => {
    console.log('In get of current location! ')
    console.log('req.user', req.user);
    console.log('req.params', req.params);
    const user = req.user;
    const listId = req.params.id;
    const sqlText = `
      SELECT location.*
        FROM list
        INNER JOIN location
          ON list.location_id = location.id
        WHERE list.id = $1;
      `;
      pool.query(sqlText, [listId])
      .then(dbResponse => {
        console.log('GET route for /api/location/current_list sucessful!', dbResponse);
        if (dbResponse.rows.length === 1) {
          res.send(dbResponse.rows[0]);
        } else {
          res.send({id: 0});
        }
      })
      .catch(dbError => {
        console.log('GET route for /api/location/current_list failed', dbError);
        res.sendStatus(500);
      })
  });

/**
 * Update location on the current list (user has selected a new location in
 *    the dropdown on the locationSelect component from the listItem component)
 */
router.put('/current_list/:list_id', rejectUnauthenticated, (req, res) => {
  console.log('in current list put, req.body, req.params', req.body, req.params);
  const user = req.user;
  let locationId = req.body.locationId;
  const listId = req.params.list_id;
  // preprocessing for no location selected
  if (locationId === "0") {
    locationId = null;
  }
  console.log('loc, list, userid', locationId, listId, user.id, 'ok');
  const sqlText = `
    UPDATE list
      SET location_id = $1
      WHERE id = $2 
        AND user_id = $3;
    `;
    pool.query(sqlText, [locationId, listId, user.id])
    .then(dbResponse => {
      console.log('PUT route for /api/locations/current_list sucessful!', dbResponse.rows);
      res.sendStatus(200);
    })
    .catch(dbError => {
      console.log('PUT route for /api/locations/current_list failed', dbError);
      res.sendStatus(500);
    })
});

router.put('/master/', rejectUnauthenticated, (req, res) => {
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

router.get('/map/', rejectUnauthenticated, async (req, res) => {
  try {
    const { lat, long } = req.query;
    apiParams = {
      latLong: `${lat},${long}`,
      key: GOOGLE_MAPS_API_KEY
    };

    const response = await axios({
      method: 'GET',
      url: googleMapsAPIurl,
      params: apiParams
    });
    console.log(response.data);
    res.json(response.data)
  } catch(apiError) {
    console.log('Error in /api/locations/map/', apiError);
    res.sendStatus(500);
  }
})

router.get('/auto_complete/', rejectUnauthenticated, async (req, res) => {
  try {
    const locString = req.query.q;
    if (!sessionToken) {
      // Generate a UUID
      sessionToken = uuid.v4();
    }
    console.log('locString:', locString);
    console.log('apikey', GOOGLE_MAPS_API_KEY)
    console.log('sessiontoken:', sessionToken);
    const autoCompleteResults = await axios ({
      method: 'GET',
      url: googlePlaceAutoCompleteAPIurl,
      params: { input: locString,
                key: GOOGLE_MAPS_API_KEY,
                sessiontoken: sessionToken }
    })
    console.log(autoCompleteResults.data);
    res.send(autoCompleteResults.data);
  }
  catch(error) {
    console.log('Error in GET of autocomplete place/location data in /api/locations/auto_complete', error);
    res.sendStatus(500);
  }
})

/**
 * GET the location details from the PlaceDetails API, then add the new location
 *  to the location table, return the updated locations table
 */
router.get('/auto_complete/details/', rejectUnauthenticated, async (req, res) => {
  try {
    userId = req.user.id;
    if (!sessionToken) {
      sessionToken = uuid.v4();;
    }
    console.log('sessiontoken:', sessionToken);
    const googlePlaceId = req.query.q;
    console.log('googlePlaceId: ', googlePlaceId);
    console.log('apikey', GOOGLE_MAPS_API_KEY)
    const placeDetailsResults = await axios ({
      method: 'GET',
      url: googlePlaceDetailsAPIurl,
      params: {
        place_id: googlePlaceId,
        key: GOOGLE_MAPS_API_KEY,
        sessiontoken: sessionToken
      }
    })
    console.log(placeDetailsResults.data);
    // extract relevant location information
    let zip = 0, country = '', region = '';
    const locData = placeDetailsResults.data.result;
    const addressData = placeDetailsResults.data.result.address_components;
    console.log('addressarray:', addressData);
    const name = locData.formatted_address;
    const latitude = locData.geometry.location.lat;
    const longitude = locData.geometry.location.lng;
    const utc_offset = locData.utc_offset;
    addressData.forEach(comp => {
      console.log('addresscomp:',comp)
      console.log('...', comp.types);
      if (comp.types.includes("postal_code")) {
        zip = comp.short_name;
      } else if (comp.types.includes("country")) {
        country = comp.long_name;
      } else if (comp.types.includes("administrative_area_level_2")) {
        region = comp.long_name;
      }
      console.log('name thru region:', name, latitude, longitude, utc_offset, zip, country, region, '::end');
    })
    // insert location into database  
    let connection;
    connection = await pool.connect();    
    sqlStringInsert = `
      INSERT INTO location
        (user_id, name, country, zip, region, latitude, longitude, utc_offset)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `
    let dbInsertResponse = await connection.query(sqlStringInsert, [userId,
                                                  name,
                                                  country,
                                                  zip,
                                                  region,
                                                  latitude,
                                                  longitude,
                                                  utc_offset]);                                       
    console.log('Insert into location table of new location successful in /api/locations/auto_complete_details', dbInsertResponse);
    sqlStringSelect = `
      SELECT * FROM location
        WHERE user_id = $1
        ORDER BY id DESC;
      `;
      const dbSelectResponse = await connection.query(sqlStringSelect, [userId])
    console.log('New locations:', dbSelectResponse.rows); 
    // on sucessful place details request, force new session token by setting
    //    to null so it is regenerated
    sessionToken = null;
    connection.release();
    res.send(dbSelectResponse.rows);
  }
  catch(error) {
    console.log('Error in GET of autocomplete place/location data in /api/locations/auto_complete', error);
    connection.release();
    res.sendStatus(500);
    // if there's an error in this route reset session token also
    sessionToken = null;
  }
})

module.exports = router;