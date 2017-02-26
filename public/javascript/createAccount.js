$(document).ready(function () {
	/* if button pushed call verify */
	$('#updateEvents').click(function () {
		verify();
	});
});

/* verify user input to create account */
function verify(){
	/* if valid email address */
	if($('#email').val().includes("@")){
		
		/* fetch session data and then redirect to event page */
		$.post("http://localhost:3000/loginInfo",{email:$('#email').val(),pass:$('#password').val()},function(data){
			window.name = $('#email').val();
			if(data==='done'){ window.location.href="http://localhost:3000/events";}
		});
	/* if not valid prompt user to enter a vlaid email */
	}else{
		window.alert("Please enter a valid email");
	}

}

/* in progress password encryption function */
function encrypt(){
	var asString=$('#password').val();
	$('#eventList').append(asString);
}
