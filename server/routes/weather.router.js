const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
require('dotenv').config()

const TESTING = false; //bypass weather API call if test mode
const OPENAI_API_KEY= process.env.OPENAI_API_KEY;
const openAIurl = 'https://api.openai.com/v1/chat/completions';
const openAIheaders = { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}` };
const VISUAL_CROSSING_API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const visualCrossUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const visualCrossIconSet = 'icons2';
const testData = {
  queryCost: 1,
  latitude: 44.9778,
  longitude: 93.265,
  resolvedAddress: '44.9778,93.265',
  address: '44.9778,93.265',
  timezone: '-05:00',
  tzoffset: -5,
  description: 'Similar temperatures continuing with no rain expected.',
  days: [
    {
      datetime: '2024-05-24',
      datetimeEpoch: 1716526800,
      tempmax: 68.3,
      tempmin: 52.2,
      temp: 60.7,
      feelslikemax: 68.3,
      feelslikemin: 52.2,
      feelslike: 60.7,
      dew: 25.6,
      humidity: 26.8,
      precip: 0,
      precipprob: 0,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 23.7,
      windspeed: 21.3,
      winddir: 322.5,
      pressure: 1011.6,
      cloudcover: 10,
      visibility: 15,
      solarradiation: 337.3,
      solarenergy: 29.2,
      uvindex: 9,
      severerisk: 10,
      sunrise: '17:09:08',
      sunriseEpoch: 1716502148,
      sunset: '08:19:11',
      sunsetEpoch: 1716556751,
      moonphase: 0.54,
      conditions: 'Clear',
      description: 'Clear conditions throughout the day.',
      icon: 'clear-day',
      stations: [Array],
      source: 'comb',
      hours: [Array]
    },
    {
      datetime: '2024-05-25',
      datetimeEpoch: 1716613200,
      tempmax: 74.6,
      tempmin: 58.2,
      temp: 66.3,
      feelslikemax: 74.6,
      feelslikemin: 58.2,
      feelslike: 66.3,
      dew: 23.8,
      humidity: 21.9,
      precip: 0,
      precipprob: 0,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 20.1,
      windspeed: 16.3,
      winddir: 311.7,
      pressure: 1010.3,
      cloudcover: 86.4,
      visibility: 15,
      solarradiation: 309.2,
      solarenergy: 27,
      uvindex: 10,
      severerisk: 10,
      sunrise: '17:08:19',
      sunriseEpoch: 1716588499,
      sunset: '08:20:11',
      sunsetEpoch: 1716643211,
      moonphase: 0.58,
      conditions: 'Partially cloudy',
      description: 'Partly cloudy throughout the day.',
      icon: 'partly-cloudy-day',
      stations: null,
      source: 'fcst',
      hours: [Array]
    },
    {
      datetime: '2024-05-26',
      datetimeEpoch: 1716699600,
      tempmax: 75.8,
      tempmin: 44,
      temp: 62.1,
      feelslikemax: 75.8,
      feelslikemin: 34.1,
      feelslike: 59.5,
      dew: 32.4,
      humidity: 40,
      precip: 0.067,
      precipprob: 19.4,
      precipcover: 16.67,
      preciptype: [Array],
      snow: 0,
      snowdepth: 0,
      windgust: 42.9,
      windspeed: 34.9,
      winddir: 286.7,
      pressure: 1010.2,
      cloudcover: 97.2,
      visibility: 14.3,
      solarradiation: 261.5,
      solarenergy: 22.4,
      uvindex: 9,
      severerisk: 10,
      sunrise: '17:07:33',
      sunriseEpoch: 1716674853,
      sunset: '08:21:10',
      sunsetEpoch: 1716729670,
      moonphase: 0.61,
      conditions: 'Overcast',
      description: 'Cloudy skies throughout the day.',
      icon: 'wind',
      stations: null,
      source: 'fcst',
      hours: [Array]
    },
    {
      datetime: '2024-05-27',
      datetimeEpoch: 1716786000,
      tempmax: 55.8,
      tempmin: 44.1,
      temp: 49.5,
      feelslikemax: 55.8,
      feelslikemin: 37.9,
      feelslike: 46.2,
      dew: 27.7,
      humidity: 44.4,
      precip: 0,
      precipprob: 16.1,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 29.1,
      windspeed: 27.1,
      winddir: 308.2,
      pressure: 1014.5,
      cloudcover: 83.6,
      visibility: 15,
      solarradiation: 309.7,
      solarenergy: 26.7,
      uvindex: 10,
      severerisk: 10,
      sunrise: '17:06:48',
      sunriseEpoch: 1716761208,
      sunset: '08:22:07',
      sunsetEpoch: 1716816127,
      moonphase: 0.65,
      conditions: 'Partially cloudy',
      description: 'Partly cloudy throughout the day.',
      icon: 'partly-cloudy-day',
      stations: null,
      source: 'fcst',
      hours: [Array]
    },
    {
      datetime: '2024-05-28',
      datetimeEpoch: 1716872400,
      tempmax: 64.3,
      tempmin: 50.8,
      temp: 57.3,
      feelslikemax: 64.3,
      feelslikemin: 50.8,
      feelslike: 57.3,
      dew: 24.3,
      humidity: 28.7,
      precip: 0,
      precipprob: 0,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 35.1,
      windspeed: 27.3,
      winddir: 304.1,
      pressure: 1010.6,
      cloudcover: 5.6,
      visibility: 15,
      solarradiation: 354.8,
      solarenergy: 30.6,
      uvindex: 10,
      severerisk: 10,
      sunrise: '17:06:06',
      sunriseEpoch: 1716847566,
      sunset: '08:23:03',
      sunsetEpoch: 1716902583,
      moonphase: 0.68,
      conditions: 'Clear',
      description: 'Clear conditions throughout the day.',
      icon: 'clear-day',
      stations: null,
      source: 'fcst',
      hours: [Array]
    },
    {
      datetime: '2024-05-29',
      datetimeEpoch: 1716958800,
      tempmax: 66.3,
      tempmin: 53.7,
      temp: 59.9,
      feelslikemax: 66.3,
      feelslikemin: 53.7,
      feelslike: 59.9,
      dew: 23.4,
      humidity: 25.3,
      precip: 0,
      precipprob: 0,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 27.7,
      windspeed: 24.4,
      winddir: 310.6,
      pressure: 1010.6,
      cloudcover: 59.9,
      visibility: 15,
      solarradiation: 350.9,
      solarenergy: 30.6,
      uvindex: 10,
      severerisk: 10,
      sunrise: '17:05:26',
      sunriseEpoch: 1716933926,
      sunset: '08:23:58',
      sunsetEpoch: 1716989038,
      moonphase: 0.72,
      conditions: 'Partially cloudy',
      description: 'Partly cloudy throughout the day.',
      icon: 'partly-cloudy-day',
      stations: null,
      source: 'fcst',
      hours: [Array]
    },
    {
      datetime: '2024-05-30',
      datetimeEpoch: 1717045200,
      tempmax: 67.7,
      tempmin: 54.6,
      temp: 60,
      feelslikemax: 67.7,
      feelslikemin: 54.6,
      feelslike: 60,
      dew: 25.4,
      humidity: 26.6,
      precip: 0,
      precipprob: 0,
      precipcover: 0,
      preciptype: null,
      snow: 0,
      snowdepth: 0,
      windgust: 27.1,
      windspeed: 24.2,
      winddir: 307.9,
      pressure: 1013.6,
      cloudcover: 91.2,
      visibility: 15,
      solarradiation: 320,
      solarenergy: 27.8,
      uvindex: 8,
      severerisk: 10,
      sunrise: '17:04:48',
      sunriseEpoch: 1717020288,
      sunset: '08:24:52',
      sunsetEpoch: 1717075492,
      moonphase: 0.75,
      conditions: 'Overcast',
      description: 'Cloudy skies throughout the day.',
      icon: 'cloudy',
      stations: null,
      source: 'fcst',
      hours: [Array]
    }
  ],
  alerts: [],
  currentConditions: {
    datetime: '11:00:00',
    datetimeEpoch: 1716566400,
    temp: 57.6,
    feelslike: 57.6,
    humidity: 29.89,
    dew: 26.3,
    precip: 0,
    precipprob: 0,
    snow: 0,
    snowdepth: 0,
    preciptype: null,
    windgust: 15.4,
    windspeed: 9.8,
    winddir: 341.8,
    pressure: 1012,
    visibility: 15,
    cloudcover: 0,
    solarradiation: 0,
    solarenergy: 0,
    uvindex: 0,
    severerisk: 10,
    conditions: 'Clear',
    icon: 'clear-night',
    stations: [],
    source: 'fcst',
    sunrise: '17:09:08',
    sunriseEpoch: 1716502148,
    sunset: '08:19:11',
    sunsetEpoch: 1716556751,
    moonphase: 0.54
  }
} //end testData


// Get today's date
let today = new Date();
today = today.toISOString().split('T')[0];
// Get the date 6 days from today (for seven day forecast)
let seventhDay = new Date();
seventhDay.setDate(seventhDay.getDate() + 6);
seventhDay = seventhDay.toISOString().split('T')[0];
console.log('today,seventhday', today, seventhDay);

// Used to prep tables to text format for openAI complete endpoint call
function convertArrayToTSV(array) {
  console.log('array in convert to TSV', array);
  return array.map(row => row.map(item => {
    console.log('row', row)
    return (item !== null ? item : '')}).join('\t')).join('\n');
}

// Used to flatten small arrays contained in weather data
function arrayToCSV(array) {
  return array.map(item => {
      if (item === null || item === undefined) {
          return '';
      }
      return item.toString();
  }).join(', ');
}

// Example usage:
const mixedData = ['treats', 'fun', 123, null, 'tasty', undefined, 'lovely'];
const csv = arrayToCSV(mixedData);
console.log(`"${csv}"`); // Output: "treats, fun, 123, , tasty, lovely"

/**
 * GET all preferred weather types for selection dropdown 
 */
router.get('/types/',rejectUnauthenticated, (req, res) => {
  console.log('in get of weather types!')
  const sqlText = `
    SELECT * FROM preferred_weather_type
        ORDER BY id;
    `;
    pool.query(sqlText)
    .then(dbResponse => {
      console.log('GET route for /api/weather/types sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for /api/weather/types failed', dbError);
      res.sendStatus(500);
    })
});

router.get('/forecast/', rejectUnauthenticated, (req, res) => {
  console.log('in get of forecast!')
  const userId = Number(req.user.id);
  const locationId = Number(req.query.id);
  console.log('locationid', locationId, 'userId', userId)
  // use location and user to get lat/long coordinates
  const sqlText = `
    SELECT *
      FROM location
      WHERE id = $1 
        AND user_id = $2;
    `;
    pool.query(sqlText, [locationId, userId])
    .then(dbResponse => {
      console.log('Get of location lat/long in /api/weather/forecast/ worked!', dbResponse.rows);
      // then use that to query visualcrossing with axios get!!
      
      const {utc_offset, name, country, latitude, longitude} = dbResponse.rows[0];
      console.log('GETTING WEATHER FROM API BELOW***************');
      console.log('utc offset, name, country, lat, long', utc_offset, name, country, latitude, longitude);
      if (TESTING) {
        res.send(testData);
      } else {
        // sample format (visual crossing timeline weather api)    Minneapolis%2C%20MN/2024-05-30/2024-06-06?unitGroup=metric&key=YOUR_API_KEY&contentType=json
        //    https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY 
        axios({
          method: 'GET',
          url: `${visualCrossUrl}${latitude},${longitude}/${today}/${seventhDay}?key=${VISUAL_CROSSING_API_KEY}&iconSet=${visualCrossIconSet}&timezone=${utc_offset}&contentType=json`
        })
        .then(apiResponse => {
          console.log('GET of data from visual crossing worked at /api/weather/forecast/!', apiResponse.data);
          res.send(apiResponse.data);
        })
        .catch(apiError => {
          console.log('GET of API data from visual crossing failed in /api/weather/forecast/, please try again later', apiError);
          res.sendStatus(500);
        })
      } 
    })
    .catch(dbError => {
      console.log('Get of location lat/log in api/weather/forecast/ failed', dbError);
      res.sendStatus(500);
    })
})

/********************************** */

/**  
 * Get recommendations from openAI!
 *   (based on weather data from openAI complete endpoint)
 *    1. get location data for list (used for weather data API call)
 *    2. get list data from list & list_items table (for openAI call)
 *    3. get weather data from visual crossing (for openAI call)
 *    4. prepare data for openAI call 
 *    5. prepare prompts for openAI call
 *    6. make call to openAI assistant with data and prompt
 *    7. get recommendations response back from openAI
 *    8. process recommendations and save to recommendations table
 *    9. send recommendations table data back to display on screen
 */
router.get('/recommendations/:list_id', rejectUnauthenticated, async (req, res) => {
  console.log('Getting recommendations with OPENAI', req.params);
  const listId = req.params.list_id;
  const userId = req.user.id;
    try {
      // Make multiple API calls and database queries:
      console.log('GET location data from db *****************')
      // 1. get location data for list (used for weather data API call)
      const dbLocationData = await getLocationData(listId, userId);
      console.log('GET list data from db*****************')
      // 2. get list data from list & list_items table (for openAI call)
      console.log('dblocdata', dbLocationData);
      let dbListData = await getListData(listId, userId);
      console.log('dbListData', dbListData);
      console.log('GET weather data from visual crossing API *****************')
      // 3. get weather data from visual crossing (for openAI call)
      const apiWeatherData = await getWeatherData(dbLocationData);

    // ****** set up and call to openAI API below. **************************
    // 4. prepare data for openAI call 
    console.log('Prepare data for openAI call *****************')
    // create list item table in text format to pass to open AI:
    //    - first put data in an array of arrays
    //    - second add the headers array to the top of the arrays
    //    - third reformat table to text format with tabs and newlines  
    //    - fourth add table header
    //  (create list array, convert to text, add table title)
    let listDataArray = dbListData.map(listObject => Object.values(listObject));
    console.log('listdataarray:', listDataArray)
    listDataArray.unshift(["Todo_ID",
                        "List Description", 
                        "Item Description",
                        "Priority",
                        "Preferred Time Of Day",
                        "Preferred Weather", 
                        "Due Date"]);
    console.log('listdataarray2', listDataArray);   
    let listDataText = convertArrayToTSV(listDataArray)  
    listDataText =
    `*** To Do list Data *** \n\n${listDataText}`;          
    console.log('listdatatext', listDataText);

    // create weather data tables in text format to pass to open AI:
    // this data set is a manually built subset of the api weather data
    //    received, do not want to send up entire data set
    let alertsArray = [], weatherLocationArray = [];
    let forecastDaysArray = [], forecastHoursArray = [];
    let forecastDay = {};
    // create location array, convert to text, add table title
    weatherLocationArray = [['lattitude', 'longitude', 'timezone'],
                           [ apiWeatherData.latitude, 
                             apiWeatherData.longitude,
                             apiWeatherData.timezone ]];
    let weatherLocationText = convertArrayToTSV(weatherLocationArray);
    weatherLocationText =
     `*** Location data for Weather Forecasts *** \n\n${weatherLocationText}`;
    // grab already created alerts array, convert to text, add table title
    let alertsText = convertArrayToTSV( apiWeatherData.alerts);
    alertsText =
    `*** Current Weather Alerts for Location *** \n\n${alertsText}`;
    // create days array, convert to tex, add table title                        
    //  - first set header row for formatted day
    forecastDaysArray.push([  
      'max_temperature',
      'min_temperature',
      'feels_like_max_temperature',
      'feels_like_min_temperature',
      'humidity',
      'precipitation_amount',
      'precipitation_probability',
      'precipitation_type',
      'snow_amount',
      'current_snow_depth',
      'wind_gust_max',
      'wind_speed_max',
      'cloud_cover_percentage',
      'uv_index',
      'risk_of_severe_weather_percentage',
      'daily_weather_description' ]);
    // - then loop through api data and select fields for rest of array
    apiWeatherData.days.map(day => {
    forecastDay = [ day.datetime,
                      day.tempmax,
                      day.tempmin,
                      day.feelslikemax,
                      day.feelslikemin,
                      day.humidity,
                      day.precip,
                      day.precipprob,
                      day.preciptype ? day.preciptype.toString() : "",
                      day.snow,
                      day.snowdepth,
                      day.windgust,
                      day.windspeed,
                      day.cloudcover,
                      day.uvindex,
                      day.severerisk,
                      day.description ];
      forecastDaysArray.push(forecastDay);
      })
      // -then convert to text table
      let daysText = convertArrayToTSV(forecastDaysArray);
      daysText =
      `*** Weather forecast information by day for location *** \n\n${daysText}`;
      // combine text tables into one string:
      let textTables =
       `\n\nFour Data Tables:\n${listDataText}\n\n${weatherLocationText}\n\n${daysText}\n\n${alertsText}`;
       console.log('texttables', textTables);
      console.log('Prepare prompts for openAI call *****************')
    // 5. prepare prompts for openAI call
      // const prompt = 
      //   `Look through the following tables and provide recommendations on when to move to do list items taking into account preferred weather and the current forecast for the week.  Please provide 5 recommendations for when to do a particular to do item based on the weather, or to do an activity that seems like an indoor activity on very hot or very cold or rainy or snowy days. For your response, can you respond in JavaScript object notation.  The response should consist of a header property with related text, and five item properties, item1, item2, item3, item 4 and item5. Each item should hold an object with the following: a numerical sequential id  property, a todo_id property, a todo_item description, and a description of the recommendation called recommend_desc.  If there is not enough data for 3 recommendations, you may assign null to: the item3 property for one missing recommendation, assign null to item3 and item2 for two missing recommendations, and assign null to item1, item2 and item3  for three missing recommendations.
      //   An example of the data structure to be returned if there were 3 recommendations given the data sent would be:           For your response, can you respond in JavaScript object notation.
      //   Content: { header: 'Header text generated by role’,
      //   Item1: { number: 1, todo_id : 5, todo_ desc: 'Mow the Lawn', 'Role generated recommendation text goes here’},
      //   Item 2: {number: 2 todo_id : 5, todo_ desc: ‘Rake the leaves’, 'Role generated recommendation text number 2 goes here},
      //   Item 3: {number: 3, todo_id : 5, todo_ desc: ‘Clean the kitchen floor’, 'Role generated recommendation text number 3 goes here},
      //   Item4: null,
      //   Item5: null} `;
        const prompt = 
        `Look through the following tables and provide recommendations on when to move to do list items taking into account preferred weather and the current forecast for the week.  Please provide 3 recommendations for when to do a particular to do item based on the weather, or to do an activity that seems like an indoor activity on very hot or very cold or rainy or snowy days.  For your response, respond using JSON format. The response should consist of a header property with related text, and three item properties, item1, item2, and item3. Each item should hold the following: a numerical sequential id  property, a todo_id property, a todo_item description, and a description of the recommendation called recommend_desc. 
        Content: { "header": 'Header text generated by role",
        "item1": {"number": "1", "todo_id" : "5","todo_desc": 'Mow the Lawn', "recommend_desc": 'Role generated recommendation text goes here"},
        "item2": {number: "2", "todo_id" : "5", "todo_desc": "Rake the leaves", "recommend_desc": 'Role generated recommendation text number 2 goes here},
        "item3": {number: "3", "todo_id" : "5", "todo_desc": "Clean the kitchen floor", "recommend_desc": 'Role generated recommendation text number 3 goes here}
        }`;
        const apiRequestData = {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant generating recommendations based on to do lists and a current weather forecast for the week.'
            },
            {
              role: 'user',
              content: `${prompt}\n\n${textTables}`
            }
          ],
          max_tokens: 600,
          temperature: 1
        };
      console.log('apiRequest', apiRequestData);
      console.log('Make call to openAI *****************')
    //6. make call to openAI assistant with data and prompt
      const AIresponse = await axios({
        method: 'POST',
        url: `${openAIurl}`,
        headers: openAIheaders,
        data: apiRequestData
      });
      console.log('Get recommendations back from openAI *****************')
      // 7. get recommendations response back from openAI
      console.log(AIresponse.data);
      let recommendations = AIresponse.data.choices[0].message.content;
      console.log('recommendations*************', recommendations);
     recommendations = recommendations.replace(/^```json\n/, '').replace(/\n```$/, '');
      console.log('rec2*********',recommendations);
      // Now parse the cleaned JSON string
      const parsedData = JSON.parse(recommendations);
      console.log('parsed data:', parsedData)
      let theheader = parsedData.header;
      console.log('head:', theheader);
      console.log('number:', parsedData.item1.number)
      console.log('recommend_desc', parsedData.item2.recommend_desc)
      // 8. process recommendations and save to recommendations table
      const responseDeleteOK = await deleteOldRecommendations(listId);
      const responseAddOK = await addNewRecommendations(listId, parsedData);
      console.log('Send recommendations back to recommendations component *****************')
      // 9. send sucessful response back in order to call get and set
      //      of new recommendations
      res.sendStatus(201);
    } catch(openAIapiError) {
      console.log('Error in POST API call to openAI at /api/weather/recommendations', openAIapiError);
      res.sendStatus(500);
    }
})

