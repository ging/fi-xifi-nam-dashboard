var superagent = require('superagent');
var server = require('./../config').nam_server;

var nam_nodes = exports.nam_nodes = {};

exports.index = function(req, res){

	var path = "http://" + server + "/monitoring/nam/hosts_all";
	var token = req.cookies.dec_token;

	superagent.get(path).set('x-auth-token', token).end(function(error, resp) {
    	if(error) {
      		res.send("error" + error);
      	} else {
      		var nodes = resp.body;
      		nam_nodes = {};
      		for (var n in nodes) {
      			if (nodes[n].regionId) {
	      			if (!nam_nodes[nodes[n].regionId]) {
	      				nam_nodes[nodes[n].regionId] = [{ip: nodes[n].ipAddress, port: nodes[n].port_NAM}];
	      			} else {
	      				if (nam_nodes[nodes[n].regionId].indexOf(nodes[n].ipAddress) === -1) {
	      					nam_nodes[nodes[n].regionId].push({ip: nodes[n].ipAddress, port: nodes[n].port_NAM});
	      				}
	      			}
      			}
      		}
      		exports.nam_nodes = nam_nodes;
    		res.render('index', {nodes: nam_nodes});
    	}
    });
};

exports.nodes_status = function(req, res){

    var hash = {};
    var result = {};
    var total_nodes = Object.keys(nam_nodes).length;
    var nodes_count = 0;

    for (var n in nam_nodes) {

        var band_url = 'http://' + nam_nodes[n][0].ip + ':' + nam_nodes[n][0].port + '/monitoring/iperf';
        var lat_url = 'http://' + nam_nodes[n][0].ip + ':' + nam_nodes[n][0].port + '/monitoring/owdserver/1';

        hash[nam_nodes[n][0].ip + ':' + nam_nodes[n][0].port] = n;
        result[n] = {band: false, lat: false};

        console.log('checking for ', n, band_url, lat_url, hash);

        superagent.get(band_url).end(function(error, resp) {
            if(!error && resp.body.port_iperf) {
                console.log('Resp band from ', hash[resp.req._headers.host], resp.body);
                result[hash[resp.req._headers.host]].band = true;
            } else {
                console.log('Error band ', error);
            }
            nodes_count++;
            console.log(nodes_count, total_nodes);
            if (nodes_count === total_nodes*2) {
                console.log('SEND ', result);
                res.send(result);
            }
        });

        superagent.get(lat_url).end(function(error, resp) {
            if(!error && resp.body.result === 'NTP OK ') {
                console.log('Resp lat from ', hash[resp.req._headers.host], resp.body);
                result[hash[resp.req._headers.host]].lat = true;
            } else {
                console.log('Error lat ', error);
            }
            nodes_count++;
            console.log(nodes_count, total_nodes);
            if (nodes_count === total_nodes*2) {
                console.log('SEND ', result);
                res.send(result);
            }
        });
    }

    setTimeout(function() {
        res.send(result);
    }, 15000);
};