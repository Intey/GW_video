//
// Entry point. Client of linkGetter.js. Define function that was called when
// links ready. Should define funcs to download files.
//

var fs = require('fs');
var request = require('request');
var linkGetter = require('./linkGetter.js');
var ProgressBar = require('progress');

var splitter = ';';

var exists_videos = [];
var dest_path = "videos";

function processLink(link, event_number, video_name) {
	if ( exists_videos.indexOf(event_number) == -1 ) {
		var bar = {};
		console.log("New video. Start downloading" + video_name);

		request(link)
		.on('response', function(res){
			console.log("New video! - " + video_name );
			var len = parseInt(res.headers['content-length'], 10);
			console.log();
			bar = new ProgressBar('Downloading [:bar] :percent :etas', {
				complete: '=',
				incomplete: ' ',
				width: 40,
				total: len
			})
		})
		.on('data', function(chunk) {
			bar.tick(chunk.length);
		})
		.on('error', function(err) {
			console.log(" === Error on download video === ");
			console.log(err);
		})
		.pipe( fs.createWriteStream(dest_path + '/' + video_name + '.mp4') );

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


