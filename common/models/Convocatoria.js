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
    Convocatoria.add = function(convocatoria, callback) {
      let urlImg = `convocatorias/${convocatoria.revistaId}/convocatoriaId/image.`+convocatoria.imagen.substring(convocatoria.imagen.indexOf('/') + 1, convocatoria.imagen.indexOf(';base64'))
      let urlPdf = `convocatorias/${convocatoria.revistaId}/convocatoriaId/doc.`+convocatoria.documentoPdf.substring(convocatoria.documentoPdf.indexOf('/') + 1, convocatoria.documentoPdf.indexOf(';base64'))
      if (convocatoria.imagen && convocatoria.documentoPdf) {
        Convocatoria.upsert({
          "id": convocatoria.id,
          "descripcion": convocatoria.descripcion,
          "fechaInicio": convocatoria.fechaInicio,
          "fechaFinal": convocatoria.fechaFinal,
          "titulo": convocatoria.titulo,
          "imagen": urlImg,
          "video": convocatoria.video,
          "documentoPdf": urlPdf,
          "link": convocatoria.link,
          "revistaId": convocatoria.revistaId
        }, function (err, convocatoriaCreated) {
          if (err) {
            console.log(err);
            return callback(true, { error: {message: 'Error al ingresar la convocatoria'}})
          }
          mkdirp(`client/convocatorias/${convocatoria.revistaId}/${convocatoriaCreated.id}/`, function(err) {
            if (err && err.code !== 'EEXIST') {
              convocatoriaCreated.destroy()
              return callback(err, { error: {message: 'Error crear la carpeta asociada a la convocatoria en el servidor'}}); // something else went wrong
            }
            fs.writeFile('client/'+urlImg.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.imagen.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
              if (err) {
                console.log(err);
                convocatoriaCreated.destroy()
                return callback(true, { error: {message: 'Error al guardar la imagen'}})
              }
              fs.writeFile('client/'+urlPdf.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.documentoPdf.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
                if (err) {
                  console.log(err);
                  convocatoriaCreated.destroy()
                  return callback(true, { error: {message: 'Error al guardar el documento'}})
                }
                return callback(null, convocatoriaCreated)
              });
            });
          });
        })
      }else if (convocatoria.imagen) {
        Convocatoria.upsert({
          "id": convocatoria.id,
          "descripcion": convocatoria.descripcion,
          "fechaInicio": convocatoria.fechaInicio,
          "fechaFinal": convocatoria.fechaFinal,
          "titulo": convocatoria.titulo,
          "imagen": urlImg,
          "video": convocatoria.video,
          "documentoPdf": null,
          "link": convocatoria.link,
          "revistaId": convocatoria.revistaId
        }, function (err, convocatoriaCreated) {
          if (err) {
            console.log(err);
            return callback(true, { error: {message: 'Error al guardar la convocatoria'}})
          }
          mkdirp(`client/convocatorias/${convocatoria.revistaId}/${convocatoriaCreated.id}/`, function(err) {
            if (err && err.code !== 'EEXIST') {
              convocatoriaCreated.destroy()
              return callback(err, { error: {message: 'Error crear la carpeta asociada a la convocatoria en el servidor'}}); // something else went wrong
            }
            fs.writeFile('client/'+urlImg.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.imagen.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
              if (err) {
                console.log(err);
                convocatoriaCreated.destroy()
                return callback(true, { error: {message: 'Error al guardar la imagen'}})
              }
              return callback(null, convocatoriaCreated)
            })
          });
        })
        
      }else if (convocatoria.documentoPdf) {
        Convocatoria.upsert({
          "id": convocatoria.id,
          "descripcion": convocatoria.descripcion,
          "fechaInicio": convocatoria.fechaInicio,
          "fechaFinal": convocatoria.fechaFinal,
          "titulo": convocatoria.titulo,
          "imagen": null,
          "video": convocatoria.video,
          "documentoPdf": urlPdf,
          "link": convocatoria.link,
          "revistaId": convocatoria.revistaId
        }, function (err, convocatoriaCreated) {
          if (err) {
            console.log(err);
            return callback(true, { error: {message: 'Error al guardar la convocatoria'}})
          }
          mkdirp(`client/convocatorias/${convocatoria.revistaId}/${convocatoriaCreated.id}/`, function(err) {
            if (err && err.code !== 'EEXIST') {
              convocatoriaCreated.destroy()
              return callback(err, { error: {message: 'Error crear la carpeta asociada a la convocatoria en el servidor'}}); // something else went wrong
            }
            fs.writeFile('client/'+urlPdf.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.documentoPdf.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
              if (err) {
                console.log(err);
                convocatoriaCreated.destroy()
                return callback(true, { error: {message: 'Error al guardar el documento'}})
              }
              return callback(null, convocatoriaCreated)
            })
          });
        })
      }else{
        Convocatoria.upsert({
          "id": convocatoria.id,
          "descripcion": convocatoria.descripcion,
          "fechaInicio": convocatoria.fechaInicio,
          "fechaFinal": convocatoria.fechaFinal,
          "titulo": convocatoria.titulo,
          "imagen": null,
          "video": convocatoria.video,
          "documentoPdf": null,
          "link": convocatoria.link,
          "revistaId": convocatoria.revistaId
        }, function (err, data) {
          if (err) {
            console.log(err);
            return callback(true, { error: {message: 'Error al guardar la convocatoria'}})
          }
          return callback(null, data)
        })
      }
    }


    Convocatoria.remoteMethod(
      'add', {
        http: {
          path: '/add',
          verb: 'post'
        },
        accepts: [{
          "arg": "Convocatoria",
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
  