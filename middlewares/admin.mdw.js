//middleware function to check right of client to access profile

module.exports = function adminAuth(req, res, next) {
  if (req.session.isLogin === false) {
    return res.redirect("/account/login"); //if client still not logged in -> require login
  } else {
    if (req.session.isAdmin === true) {
    } else {
      return;
    }
  }

  next();
};
