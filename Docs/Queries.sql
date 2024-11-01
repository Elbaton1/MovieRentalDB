-- Makes a table for storing movie details
CREATE TABLE IF NOT EXISTS movies (
  movie_id SERIAL PRIMARY KEY,      
  title VARCHAR(255),               
  release_year INTEGER,             
  genre VARCHAR(100),               
  director VARCHAR(255)             
);

-- Makes a table for customer details
CREATE TABLE IF NOT EXISTS customers (
  customer_id SERIAL PRIMARY KEY,   
  first_name VARCHAR(100),          
  last_name VARCHAR(100),           
  email VARCHAR(255) UNIQUE,        
  phone_number VARCHAR(20)          
);

-- Makes a table for rentals 
CREATE TABLE IF NOT EXISTS rentals (
  rental_id SERIAL PRIMARY KEY,     
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE, 
  movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,          
  rental_date DATE DEFAULT CURRENT_DATE, 
  return_date DATE                       
);

-- Add movies to the movies table
INSERT INTO movies (title, release_year, genre, director) VALUES
  ('Iron Man', 2008, 'Action', 'Jon Favreau'),
  ('The Dark Knight', 2008, 'Action', 'Christopher Nolan'),
  ('Avengers: Endgame', 2019, 'Action', 'Anthony Russo, Joe Russo'),
  ('Spider-Man: Homecoming', 2017, 'Action', 'Jon Watts'),
  ('Wonder Woman', 2017, 'Action', 'Patty Jenkins');

-- Shows all the movies in the movies table
SELECT * FROM movies;

-- Add customers to the customers table
INSERT INTO customers (first_name, last_name, email, phone_number) VALUES
  ('Bruce', 'Wayne', 'bruce.wayne@example.com', '555-1234'),
  ('Peter', 'Parker', 'peter.parker@example.com', '555-5678'),
  ('Clark', 'Kent', 'clark.kent@example.com', '555-8765'),
  ('Diana', 'Prince', 'diana.prince@example.com', '555-4321'),
  ('Tony', 'Stark', 'tony.stark@example.com', '555-6789');

-- Shows all the customers in the customers table
SELECT * FROM customers;

-- Add rentals to the rentals table (which customer rented which movie and when)
INSERT INTO rentals (customer_id, movie_id, rental_date, return_date) VALUES
  (1, 2, '2023-01-01', '2023-01-10'),
  (2, 1, '2023-01-02', '2023-01-12'),
  (3, 5, '2023-01-03', '2023-01-13'),
  (4, 3, '2023-01-04', '2023-01-14'),
  (5, 4, '2023-01-05', '2023-01-15'),
  (1, 3, '2023-01-06', '2023-01-16'),
  (2, 4, '2023-01-07', '2023-01-17'),
  (3, 2, '2023-01-08', '2023-01-18'),
  (4, 5, '2023-01-09', '2023-01-19'),
  (5, 1, '2023-01-10', '2023-01-20');

-- Shows all the rentals in the rentals table
SELECT * FROM rentals;

-- Finds all movies rented by a specific customer by email
SELECT m.*
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE c.email = 'bruce.wayne@example.com';

-- Finds all customers who rented a specific movie by movie title
SELECT DISTINCT c.*
FROM customers c
JOIN rentals r ON c.customer_id = r.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'Iron Man';

-- Shows the rental history for a specific movie by movie title
SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM rentals r
JOIN customers c ON r.customer_id = c.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'The Dark Knight';

-- Finds rentals of movies by a specific director, show customer and movie details
SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM rentals r
JOIN customers c ON r.customer_id = c.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.director = 'Christopher Nolan';

-- Shows all movies that are currently rented out 
SELECT m.*
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
WHERE r.return_date > '2024-01-05';

-- Lists all tables in the database
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'; 

-- Shows all movies, customers, and rentals data in each table
SELECT * FROM movies;
SELECT * FROM customers;
SELECT * FROM rentals;
