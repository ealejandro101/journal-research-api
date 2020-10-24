module.exports = function (PalabraClave) {


  PalabraClave.getIdsByKeywords = async function (keywords, callback) {
    const arr = keywords?keywords.toString().split(';'):[]
    let keywordIds = []
    for (const iterator of arr) {
      let wordId = undefined
      try {
        const response = await PalabraClave.find({
          where: {
            palabraClave: iterator.trim()
          }
        })
        if (response.length > 0) {
          wordId = response[0].id
        }
      } catch (error) {
        console.log(error);
      }
      if (wordId === undefined) {
        try {
          const response = await PalabraClave.create({
            id: "",
            palabraClave: iterator.trim()
          })
          console.log(response);
          wordId = response.id
        } catch (error) {
          console.log(error);
        }
      }
      keywordIds.push(wordId)
    }
    return callback(null, { ids: keywordIds })
  };
  PalabraClave.remoteMethod(
    'getIdsByKeywords', {
    http: {
      path: '/getIdsByKeywords',
      verb: 'get'
    },
    accepts: [{
      "arg": "keywords",
      "type": "string",
      "required": true,
      "description": `Palabras clave separadas por (;)`
    }],
    returns: {
      arg: 'ids',
      type: 'object',
      description: "Lista ids de las palabras clave."
    }
  }
  );


  PalabraClave.busqueda = function (q, callback) {
    if (q.length < 3) {
      return callback(null, []);
    }
    let query = `
      SELECT DISTINCT palabraclave.* 
      FROM palabraclave 
      WHERE palabraclave.palabra_clave LIKE "%${q}%"
        `
    PalabraClave.dataSource.connector.execute(query, [], function (err, data) {
      if (data === undefined) {
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
