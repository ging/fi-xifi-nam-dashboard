/**
 * test_controller.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */

var FS   = require('fs');
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

//Test Bwctl


exports.testbdw = function(req, res) {

	console.log('Params en este caso');
	console.log(req.body);

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var windows = req.body.windows;
    var interval = req.body.interval;
    var durarion = req.body.durarion;
    var token = req.cookies.dec_token;

    nam_nodes = require('./index').nam_nodes;

    console.log ('compobación parametros')
    if (source == '' || destination == ''){
    	req.flash('error', "You must select hosts: source and destination");
    	res.render('index', {type: "error",  r1:"", isAvaliableSource :"", isAvaliableDestination:""});
    	
    }else{
        
	    console.info('Options prepared:');
	    var path_call_bwctl = "http://"+server+"/monitoring/host2hosts/bdw/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
	    var test_info = source + "-" + source1 + ";" + destination+ "-" + destination1;
	    console.info(path_call_bwctl);
	    console.info('Do the GET call');
   
	    superagent.get(path_call_bwctl).set('x-auth-token', token).end(function(error, resp) {
	    	if(error) {
	      		res.send("error" + error);
	      	} else {
	      		
      			//res.send(resp.body);  
	      		console.log('RESP', resp.body);
	      		if(!resp.body.error && resp.body !== {}){
	      			console.log(resp.body);
		      		fbResponse = resp.body;
		     		var resul = {
	        				  RegionIdD : source,
	          				  hostIdS : source1,
	          				  RegionIdD : destination,
	          				  hostIdD : destination1,
	          				  path: path_call_bwctl,
		     				  info: test_info,
		      				  ipS : source,
		      				  ipD : destination,
		      			interval : fbResponse.result.match(/([0-9.]+)([- ])([ 0-9.]+)( sec)/gm), 
		      			transfer : fbResponse.result.match(/([0-9.]+)( MBytes )/gm), 
		      			banwidth : fbResponse.result.match(/([0-9.]+)( Mbits)/gm)
		     		};
		     		for (i in resul.banwidth){
	      			  resul.banwidth[i]=parseFloat(resul.banwidth[i].match(/[0-9.]+/)); 
	      			  console.log (i + resul.banwidth[i])
	      			  console.log (typeof( resul.banwidth[i]));
		     		}
	      			if (fbResponse.error!=0 || resul.banwidth==null){
	      				req.flash('error', fbResponse.result);
	      				res.render('index', {type: "error", nodes: nam_nodes});//, r1: fbResponse.result, isAvaliableSource : '', isAvaliableDestination:""});
	      			} else {
	      				res.render('index', {title: "Bandwidth service results", type: "bwctl_result", nodes: nam_nodes, r1: fbResponse.result, isAvaliableSource : resul, isAvaliableDestination:""});
	      			}
      			
	      	    }else{
	      		    req.flash('error', "You must select hosts: source and destination");
	        	    res.render('index', {type: "error", r1:"", isAvaliableSource :"", isAvaliableDestination:"", nodes: nam_nodes});
	      		
	      	    }      		
      	    }
      });
    }
};



// Test Owamp


exports.testow = function(req, res) {

	console.log('Params');
	console.log(req.body);
	    
    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
   
    nam_nodes = require('./index').nam_nodes;

    console.log ('compobación parametros');
    if (source == '' || destination == ''){
    	req.flash('error', "You must select hosts: source and destination");
    
    	res.render('index', {type: "error", r1:"", isAvaliableSource :"", isAvaliableDestination:"", nodes: nam_nodes});

    }else{
    	
    	console.info('Options prepared:');
    	var path_call_bwctl = "http://"+server+"/monitoring/host2hosts/owd/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
    	var test_info = source + "-" + source1 + ";" + destination+ "-" + destination1;
	    //var path_call_bwctl = "http://" + server + "/monitoring/owd/"+ source + "/" + destination;
	    console.info(path_call_bwctl);
	    console.info('Do the GET call');
	    
	    superagent.get(path_call_bwctl)
        .end(function(error, resp){
      	if (error) {
            res.send("error");
        } else {
        		
    		fbResponse = resp.body;

    		if (fbResponse.error || !fbResponse.result){
          		req.flash('error', fbResponse.result);
          		console.log(fbResponse);
          		console.log('owamp con error', nam_nodes);
          		res.render('index', {type: "error", r1: fbResponse.result, isAvaliableSource :resul, isAvaliableDestination:"", nodes: nam_nodes});
         
      	     } else {
          		  
          		console.log(fbResponse)
          		var resul = {
          		    	  RegionIdD : source,
          				  hostIdS : source1,
          				  RegionIdD : destination,
          				  hostIdD : destination1,
          				  path: path_call_bwctl,
          				  info: test_info,
          			      OWD : fbResponse.result.match(/([-0-9.]+)/gm),
          			      //.match(/[0-9.]+/),
          					//match(/(= [-0-9./]+)/gm))[0].match(/([-0-9.]+)/gm),  
          			      jitter : fbResponse.result.jitter_sc, 
          		  };
	
          		  for (i in resul.OWD){
          			resul.OWD[i]=parseFloat(resul.OWD[i].match(/[0-9.]+/)); 
          		  }
          		  
          		resul.OWD[3]=(resul.OWD[0]+resul.OWD[1])/2;
          		  console.log('::::::::::::::::::::::: ', nam_nodes);
                  res.render('index', {title: "Latency service results", type: "owamp_result", nodes: nam_nodes, r1: fbResponse.result, isAvaliableSource :resul, isAvaliableDestination:""});
          	  
          	  }  
        	}
        });
    }   
};

