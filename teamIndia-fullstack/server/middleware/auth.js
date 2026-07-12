// Middleware: Check if admin is logged in
function isAuthenticated(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
}

module.exports = { isAuthenticated };
