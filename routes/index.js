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
	      				nam_nodes[nodes[n].regionId] = [nodes[n].ipAddress];
	      			} else {
	      				if (nam_nodes[nodes[n].regionId].indexOf(nodes[n].ipAddress) === -1) {
	      					nam_nodes[nodes[n].regionId].push(nodes[n].ipAddress);
	      				}
	      			}
      			}
      		}
      		exports.nam_nodes = nam_nodes;
    		res.render('index', {type: false, nodes: nam_nodes});
    	}
    });
};

// exports.bwctl = function(req, res){
//     res.render('bwctl');
// };
// exports.owamp = function(req, res){
//     res.render('owamp');
// };
// exports.newhost = function(req, res){
//     res.render('new');
// };
// exports.edithost = function(req, res){
//     res.render('edithost');
// };
// exports.delhost = function(req, res){
//     res.render('delhost');
// };
