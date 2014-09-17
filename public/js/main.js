window.onload = function () {

	var updateSelectBoxes = function () {

		$("select").selectbox("detach");

		$("select").selectbox({
			 onChange: function (val, inst) {

			    this.value = val;

			    if (this.id === 'source' || this.id === 'dest') {
				    $("#" + this.id + "_ip").empty();
				    var new_options = nam_nodes[val];

				    for (var o in new_options) {
				    	$("#" + this.id + "_ip").append("<option>" + new_options[o].host + "</option>");
				    }
			    }
			    updateSelectBoxes();
			}
		});
		
	};

	updateSelectBoxes();

	var current_request = {
		service: 'bandwidth',
		type: 'live',
		title: 'Bandwidth Test Results'
	};

	$(".service_menu_item").click(function(e) {

		$(".service_menu_item").removeClass('active');
		e.currentTarget.className = e.currentTarget.className + ' active';
		$("#option_icon").removeClass();

		$("#history").removeClass('active');
		$("#live").addClass('active');

		current_request.service = e.currentTarget.id;
		current_request.type = 'live';

		switch(current_request.service) {
			case 'bandwidth':
				$("#service_description_text").html('Test the available Bandwidth between hosts')
				$("#option_icon").addClass('fa fa-tachometer');
				break;

			case 'latency':
				$("#service_description_text").html('Test the current network Latency between hosts')
				$("#option_icon").addClass('fa fa-exchange');
				break;

			case 'packet':
				$("#service_description_text").html('Test the Packet Loss level between hosts')
				$("#option_icon").addClass('fa fa-ellipsis-h');
				break;
		}
	});

	$(".serv_tab").click(function(e) {
		current_request.type = e.currentTarget.parentElement.id;
	});


	$("#send_button").click(function(e) {

		current_request.body = {
			source: $('#source').val(),
			source1: $('#source_ip').val(),
			destination: $('#dest').val(),
			destination1: $('#dest_ip').val()
		};

		switch (current_request.service) {
			case 'bandwidth':
				if (current_request.type === 'live') {
					current_request.title = 'Bandwidth Test Results'
					current_request.url = '/bdw';
				} else {
					current_request.title = 'Bandwidth History Test Results'
					current_request.url = '/bdwhistory';
				}
				break;

			case 'latency':
				if (current_request.type === 'live') {
					current_request.title = 'Latency Test Results';
					current_request.url = '/owd';
				} else {
					current_request.title = 'Latency History Test Results';
					current_request.url = '/owdhistory';
				}
				break;

			case 'packet':
				if (current_request.type === 'live') {
					current_request.title = 'Packet Loss Test Results';
					current_request.url = '/ploss';
				}
				else {
					current_request.title = 'Packet Loss History Test Results';
					current_request.url = '/plosshistory';
				}
				break;
		}

		$('#resutls_title').html(current_request.title);
		$('#host_source').html(current_request.body.source + ' - ' + current_request.body.source1);
		$('#host_dest').html(current_request.body.destination + ' - ' + current_request.body.destination1);
		$('#result_modal').modal();

	});

	$('#result_modal').on('shown.bs.modal', function (e) {

		if (!current_request.request) {

			current_request.request = $.ajax({
			  	type: 'POST',
			  	url: current_request.url,
			  	data: current_request.body,
			  	success: function(data) {
		  			$('#connection_progress').hide();
			  		$('#results_table').html(data);

			  		delete current_request.request;
				},
			  	error: function(xhr, textStatus, error){
				    $('#connection_progress').hide();
				    if (xhr.status === 404) {
				    	$('#results_table').html('No data available for this test');
				    } else {
				    	$('#results_table').html('Error getting data');
				    }

				    delete current_request.request;
			  	}
			});
		}
	});

	$('#result_modal').on('hidden.bs.modal', function () {

		if (current_request.request) {
		    current_request.request.abort();
		    delete current_request.request;
		}

	    $('#connection_progress').show();
	    $('#results_table').html('');
	    $('#results_graph').html('');
	});

	// var check_nam_services = function () {

	// 	$.ajax({
	// 	  	type: 'GET',
	// 	  	url: '/nodes_status',
	// 	  	success: function(data) {
	// 	  		console.log('Result band', data);
	// 	  		for (var n in data) {
	// 	  			if (data[n].band) {
	// 	  				$('#' + n + '_band').children().addClass('up');
	// 	  			} else {
	// 	  				$('#' + n + '_band').children().addClass('down');
	// 	  			}
	// 	  			if (data[n].lat) {
	// 	  				$('#' + n + '_lat').children().addClass('up');
	// 	  			} else {
	// 	  				$('#' + n + '_lat').children().addClass('down');
	// 	  			}
	// 	  		}
	// 		},
	// 	  	error: function(xhr, textStatus, error){
	// 	  		console.log('Error band', error);
	// 	  	}
	// 	});
	// }

	for (var n in nam_nodes_status) {
		if (nam_nodes_status[n].band) {
			$('#' + n + '_band').children().addClass('up');
		} else {
			$('#' + n + '_band').children().addClass('down');
		}
		if (nam_nodes_status[n].lat) {
			$('#' + n + '_lat').children().addClass('up');
		} else {
			$('#' + n + '_lat').children().addClass('down');
		}
	}
};