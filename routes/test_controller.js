var FS   = require('fs');
var ejs = require('ejs');
var http = require('http');
var superagent = require('superagent');
var datareq = '';
var server = require('./../config').nam_server;

var nam_nodes;

var optionsget = {
    host : '', // here only the domain name
    port : 4000,
    path : '', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

exports.testbdw = function(req, res) {

    console.log('[-] Test Band ', req.body);

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;

    if (source === '' || destination === '') {
        console.log('[-] Error: no hosts selected');
    	res.send(500, 'No hosts selected');
    	
    } else {
        
	    var path_call_bwctl = "http://"+server+"/monitoring/host2host/bdw/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
	    console.log('[-] Sending request to', path_call_bwctl);
   
	    superagent.get(path_call_bwctl).set('x-auth-token', token).end(function(error, resp) {
	    	if (error) {
                console.log('[-] Error from NAM server 1 ' + error);
	      		res.send(500, 'Error from NAM server ' + error);
	      	} else {
	      		
	      		var response = resp.body;

                console.log('[-] Response from NAM ', response);

	      		if(!response.error && response.result) {
		      		
		     		var resul = {
		      			interval : response.result.match(/([0-9.]+)([- ])([ 0-9.]+)( sec)/gm), 
		      			transfer : response.result.match(/([0-9.]+)( MBytes )/gm), 
		      			bandwidth : response.result.match(/([0-9.]+)( Mbits)/gm)
		     		};

		     		for (var i in resul.bandwidth){
	      			  resul.bandwidth[i] = parseFloat(resul.bandwidth[i].match(/[0-9.]+/)); 
		     		}

	      			if (response.error != 0 || resul.bandwidth == null) {
                        console.log('[-] Error from NAM server 2 ' + response.result);
	      				res.send(500, 'Error from NAM server' + response.result);
	      			} else {
                        console.log('[-] Success. Sending response');
                        var str = FS.readFileSync(__dirname + '/../views/bwctl_result.ejs', 'utf8');
                        var html = ejs.render(str, {data : resul});
                        res.send(html);
	      			}
      			
	      	    } else {
                    console.log('Error from NAM server 3 ', + response);
	        	    res.send(500, 'Error from NAM server', + response);
	      	    }      		
      	    }
        });
    }
};

exports.testow = function(req, res) {

	console.log('[-] Test Latency ', req.body);
	    
    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;
   
    nam_nodes = require('./index').nam_nodes;

    if (source === '' || destination === ''){
        console.log('[-] Error: no hosts selected');
        res.send(500, 'No hosts selected');

    } else {
    	
    	var path_call_bwctl = "http://"+server+"/monitoring/host2host/owd/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
	    
        console.info('[-] Sending request to', path_call_bwctl);
        
	    superagent.get(path_call_bwctl).set('x-auth-token', token).end(function(error, resp) {
      	    if (error) {
                console.log('[-] Error from NAM server 1 ' + error);
                res.send(500, 'Error from NAM server ' + error);
            } else {
        		
    		    var response = resp.body;

                console.log('[-] Response from NAM ', response);

    		    if (response.error || !response.result){
          		    console.log('[-] Error from NAM server 2 ' + response);
                    res.send(500, 'Error from NAM server ' + response);
         
      	        } else {

                    var items = response.result.split('ms, ');
                    var data = {};
                    for (var i in items) {
                        data[items[i].split(':')[0]] = parseInt(items[i].split(':')[1]);
                    }
          		            		  
                    console.log('[-] Success. Sending response');
                    var str = FS.readFileSync(__dirname + '/../views/owamp_result.ejs', 'utf8');
                    var html = ejs.render(str, {data: data});
                    res.send(html);
          	    }  
        	}
        });
    }   
};

exports.testloss = function(req, res) {

    console.log('[-] Test Ploss ', req.body);

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;

    if (source === '' || destination === '') {
        console.log('[-] Error: no hosts selected');
        res.send(500, 'No hosts selected');
        
    } else {
        
        var path_call_loss = "http://"+server+"/monitoring/host2host/ploss/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
        console.log('[-] Sending request to', path_call_loss);
   
        superagent.get(path_call_loss).set('x-auth-token', token).end(function(error, resp) {
            if (error) {
                console.log('[-] Error from NAM server 1 ' + error);
                res.send(500, 'Error from NAM server ' + error);
            } else {
                
                var response = resp.body;

                console.log('[-] Response from NAM ', response);

                // if(!response.error && response.result) {
                    
                //     var resul = {
                //         interval : response.result.match(/([0-9.]+)([- ])([ 0-9.]+)( sec)/gm), 
                //         transfer : response.result.match(/([0-9.]+)( MBytes )/gm), 
                //         bandwidth : response.result.match(/([0-9.]+)( Mbits)/gm)
                //     };

                //     for (var i in resul.bandwidth){
                //       resul.bandwidth[i] = parseFloat(resul.bandwidth[i].match(/[0-9.]+/)); 
                //     }

                //     if (response.error != 0 || resul.bandwidth == null) {
                //         console.log('[-] Error from NAM server 2 ' + response.result);
                //         res.send(500, 'Error from NAM server' + response.result);
                //     } else {
                //         console.log('[-] Success. Sending response');
                //         var str = FS.readFileSync(__dirname + '/../views/bwctl_result.ejs', 'utf8');
                //         var html = ejs.render(str, {data : resul});
                //         res.send(html);
                //     }
                
                // } else {
                //     console.log('Error from NAM server 3 ', + response);
                //     res.send(500, 'Error from NAM server', + response);
                // }           
            }
        });
    }
};

exports.testbdwhist = function(req, res) {

    console.log('[-] Test Band Hist ', req.body);   
	
    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;

    if (source === '' || destination === ''){
    	console.log('[-] Error: no hosts selected');
        res.send(500, 'No hosts selected');
    } else {

        var path = 'http://' + server + '/monitoring/regions/' + source + '/hosts/' + source1;
        console.log('[-] Sending request to', path);
        
        superagent.get(path).set('x-auth-token', token).end(function(error, resp) {

        	if (error) {
         		console.log('[-] Error from NAM server 1 ' + error);
                res.send(500, 'Error from NAM server ' + error);
         	} else {
         		
        	    var path_call_bwctl = "http://"+ resp.body[0].ipAddress+":"+ resp.body[0].port_NAM +"/monitoring/history/Bdw/"+ source + "-" + source1 + ";" + destination + "-" + destination1 + '/5';

                console.log('[-] Sending request to', path_call_bwctl);

                superagent.get(path_call_bwctl).set('x-auth-token', token).end(function(error, resp) {
            	    
                    if (error){
              		    console.log('[-] Error from NAM server 2 ' + error);
                        res.send(500, 'Error from NAM server ' + error);
              	    } else {
              		
                  		if (resp.body) {
                  			
            	      		response = resp.body;

                            console.log('[-] Response from NAM ', response);

            	     		var resul = [];
            	      		  
            	      		for (i in response){
                                var d = {};
                                d.date = response[i].timestamp;
            	      			var bandw = response[i].result.match(/([0-9.]+)( Mbits)/gm);
                                d.band = parseFloat(bandw[5].match(/[0-9.]+/));
                                resul.push(d);
            	      		}
            	      		
            	      		if (resul.length === 0) {
            	      			console.log('[-] Empty data');
                                res.send(404, 'Empty data ');
            	      		} else {
                                console.log('[-] Success. Sending response');
            	      			var str = FS.readFileSync(__dirname + '/../views/bwctl_result_history.ejs', 'utf8');
                                var html = ejs.render(str, {data : resul});
                                res.send(html);
            	      		}
                  			
            	      	} else {
            	        	console.log('[-] Error from NAM server 3 ' + resp);
                            res.send(500, 'Error from NAM server ' + resp);
            	      	} 					
              	    }
                });
         	}
        });
    }
};

exports.testowdhist = function(req, res) {

    console.log('[-] Test Latency Hist', req.body);

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;
   
    nam_nodes = require('./index').nam_nodes;
    
    if (source === '' || destination === '') {
        console.log('[-] Error: no hosts selected');
        res.send(500, 'No hosts selected');

    } else {

        var path = 'http://' + server + '/monitoring/regions/' + source + '/hosts/' + source1;
        console.info('[-] Sending request to', path);

        superagent.get(path).set('x-auth-token', token).end(function(error, resp) {
                      
            if (error) {
                console.log('[-] Error from NAM server 1 ' + error);
                res.send(500, 'Error from NAM server ' + error);
            } else {
          
                var path_call_owd = "http://"+ resp.body[0].ipAddress+":"+ resp.body[0].port_NAM +"/monitoring/history/Owd/"+ source + "-" + source1 + ";" + destination+ "-" + destination1 + '/5';

                console.info('[-] Sending request to', path_call_owd);

                superagent.get(path_call_owd).set('x-auth-token', token).end(function(error, resp){
                    if(error) {
                        console.log('[-] Error from NAM server 2 ' + error);
                        res.send(500, 'Error from NAM server ' + error);
                    } else {
                        
                        if (resp.body) {

                            console.log('[-] Response from NAM ', resp.body);
                            var data = [];

                            for (i in resp.body) {
                                var d = {};
                                d.date = resp.body[i].timestamp;
                                var owd = resp.body[i].result.match(/([-0-9.]+)/gm);
                                
                                for (i in owd) {
                                    if (i == 0) d.min = parseFloat(owd[i].match(/[0-9.]+/));
                                    if (i == 1) d.max = parseFloat(owd[i].match(/[0-9.]+/));
                                    if (i == 4) d.jitter = parseFloat(owd[i].match(/[0-9.]+/));
                                }
                                data.push(d);
                            }
                            if (data.length === 0) {
                                console.log('[-] Empty data');
                                res.send(404, 'Empty data ');
                            } else {
                                console.log('[-] Success. Sending response');
                                var str = FS.readFileSync(__dirname + '/../views/owamp_result_history.ejs', 'utf8');
                                var html = ejs.render(str, {data :data});
                                res.send(html);
                            }
                        } else {
                            console.log('[-] Error from NAM server 3 ', resp.body);
                            res.send(500, 'Error from NAM server ', resp.body);
                        }  
                    }
                });  
            }
        });
    }   
};

exports.testlosshist = function(req, res) {

    console.log('[-] Test Ploss Hist ', req.body);   
    
    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var token = req.cookies.dec_token;

    if (source === '' || destination === ''){
        console.log('[-] Error: no hosts selected');
        res.send(500, 'No hosts selected');
    } else {

        var path = 'http://' + server + '/monitoring/regions/' + source + '/hosts/' + source1;
        console.log('[-] Sending request to', path);
        
        superagent.get(path).set('x-auth-token', token).end(function(error, resp) {

            if (error) {
                console.log('[-] Error from NAM server 1 ' + error);
                res.send(500, 'Error from NAM server ' + error);
            } else {
                
                var path_call_loss = "http://"+ resp.body[0].ipAddress+":"+ resp.body[0].port_NAM +"/monitoring/history/ploss/"+ source + "-" + source1 + ";" + destination + "-" + destination1 + '/5';

                console.log('[-] Sending request to', path_call_loss);

                superagent.get(path_call_loss).set('x-auth-token', token).end(function(error, resp) {
                    
                    if (error){
                        console.log('[-] Error from NAM server 2 ' + error);
                        res.send(500, 'Error from NAM server ' + error);
                    } else {
                    
                        if (resp.body) {
                            
                            response = resp.body;

                            console.log('[-] Response from NAM ', response);

                            // var resul = [];
                              
                            // for (i in response){
                            //     var d = {};
                            //     d.date = response[i].timestamp;
                            //     var bandw = response[i].result.match(/([0-9.]+)( Mbits)/gm);
                            //     d.band = parseFloat(bandw[5].match(/[0-9.]+/));
                            //     resul.push(d);
                            // }
                            
                            // if (resul.length === 0) {
                            //     console.log('[-] Empty data');
                            //     res.send(404, 'Empty data ');
                            // } else {
                            //     console.log('[-] Success. Sending response');
                            //     var str = FS.readFileSync(__dirname + '/../views/bwctl_result_history.ejs', 'utf8');
                            //     var html = ejs.render(str, {data : resul});
                            //     res.send(html);
                            // }
                            
                        } else {
                            console.log('[-] Error from NAM server 3 ' + resp);
                            res.send(500, 'Error from NAM server ' + resp);
                        }                   
                    }
                });
            }
        });
    }
};