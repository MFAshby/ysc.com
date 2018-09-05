'use strict';

const loopback = require('loopback');
const fs = require('fs');

const DATASOURCE_NAME = 'db';
const dataSourceConfig = require('./server/datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

async function discover() {
  // Discover models and relations
  const resultSchemas = await db.discoverSchemas('result', {relations: true});
  for (var key in resultSchemas) {
    if (resultSchemas.hasOwnProperty(key)) {
      var schema =resultSchemas[key];
      console.log(schema);
      fs.writeFileSync('common/models/' + key + '.json', 
	      JSON.stringify(schema, null, 2));
    }
  }
  // Create model definition files
  //fs.writeFileSync(
  //  'common/models/results.json',
   // JSON.stringify(resultSchemas['result'], null, 2)
  //);
}

discover().catch(e => console.log(e));
