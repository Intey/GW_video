//
// Entry point. Client of linkGetter.js. Define function that was called when 
// links ready. Should define funcs to download files.
//

var fs = require('fs');
var request = require('request');
var linkGetter = require('./linkGetter.js')

// when 1 link fetched, call given function
linkGetter.onEach(function(link, filename) { 
	request(link).pipe(fs.createWriteStream(filename));
	return "OK!";
});

// when all 'tasks' is done - call function
linkGetter.onAll(function(links, names) {
	console.log(links);
	console.log(names);
});

