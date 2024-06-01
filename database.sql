-- CREATE DATABASE "sunny_day"


-- drop tables if exist ---------------------------------------
DROP TABLE IF EXISTS list_item;
DROP TABLE IF EXISTS priority;
DROP TABLE IF EXISTS preferred_weather_type;
DROP TABLE IF EXISTS time_of_day;


DROP TABLE IF EXISTS forecast_precipitation_type;

DROP TABLE IF EXISTS daily_forecast;


DROP TABLE IF EXISTS list;
DROP TABLE IF EXISTS hourly_forecast;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS weather_icon;
-- DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS recommendations;


-- create tables ----------------------------------------------
-- CREATE TABLE "user" (
--   id  SERIAL PRIMARY KEY,
--   username  VARCHAR(80) UNIQUE NOT NULL,
--   password  VARCHAR(100) NOT NULL
-- );

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "user",
  name VARCHAR(200) NOT NULL,
  country VARCHAR(100),
  zip INT,
  region VARCHAR(200),
  latitude DEC,
  longitude DEC,
  timezone_id INT,
  utc_offset  DEC,
  is_master_default_location BOOLEAN DEFAULT NULL
);

CREATE TABLE list (
  id  SERIAL PRIMARY KEY,
  description VARCHAR(200) NOT NULL,
  location_id INT REFERENCES location DEFAULT NULL,
  show_on_open  BOOLEAN DEFAULT FALSE,
  sort_order  INT NOT NULL,
  user_id INT REFERENCES "user"
);

CREATE TABLE list_item (
  id SERIAL PRIMARY KEY,
  description VARCHAR(200) NOT NULL,
  completed_date DATE DEFAULT NULL,
  priority INT DEFAULT NULL,
  preferred_weather_type INT DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  year_to_work_on INT NOT NULL,
  month_to_work_on INT DEFAULT NULL,
  week_to_work_on INT DEFAULT NULL,
  preferred_time_of_day VARCHAR(100) DEFAULT NULL,
  sort_order INT NOT NULL,
  list_id INT REFERENCES list(id) ON DELETE CASCADE
);

  
CREATE TABLE priority (
  id SERIAL PRIMARY KEY,
  description VARCHAR(100) NOT NULL
);

CREATE TABLE preferred_weather_type (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  icon_url  VARCHAR(200)
);
 
CREATE TABLE time_of_day (
  id SERIAL PRIMARY KEY,
  morning TIME NOT NULL,
  afternoon TIME NOT NULL,
  evening TIME NOT NULL,
  night TIME NOT NULL,
  user_id INT REFERENCES "user" 
);

CREATE TABLE weather_icon (
  icon  VARCHAR(100) PRIMARY KEY,
  icon_url  VARCHAR(300),
  description VARCHAR(100)
);

CREATE TABLE daily_forecast (
  id SERIAL PRIMARY KEY,
  location_id INT REFERENCES location,
  date  TIMESTAMP WITH TIME ZONE,
  temp_max DEC,
  temp_min  DEC,
  temp  DEC,
  feelslikemax  DEC,
  feelslikemin  DEC,
  feelslike DEC,
  dew DEC,
  humidity  DEC,
  precip  DEC,
  precipprob  DEC,
  snow DEC,
  snow_depth  DEC,
  windgust  DEC,
  windspeed DEC,
  cloudcover  DEC,
  visibility  DEC,
  uvindex DEC,
  severerisk  DEC,
  sunrise TIME,
  sunset  TIME,
  conditions  VARCHAR(300),
  description VARCHAR(500),
  icon VARCHAR(100) REFERENCES weather_icon
);

