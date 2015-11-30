//
// Common fetcher. Contain function, for process site.
//


var fs = require('fs');
var request = require('request');
request = request.defaults({jar:true});
var cheerio = require('cheerio');

var url = 'http://geekbrains.ru/';
var events_page_url = url + 'events/';
var test_event_url = events_page_url + '163';

Parser = {
	CLIENT_callback: function(link, number, videoName) {
		console.log(number + ";" + link);
	},

	getVideoLink: function(e, res, body) {
		var cookies = res['headers']['set-cookie'][0];
		var options = { url: events_page_url, headers: { 'Cookie': cookies } };
		request(options, function(e, res, body) {
			var links = [];
			var $ = cheerio.load(body);
		   	$("#all>div>a").each(function(i, e) {
				// parse event number from link like: '/event/123'. Get last part
				var event_number = parseInt($(e).attr('href').split('/').reverse()[0]);
				// slice for delete first '/': url already contains this
				var link = url + $(e).attr('href').slice(1) + '/attendee';
				options.url = link;
				delete $; // cleaning <3
				// processing page with video
				if ( event_number >= 144 && event_number <= 197) {
					request(options, function(e, res, body){
						var $ = cheerio.load(body);
						var video_link = $("video > source").attr('src');
						var video_name = $("h1.h3").text();
						if (video_link) Parser.CLIENT_callback(video_link, event_number, video_name);
					});
				}
			});
		});
	},

	login: function(token) {
		var data = JSON.parse(fs.readFileSync('adata', 'utf-8'));
		var link = '';
		request.post( {
			url: url+'login',
			form: {
				'authenticity_token': token,
				'user[email]': data.username,
				'user[password]': data.password,
				'user[remember_me]': 0
			}},
			Parser.getVideoLink
		);
	},
	onTokenParse: function(e, res, body) {
		var $ = cheerio.load(body);
		var token = $("input[name='authenticity_token']").attr('value');
		Parser.login(token);
	}
};
module.exports.onEach = function(callback) {
	request(url+'login', function(e, res, body) {
		Parser.CLIENT_callback = callback;
		Parser.onTokenParse(e, res, body);
	});
}
module.exports.onAll = function(callback) {
	console.log(callback());
}

exports.Parser = Parser;

