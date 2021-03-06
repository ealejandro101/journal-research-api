module.exports = function (Editor) {
  Editor.on('resetPasswordRequest', function(info) {
    var url = `https://dardo.info/#/resetPassword/${info.accessToken.id}`;
    var html = `Hola ${info.user.name}, <br /> Para recuperar tu cuenta utiliza el siguiente enlace: <a href="${url}">${url}</a>`
    //'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    Editor.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

  Editor.afterRemote('create', function (context, user, next) {
    var options = {
      host: 'www.dardo.info',
      port: 80,
      type: 'email',
      to: user.email,
      from: "dardocfp@gmail.com",
      subject: 'Termina el proceso para registrarte en Dardo.',/*
      text: "Gracias por registrarte. Haga click en el enlace a continuación para completar su registro.",
      template: path.resolve(__dirname, '../emailFormat/index.ejs'),*/
      user: user,
      redirect: 'https://dardo.info/#/Login',
    };
    user.verify(options, function (err, response) {
      if (err) {
        console.log(err);
        Editor.deleteById(user.id);
        return next(err);
      }
      return next();
    });
  });

  
  Editor.postFullJournal = async function(id, models, callback) {
    let journalId = undefined
    let revista = models.revista
    let radicional = models.radicional
    let rcontactos = models.rcontactos
    let rubicacion = models.rubicacion
    let ridiomas = models.ridiomas
    let rindexaciones = models.rindexaciones
    let revistascategorias = models.revistascategorias
    let rpalabraclave = models.rpalabraclave
    let isError = false
    let currenError = undefined

    //Validar formato
    let regISSN = /^[0-9]{4}-[0-9]{3}[0-9A-Za-z]{1}$/
    let isIssnValid = true
    let isEissnValid = true
    //Validar existencia de eissn e issn
    if (revista.issn || revista.eissn) {
      let orQuery = []
      if (revista.eissn) {
        isEissnValid = regISSN.test(revista.eissn)
        orQuery = orQuery.concat([{
            eissn: revista.eissn
          },
          {
            eissn: revista.eissn.replace('-', '')
          }
        ])
      }
      if (revista.issn) {
        isIssnValid = regISSN.test(revista.issn)
        orQuery = orQuery.concat([{
            issn: revista.issn
          },
          {
            issn: revista.issn.replace('-', '')
          }
        ])
      }
      if (!isIssnValid || !isEissnValid) {
        return callback({
          message: 'El formato del (EISSN o ISSN) es incorrecto.'
        })
      }
      await Editor.app.models.Revista.find({
        where: {
          or: orQuery
        }
      }).then(response => {
        if (response.length) {
          return callback({
            message: 'El EISSN o ISSN ya se encuentra en la base de datos de Dardo.'
          })
        }
      }).catch(error => {
        console.log(error);
        currenError = error
        isError = true
        return callback(error)
      })
    }
    //Insercion de la revista
    revista.estaActiva = 0
    if (id == 3) {
      revista.estaActiva = 1
    }
    revista.fechaCreacion = (new Date(new Date().setFullYear(revista.fechaCreacion))).toISOString()
    revista.fechaIngreso = new Date().toISOString()
    await Editor.app.models.Revista.create(revista).then(response => {
      journalId = response.id
    }).catch(error => {
      currenError = error
      isError = true
    })
    if(isError) return callback(currenError)

    await Editor.app.models.EditorPropietario.create({
      id: "",
      editorId: id,
      revistaId: journalId
    }).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.Revista.destroyById(journalId)
      return callback(currenError)
    }

    radicional.id = journalId
    await Editor.app.models.Radicional.create(radicional).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Revista.destroyById(journalId)
      })
      return callback(currenError)
    }

    rcontactos.id = journalId
    await Editor.app.models.Rcontacto.create(rcontactos).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Radicional.destroyAll({id: journalId}).then(() => {
          Editor.app.models.Revista.destroyById(journalId)
        })
      })
      return callback(currenError)
    }

    rubicacion.id = journalId
    await Editor.app.models.Rubicacion.create(rubicacion).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Radicional.destroyAll({id: journalId}).then(() => {
          Editor.app.models.Rcontacto.destroyAll({id: journalId}).then(() => {
            Editor.app.models.Revista.destroyById(journalId)
          })
        })
      })
      return callback(currenError)
    }

    let categories = []
    for (const categoriaId of revistascategorias.categories) {
      categories.push({
        "id": "",
        "categoriaId": categoriaId,
        "revistaId": journalId
      })
    }
    await Editor.app.models.RevistasCategorias.create(categories).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Radicional.destroyAll({id: journalId}).then(() => {
          Editor.app.models.Rcontacto.destroyAll({id: journalId}).then(() => {
            Editor.app.models.Rubicacion.destroyAll({id: journalId}).then(() => {
              Editor.app.models.Revista.destroyById(journalId)
            })
          })
        })
      })
      return callback(currenError)
    }

    let idiomas = []
    for (const idiomaId of ridiomas.idiomas) {
      idiomas.push({
        "id": "",
        "idiomaId": idiomaId,
        "revistaId": journalId
      })
    }
    await Editor.app.models.Ridiomas.create(idiomas).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Radicional.destroyAll({id: journalId}).then(() => {
          Editor.app.models.Rcontacto.destroyAll({id: journalId}).then(() => {
            Editor.app.models.Rubicacion.destroyAll({id: journalId}).then(() => {
              Editor.app.models.RevistasCategorias.destroyAll({revistaId: journalId}).then(() => {
                Editor.app.models.Revista.destroyById(journalId)
              })
            })
          })
        })
      })
      return callback(currenError)
    }

    let indexaciones = []
    for (const indexacionId of rindexaciones.indexaciones) {
      indexaciones.push({
        "id": "",
        "indexacionesId": indexacionId,
        "revistaId": journalId,
        "parametro": rindexaciones[`parameter-${indexacionId}`]
      })
    }
    await Editor.app.models.Rindexaciones.create(indexaciones).catch(error => {
      currenError = error
      isError = true
    })

    if(isError){
      Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
        Editor.app.models.Radicional.destroyAll({id: journalId}).then(() => {
          Editor.app.models.Rcontacto.destroyAll({id: journalId}).then(() => {
            Editor.app.models.Rubicacion.destroyAll({id: journalId}).then(() => {
              Editor.app.models.RevistasCategorias.destroyAll({revistaId: journalId}).then(() => {
                Editor.app.models.Ridiomas.destroyAll({revistaId: journalId}).then(() => {
                  Editor.app.models.Revista.destroyById(journalId)
                })
              })
            })
          })
        })
      })
      return callback(currenError)
    }

    if (rpalabraclave.palabrasclave.length != 0) {
      let palabrasclave = []
      for (const iterator of rpalabraclave.palabrasclave.split(';')) {
        let wordId = undefined
        await Editor.app.models.Palabraclave.find({
          where: {
            palabraClave: iterator.trim()
          }
        }).then(response => {
          if (response.length > 0) {
            wordId = response[0].id
          }
        })
        if (wordId === undefined) {
          await Editor.app.models.Palabraclave.create({
            id: "",
            palabraClave: iterator.trim()
          }).then(res => {
            wordId = res.id
          })
        }
        palabrasclave.push({
          "id": "",
          "palabraClaveId": wordId,
          "revistaId": journalId
        })
      }
      await Editor.app.models.Palabrasclave.create(palabrasclave).catch(error => {
        currenError = error
        isError = true
      })
      if(isError){
        Editor.app.models.EditorPropietario.destroyAll({revistaId: journalId}).then(() => {
          Editor.app.models.Radicional.destroyById(journalId).then(() => {
            Editor.app.models.Rcontacto.destroyById(journalId).then(() => {
              Editor.app.models.Rubicacion.destroyById(journalId).then(() => {
                Editor.app.models.RevistasCategorias.destroyAll({revistaId: journalId}).then(() => {
                  Editor.app.models.Ridiomas.destroyAll({revistaId: journalId}).then(() => {
                    Editor.app.models.Rindexaciones.destroyAll({revistaId: journalId}).then(() => {
                      Editor.app.models.Revista.destroyById(journalId)
                    })
                  })
                })
              })
            })
          })
        })
        return callback(currenError)
      }
    }
    
    await Editor.app.models.Pais.findById(rubicacion.paisId).then(pais => {
      pais.updateAttributes({
        "hayrevista": 1
      })
    })
    callback(null, {  state: true })
  };
  Editor.remoteMethod(
    'postFullJournal', {
      accepts: [
        {
          "arg": "id",
          "type": "number",
          "required": true,
          "description": `Editor id`
        },
        {
        "arg": "models",
        "type": "any",
        "required": true,
        "description": `JSON con todos los models necesarios para insertar una revista completa`
        }
      ],
      http: {
        path: '/:id/postFullJournal',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Establece si se realizo la insercion correctamente"
      }
    }
  );


  Editor.myCfp = function (id, callback) {
    let query = `
      SELECT convocatoria.id, convocatoria.titulo, convocatoria.imagen, convocatoria.estado, revista.imagen AS journal_image 
      FROM editor, editorpropietario, convocatoria, revista 
      WHERE 
        editor.id = ${id} AND editor.id = editorpropietario.editor_id AND 
        editorpropietario.revista_id = revista.id AND 
        convocatoria.revistaId = revista.id AND
        convocatoria.fecha_final  >= "${(new Date(Date.now())).toISOString()}"
    `
    Editor.dataSource.connector.execute(query, [] , function (err, data) {
      if(!Array.isArray(data)){
        return callback(null, []);
      }
      return callback(null, data);
    } );
  }
  Editor.remoteMethod(
    'myCfp', {
      accepts: [
        {
          "arg": "id",
          "type": "number",
          "required": true,
          "description": `Editor id`
        }
      ],
      http: {
        path: '/:id/myCfp',
        verb: 'get'
      },
      returns: {
        arg: 'cfps',
        type: 'object',
        description: "Establece si se realizo la insercion correctamente"
      }
    }
  );


  Editor.revistasSuscritasConConvocatorias = function (id, callback) {
    let query = `
      SELECT DISTINCT revista.id, revista.issn, revista.eissn, revista.titulo, revista.titulo_corto
      FROM revista, editor, convocatoria, suscripcioneditorrevista
      WHERE 
        editor.id = ${id} AND editor.id = suscripcioneditorrevista.editor_id AND 
        suscripcioneditorrevista.revista_id = revista.id AND 
        convocatoria.estado = 1 AND
        convocatoria.revistaId = revista.id AND
        convocatoria.fecha_final  >= "${(new Date(Date.now())).toISOString()}"
    `
    Editor.dataSource.connector.execute(query, [] , function (err, data) {
      if(!Array.isArray(data)){
        return callback(null, []);
      }
      return callback(null, data);
    } );
  }
  Editor.remoteMethod(
    'revistasSuscritasConConvocatorias', {
      accepts: [
        {
          "arg": "id",
          "type": "number",
          "required": true,
          "description": `Editor id`
        }
      ],
      http: {
        path: '/:id/revistasSuscritasConConvocatorias',
        verb: 'get'
      },
      returns: {
        arg: 'revistas',
        type: 'object',
        description: "Retorna las revistas suscritas que cuentan con convocatorias activas."
      }
    }
  );

  Editor.createJournalProperty = async function (editorId, issn, callback) {
    let arg = {
      fields: ['id'],
      where: {
        or: [
          {
            issn: issn
          },
          {
            eissn: issn
          }
        ]
      }
    }
    try {
      const journalResponse = await Editor.app.models.Revista.find(arg)
      const journalId = journalResponse[0].id
      arg = {
        id: "",
        editorId: editorId,
        revistaId: journalId
      }
      const createJPropertyResponse = await Editor.app.models.EditorPropietario.create(arg)
      if (!(createJPropertyResponse && createJPropertyResponse.id)) {
        return callback(createJPropertyResponse)
      }
      return callback(null, {
        state: true
      })
    } catch (error) {
      return callback(error)
    }
  }
  Editor.remoteMethod(
    'createJournalProperty', {
      accepts: [
        {
          "arg": "editorId",
          "type": "number",
          "required": true,
          "description": `ID del editor.`
        },
        {
          "arg": "issn",
          "type": "text",
          "required": true,
          "description": `ISSN o EISSN de la revista.`
        }
      ],
      http: {
        path: '/:editorId/createJournalProperty',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Establece si se realizo la opercacion correctamente"
      }
    }
  );

};