const getLocationData = async (listId, userId) => {
  let connection;
  // 1. get location data for list (used for weather data API call)
  try {
    connection = await pool.connect()
    const sqlTextLocation = `
    SELECT *
      FROM location
      INNER JOIN list
        ON location.id = list.location_id
      WHERE list.id = $1 
        AND list.user_id = $2;
    `;
    const locationData = await connection.query(sqlTextLocation, [listId, userId]);
    console.log('locdata:', locationData.rows[0]);
    const utc_offset = locationData.rows[0].utc_offset;
    const latitude = locationData.rows[0].latitude;
    const longitude = locationData.rows[0].longitude;
    const name = locationData.rows[0].name;
    const country = locationData.rows[0].country;
    console.log('offset', utc_offset)
    // const { name, country, zip, region, latitude, longitude, timezone_id, utc_offset } = dbResponse.rows[0];
    console.log('locationdatalenght', locationData.rows.length);
    if (locationData.rows.length !== 1) {
      console.log('whoops!')
      throw new Error('Location data not found! Failure in /api/weather/recommendations');
    } else {
      // const {utc_offset, name, country, latitude, longitude} = dbResponse.rows[0];
      console.log('ok next!')
      if (!latitude || !longitude) {
        console.log('lat, long', latitude, longitude);
        connection.release();
        console.log('utc offset, name, country, lat, long', utc_offset, name, country, latitude, longitude);
      }
      connection.release();
      return locationData.rows[0];
    }
  } catch (error) {
    connection.release();
    console.error(error.stack)
    throw new Error('Error in get of location data in /api/weather/recommendations', error.message);
  }

};

