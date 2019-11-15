module.exports = function(PalabraClave) {

  PalabraClave.busqueda = function(q, callback) {
    if (q.length < 3) {
      return callback(null, []);
    }
    let query = `
      SELECT DISTINCT palabraclave.* 
      FROM palabraclave 
      WHERE palabraclave.palabra_clave LIKE "%${q}%"
        `
    PalabraClave.dataSource.connector.execute(query, [] , function (err, data) {
      if(data === undefined){
        return callback(null, []);
      }
      callback(null, data);
    })
  };


  

  PalabraClave.remoteMethod(
    'busqueda', {
      http: {
        path: '/busqueda',
        verb: 'get'
      },
      accepts: [{
        "arg": "word",
        "type": "string",
        "required": true,
        "description": `str`
      }],
      returns: {
        arg: 'words',
        type: 'object',
        description: "Lista de las palabras que coincidan"
      }
    }
  );
};
