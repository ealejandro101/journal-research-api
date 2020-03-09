module.exports = function (Pais) {
  Pais.getStatistics = function (callback) {
    let query = `
      SELECT DISTINCT 
        pais.*, 
        SUM(estadisticasrevista.nroVisitas) AS nro_Visitas, 
        SUM(estadisticasrevista.clicksIndexaciones + 
          estadisticasrevista.clicksDoi + 
          estadisticasrevista.clicksCorreo + 
          estadisticasrevista.clicksSitioweb + 
          estadisticasrevista.clicksGuiaAutores + 
          estadisticasrevista.clicksRedes) 
        AS nro_interactions 
      FROM 
        rubicacion, 
        ciudad, 
        estado, 
        pais, 
        estadisticasrevista 
      WHERE 
        rubicacion.ciudad_id = ciudad.id AND 
        ciudad.state_id = estado.id AND 
        estado.country_id = pais.id AND 
        estadisticasrevista.id = rubicacion.id 
      GROUP BY 
        pais.id
    `
    Pais.dataSource.connector.execute(query, [] , function (err, data) {
      if(!Array.isArray(data)){
        return callback(null, {});
      }
      return callback(null, data);
    } );
  };
  Pais.remoteMethod(
    'getStatistics', {
    accepts: [],
    http: {
      path: '/getStatistics',
      verb: 'get'
    },
    returns: {
      arg: 'statistics',
      type: 'object',
      description: "Estadísticas del sitio web"
    }
  }
  );
}