function checkPass(){
	var pass1=document.getElementById('orgPassword');
	var pass2=document.getElementById('verifyPassword');
	var message=document.getElementById('confirmMessage');
	var button=document.getElementById('submit');
	if(pass1.value==pass2.value){
		message.innerHTML="Passwords Match!";
		button.disabled="";
	}
	else{
		message.innerHTML="Passwords Do Not Match";
		button.disabled="disabled";

	}
}
function checkEmail(){
	var emailString=document.getElementById('orgEmail').value;
	var message=document.getElementById('confirmMessage2');
	var button=document.getElementById('submit');
	if(!emailString.includes("@")){
		message.innerHTML="Invalid Email";
		button.disabled="disabled";
	}
	else{
		message.innerHTML="";
		button.disabled="";
	}
}
