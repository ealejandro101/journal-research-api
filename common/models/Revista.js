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
    var filter = {
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
    });
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
        sentence: 'revista.id = palabrasclave.revista_id',
      }
    }
    let baseSQL = 'SELECT DISTINCT revista.*'
    let from = 'revista'
    let where = ''
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
            where += `${iterator.model}.${res.attribute} ${res.operator} ${res.value} ${res.isOr?'OR ':'AND'} `
          }
          where = where.substring(0, where.length - 5)
          where += ' ) '
        }
      }
    }
    let query = baseSQL + ' FROM ' + from + (where?' WHERE ' + where:'') + (extra.order?' ORDER BY ' + extra.order:'') + (extra.limit?' LIMIT ' + extra.limit:'') + (extra.limit && extra.page?' OFFSET ' + (extra.limit * (extra.page - 1)):'')
    console.log(query);
    
    Revista.dataSource.connector.execute(query, [] , function (err, data) {
      if(data === undefined){
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
