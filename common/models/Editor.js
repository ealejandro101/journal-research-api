module.exports = function(Editor) {
    Editor.afterRemote('create', function(context, user, next) {
        var options = {
            type: 'email',
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Thanks for registering.',
            user: user,
            redirect: 'http://journals-research.com/#/Login',
          };
    
        user.verify(options,function(err, response) {
          if (err) {
            Editor.deleteById(user.id);
            return next(err);
          }
          return next();
        });
      });
};
  