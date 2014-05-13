
window.onload = function () {
	$("select").selectbox({
		 onChange: function (val, inst) {
		    this.value = val;
		    $("#" + this.id + "_ip").selectbox("detach");

		    $("#" + this.id + "_ip").empty();
		    var new_options = nam_nodes[val];

		    for (var o in new_options) {
		    	$("#" + this.id + "_ip").append("<option>" + new_options[o] + "</option>");
		    }
		    $("#" + this.id + "_ip").selectbox("attach");
		}
	});

	$(".test_button").click(function() {
		$('#result_modal').modal();
	});

	$('#result_modal').on('hidden.bs.modal', function () {
	    window.location = '/';
	})
}