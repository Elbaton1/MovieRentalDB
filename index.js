const { Pool } = require("pg");

const pool = new Pool({
  user: "movie_user",
  host: "localhost",
  database: "superhero_movie_rental",
  password: "5348",
  port: 5432 /**lol i had so much trouble with this cause for some reason i had the port set to 5433 and it took me about 2 hours to find that out hahaha */,
});

/**
 * Creates the database tables.
 */
async function createTable() {
  try {
    // Create Movies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        movie_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        release_year INTEGER,
        genre VARCHAR(100),
        director VARCHAR(255)
      );
    `);

    // Create Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
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
 * @param {string} title
 * @param {number} year
 * @param {string} genre
 * @param {string} director
 */
async function insertMovie(title, year, genre, director) {
  try {
    // Insert a new movie record into the movies table
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
 * Inserts a new customer into the Customers table.
 *
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} phoneNumber
 */
async function insertCustomer(firstName, lastName, email, phoneNumber) {
  try {
    // Insert a new customer record into the customers table
    await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone_number)
       VALUES ($1, $2, $3, $4);`,
      [firstName, lastName, email, phoneNumber]
    );
    console.log(`Customer "${firstName} ${lastName}" inserted successfully.`);
  } catch (err) {
    console.error("Error inserting customer:", err);
  }
}

/**
 * Inserts a new rental into the Rentals table.
 *
 * @param {number} customerId ID of the customer renting the movie
 * @param {number} movieId ID of the movie being rented
 * @param {string} [rentalDate]  Rental date in YYYY-MM-DD format
 * @param {string} [returnDate]  Return date in YYYY-MM-DD format
 */
