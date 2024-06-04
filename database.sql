-- CREATE DATABASE "sunny_day"

-- drop tables if exist ---------------------------------------
DROP TABLE IF EXISTS list_item;
DROP TABLE IF EXISTS priority;
DROP TABLE IF EXISTS preferred_weather_type;
DROP TABLE IF EXISTS time_of_day;
DROP TABLE IF EXISTS forecast_precipitation_type;
DROP TABLE IF EXISTS list;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS weather_icon;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS recommendations;


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

CREATE TABLE forecast_precipitation_type (
  id  SERIAL PRIMARY KEY,
  preciptype  VARCHAR(200),
  forecast_id INT
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

INSERT INTO location
  (name, country, zip, region, latitude, longitude, timezone_id, utc_offset)
  VALUES ('Minneapolis, MN', 'United States',  55412, 'midwest', 44.980553, -93.270035, 5, -5),
         ('St. Paul, MN', 'United States', 55101, 'midwest', 44.949642, -93.093124, 5, -5);

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

            
      
      
      