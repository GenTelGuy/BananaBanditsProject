$(document).ready(function () {
	$('#updateEvents').click(function () {
		verify();
	});
});
function verify(){
	if($('#email').val().includes("@")){
		$('#eventList').append("Verifying\n");
		/*$.post("http://localhost:3000/loginInfo",{email:$('#email').val,pass:$('#password')},function(data){
			window.alert("Session stored");
			if(data==='done'){ window.location.href = "/admitted";}
			});*/
		window.loacation=href"/admitted";
	}else{
		window.alert("Please enter a valid email");
	}

}
function encrypt(){
	var asString=$('#password').val();
	$('#eventList').append(asString);
}
