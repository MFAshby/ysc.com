'use strict';

const loopback = require('loopback');
const fs = require('fs');

const DATASOURCE_NAME = 'db';
const dataSourceConfig = require('./server/datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

function extractModels(schemas) {
  for (var key in schemas) {
    if (schemas.hasOwnProperty(key)) {
      var schema =schemas[key];
      fs.writeFileSync('common/models/' + key + '.json', 
	                     JSON.stringify(schema, null, 2));
    }
  }
}

async function discover() {
  // Discover models and relations
  // const resultSchemas = await db.discoverSchemas('result', {relations: true});
  // extractModels(resultSchemas);
  const userSchemas = await db.discoverSchemas('user', {relations: true});
  extractModels(userSchemas);
}

discover().catch(e => console.log(e));
