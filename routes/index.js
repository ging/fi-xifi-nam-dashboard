var nodes = require('./../models/nodes');

exports.index = function(req, res){
    res.render('index', {nodes: nodes.nam_nodes, nodes_status: nodes.nam_nodes_status});
};