const fs = require('fs');
let mkdirp = require('mkdirp');
module.exports = function(Convocatoria) {
    let methods = {
    }
  
    /**
     * Retorna un listado de revistas que coinciden con la busqueda
     * @param {string} q Cadena de caracter para buscar por diferentes campos
     * @param {Function(Error, object)} callback
     */
    Convocatoria.add = async function(convocatoria, callback) {
      let urlImg = null
      let urlPdf = null
      if (convocatoria.imagen) {
        urlImg = `convocatorias/${convocatoria.revistaId}/convocatoriaId/image.`+convocatoria.imagen.substring(convocatoria.imagen.indexOf('/') + 1, convocatoria.imagen.indexOf(';base64'))
      }
      if (convocatoria.documentoPdf) {
        urlPdf = `convocatorias/${convocatoria.revistaId}/convocatoriaId/doc.`+convocatoria.documentoPdf.substring(convocatoria.documentoPdf.indexOf('/') + 1, convocatoria.documentoPdf.indexOf(';base64'))
      }
      let convocatoriaCreated
      try {
        convocatoriaCreated = await Convocatoria.upsert({
          "id": convocatoria.id,
          "descripcion": convocatoria.descripcion,
          "fechaInicio": convocatoria.fechaInicio,
          "fechaFinal": convocatoria.fechaFinal,
          "titulo": convocatoria.titulo,
          "imagen": urlImg,
          "video": convocatoria.video,
          "documentoPdf": urlPdf,
          "link": convocatoria.link,
          "revistaId": convocatoria.revistaId,
          "estado": 0
        })
        if (urlImg || urlPdf) {
          await mkdirp(`client/convocatorias/${convocatoria.revistaId}/${convocatoriaCreated.id}/`)
          if (urlImg) {
            await new Promise((resolve, reject) => {
              fs.writeFile('client/'+urlImg.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.imagen.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
                if (err) {
                  reject(err)
                }
                resolve(undefined)
              })
            })
          }
          if (urlPdf) {
            await new Promise((resolve, reject) => {
              fs.writeFile('client/'+urlPdf.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.documentoPdf.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
                if (err) {
                  reject(err)
                }
                resolve(undefined)
              })
            })
          }
        }
      } catch (error) {
        console.log(error);
        if (convocatoriaCreated.id) {
          convocatoriaCreated.destroy()
        }
        return callback(err, { error: {message: 'Error interno del servidor'}});
      }
      return callback(null, convocatoriaCreated)
    }

    Convocatoria.remoteMethod(
      'add', {
        http: {
          path: '/add',
          verb: 'post'
        },
        accepts: [{
          "arg": "convocatoria",
          "type": "Object",
          "required": true,
          "description": ``
        }],
        returns: {
          arg: 'convocatoria',
          type: 'object',
          description: "Lista las revistas que cumplen estrictamente con la condición, incluye las condiciones de los modelos relacionados"
        }
      }
    );
  };
  