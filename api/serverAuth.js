const
	jwt = require('jsonwebtoken'),
  { JWT_SECRET, EXPIRE_IN } = process.env,
  httpStatus = require("http-status"),
  util = require("./util")

// function for creating tokens
function signToken(user) {
	// toObject() returns a basic js object with only the info from the db
  const userData = user.toObject()
  
  if (userData.password) {
    delete userData.password
  }

  const jwtConfig = {
    expiresIn: EXPIRE_IN
  };

	return jwt.sign(userData, JWT_SECRET, jwtConfig)
}

// function for verifying tokens
function verifyToken(req, res, next) {
	// grab token from either headers, req.body, or query string
  const token = getTokenFromHeader(req) || req.body.token || req.query.token
	// if no token present, deny access
	if(!token) return false;
  // otherwise, try to verify token
  jwt.verify(token, JWT_SECRET, (err, decodedData) => {
    // if problem with token verification, deny access
    if(err) return false;
  })

  return true;
}

function isAuthHeaderInvalid(req) {
  const authHeader = req.headers.authorization;
  return !authHeader || authHeader.split(" ")[0] !== "Bearer";
}

function invalidAuthHeader(res) {
  const message = `Error in authorization format. Invalid authentication header. ${httpStatus["401_MESSAGE"]}`;
  console.log(`invalidAuthHeader( ${message} )`);
  return util.createErrorResponse(res, httpStatus.UNAUTHORIZED, message);
}

function invalidToken(res) {
  const message = `Invalid token. ${httpStatus["401_MESSAGE"]}`;
  console.log(`invalidToken( ${message} )`);
  return util.createErrorResponse(res, httpStatus.UNAUTHORIZED, message);
}

// Return the token value from the request header.
function getTokenFromHeader(req) {
  return req.headers.authorization.split(" ")[1];
}

function isAuthApiEndpoint(url) {
  return url.indexOf("/api/users/auth") !== -1;
}

function isApiEndpoint(url) {
  return url.indexOf("/api") !== -1;
}

function requiresTokenValidation(url) {
  return !isAuthApiEndpoint(url) && isApiEndpoint(url);
}

module.exports = {
  intercept: (req, res, next) => {
    if (requiresTokenValidation(req.url)) {
      if (isAuthHeaderInvalid(req)) {
        invalidAuthHeader(res);
        return;
      } else {
        try {
          if (verifyToken(req, res, next)) {
            next();
          } else {
            return res.json({message: 'token invalid'}); 
          }
        } catch (err) {
          console.warn(err);
          invalidToken(res);
        }
      }
    } else {
      next();
    }
  },
  signToken,
	verifyToken
};
