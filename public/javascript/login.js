$(document).ready(function () {
	/* if button pushed call verify */
	$('#updateEvents').click(function () {
		verify();
	});
});

/* form checking function */
function verify(){
	
	/* if avalid email address */
	if($('#email').val().includes("@")){
		
		/* pull session data, redirect to temp in between page */
		$.post("http://localhost:3000/loginInfo",{email:$('#email').val(),pass:$('#password').val()},function(data){
			window.name = $('#email').val();
			if(data==='done'){ window.location.href="http://localhost:3000/admitted";}
		});
	
	/* if not valid prompt user to enter valid info */
	}else{
		window.alert("Please enter a valid email");
	}

}

/* in progress password encryption function */
function encrypt(){
	var asString=$('#password').val();
	$('#eventList').append(asString);
}
