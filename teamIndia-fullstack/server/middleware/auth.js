// Middleware: Check if admin is logged in
function isAuthenticated(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }

  // If it's an API request, file upload, or AJAX call, return JSON 401 instead of redirecting with HTML
  const isAjaxOrApi = req.xhr ||
    req.method !== 'GET' ||
    req.path.startsWith('/upload') ||
    (req.headers.accept && req.headers.accept.includes('application/json')) ||
    (req.headers['content-type'] && req.headers['content-type'].includes('application/json'));

  if (isAjaxOrApi) {
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please log in again.',
      redirect: '/admin/login'
    });
  }

  // Direct page navigation redirect
  res.redirect('/admin/login');
}

module.exports = { isAuthenticated };