exports.availableBwctlSource = function(req, res) {

    var source = req.body.source;

    optionsget.host = source;
    optionsget.path = "/bwctl/avaliable/";
    console.info('Options prepared:');
    console.info(optionsget);      
    console.info('Do the GET call');
    console.log('source    = ' + source);
    console.log('destination = ' + destination);

    callback = function(response) {
  
    	var str = '';

  //another chunk of data has been recieved, so append it to `str`
    	response.on('data', function (chunk) {
    		str += chunk;
    		str = str.replace(new RegExp('"', 'g'), '');
	
    	});

  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    console.log(str);
	    res.render('owamp', { r1: '', nodes: nam_nodes, isAvaliableSource : str, isAvaliableDestination:""});
	      
	  });
	};
	http.request(optionsget, callback).end();
};



//Test Bwctl  history


exports.testbdwhist = function(req, res) {
	
	console.log('Params bdw history');
	console.log(req.body);

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
    var windows = req.body.windows;
    var interval = req.body.interval;
    var durarion = req.body.durarion;
    nam_nodes = require('./index').nam_nodes;

    console.log ('compobación parametros');
    if (source == '' || destination == ''){
    	req.flash('error', "You must select hosts: source and destination");
    	res.render('index', {type: "error", nodes: nam_nodes, r1:"", isAvaliableSource :"", isAvaliableDestination:""});
    	
    }else{
        
    	
    
    	 superagent.get('http://' + server + '/monitoring/regions/'+source+'/hosts/'+source1)
         .end(function(error, resp){
       	          
        	if(error){
         		res.send("error" + error);
         	}else{
         		
        	    var path_call_bwctl = "http://"+ resp.body[0].ipAddress+":"+ resp.body[0].port_NAM +"/monitoring/testshow/Bdw/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
        	    var test_info = source + "-" + source1 + ";" + destination+ "-" + destination1;

            superagent.get(path_call_bwctl)
              .end(function(error, resp){
            	if(error){
              		res.send("error" + error);
              	}else{
              		
              			//res.send(resp.body); 
              		console.log(resp.body);
              		console.log("resultado");
              		
              		if(resp.body.length>4){
              			console.log("pass if");
              			console.log(resp.body);
              			
        	      		fbResponse = resp.body[1];
        	     		var resul = {
                				  RegionIdD : source,
                  				  hostIdS : source1,
                  				  RegionIdD : destination,
                  				  hostIdD : destination1,
                  				  path: path_call_bwctl,
        	     				  info: test_info,
        	      				  ipS : source,
        	      				  ipD : destination,
        	      			interval : fbResponse.result.match(/([0-9.]+)([- ])([ 0-9.]+)( sec)/gm), 
        	      			transfer : fbResponse.result.match(/([0-9.]+)( MBytes )/gm), 
        	      			banwidth : fbResponse.result.match(/([0-9.]+)( Mbits)/gm),
        	      			date: [],
        	     		    band: []
        	      		  };
        	      		  for (i in resul.banwidth){
        	      			  resul.banwidth[i]=parseFloat(resul.banwidth[i].match(/[0-9.]+/)); 
        	      			  console.log (i + resul.banwidth[i])
        	      			  console.log (typeof( resul.banwidth[i]));
        	      		  }
        	      		  
        	      		  for (i in resp.body){
        	      			  resul.date.push(resp.body[i].timestamp);
        	      			  var bandw = resp.body[i].result.match(/([0-9.]+)( Mbits)/gm);
        	      			  var sum = 0;
        	      			  for (i in bandw){
        	      				  
        	      				  bandw[i]= parseFloat(bandw[i].match(/[0-9.]+/));
        	      				  sum += bandw[i];
        		      			  console.log (i + bandw[i])
        		      			  console.log (typeof( bandw[i]));
        		      			  resul.band.push(bandw[i]);
        		      		  }
        	      			  //resul.band[i]=bandw[0]; 
        	      			 // console.log (i + bandw[0])
        	      			  //console.log (typeof( bandw[0]));
        	      		  }
        	      		
        	      			if (fbResponse.error!=0 || resul.banwidth==null){
        	      				
        	      				req.flash('error', fbResponse.result);
        	      				res.render('index', {type: "error", nodes: nam_nodes,  r1: fbResponse.result, isAvaliableSource : '', isAvaliableDestination:""});
        	      			}else {
        	      				console.log (resul.band);
        	      				res.render('index', {title: "Bandwidth history results", type: "bwctl_result_history", nodes: nam_nodes, r1: fbResponse.result, isAvaliableSource : resul, isAvaliableDestination:""});
        	      				
        	      			}
              			
        	      	}else{
        	      		req.flash('error', "Not found sufficient tests");
                    console.log('bwd error')
        	        	res.render('index', {type: "error", nodes: nam_nodes, r1:"", isAvaliableSource :"", isAvaliableDestination:""});
        	      		
        	      	} 					
              	}
              });
              
         	}
         });
    	 
    }

    
};

