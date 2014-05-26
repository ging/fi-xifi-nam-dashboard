window.onload = function () {
	$("select").selectbox({
		 onChange: function (val, inst) {
		    this.value = val;
		    $("#" + this.id + "_ip").selectbox("detach");

		    $("#" + this.id + "_ip").empty();
		    var new_options = nam_nodes[val];

		    for (var o in new_options) {
		    	$("#" + this.id + "_ip").append("<option>" + new_options[o].ip + "</option>");
		    }
		    $("#" + this.id + "_ip").selectbox("attach");
		}
	});

	var current_request;

	$(".test_button").click(function(e) {

		var req_url, source, source_ip, dest, dest_ip, title;

		switch (e.target.id) {
			case 'bdw_demand_button':
				req_url = '/bdw';
				source = $('#bdw_demand_source').val();
				source_ip = $('#bdw_demand_source_ip').val();
				dest = $('#bdw_demand_dest').val();
				dest_ip = $('#bdw_demand_dest_ip').val();
				title = 'Bandwidth Test Results';
				break;
			case 'bdw_hist_button':
				req_url = '/bdwhistory';
				source = $('#bdw_hist_source').val();
				source_ip = $('#bdw_hist_source_ip').val();
				dest = $('#bdw_hist_dest').val();
				dest_ip = $('#bdw_hist_dest_ip').val();
				title = 'Bandwidth History Test Results';
				break;
			case 'lat_demand_button':
				req_url = '/owd';
				source = $('#lat_demand_source').val();
				source_ip = $('#lat_demand_source_ip').val();
				dest = $('#lat_demand_dest').val();
				dest_ip = $('#lat_demand_dest_ip').val();
				title = 'Latency Test Results';
				break;
			case 'lat_hist_button':
				req_url = '/owdhistory';
				source = $('#lat_hist_source').val();
				source_ip = $('#lat_hist_source_ip').val();
				dest = $('#lat_hist_dest').val();
				dest_ip = $('#lat_hist_dest_ip').val();
				title = 'Latency History Test Results';
				break;
		}
		var req_body = {
			source: source,
			source1: source_ip,
			destination: dest,
			destination1: dest_ip
		};

		current_request = {
			body: req_body,
			url: req_url
		};

		$('#resutls_title').html(title);
		$('#host_source').html(source + ' - ' + source_ip);
		$('#host_dest').html(dest + ' - ' + dest_ip);
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

			  		current_request = undefined;
				},
			  	error: function(xhr, textStatus, error){
				    $('#connection_progress').hide();
				    if (xhr.status === 404) {
				    	$('#results_table').html('No data available for this test');
				    } else {
				    	$('#results_table').html('Error getting data');
				    }

				    current_request = undefined;
			  	}
			});
		}
	});

	$('#result_modal').on('hidden.bs.modal', function () {

		if (current_request) {
		    current_request.request.abort();
		    current_request = undefined;
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