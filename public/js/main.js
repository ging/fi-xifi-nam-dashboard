
window.onload = function () {
	$("select").selectbox({
		 onChange: function (val, inst) {
		    this.value = val;
		}
	});

	$(".test_button").click(function() {
		$('#result_modal').modal();
	});

	$('#result_modal').on('hidden.bs.modal', function () {
	    console.log('sisisisiisisis');
	    window.location = '/';
	})
}