//
// Entry point. Client of linkGetter.js. Define function that was called when
// links ready. Should define funcs to download files.
//

var fs = require('fs');
var request = require('request');
var linkGetter = require('./linkGetter.js');

var splitter = ';';

var exists_videos = [];
var dest_path = "videos";

function processLink(link, event_number, video_name) {
	if ( exists_videos.indexOf(event_number) == -1 ) {
		console.log("New video. Start downloading" + video_name);
		request(link).pipe( 
				fs.createWriteStream(dest_path + '/' + video_name + '.mp4') 
				);

		fs.appendFile('links', event_number + splitter + link + '\n');
	} 
	else { console.log('Exists, so skip:' + video_name ); }
}

// main processing. In readFile, couze its async. It's ALL async. >_<
fs.readFile('links', 'utf-8', function(err, data) { 
	if (err) throw err;
	var rows = data.split('\n');
	rows.map(function(e) { 
		var num = parseInt( e.split(splitter)[0] );
		if ( ! isNaN(num) ) {
			exists_videos.push(num); 
		}
	});
	console.log("Exists videos: " + exists_videos);
	console.log("Start searching...");
	linkGetter.onEach(processLink);
});


