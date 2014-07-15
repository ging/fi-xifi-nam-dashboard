var superagent = require('superagent');
var server = require('./../config').nam_server;

exports.nam_nodes;
exports.nam_nodes_status;

var get_nodes = function (callback, error_callback) {

    var path = "http://" + server + "/monitoring/nam/hosts_all";

    var nam_nodes = {};

    superagent.get(path).end(function(error, resp) {
        if(error) {
            error_callback(error);
        } else {
            var nodes = resp.body;
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
            callback(nam_nodes);
        }
    });
};

exports.update_nodes = function() {

    console.log('[--] Updating nodes...');

    get_nodes(function (nodes) {

        exports.nam_nodes = nodes;

        var hash = {};
        exports.nam_nodes_status = {};
        var total_nodes = Object.keys(nodes).length;

        for (var n in nodes) {

            var band_url = 'http://' + nodes[n][0].ip + ':' + nodes[n][0].port + '/monitoring/nam/bdwstatus';
            var lat_url = 'http://' + nodes[n][0].ip + ':' + nodes[n][0].port + '/monitoring/nam/owdstatus';

            hash[nodes[n][0].ip + ':' + nodes[n][0].port] = n;
            exports.nam_nodes_status[n] = {band: false, lat: false};

            console.log('[--] Checking for ', n, band_url, lat_url, hash);

            superagent.get(band_url).end(function(error, resp) {
                if(!error && (resp.body.bdw_status || resp.body.bdw_status === 'true')) {
                    console.log('[--] Resp band from ', hash[resp.req._headers.host], resp.body);
                    exports.nam_nodes_status[hash[resp.req._headers.host]].band = true;
                } else {
                    console.log('[--] Error band ', error, resp.body);
                }
            });

            superagent.get(lat_url).end(function(error, resp) {
                if(!error && (resp.body.odw_status || resp.body.odw_status === 'true')) {
                    console.log('Resp lat from ', hash[resp.req._headers.host], resp.body);
                    exports.nam_nodes_status[hash[resp.req._headers.host]].lat = true;
                } else {
                    console.log('[--] Error lat ', error, resp.body);
                }
            });
        }

    }, function (e) {
        console.log('[--] Error getting nodes ', e);
    });
};