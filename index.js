const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  user: "movie_user", // Replace with your PostgreSQL username
  host: "localhost",
  database: "superhero_movie_rental", // Replace with your database name
  password: "5348", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  try {
    // Create Movies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        movie_id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        release_year INTEGER,
        genre VARCHAR(100),
        director VARCHAR(255)
      );
    `);

    // Create Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE,
        phone_number VARCHAR(20)
      );
    `);

    // Create Rentals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        rental_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
        rental_date DATE DEFAULT CURRENT_DATE,
        return_date DATE
      );
    `);

    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  try {
    await pool.query(
      `INSERT INTO movies (title, release_year, genre, director)
       VALUES ($1, $2, $3, $4);`,
      [title, year, genre, director]
    );
    console.log(`Movie "${title}" inserted successfully.`);
  } catch (err) {
    console.error("Error inserting movie:", err);
  }
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  try {
    const res = await pool.query("SELECT * FROM movies;");
    console.log("Movies in the database:");
    res.rows.forEach((movie) => {
      console.log(
        `ID: ${movie.movie_id}, Title: ${movie.title}, Year: ${movie.release_year}, Genre: ${movie.genre}, Director: ${movie.director}`
      );
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
  }
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
    await pool.query(
      `UPDATE customers SET email = $1 WHERE customer_id = $2;`,
      [newEmail, customerId]
    );
    console.log(`Customer ID ${customerId}'s email updated to ${newEmail}.`);
  } catch (err) {
    console.error("Error updating customer email:", err);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  try {
    await pool.query(`DELETE FROM customers WHERE customer_id = $1;`, [
      customerId,
    ]);
    console.log(
      `Customer ID ${customerId} and their rental history have been removed.`
    );
  } catch (err) {
    console.error("Error removing customer:", err);
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log("  show - Show all movies");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2); // Capture command-line arguments
  switch (args[0]) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "show":
      await displayMovies();
      break;
    case "update":
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case "remove":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }

  // Close the database connection pool
  await pool.end();
}

runCLI();
