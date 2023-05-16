const jsonwebtoken = require("jsonwebtoken");

const authVerify = async (request, response, next) => {
  try {
    const header = request.headers.authorization;
    if (header == null) {
      return response.status(402).json({
        message: "missing token",
        err: null,
      });
    }
    let token = header.split(" ")[1];
    const SECRET_KEY = "secretcode";

    let decodedToken;
    try {
      decodedToken = jsonwebtoken.verify(token, SECRET_KEY);
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        return response.status(401).json({
          message: "token expried",
          err: error,
        });
      }
      return response.status(401).json({
        message: "invalid token",
        err: error,
      });
    }
    request.userData = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "internal error",
      err: error,
    });
  }
};

module.exports = { authVerify };
