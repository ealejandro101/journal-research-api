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
  Revista.filtrar = function(filtro, callback) {
    let jsonFilter = JSON.parse(JSON.stringify(filtro))
    let jsonFormat = {}
    if (Array.isArray(jsonFilter.include)) {
      jsonFormat = methods.returnFormat(jsonFilter)
    }
    // console.log("Formato de respuesta (Revista.js/Revista.filtrar): "+ JSON.stringify(jsonFormat));
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