module.exports = function (Disciplina) {
  Disciplina.used = function (callback) {
    let query = `
      SELECT DISTINCT disciplina.* 
      FROM disciplina, radicional 
      WHERE 
        radicional.disciplina_id = disciplina.id OR 
        radicional.disciplina_id1 = disciplina.id OR 
        radicional.disciplina_id2 = disciplina.id OR 
        radicional.disciplina_id3 = disciplina.id
    `
    Disciplina.dataSource.connector.execute(query, [] , function (err, data) {
      if(data === undefined){
        return callback(null, []);
      }
      return callback(null, data);
    })
  };
  Disciplina.remoteMethod(
    'used', {
    accepts: [],
    http: {
      path: '/used',
      verb: 'get'
    },
    returns: {
      arg: 'disciplinas',
      type: 'any',
      description: "Array de disciplinas"
    }
  }
  );
};