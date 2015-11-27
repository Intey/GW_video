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


function onAuthed(e, res, body) {      
	var cookies = res['headers']['set-cookie'][0];
	var options = { url: test_event_url, headers: { 'Cookie': cookies } };

	request(options, function(e, res, body) {
		var $ = cheerio.load(body);
		console.log($("#video>source").attr('src'));
	});
}

function login(token) {
	var data = JSON.parse(fs.readFileSync('adata', 'utf-8'));
	request.post( {
		url: url+'login', 
		form: {
			'authenticity_token': token, 
			'user[email]': data.username, 
			'user[password]': data.password, 
				'user[remember_me]': 0
		} },
		onAuthed);
}

function onTokenParse(e, res, body) {
	var $ = cheerio.load(body);
	var token = $("input[name='authenticity_token']").attr('value');
	login(token);
}

// request(url+'login', onTokenParse);

module.exports.onEach = function(callback) {
	console.log(callback());
}
module.exports.onAll = function(callback) {
	console.log(callback());
}