async function insertRental(
  customerId,
  movieId,
  rentalDate = null,
  returnDate = null
) {
  try {
    const query = `
      INSERT INTO rentals (customer_id, movie_id, rental_date, return_date)
      VALUES ($1, $2, $3, $4);
    `;
    // Insert a new rental record into the rentals table
    await pool.query(query, [customerId, movieId, rentalDate, returnDate]);
    console.log(
      `Rental for Customer ID ${customerId} and Movie ID ${movieId} inserted successfully.`
    );
  } catch (err) {
    console.error("Error inserting rental:", err);
  }
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  try {
    // Retrieve all movies from the movies table
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
 * Prints all customers in the database to the console
 */
async function displayCustomers() {
  try {
    // Retrieve all customers from the customers table
    const res = await pool.query("SELECT * FROM customers;");
    console.log("Customers in the database:");
    // Loop through each customer and display their details
    res.rows.forEach((customer) => {
      console.log(
        `ID: ${customer.customer_id}, Name: ${customer.first_name} ${customer.last_name}, Email: ${customer.email}, Phone: ${customer.phone_number}`
      );
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
  }
}

/**
 * Prints all customer emails in the database to the console
 */
async function displayEmails() {
  try {
    // Retrieve all emails from the customers table
    const res = await pool.query("SELECT email FROM customers;");
    console.log("Customer Emails:");
    // Loop through each email and display it
    res.rows.forEach((row) => {
      console.log(row.email);
    });
  } catch (err) {
    console.error("Error fetching emails:", err);
  }
}

/**
 * Prints all rentals in the database to the console
 */
async function displayRentals() {
  try {
    // all rentals along with customer and movie details
    const res = await pool.query(`
      SELECT 
        rentals.rental_id, 
        customers.first_name || ' ' || customers.last_name AS customer_name,
        movies.title AS movie_title,
        rentals.rental_date,
        rentals.return_date
      FROM rentals
      JOIN customers ON rentals.customer_id = customers.customer_id
      JOIN movies ON rentals.movie_id = movies.movie_id
      ORDER BY rentals.rental_date DESC;
    `);
    console.log("Rentals in the database:");
    // Loop through each rental and display its details
    res.rows.forEach((rental) => {
      console.log(
        `Rental ID: ${rental.rental_id}, Customer: ${
          rental.customer_name
        }, Movie: ${rental.movie_title}, Rented On: ${
          rental.rental_date
        }, Returned On: ${rental.return_date || "Not Returned"}`
      );
    });
  } catch (err) {
    console.error("Error fetching rentals:", err);
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
    // Update the customer's email in the customers table
    const res = await pool.query(
      `UPDATE customers SET email = $1 WHERE customer_id = $2;`,
      [newEmail, customerId]
    );
    if (res.rowCount === 0) {
      console.log(`No customer found with ID ${customerId}.`);
    } else {
      console.log(`Customer ID ${customerId}'s email updated to ${newEmail}.`);
    }
  } catch (err) {
    console.error("Error updating customer email:", err);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId
 */
async function removeCustomer(customerId) {
  try {
    // Delete the customer record from the customers table
    const res = await pool.query(
      `DELETE FROM customers WHERE customer_id = $1;`,
      [customerId]
    );
    if (res.rowCount === 0) {
      console.log(`No customer found with ID ${customerId}.`);
    } else {
      console.log(
        `Customer ID ${customerId} and their rental history have been removed.`
      );
    }
  } catch (err) {
    console.error("Error removing customer:", err);
  }
}

/**
 * Removes a rental from the database.
 *
 * @param {number} rentalId ID of the rental to remove
 */
async function removeRental(rentalId) {
  try {
    // Delete the rental record from the rentals table
    const res = await pool.query(`DELETE FROM rentals WHERE rental_id = $1;`, [
      rentalId,
    ]);
    if (res.rowCount === 0) {
      console.log(`No rental found with ID ${rentalId}.`);
    } else {
      console.log(`Rental ID ${rentalId} has been removed.`);
    }
  } catch (err) {
    console.error("Error removing rental:", err);
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  // Display instructions for the CLI
  console.log("Usage:");
  console.log("  insert <title> <year> <genre> <director> - Insert a movie");
  console.log(
    "  insert-customer <first_name> <last_name> <email> <phone_number> - Insert a customer"
  );
  console.log(
    "  insert-rental <customer_id> <movie_id> [rental_date] [return_date] - Insert a rental"
  );
  console.log("  show - Show all movies");
  console.log("  show-customers - Show all customers");
  console.log("  show-emails - Show all customer emails");
  console.log("  show-rentals - Show all rentals");
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log("  remove <customer_id> - Remove a customer from the database");
  console.log(
    "  remove-rental <rental_id> - Remove a rental from the database"
  );
  console.log("  help - Show this help message");
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable(); // Ensure tables are created before proceeding

  const args = process.argv.slice(2); // Capture command-line arguments
  const command = args[0]; // Get the command from the arguments

  switch (command) {
    case "insert":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case "insert-customer":
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertCustomer(args[1], args[2], args[3], args[4]);
      break;
    case "insert-rental":
      if (args.length < 3 || args.length > 5) {
        printHelp();
        return;
      }
      const rentalDate = args[3] || null;
      const returnDate = args[4] || null;
      await insertRental(
        parseInt(args[1]),
        parseInt(args[2]),
        rentalDate,
        returnDate
      );
      break;
    case "show":
      if (args.length !== 1) {
        printHelp();
        return;
      }
      await displayMovies();
      break;
    case "show-customers":
      if (args.length !== 1) {
        printHelp();
        return;
      }
      await displayCustomers();
      break;
    case "show-emails":
      if (args.length !== 1) {
        printHelp();
        return;
      }
      await displayEmails();
      break;
    case "show-rentals":
      if (args.length !== 1) {
        printHelp();
        return;
      }
      await displayRentals();
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
    case "remove-rental":
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeRental(parseInt(args[1]));
      break;
    case "help":
      printHelp();
      break;
    default:
      printHelp(); // Show help if command is unrecognized
      break;
  }

  // Close
  await pool.end();
}

runCLI();
