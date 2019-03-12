module.exports = function(Revista) {
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
};
