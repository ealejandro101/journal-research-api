let emailController =  require('./utilities/emailController.js')

module.exports = function(app) {
    let Editor = app.models.Editor
    
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
                res.status(200).send({
                    accessToken: token.id,
                    editorId: editor.id
                });
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

    app.get('/custom/Editor/test', (req, res) => {
        emailController.sendMail('danieladiazgomez97@gmail.com', 'Test', 'MSG Test').catch(console.error);
        res.send(':D')
    })

}