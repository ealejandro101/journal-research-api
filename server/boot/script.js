/*var loopback = require('loopback');
var ds = loopback.createDataSource('db', {
    "host": "localhost",
    "database": "jasoluti_researchdb",
    "password": "",
    "name": "jasoluti_researchdb",
    "user": "root",
    "connector": "mysql"
});

// Discover and build models from INVENTORY table
ds.discoverAndBuildModels('convocatoria', {visited: {}, associations: false},
function (err, models) {
  // Now we have a list of models keyed by the model name
  // Find the first record from the inventory
  console.log(JSON.stringify(models.Convocatoria.definition));//imprime el modelo
});*/
module.exports = function(app) {
  let Editor = app.models.Editor
  let Role = app.models.Role;
  let RoleMapping = app.models.RoleMapping;

  Editor.findById(3, function (err, user) {
    Role.create({
      name: 'admin'
    }, function(err, role) {
      if (err) throw err;
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: user.id
      }, function(err, principal) {
        if (err) throw err;
        console.log('Created principal:', principal);
      });
    });
  })
}