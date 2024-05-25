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
DROP TABLE IF EXISTS "user";



-- create tables ----------------------------------------------
CREATE TABLE "user" (
  id  SERIAL PRIMARY KEY,
  username  VARCHAR(80) UNIQUE NOT NULL,
  password  VARCHAR(100) NOT NULL
);

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


INSERT INTO location
  (name, zip, is_master_default_location)
  VALUES ('Mendota Hts, MN', 55118, TRUE),
         ('St. Paul, MN', 55032, FALSE);


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
  (morning, afternoon, evening, night, user_id)
  VALUES ( '06:00:00', '12:00:00', '17:00:00', '20:00:00', 1),
         ( '06:00:00', '12:00:00', '17:00:00', '20:00:00', 2);

--  INSERT INTO list
--    (description,  user_id, location_id, sort_order)
--    VALUES ('treats', 1,
--          CASE WHEN (SELECT is_master_default_location
--                       FROM location
--                       WHERE location.user_id = 1       
--                        AND is_master_default_location = true)
--               THEN (SELECT id 
--                       FROM location
--                       WHERE location.user_id = 1
--                        AND is_master_default_location = true)
--               ELSE null
--          END,
--          COALESCE((SELECT MAX(sort_order) 
--                    FROM list 
--                    WHERE user_id = 1), 0) + 1);
--                    
--                    
--WITH new_order AS (
--    SELECT unnest(ARRAY[1, 2, 9, 10]) AS id, generate_series(1, array_length(ARRAY[1, 2, 9, 10], 1)) AS new_sort_order
--)
--UPDATE list
--SET sort_order = new_order.new_sort_order
--FROM new_order
--WHERE list.id = new_order.id  AND
--	user_id = 1;