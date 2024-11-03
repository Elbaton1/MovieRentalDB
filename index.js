const { Pool } = require("pg");

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: "movie_user",
  host: "localhost",
  database: "superhero_movie_rental",
  password: "5348",
  port: 5432, // Ensure this matches your PostgreSQL server's port
});

/**
 * Creates the database tables.
 */
async function createTable() {
  try {
    // Create Movies table
    // had to use not null here but i dint have to in the pgadmin, why? i have no idea lol
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
 * Inserts a new customer into the Customers table.
 */
async function insertCustomer(firstName, lastName, email, phoneNumber) {
  try {
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
 */
async function insertRental(
  customerId,
  movieId,
  rentalDate = null,
  returnDate = null
) {
  try {
    await pool.query(
      `
      INSERT INTO rentals (customer_id, movie_id, rental_date, return_date)
      VALUES ($1, $2, $3, $4);
      `,
      [customerId, movieId, rentalDate, returnDate]
    );
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
    const res = await pool.query("SELECT * FROM movies;");
    console.log("\nMovies in the Database:");
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
    const res = await pool.query("SELECT * FROM customers;");
    console.log("\nCustomers in the Database:");
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
    const res = await pool.query("SELECT email FROM customers;");
    console.log("\nCustomer Emails:");
    res.rows.forEach((row) => {
      console.log(`• ${row.email}`);
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
    console.log("\nRentals in the Database:");
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
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
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
 */
async function removeCustomer(customerId) {
  try {
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
 */
async function removeRental(rentalId) {
  try {
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
 * Prints a help message to the console with emojis
 */
function printHelp() {
  console.log(`
📚 **Movie Rental System - Command Menu**

🔧 *Insert Operations:*
  • *insert* <title> <year> <genre> <director> 
      - Add a new movie to the database.

  • *insert-customer* <first_name> <last_name> <email> <phone_number> 
      - Add a new customer to the database.
  
  • *insert-rental* <customer_id> <movie_id> [rental_date] [return_date] 
      - Add a new rental. Dates are optional in YYYY-MM-DD format.

📂 *Display Operations:*
  • **show** 📽️
      - Display all movies.

  • *show-customers*🧑‍🤝‍🧑
      - Display all customers.
  
  • *show-emails*📧
      - Display all customer emails.
  
  • *show-rentals*📋
      - Display all rentals.

🔄 *Update Operations:*
  • *update* <customer_id> <new_email> 
      - Update a customer's email address.

🗑️ *Remove Operations:*
  • *remove* <customer_id> 
      - Remove a customer and their rental history from the database.
  
  • *remove-rental* <rental_id> 
      - Remove a specific rental from the database.


  • *help*❓
      - Show this help menu.
`);
}

/**
 * Runs the CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable(); // tables created

  const args = process.argv.slice(2);
  const command = args[0];

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
      printHelp(); // Show help if command is unrecognize
      break;
  }

  // Close
  await pool.end();
}

runCLI();
