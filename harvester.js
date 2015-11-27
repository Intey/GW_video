//
// Entry point. Client of linkGetter.js. Define function that was called when 
// links ready. Should define funcs to download files.
//


var fs = require('fs');
var request = require('request');
var linkGetter = require('./linkGetter.js')

// when 1 link fetched, call given function
linkGetter.onEach(function(link, filename) { 
	console.log(link);
	// request(link).pipe(fs.createWriteStream(filename));
});

// when all 'tasks' is done - call function
// linkGetter.onAll(function(links, names) {
// 	console.log(links);
// 	console.log(names);
// });

