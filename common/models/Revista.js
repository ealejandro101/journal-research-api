let axios = require("axios");
let convert = require('xml-js');
let crossrefTools =  require('./../../server/tools/crossref.js')
let CryptoJS = require('crypto-js')

module.exports = function(Revista) {
  let methods = {
    /* Segun el SCOPE segun la documentacion de LoopBack v3, retorna el formato que debe de tener cada
      JSON del resultado de la consulta, unicamente toma los includes, esto con el fin de validar que este atributo este
      en cada JSON, si no esta es porque no cumple la condicion del filtro */
    returnFormat (scope){
      let format = {}
      if(scope.include === undefined || scope.include === null || !Array.isArray(scope.include)){
        return format
      }
      for (const iterator of scope.include) {
        if (iterator.scope !== undefined && iterator.scope !== null) {
          format[iterator.relation] = methods.returnFormat(iterator.scope)
        } else {
          format[iterator.relation] = {}
        }
      }
      return format
    },
    /* Valida que sea valido el formato del JSON segun otro json, si es una arreglo y es vacio tambien se sabe que no cumple y por lo tanto retorna false */
    isFormatValid (format, object){
      let jsonObject = JSON.parse(JSON.stringify(object))
      for (const key in format) {
        if(jsonObject[key] === undefined || jsonObject[key] === null){
          return false
        }
        if(Array.isArray(jsonObject[key]) && jsonObject[key].length === 0){
          return false
        }
        if(!methods.isFormatValid(format[key], jsonObject[key])){
          return false
        }
      }
      return true;
    }
  }

  /**
   * Retorna un listado de revistas que coinciden con la busqueda
   * @param {string} q Cadena de caracter para buscar por diferentes campos
   * @param {Function(Error, object)} callback
   */
  Revista.busqueda = function(q, callback) {
    if (q.length < 3) {
      return callback(null, []);
    }
    let query = `
      SELECT DISTINCT revista.* 
      FROM revista 
      WHERE 
        revista.esta_activa = 1 AND (
        revista.titulo LIKE "%${q}%" OR
        revista.titulo_corto LIKE "%${q}%" OR
        revista.subtitulo LIKE "%${q}%" OR
        revista.descripcion LIKE "%${q}%")
      ORDER BY CASE 
        WHEN revista.titulo LIKE "${q.substr(0, 3)}%" then 1 
        else 2
      END
        `
    Revista.dataSource.connector.execute(query, [] , function (err, data) {
      if(data === undefined){
        return callback(null, []);
      }
      callback(null, data);
    })
    //OLD
    /*var filter = {
      "where":{
        "or":
        [
          {"descripcion": {"regexp":q+"/i"} },
          {"titulo": {"regexp":q+"/i"} },
          {"tituloCorto": {"regexp":q+"/i"} },
          {"subtitulo": {"regexp":q+"/i"} }
        ]
      }
    };
    Revista.find(filter, function(err, instance) {
      revistas = instance;
      callback(null, revistas);
    });*/
  };

  /* Realiza un filtro como Loopback v3 con include, solo que convierte la consulta "LEFT JOIN" a "JOIN" */
  Revista.filtrar = function(body, callback) {
    let filtro = body.filters
    let extra = body.extra

    let sentences = {
      revista: {
        sentence: ''
      },
      revistascategorias: {
        sentence: 'revista.id = revistascategorias.revista_id'
      },
      convocatoria: {
        sentence: 'revista.id = convocatoria.revistaId'
      },
      radicional: {
        sentence: 'revista.id = radicional.id'
      },
      rcontacto: {
        sentence: 'revista.id = rcontacto.id'
      },
      ridiomas: {
        sentence: 'revista.id = ridiomas.revista_id'
      },
      rindexaciones: {
        sentence: 'revista.id = rindexaciones.revista_id'
      },
      rubicacion: {
        sentence: 'revista.id = rubicacion.id'
      },
      estado: {
        sentence: 'revista.id = rubicacion.id AND ciudad.id = rubicacion.ciudad_id AND ciudad.state_id = estado.id',
        models: [
          'rubicacion', 'ciudad', 'estado'
        ]
      },
      palabrasclave: {
        sentence: 'revista.id = palabrasclave.revista_id AND palabrasclave.palabra_clave_id = palabraclave.id',
        models: [
          'palabrasclave', 'palabraclave'
        ]
      }
    }
    let baseSQL = 'SELECT DISTINCT revista.*'
    let from = 'revista'
    let where = 'revista.esta_activa = 1'
    for (const iterator of filtro) {
      if ((iterator.response && iterator.response.length > 0)  || (iterator.customQuery && iterator.customQuery.length > 0 ) ) {
        //Se incluye la tabla del filtro en la query
        if (Array.isArray(sentences[iterator.model].models)) {
          for (const model of sentences[iterator.model].models) {
            if (!from.includes(model)) {
              from += `, ${model}`
            }
          }
        }else if(!from.includes(iterator.model)) {
          from += `, ${iterator.model}`
        }
        //Se incluye la sentencia where base para hacer el Join entre las tablas
        if (!where.includes(sentences[iterator.model].sentence)) {
          if (where.length != 0) {
            where += ' AND '
          }
          where += sentences[iterator.model].sentence
        }
        //Si el filtro es sensillo
        if (iterator.response && iterator.response.length > 0) {
          if (where.length != 0) {
            where += ' AND '
          }
          where += ' ( '
          for (const res of iterator.response) {
            if (Array.isArray(iterator.attribute)) {
              for (const attr of iterator.attribute) {
                where += `${iterator.model}.${attr} = ${res} OR  `
              }
            }else{
              where += `${iterator.model}.${iterator.attribute} = ${res} OR  `
            }
          }
          where = where.substring(0, where.length - 5)
          where += ' ) '
        }
        if (iterator.customQuery && iterator.customQuery.length > 0) {//Si el filtro es personalizado
          if (where.length != 0) {
            where += ' AND '
          }
          where += ' ( '
          for (const res of iterator.customQuery) {
            where += `${res.model?res.model:iterator.model}.${res.attribute} ${res.operator} ${res.value} ${res.isOr?'OR ':'AND'} `
          }
          where = where.substring(0, where.length - 5)
          where += ' ) '
        }
      }
    }
    let query = baseSQL + ' FROM ' + from + (where?' WHERE ' + where:'') + (extra.order?' ORDER BY ' + extra.order:'') + (extra.limit?' LIMIT ' + extra.limit:'') + (extra.limit && extra.page?' OFFSET ' + (extra.limit * (extra.page - 1)):'')
    console.log(query);
    
    Revista.dataSource.connector.execute(query, [] , function (err, data) {
      if(!Array.isArray(data)){
        return callback(null, []);
      }
      callback(null, data);
    } );
  };


  /* Realiza un filtro como Loopback v3 con include, solo que convierte la consulta "LEFT JOIN" a "JOIN" */
  Revista.filtrarOLD = function(filtro, callback) {
    let jsonFilter = JSON.parse(JSON.stringify(filtro))
    let jsonFormat = {}
    if (Array.isArray(jsonFilter.include)) {
      jsonFormat = methods.returnFormat(jsonFilter)
    }
    Revista.find(jsonFilter, function(err, instance) {
      let response = []
      for (const iterator of instance) {
        if (methods.isFormatValid(jsonFormat, iterator)) {
          response.push(iterator)
        }
      }
      revistas = response;
      callback(null, revistas);
    });
  };

  Revista.updateFullJournal = async function(revistaId, models, callback) {
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
    let revisaPalabrasCreated = []

    revista.fechaCreacion = (new Date(new Date().setFullYear(revista.fechaCreacion))).toISOString()
    revista.fechaIngreso = new Date().toISOString()

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
      try {
        const response = await Revista.find({where: {or: orQuery}})
        if (response.length && response[0].id !== revista.id) {
          return callback({
            message: 'El EISSN o ISSN ya se encuentra en la base de datos de Dardo.'
          })
        }
      } catch (error) {
        console.log(error);
        return callback(error)
      }
    }
    await Revista.app.models.Revista.replaceById(revistaId, revista).then(response => {
      revistaId = response.id
    }).catch(error => {
      currenError = error
      isError = true
    })
    if(isError) return callback(currenError)

    
    radicional.id = revistaId
    await Revista.app.models.Radicional.replaceById(revistaId, radicional).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }

    rcontactos.id = revistaId
    await Revista.app.models.Rcontacto.replaceById(revistaId, rcontactos).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }

    rubicacion.id = revistaId
    await Revista.app.models.Rubicacion.replaceById(revistaId, rubicacion).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }

    let categories = []
    for (const categoriaId of revistascategorias.categories) {
      categories.push({
        "id": "",
        "categoriaId": categoriaId,
        "revistaId": revistaId
      })
    }

    await Revista.app.models.RevistasCategorias.destroyAll({
      revistaId: revistaId
    })
    await Revista.app.models.RevistasCategorias.create(categories).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }

    let idiomas = []
    for (const idiomaId of ridiomas.idiomas) {
      idiomas.push({
        "id": "",
        "idiomaId": idiomaId,
        "revistaId": revistaId
      })
    }
    await Revista.app.models.Ridiomas.destroyAll({
      revistaId: revistaId
    })
    await Revista.app.models.Ridiomas.create(idiomas).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }

    let indexaciones = []
    for (const indexacionId of rindexaciones.indexaciones) {
      indexaciones.push({
        "id": "",
        "indexacionesId": indexacionId,
        "revistaId": revistaId,
        "parametro": rindexaciones[`parameter-${indexacionId}`]
      })
    }
    await Revista.app.models.Rindexaciones.destroyAll({
      revistaId: revistaId
    })
    await Revista.app.models.Rindexaciones.create(indexaciones).catch(error => {
      currenError = error
      isError = true
    })
    if(isError){
      return callback(currenError)
    }
    try {
      let x = await new Promise((resolve, reject) => {
      Revista.app.models.Palabraclave.getIdsByKeywords(rpalabraclave.palabrasclave, (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })
      const currentKeywords = await Revista.app.models.Palabrasclave.find({
        where: {
          revistaId
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
        const created = await Revista.app.models.Palabrasclave.create({
          id: '',
          palabraClaveId: wordId,
          revistaId
        })
        revisaPalabrasCreated.push(created)
      }
    } catch (error) {
      revisaPalabrasCreated.forEach(item => {
        item.destroy()
      })
    }

    

    await Revista.app.models.Pais.findById(rubicacion.paisId).then(pais => {
      pais.updateAttributes({
        "hayrevista": 1
      })
    })
    callback(null, {  state: true })
  };

  Revista.hasCrossref = function(journalId, callback) {
    Revista.app.models.Radicional.findById(journalId).then(radicional => {
      let crossref = radicional.crossref
      if (!crossref) {
        return callback(null, false)
      }
      return callback(null, true)
    })
  };

  Revista.updateCrossref = function(journalId, crossref, callback){
    let decryptedCrossref = crossref
    Revista.app.models.Radicional.findById(journalId).then(radicional => {
      let encryptedCrossref = CryptoJS.AES.encrypt(decryptedCrossref, process.env.CROSSREF_SECRET).toString();
      radicional.crossref = encryptedCrossref
      radicional.save().then(() => {
        callback(null, true)
      }).catch(() => {
        callback(null, false)
      })
    }).catch(() => {
      callback(null, false)
    })
  }

  Revista.getArticles = function(journalId, dateRange, callback) {
    if (!dateRange.startDate || !dateRange.endDate) {
      return callback(true, { error: 'El rango de fechas ingresado no es valido' })
    }
    let startDate = new Date(dateRange.startDate)
    let endDate = new Date(dateRange.endDate)
    if (endDate.getTime() <= startDate.getTime()) {
      return callback(true, { error: 'El rango de fechas ingresado no es valido' })
    }
    Revista.findById(journalId, {
      include: 'infoAdicional',
      fields: ['id', 'doi']
    }).then(response => {
      let revista = JSON.parse(JSON.stringify(response))
      let bytesCrossref = CryptoJS.AES.decrypt(revista.infoAdicional.crossref.toString(), process.env.CROSSREF_SECRET);
      let decryptedCrossref = bytesCrossref.toString(CryptoJS.enc.Utf8);
      let crossref = decryptedCrossref
      if (!crossref) {
        return callback(null, { error: 'No tiene registrado el Crossref' })
      }
      crossref += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      axios.get(crossref).then(response => {
        let dataJson = convert.xml2json(response.data, {compact: true, spaces: 4});
        let articles = JSON.parse(dataJson).crossref_result.query_result.body.forward_link
        let result = []
        let iterablePv = articles || []
        for (const iterator of iterablePv) {
          if (iterator._attributes.doi.toString().includes(revista.doi)) {
            let doi = `https://doi.org/${iterator._attributes.doi}`
            if (iterator.journal_cite) {
              let authors = crossrefTools.getAuthors(iterator.journal_cite.contributors.contributor)
              let year = iterator.journal_cite.year._text
              let articleTitle = iterator.journal_cite.article_title._text
              let journalTitle = iterator.journal_cite.journal_title._text
              let doiRef = `https://doi.org/${iterator.journal_cite.doi._text}`
              result.push(`<span>Doi: ${doi}</span><br /><span>${authors} (${year}). ${articleTitle}, <i>${journalTitle}</i>. <a href="${doiRef}" target="_blank">${doiRef}</a></span>`)
            }
          }
        }
        callback(null, result)
      }).catch(err => {
        callback(err, [])
      })
    })
  };

  Revista.remoteMethod(
    'hasCrossref', {
      accepts: [
        {
          "arg": "revistaId",
          "type": "number",
          "required": true,
          "description": `Joyrnal id`
        }
      ],
      http: {
        path: '/:revistaId/hasCrossref',
        verb: 'get'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Boolean"
      }
    }
  );

  Revista.remoteMethod(
    'updateCrossref', {
      accepts: [
        {
          "arg": "revistaId",
          "type": "number",
          "required": true,
          "description": `Joyrnal id`
        },
        {
          "arg": "crossref",
          "type": "any",
          "required": true,
          "description": "Crossref"
        }
      ],
      http: {
        path: '/:revistaId/updateCrossref',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Boolean"
      }
    }
  );

  Revista.remoteMethod(
    'getArticles', {
      accepts: [
        {
          "arg": "revistaId",
          "type": "number",
          "required": true,
          "description": `Joyrnal id`
        },
        {
          "arg": "dateRange",
          "type": "any",
          "required": true,
          "description": "JSON {startDate: [x],endDate: [y]}"
        }
      ],
      http: {
        path: '/:revistaId/getArticles',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Lista de articulos"
      }
    }
  );

  Revista.remoteMethod(
    'updateFullJournal', {
      accepts: [
        {
          "arg": "revistaId",
          "type": "number",
          "required": true,
          "description": `Joyrnal id`
        },
        {
        "arg": "models",
        "type": "any",
        "required": true,
        "description": `JSON con todos los models necesarios para insertar una revista completa`
        }
      ],
      http: {
        path: '/:revistaId/updateFullJournal',
        verb: 'post'
      },
      returns: {
        arg: 'state',
        type: 'object',
        description: "Establece si se realizo la insercion correctamente"
      }
    }
  );

  Revista.remoteMethod(
    'filtrar', {
      http: {
        path: '/filtrar',
        verb: 'post'
      },
      accepts: [{
        "arg": "filtro",
        "type": "any",
        "required": true,
        "description": `El campo debe de tener un array`
      }],
      returns: {
        arg: 'revistas',
        type: 'object',
        description: "Lista las revistas que cumplen estrictamente con la condición, incluye las condiciones de los modelos relacionados"
      }
    }
  );

  Revista.remoteMethod(
    'filtrarOLD', {
      http: {
        path: '/filtrarOLD',
        verb: 'get'
      },
      accepts: [{
        "arg": "filtro",
        "type": "Object",
        "required": true,
        "description": `El campo debe de tener un JSON con los estándares de los filtros de la documentación de loopback v3,
                        con las condiciones: 1) El atributo include debe de ser un arreglo de JSONs; 2) el atributo include 
                        debe de estar en la raiz del JSON o hijo de un atributo SCOPE 3) Cada JSON del array INCLUDE debe de
                         tener un atributo "relation", este servicio lista las revistas que cumplen estrictamente con la 
                         condición haciendo enfasis en las condiciones de otros modelos 4) Si el filtro es por ID se debe 
                         de hacer con un "OR", no se sabe porque, error de loopback. example: 
                         {"include": [{"relation": "[relation1]","scope": {"fields": ["[attribute1]" ],"where": {"[attribute1]": "[value1]"}}},{"relation": "[relation2]"}]}`
      }],
      returns: {
        arg: 'revistas',
        type: 'object',
        description: "Lista las revistas que cumplen estrictamente con la condición, incluye las condiciones de los modelos relacionados"
      }
    }
  );
};
