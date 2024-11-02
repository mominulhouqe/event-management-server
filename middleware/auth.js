// // Example middleware definition
// const jwt = require('jsonwebtoken');

// const verifyJWT = (req, res, next) => {
//     // Get the token from the request headers or wherever it is stored
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).send({ message: 'Unauthorized - Token not provided' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Attach the decoded token to the request object for later use if needed
//         req.user = decoded;

//         next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//         console.error(error);
//         res.status(401).send({ message: 'Unauthorized - Invalid token' });
//     }
// };

// // Middleware to verify JWT and check if user has admin role
// const isAdmin = (req, res, next) => {
//   // Check if the user is authenticated and has the 'admin' role
//   if (req.user && req.user.role === 'admin') {
//       next(); // User is admin, proceed to the next middleware or route handler
//   } else {
//       // User is either not authenticated or doesn't have admin role
//       res.status(403).send({ message: 'Forbidden - Admin access required' });
//   }
// };

// module.exports = { verifyJWT, isAdmin };

// middleware/auth.js
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
  // Get the token from the request headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Unauthorized - Token not provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded token to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).send({ message: "Unauthorized - Invalid token" });
  }
};

// Middleware to check if the user has an admin role
const isAdmin = (req, res, next) => {
  // Check if user exists and has the 'admin' role
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    res.status(403).send({ message: "Forbidden - Admin access required" });
  }
};

module.exports = { verifyJWT, isAdmin };
