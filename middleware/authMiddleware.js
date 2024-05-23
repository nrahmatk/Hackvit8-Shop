const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  const redirectAdmin = (req, res, next) => {
    if (req.session.userRole !== 'admin') {
      res.redirect('/shop');
    } else {
      next();
    }
  };
  
  const redirectUser = (req, res, next) => {
    if (req.session.userRole !== 'user') {
      res.redirect('/admin');
    } else {
      next();
    }
  };

  module.exports = {redirectLogin, redirectAdmin, redirectUser};