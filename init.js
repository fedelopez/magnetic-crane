var fs = require('fs');

fs.createReadStream('./node_modules/d3/d3.js').pipe(fs.createWriteStream('./src/js/d3.js'));