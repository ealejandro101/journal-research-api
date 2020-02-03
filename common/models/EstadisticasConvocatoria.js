
module.exports = function(EstadisticasConvocatoria) {

  EstadisticasConvocatoria.addAnnouncementInteraction = function(announcementId, interaction, callback) {
    let register = {
      "id": announcementId,
      "nroVisitas": 0,
      "clicksConvocatoria": 0,
      "descargasPdf": 0,
      "clicksCorreo": 0,
      "clicksSitioweb": 0,
      "clicksGuiaAutores": 0
    }
    EstadisticasConvocatoria.findById(announcementId).then(currentRegister => {
      if (!currentRegister) {
        register[interaction] = 1
        EstadisticasConvocatoria.create(register).then(() => {
          return callback(null, true)
        }).catch(errPost => {
          return callback(null, { err: errPost })
        })
      }else{
        currentRegister[interaction]++
        currentRegister.save().then(() => {
          return callback(null, true)
        }).catch(err => {
          return callback(null, { err })
        })
      }
    }).catch(err => {
      return callback(null, { err })
    })
  }

  EstadisticasConvocatoria.remoteMethod(
    'addAnnouncementInteraction', {
      accepts: [
        {
          "arg": "announcementId",
          "type": "number",
          "required": true,
          "description": `Announcement id`
        },
        {
          "arg": "interaction",
          "type": "string",
          "required": true,
          "description": "Attribute of -EstadisticasConvocatoria- model"
        }
      ],
      http: {
        path: '/:announcementId/addAnnouncementInteraction',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: ""
      }
    }
  );
};
