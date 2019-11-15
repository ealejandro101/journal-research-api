let emailController =  require('./utilities/emailController.js')

module.exports = function(app) {
    let Editor = app.models.Editor
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;
    
    let sessionChecker = (req, res, next) => {
        if (!req.session.token) {
            res.status(401).send()
        } else {
            next();
        }    
    };

    app.post('/custom/Editor/login', function(req, res){
        Editor.login({
            email: req.body.email,
            password: req.body.password
        }, 'user', function(err, token) {
            if (err) {
                return res.status(err.statusCode).send({
                    error: err
                })
            }
            Editor.find({
                where: {
                    email: req.body.email
                }
            }).then(function (response) {
                let editor = response[0]
                console.log(editor.id);
                req.session.token = token.id;
                req.session.identifier = editor.id
                res.status(200).send(token);
            })
        })
    })

    app.get('/custom/Editor/isLogged', sessionChecker, function(req, res){
        res.status(200).send({
            accessToken: req.session.token,
            identifier: req.session.identifier
        })
    })

    app.get('/custom/Editor/logout', sessionChecker, (req, res) => {
        res.clearCookie('user_sid');
        res.status(200).send();
    });

    app.get('/custom/Editor/getFullObject', sessionChecker, (req, res) => {
        Editor.find({
            where: {
                id: req.session.identifier
            },
            include: ['categoriasSuscritas', 'revistasSuscritas', 'propietarioRevista']
        }).then((result) => {
            res.status(200).send({
                editor: result[0]
            });
        }).catch((err) => {
            res.status(500).send({
                error: err
            });
        })
        
    });

    app.get('/custom/Roles/isAdmin', sessionChecker, function(req, res){
        Role.isInRole('admin', {principalType: RoleMapping.USER, principalId: req.session.identifier}, function(err, isInRole) {
            res.status(200).send({
                isInRole
            })
        });
    })
}