exports.testowdhist = function(req, res) {

    var source = req.body.source; 
    var source1 = req.body.source1;
    var destination  = req.body.destination;
    var destination1  = req.body.destination1;
   
    nam_nodes = require('./index').nam_nodes;
    
    console.log ('compobación parametros');
    if (source == '' || destination == ''){
      req.flash('error', "You must select hosts: source and destination");
    
      res.render('index', {type: "error", nodes: nam_nodes, r1:"", isAvaliableSource :"", isAvaliableDestination:""});

    }else{

      superagent.get('http://' + server + '/monitoring/regions/'+source+'/hosts/'+source1)
         .end(function(error, resp){
                  
          if(error){
            res.send("error" + error);
          }else{
      
      var path_call_owd = "http://"+ resp.body[0].ipAddress+":"+ resp.body[0].port_NAM +"/monitoring/testshow/Owd/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;

      var path_call_bwctl = "http://"+server+"/monitoring/host2hosts/owd/"+ source + "-" + source1 + ";" + destination+ "-" + destination1;
      var test_info = source + "-" + source1 + ";" + destination+ "-" + destination1;
      //var path_call_bwctl = "http://" + server + "/monitoring/owd/"+ source + "/" + destination;

        superagent.get(path_call_owd)
        .end(function(error, resp){
        if(error){
            res.send("error");
          }else{
            
            //res.send(resp.body);            
            
            

            console.log("body")
            console.log(resp.body.length)
            console.log("text")
            console.log(resp.text)


            if (resp.body.length>4){

              fbResponse = resp.body[1];
              console.log(fbResponse)
                var resul = {
                    RegionIdD : source,
                    hostIdS : source1,
                    RegionIdD : destination,
                    hostIdD : destination1,
                    path: path_call_bwctl,
                    info: test_info,
                      //OWD : fbResponse.result.match(/([-0-9.]+)/gm),
  
                      //jitter : fbResponse.result.jitter_sc, 
                      date: [],
                      owd_data: [],
                      jitter_data: []
                };
  
                /*for (i in resul.OWD){
                console.log ("i: " + i);
                resul.OWD[i]=parseFloat(resul.OWD[i].match(/[0-9.]+/)); 

                }*/

                for (i in resp.body){
                  resul.date.push(resp.body[i].timestamp);
                  var owd = resp.body[i].result.match(/([-0-9.]+)/gm);
                  resul.jitter_data.push(resp.body[i].result.jitter_sc);
                  console.log (resp.body[i].result.jitter_sc);
                  for (i in owd){
                          
                    owd[i]= parseFloat(owd[i].match(/[0-9.]+/)); 
                          
                    console.log (i + owd[i])
                    console.log (typeof( owd[i]));
                    resul.owd_data.push(owd[i]);
                  }

                }


                res.render('index', {title: "Latency history results", type: "owamp_result_history", nodes: nam_nodes, isAvaliableSource :resul, isAvaliableDestination:""});


              } else {
                
                req.flash('error', "Not found sufficient measures");
                console.log('owamp con error')
                res.render('index', {type: "error", r1: "Not found sufficient tests", nodes: nam_nodes, isAvaliableSource :resul, isAvaliableDestination:""});
             
              
              }  

              }
         });  
              
   
          }
        });

    }   
};