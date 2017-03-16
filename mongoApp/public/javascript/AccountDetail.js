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
        $('#accountDiv').empty();
        allAccounts = [];
        for (i = 0; i < data.length; i++) {
            if(!data[i].Org) continue;
	    setOrgName(data[i]);
	    createdDiv = accountDiv(data[i]);
            a = {
                visible: true,
                searchableText: [data[i].Org.toLowerCase(),
                data[i].OrgBio.toLowerCase()],
                div: createdDiv
            }
            allAccounts.push(a);
	    $('#accountDiv').append(createdDiv);
            //$('#title').append(data[i].Org);
        }
    });
}

// similar to updateEventsList in post.js, but queries for an event by objectID
function updateEventsList() {
    // direct to eventDetailQuery with the objectID
    response = $.get('http://localhost:3000/eventDetailQuery', { "$oid": getQueryVariable("query") }, function (data) {
        $('#eventList').empty();
        allEvents = [];
        for (i = 0; i < data.length; i++) {
	    createdDiv = eventDiv(data[i]);
        
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(),
                data[i].Details.toLowerCase()],
            }
            allEvents.push(a);
            $('#eventDiv').append(createdDiv);
            
            
            $('#title').text(data[i].Title);
            //$('#date').text(correctDate(data[i].startTime));
            //$('#time').text(correctTime())
        }
    });
}
function accountDiv(data) {
    
    
    ret = document.createElement("p");
    ret.className = "desc-text";
    
    anchor=document.createElement("a");
    anchor.href = "/accountDetail?query=" + data._id;
    ret.appendChild(anchor);

    header = document.createElement("h2");
    header.className="post-title";
    header.appendChild(document.createTextNode(data.Org));
    ret.appendChild(header);

    descriptionHeader = document.createElement("h3");
    descriptionHeader.className = "post-subtitle";
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    

    descriptionText = document.createElement("h3");
    descriptionText.className = "post-subtitle";
    descriptionText.appendChild(document.createTextNode(data.orgEmail));
    ret.appendChild(descriptionText);
    form = document.createElement("form");
            form.setAttribute('action', "/deleteEvent");
            form.setAttribute('method', "post");
            form.appendChild(ret);
    verify=document.createElement("input");
        verify.setAttribute('type',"hidden");
	verify.setAttribute('name',"verify");
	verify.setAttribute('value',data.Org);
	verify.setAttribute('formaction',"/verify");
    verifyButton=document.createElement("button");
        verifyButton.setAttribute('type',"submit");
	verifyButton.setAttribute('formaction',"/verify");
	verifyButton.innerHTML='Verify';
	form.appendChild(verify);
	form.appendChild(verifyButton);
    
    var myHR = document.createElement("HR");
    ret.appendChild(myHR);

    return form;
}
function changeAccess(){
	$.get('http://localhost:3000/getSignedIn', {}, function (data){
                        if(data=="USER"){
				$('#access').empty();
				console.log("Signed in");
				$('#access').append('<a href="account">Account</a>');
				$('#list').append('<li><a href="logout">Sign Out</a></li>');
			}

	});
}
function setOrgName(data){
	var name=data.Org;
	console.log(name);
	$('#orgTitle').append("<h1>"+name+"</h1>");
	
	
        //updateEventsList();
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


//alert(getQueryVariable("query"));
changeAccess();
updateAccountsList();