const getListData = async (listId, userId) => {
  console.log('in getlistdata')
  let connection;
  try {
    console.log( 'user, list', userId, listId);
    connection = await pool.connect();
    // 2. get list data from list & list_items table (for openAI call)
    const sqlTextList = `
      SELECT list_item.id AS todo_id,
             list.description AS list_description,
             list_item.description AS item_description,
             list_item.priority AS priority,
             list_item.preferred_time_of_day AS preferred_time_of_day,
             weather_type.title AS preferred_weather,
             list_item.due_date AS due_date
      FROM list_item
      INNER join list
       ON list.id = list_item.list_id
      LEFT OUTER JOIN preferred_weather_type AS weather_type
        ON weather_type.id = list_item.preferred_weather_type
      where list.id = $1 
        AND list.user_id = $2 
        AND completed_date IS NULL;
      `;
    const listData = await connection.query(sqlTextList, [listId, userId]);
    console.log('listdata', listData.rows);
    if (listData.rows.length === 0) {
      console.log('no items in listdata')
      throw new Error('No list items on this list, so no recommendations! Failure in /api/weather/recommendations');
    } else {
      console.log('wowo')
      connection.release();
      return listData.rows;
    }
  } catch(dbError) {
    console.error(dbError.stack)
    throw new Error ('Error fetching list data in /api/weather/recommendations', dbError);
    connection.release();
  }
}


  const getWeatherData = async (location) => {
    console.log('GETTING WEATHER FROM API BELOW***************');
    console.log('latlong', location.latitude, location.longitude)
    if (TESTING) {
      return testData;
    } else {
      try {
        // sample format (visual crossing timeline weather api)
        //    https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY 
        const weatherApiResponse = await axios({
          method: 'GET',
          url: `${visualCrossUrl}${location.latitude},${location.longitude}/${today}/${seventhDay}?key=${VISUAL_CROSSING_API_KEY}&iconSet=${visualCrossIconSet}&timezone=${location.utc_offset}&contentType=json`
        })
        console.log('GET of data from visual crossing worked at /api/weather/forecast/!', weatherApiResponse.data);
        if (typeof weatherApiResponse === undefined ) {
          console.log('No rows received for weather data, error in getWeatherData in /api/weather/recommendations!');
          throw new Error('No rows received for weather data, error in getWeatherData in /api/weather/recommendations!');
        }
        return weatherApiResponse.data;
      } catch (apiError) {
        console.error(apiError.stack)
          console.log('GET of API data from visual crossing failed in /api/weather/forecast/, please try again later', apiError);
          throw new Error('Error in getWeatherData in /api/weather/forecast/', apiError);
      }
    }
  };

  const addNewRecommendations = async (listId, recommendations) => {
    let connection;
    // 1. get location data for list (used for weather data API call)
    try {
      connection = await pool.connect()
      const sqlText = `
      INSERT INTO recommendations
        ( header, recommendation_number, list_id, todo_id, todo_desc, recommend_desc )
        VALUES ( $2, $3, $1, $4, $5, $6),
               ( $2, $7, $1, $8, $9, $10),
               ( $2, $11, $1, $12, $13, $14)
      `;
      const response = 
        await connection.query(sqlText, [listId,
                                         recommendations.header,
                                         recommendations.item1.number,
                                         recommendations.item1.todo_id,
                                         recommendations.item1.todo_desc,
                                         recommendations.item1.recommend_desc,                 
                                         recommendations.item2.number,
                                         recommendations.item2.todo_id,
                                         recommendations.item2.todo_desc,
                                         recommendations.item2.recommend_desc,
                                         recommendations.item3.number,
                                         recommendations.item3.todo_id,
                                         recommendations.item3.todo_desc,
                                         recommendations.item3.recommend_desc
                                        ]);
        connection.release();
        return true;
      } catch(dbError) {
        console.error(dbError.stack)
        throw new Error ('Error adding to recommendations table in /api/weather/recommendations', dbError);
        connection.release();  
      }
  }


  const deleteOldRecommendations = async (listId) => {
    let connection;
    // 1. get location data for list (used for weather data API call)
    try {
      connection = await pool.connect()
      const sqlText = `
      DELETE FROM recommendations
        WHERE list_id = $1
      `;
      const response = 
        await connection.query(sqlText, [listId]);
        connection.release();
        return true;
      } catch(dbError) {
        console.error(dbError.stack)
        throw new Error ('Error deleting old recommendations in /api/weather/recommendations', dbError);
        connection.release();  
      }
  }

/**
 * GET all the recommendations for a listId
 */
router.get('/get_recommendation_text/:list_id',rejectUnauthenticated, (req, res) => {
  console.log('reqparams', req.params);
  const listId = req.params.list_id;
  const sqlText = `
    SELECT * FROM recommendations
      WHERE list_id = $1
      ORDER BY recommendation_number;
    `;
    pool.query(sqlText, [listId])
    .then(dbResponse => {
      console.log('GET route for /api/weather/get_recommendation_text/ sucessful!', dbResponse.rows);
      res.send(dbResponse.rows);
    })
    .catch(dbError => {
      console.log('GET route for/api/weather/get_recommendation_text/ failed', dbError);
      res.sendStatus(500);
    })
});



module.exports = router;



