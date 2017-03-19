// gets the string from the end of the url that holds the objectID
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


//TODO refactor div to p in function names etc
function updateAccountsList() {
    // fetch data on the events in the database
    response = $.get('http://localhost:3000/accountDetailQuery', {"$oid":getQueryVariable("query")}, function (data) {
        $('#accountList').empty();
        allAccounts = [];
        for (i = 0; i < data.length; i++) {
            if(!data[i].Org) continue;
	    setOrgName(data[i]);
	    createdDiv = accountDiv(data[i]);
            a = {
                visible: true,
                searchableText: [data[i].Org.toLowerCase(),
                data[i].OrgBio.toLowerCase()],
            }
            allAccounts.push(a);
	    $('#accountDiv').append(createdDiv);
            //$('#title').append(data[i].Org);
        }
    });
}

function accountDiv(data){
    ret = document.createElement("p");
    ret.className = "desc-text";


    descriptionText = document.createElement("p");
    descriptionText.appendChild(document.createTextNode(data.OrgBio));
    ret.appendChild(descriptionText);
    
    contactEmail=document.createElement("p");
    contactEmail.className="post-subtitle";
    contactEmail.appendChild(document.createTextNode("Email: "+data.Email));
    ret.appendChild(contactEmail);

    contactNumber=document.createElement("p");
    contactNumber.className="post-subtitle";
    contactNumber.appendChild(document.createTextNode("Phone: "+data.Phone));
    ret.appendChild(contactNumber);

    form = document.createElement("form");
            form.setAttribute('action', "/deleteAccount");
            form.setAttribute('method', "post");
            form.appendChild(ret);

    input = document.createElement("input");
            input.setAttribute('type', "hidden");
            input.setAttribute('name', "accountname")
            input.setAttribute('value', data.Org);

    accept= document.createElement("input");
        accept.setAttribute('type',"hidden");
	accept.setAttribute('name',"verify");
	accept.setAttribute('value',data.Org);
	accept.setAttribute('formaction',"/verify");
 
    $.get('http://localhost:3000/checkAdmin',{},function(stuff){
            if(stuff=="admin"){
	    button = document.createElement("button");
            button.setAttribute('type', "submit");
            button.innerHTML = 'Delete';

	    acceptButton=document.createElement("button");
	    acceptButton.setAttribute('type',"submit");
	    acceptButton.setAttribute('formaction',"/verify");
	    acceptButton.innerHTML='Verify';

            form.appendChild(input);
            form.appendChild(button);

	    form.appendChild(accept);
	    form.appendChild(acceptButton);
	    }
	  });

    return form;

}

function changeAccess(){
	$.get('http://localhost:3000/getSignedIn', {}, function (data){
                        if(data=="USER"){
				$('#access').empty();
				$('#access').append('<a href="/account">Account</a>');
				$('#list').append('<li><a href="/logout">Sign Out</a></li>');
			}

	});
}

// set orgName at top of page
function setOrgName(data){
	var name=data.Org;
	$('#orgTitle').append("<h1>"+name+"</h1>");
	
	
}

// makes the date appear in a readable format
function correctDate(data) {
    var date = new Date(data)
    var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " ";
    var hour = date.getHours();
    var minutes = date.getMinutes();
    if (minutes < 11)
        minutes += '0';
    // need to adjust for daylight savings, since db stores everything in PST
    if (date.getTimezoneOffset() == 420)
        hour -= 1;
    if (hour > 12)
        return dateString + (hour - 12) + ":" + minutes + " PM";
    if (hour == 0)
        return dateString + "12:" + minutes + " AM";
    if (hour == 12)
        return dateString + hour + ":" + minutes + " PM";
    return dateString + hour + ":" + minutes + " AM";
}


changeAccess();
updateAccountsList();