CREATE TABLE hourly_forecast (
  id SERIAL PRIMARY KEY,
  location_id INT REFERENCES location,
  time  TIME WITH TIME ZONE,
  datetimeEpoch INT,
  date DATE,
  temp DEC,
  feelslike  DEC,
  humidity  DEC,
  precip  DEC,
  precipprob  DEC,
  snow DEC,
  snow_depth  DEC,
  windgust  DEC,
  windspeed DEC,
  cloudcover  DEC,
  visibility  DEC,
  uvindex DEC,
  severerisk  DEC,
  conditions  VARCHAR(300),
  icon VARCHAR(100) REFERENCES weather_icon
);

CREATE TABLE forecast_precipitation_type (
  id  SERIAL PRIMARY KEY,
  preciptype  VARCHAR(200),
  forecast_id INT REFERENCES daily_forecast
);


CREATE TABLE recommendations (
  id  SERIAL PRIMARY KEY,
  header VARCHAR(900) NOT NULL,
  recommendation_number INT,
  list_id INT REFERENCES list ON DELETE CASCADE,
  todo_id INT REFERENCES list_item ON DELETE CASCADE,
  todo_desc VARCHAR(300),
  recommend_desc VARCHAR(900)
);

-- INSERT INTO "user" 
--   (username, password)
--   VALUES ('lisa', 'cat'),
--         ('betty', 'pie');

INSERT INTO location
  (name, country, zip, region, latitude, longitude, timezone_id, utc_offset)
  VALUES ('Minneapolis, MN', 'United States',  55412, 'midwest', 44.980553, -93.270035, 5, -5),
         ('St. Paul, MN', 'United States', 55101, 'midwest', 44.949642, -93.093124, 5, -5);


-- INSERT INTO list 
--   (description, location_id, sort_order, user_id)
--   VALUES ('my first list', 1, 1, 1),
--         ('to do list not done yet', 2, 2, 1);

-- INSERT INTO list_item
--   (description, year_to_work_on, sort_order, list_id)
--   VALUES ('mow the lawn', 2024, 1, 1),
--         ('make a big cake', 2024, 3, 1),
--         ('trim the hedge', 2024, 2, 1);

 INSERT INTO preferred_weather_type
  (title, description, icon_url)
  VALUES ('sunny', 'More than 50% sun', NULL),
  ('rain/snow', 'Chance of rain/snow', NULL),
  ('partly cloudy', 'Less than 50% sun', NULL),
  ('cloudy', 'More than 80% cloudy', NULL),
  ('hot', 'More than n degrees', NULL),
  ('cold', 'Less than n degrees', NULL),
  ('cool', 'less than n degrees', NULL),
  ('warm', 'More than n degrees', NULL);


INSERT INTO time_of_day 
  (morning, afternoon, evening, night)
  VALUES ( '06:00:00', '12:00:00', '17:00:00', '20:00:00'),
         ( '06:00:00', '12:00:00', '17:00:00', '20:00:00');

      SELECT location.*
        FROM list
			INNER JOIN location
				ON list.location_id = location.id
        WHERE list.user_id = 2
            AND list.id = 1;
            
            
      SELECT list.description AS list_description,
             list_item.description AS item_description,
             list_item.priority AS priority,
             preferred_weather_type.title AS preferred_weather,
             list_item.due_date AS due_date
        FROM list_item
        INNER JOIN list
          ON list.id = list_item.list_id
        INNER JOIN preferred_weather_type
          ON preferred_weather_type.id = list_item.preferred_weather_type
        WHERE list.id = 2
          AND list.user_id = 2
          AND list_item.completed_date IS NULL;
      `;
      
      SELECT list.description AS list_description,
             list_item.description AS item_description,
             list_item.priority AS priority,
             list_item.preferred_time_of_day AS preferred_time_of_day,
             weather_type.title AS preferred_weather,
             list_item.due_date AS due_date
      from list_item
      inner join list
      on list.id = list_item.list_id
      left join preferred_weather_type AS weather_type
      on weather_type.id = list_item.preferred_weather_type
      where list.id = 2 and list.user_id = 2 AND completed_date IS NULL
      
      
      
      
      