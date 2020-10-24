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
    Convocatoria.add = async function(convocatoria, palabrasClave, callback) {
      let urlImg = null
      let urlPdf = null
      if (convocatoria.imagen) {
        urlImg = `convocatorias/${convocatoria.revistaId}/convocatoriaId/image.`+convocatoria.imagen.substring(convocatoria.imagen.indexOf('/') + 1, convocatoria.imagen.indexOf(';base64'))
      }
      if (convocatoria.documentoPdf) {
        urlPdf = `convocatorias/${convocatoria.revistaId}/convocatoriaId/doc.`+convocatoria.documentoPdf.substring(convocatoria.documentoPdf.indexOf('/') + 1, convocatoria.documentoPdf.indexOf(';base64'))
      }
      let convocatoriaCreated
      let convocatoriaPalabras = []
      try {
        convocatoriaCreated = await Convocatoria.upsert({
          id: convocatoria.id,
          descripcion: convocatoria.descripcion,
          fechaInicio: convocatoria.fechaInicio,
          fechaFinal: convocatoria.fechaFinal,
          titulo: convocatoria.titulo,
          imagen: urlImg,
          video: convocatoria.video,
          documentoPdf: urlPdf,
          link: convocatoria.link,
          revistaId: convocatoria.revistaId,
          estado: convocatoria.estado,
          editoresInvitados: convocatoria.editoresInvitados
        })
        if (urlImg || urlPdf) {
          const i = await mkdirp(`client/convocatorias/${convocatoria.revistaId}/${convocatoriaCreated.id}/`)
          if (urlImg) {
            await new Promise((resolve, reject) => {
              fs.writeFile('client/'+urlImg.replace('convocatoriaId', convocatoriaCreated.id), convocatoria.imagen.split(';base64,').pop(), {encoding: 'base64'}, function(err) {
                if (err) {
                  console.log(err);
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
        let x = await new Promise((resolve, reject) => {
          Convocatoria.app.models.Palabraclave.getIdsByKeywords(palabrasClave.palabrasclave, (err, data) => {
            if (err) {
              reject(err)
            }
            resolve(data)
          })
        })
        const currentKeywords = await Convocatoria.app.models.PalabraConvocatoria.find({
          where: {
            convocatoriaId: convocatoria.id
          }
        })
        const [keywordIdsForCreate, keywordIdsForDelete] = currentKeywords.reduce((accumulator, currentValue) => {
          const newForCreate = accumulator[0].filter(wordId => wordId !== currentValue.palabraId)
          let newForDelete = accumulator[1]
          if (accumulator[0].length === newForCreate.length) {
            newForDelete = accumulator[1].concat([currentValue])
          }
          return [newForCreate, newForDelete]
        }, [x.ids, []])
        for (const wordCreated of keywordIdsForDelete) {
          wordCreated.destroy()
        }
        for (const wordId of keywordIdsForCreate) {
          const created = await Convocatoria.app.models.PalabraConvocatoria.upsert({
            id: '',
            palabraId: wordId,
            convocatoriaId: convocatoriaCreated.id
          })
          convocatoriaPalabras.push(created)
        }
      } catch (error) {
        console.log(error);
        if (convocatoriaCreated.id) {
          convocatoriaCreated.destroy()
        }
        convocatoriaPalabras.forEach(convPalCreated => {
          convPalCreated.destroy()
        })
        return callback(error, { error: {message: 'Error interno del servidor'}});
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
        },
        {
          "arg": "palabrasClave",
          "type": "Object",
          "required": true,
          "description": `Palabras clave separadas por (;)`
        },
        ],
        returns: {
          arg: 'convocatoria',
          type: 'object',
          description: "Lista las revistas que cumplen estrictamente con la condición, incluye las condiciones de los modelos relacionados"
        }
      }
    );
  };
  