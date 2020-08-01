let CryptoJS = require('crypto-js')

module.exports = function (app) {
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

  let isAdmin = (req, res, next) => {
    if (!req.session.token) {
      res.status(401).send()
    } else {
      Role.isInRole('admin', { principalType: RoleMapping.USER, principalId: req.session.identifier }, function (err, isInRole) {
        if (isInRole) {
          next();
        } else {
          res.status(401).send()
        }
      })
    }
  };

  app.post('/api/custom/Editor/login', function (req, res) {
    Editor.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function (err, token) {
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

  app.get('/api/custom/Editor/isLogged', sessionChecker, function (req, res) {
    res.status(200).send({
      accessToken: req.session.token,
      identifier: req.session.identifier
    })
  })

  app.get('/api/custom/Editor/logout', sessionChecker, (req, res) => {
    res.clearCookie('user_sid');
    res.status(200).send();
  });

  app.post('/api/custom/Editor/register', (req, res) => {
    let editor = req.body
    Editor.create(editor).then(() => {
      res.status(200).send({
        created: true
      })
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        created: false,
        error: err
      })
    })
  });

  app.get('/api/custom/Editor/getFullObject', sessionChecker, (req, res) => {
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

  app.get('/api/custom/Roles/isAdmin', sessionChecker, function (req, res) {
    Role.isInRole('admin', { principalType: RoleMapping.USER, principalId: req.session.identifier }, function (err, isInRole) {
      res.status(200).send({
        isInRole
      })
    });
  })

  app.get('/api/custom/Admin/Statistics/Journal/getStatisticsInfo/:journalId', isAdmin, async function (req, res) {
    let journalId = req.params.journalId
    let EstadisticasRevista = app.models.EstadisticasRevista
    let Convocatoria = app.models.Convocatoria
    let journalStadistics = []
    let journalAnnouncements = []

    await EstadisticasRevista.find({
      where: {
        revistaId: journalId
      }
    }).then(stadistics => {
      journalStadistics = stadistics
    })
    await Convocatoria.find({
      where: {
        revistaId: journalId
      },
      fields: ['id', 'titulo', 'imagen', 'fechaInicio', 'fechaFinal', 'estado'],
      include: [{
        relation: 'estadisticas', // include the owner object
      }]
    }).then(announcements => {
      journalAnnouncements = announcements
    })
    res.status(200).send({
      journalStadistics,
      announcements: journalAnnouncements
    })
  })

  app.post('/api/custom/Admin/Statistics/getGeneralStatistics', isAdmin, function (req, res) {
    let EstadisticasRevista = app.models.EstadisticasRevista
    const QUERY = `
            SELECT 
                SUM(estadisticasrevista.nroVisitas) AS journalViews, 
                SUM(estadisticasconvocatoria.nroVisitas) AS announcementsViews 
            FROM estadisticasrevista, estadisticasconvocatoria
        `
    EstadisticasRevista.dataSource.connector.execute(QUERY, [], function (err, data) {
      if (!Array.isArray(data)) {
        return res.send({
          state: false,
          error: 'Error al consular las estadisticas generales.'
        });
      }
      return res.send({
        state: true,
        data: {
          journalViews: data[0].journalViews,
          announcementsViews: data[0].announcementsViews
        }
      });
    });
  })

  app.post('/api/custom/Admin/Statistics/getJournals', isAdmin, function (req, res) {
    let Revista = app.models.Revista
    const QUERY = `
      SELECT DISTINCT revista.id, revista.titulo 
      FROM revista, estadisticasrevista 
      WHERE revista.id = estadisticasrevista.revistaId
    `
    Revista.dataSource.connector.execute(QUERY, [], function (err, data) {
      if (!Array.isArray(data)) {
        return res.send({
          state: false,
          error: 'Error al consular las revistas que cuentan con estadisticas.'
        });
      }
      return res.send({
        state: true,
        data
      });
    });
  })

  app.post('/api/custom/Admin/Statistics/getPeriods', isAdmin, function (req, res) {
    let EstadisticasRevista = app.models.EstadisticasRevista
    let journalId =  req.body.journalId
    if (!journalId) {
      return res.status(400)
    }
    const QUERY = `
      SELECT 
        DISTINCT estadisticasrevista.periodo 
      FROM estadisticasrevista
      WHERE estadisticasrevista.revistaId = ${journalId}
    `
    EstadisticasRevista.dataSource.connector.execute(QUERY, [], function (err, data) {
      if (!Array.isArray(data)) {
        return res.send({
          state: false,
          error: 'Error al consular los periodos.'
        });
      }
      return res.send({
        state: true,
        data
      });
    });
  })

  /*app.post('/custom/Admin/encryptCrossref', function(req, res){
      let crossref = req.body.crossref
      let encryptedCrossref = CryptoJS.AES.encrypt(crossref, process.env.CROSSREF_SECRET).toString();
      res.status(200).send({
          crossref: encryptedCrossref
      })
  })*/

}