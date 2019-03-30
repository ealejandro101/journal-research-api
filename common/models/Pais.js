module.exports = function(Pais) {
    /*  */
    Pais.revistas = function(countryId, callback) {
        let filter = {
            where: {
                id: countryId
            },
            fields: ['id'],
            include: [
                {
                    relation: 'estados',
                    scope: {
                        fields: ['id'],
                        include: [
                            {
                                relation: 'ciudades',
                                scope: {
                                    fields: ['id'],
                                    include: [
                                        {
                                            relation: 'rubicaciones',
                                            scope: {
                                                fields: ['id'],
                                                include: [
                                                    {
                                                        relation: 'revista',
                                                    }
                                                ]
                                            },
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
        Pais.find(filter, function(err, instance) {
            let response = []
            if (err) {
                return callback(err);
            }
            if(instance.length === 0){
                callback(null, response);
            }
            for (const estado of JSON.parse(JSON.stringify(instance[0])).estados) {
               for (const ciudad of estado.ciudades) {
                   if (ciudad.rubicaciones.length > 0) {
                       for (const revista of ciudad.rubicaciones) {
                            response.push(revista.revista)
                       }
                       
                   }
               }
            }
            callback(null, response);
        });
    };
  
    Pais.remoteMethod(
      'revistas', {
        http: {
          path: '/revistas',
          verb: 'get'
        },
        accepts: [{
          "arg": "countryId",
          "type": "Number",
          "required": true,
          "description": `Id del pais`
        }],
        returns: {
          arg: 'revistas',
          type: 'object',
          description: "Lista las revistas que sean del pais dado"
        }
      }
    );
  };
  