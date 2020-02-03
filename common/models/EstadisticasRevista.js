
module.exports = function(EstadisticasRevista) {

  EstadisticasRevista.addJournalInteraction = function(journalId, interaction, callback) {
    let dateAux = new Date(Date.now())
    let period = `${dateAux.getFullYear()}-${dateAux.getMonth() + 1}`
    let register = {
      "id": "",
      "revistaId": journalId,
      "periodo": period,
      "nroVisitas": 0,
      "clicksIndexaciones": 0,
      "clicksDoi": 0,
      "clicksCorreo": 0,
      "clicksSitioweb": 0,
      "clicksGuiaAutores": 0,
      "clicksRedes": 0
    }
    EstadisticasRevista.find({where: { periodo: period, revistaId: journalId }}).then(response => {
      if (response.length == 0) {//En el periodo actual no hay registros
        register[interaction] = 1
        EstadisticasRevista.create(register).then(() => {
          return callback(null, true)
        }).catch(errPost => {
          return callback(null, { err: errPost })
        })
      }else{//En el periodo actual hay registros
        let currentStatistics = response[0]
        currentStatistics[interaction]++
        currentStatistics.save().then(() => {
          return callback(null, true)
        }).catch(err => {
          return callback(null, { err })
        })
        
      }
    }).catch(err => {
      return callback(null, { err })
    })
  }

  EstadisticasRevista.remoteMethod(
    'addJournalInteraction', {
      accepts: [
        {
          "arg": "journalId",
          "type": "number",
          "required": true,
          "description": `Joyrnal id`
        },
        {
          "arg": "interaction",
          "type": "string",
          "required": true,
          "description": "Attribute of -EstadisticasResvista- model"
        }
      ],
      http: {
        path: '/:journalId/addJournalInteraction',
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
