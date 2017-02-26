$(document).ready(function () {
	$('#updateEvents').click(function () {
		verify();
	});
});
function verify(){
	if($('#email').val().includes("@")){
		$.post("http://localhost:3000/loginInfo",{email:$('#email').val(),pass:$('#password').val()},function(data){
			window.name = $('#email').val();
			if(data==='done'){ window.location.href="http://localhost:3000/admitted";}
		});
	}else{
		window.alert("Please enter a valid email");
	}

}
function encrypt(){
	var asString=$('#password').val();
	$('#eventList').append(asString);
}
