module.exports = function(Revista) {
  /**
   * Retorna un listado de revistas que coinciden con la busqueda
   * @param {string} q Cadena de caracter para buscar por diferentes campos
   * @param {Function(Error, object)} callback
   */

  Revista.busqueda = function(q, callback) {
    var revistas = "hola";
    // TODO
    callback(null, revistas);
  };
};
