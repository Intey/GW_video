var fs = require('fs');
var request = require('request');
request = request.defaults({jar:true});
var cheerio = require('cheerio');

var url = 'http://geekbrains.ru/';
var events_page_url = url + 'events/';
var test_event_url = events_page_url + '163';

// logining
// paging
function login() {
  var data = JSON.parse(fs.readFileSync('adata', 'utf-8'));
  console.log("username: " + data.username);
  console.log("password: " + data.password);

  var token = '';
  request(url+'login', function(e, res, body) {
      //console.log("GETed login page");
      var $ = cheerio.load(body);
      token = $("input[name='authenticity_token']").attr('value');
    });

  request.post( {
    url: url+'login', 
    form: {
      'authenticity_token': token, 
      'user[email]': data.username, 
      'user[password]': data.password, 
      'user[remember_me]': 0
    } },
      function (e, res, body) {
          var cookies = res['headers']['set-cookie'][0];
          //console.log("GET COOKIES");
          //console.log(cookies);
          var options = { url: test_event_url, headers: { 'Cookie': cookies } };

          request(options, function(e, res, body) {
            if (!e && res.statusCode == 200) {
              var $ = cheerio.load(body);
              console.log($("#video>source").attr('src'));
              //fs.writeFile('result', body);
            }
            else {
              console.log("ERROR OCCURE");
              console.log(e);
            }
          });
      });
}

function parse(body) {
    $ = cheerio.load(body);
    var target = $('#video > video > source ');
    console.log("=========== parsed");
    // console.log($('body').text());
    // console.log(target.attr('src'));
    // fs.writeFile('page.html', body);
}

login();

// request(test_event_url, function (e, res, body) {
//   if (!e && res.statusCode == 200) {
//     parse(body);
//   }
//   else { 
//     console.log("======= error occured");
//     console.log(e);
//   }
// });
