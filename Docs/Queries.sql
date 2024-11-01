CREATE TABLE IF NOT EXISTS movies (
  movie_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  release_year INTEGER,
  genre VARCHAR(100),
  director VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS rentals (
  rental_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
  rental_date DATE DEFAULT CURRENT_DATE,
  return_date DATE
);

SELECT m.*
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE c.email = 'bruce.wayne@example.com';

SELECT DISTINCT c.*
FROM customers c
JOIN rentals r ON c.customer_id = r.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'Iron Man';

SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM rentals r
JOIN customers c ON r.customer_id = c.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.title = 'The Dark Knight';

SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM rentals r
JOIN customers c ON r.customer_id = c.customer_id
JOIN movies m ON r.movie_id = m.movie_id
WHERE m.director = 'Christopher Nolan';

SELECT m.*
FROM movies m
JOIN rentals r ON m.movie_id = r.movie_id
WHERE r.return_date > '2024-01-05';

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'; 

SELECT * FROM movies;

SELECT * FROM customers;

SELECT * FROM rentals;
