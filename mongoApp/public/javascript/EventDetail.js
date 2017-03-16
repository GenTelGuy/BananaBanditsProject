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

// make the div for this event, same as in post.js
function eventDiv(data) {

    ret = document.createElement("p");
    ret.className = "desc-text";

    /*header = document.createElement("h3");
    header.appendChild(document.createTextNode(data.Title));
    ret.appendChild(header);*/

    startTime = document.createElement("p");
    startTime.appendChild(document.createTextNode("Start Time: " + correctDate(data.StartTime)));
    ret.appendChild(startTime);

    descriptionHeader = document.createElement("h1");
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    ret.appendChild(startTime);

    endTime = document.createElement("p");
    endTime.appendChild(document.createTextNode("End Time: " + correctDate(data.EndTime)));
    ret.appendChild(endTime);

    descriptionHeader = document.createElement("h1");
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    ret.appendChild(endTime);

    descriptionText = document.createElement("p");
    descriptionText.appendChild(document.createTextNode(data.Details));
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
            form.setAttribute('action', "/deleteEvent");
            form.setAttribute('method', "post");
            form.appendChild(ret);

    input = document.createElement("input");
            input.setAttribute('type', "hidden");
            input.setAttribute('name', "eventname")
            input.setAttribute('value', data.Title);

    pin = document.createElement("input");
        pin.setAttribute('type', "hidden");
        pin.setAttribute('name', "eventpin");
        pin.setAttribute('value', data.Title);
        pin.setAttribute('formaction', "/pinEvent");

    edit = document.createElement("input");
        edit.setAttribute('type', "hidden");
        edit.setAttribute('name', "editevent");
        edit.setAttribute('value', data._id);
        pin.setAttribute('formaction', "/edit");

    report= document.createElement("input");
        report.setAttribute('type',"hidden");
	report.setAttribute('name',"reportEvent");
	report.setAttribute('value',data.Title);
	report.setAttribute('formaction',"/report");
   
    clearReport= document.createElement("input");
        clearReport.setAttribute('type',"hidden");
	clearReport.setAttribute('name',"clearReport");
	clearReport.setAttribute('value',data.Title);
	clearReport.setAttribute('formaction',"/clearReport");
 
    reportButton=document.createElement("button");
    reportButton.setAttribute('type',"submit");
    reportButton.setAttribute('formaction',"/report");
    reportButton.innerHTML='Report';
    form.appendChild(report);
    form.appendChild(reportButton);
    
    $.get("http://localhost:3000/checkAdmin", {}, function(data) {
        if(data == "admin") {
            /**
            form = document.createElement("form");
            form.setAttribute('action', "/deleteEvent");
            form.setAttribute('method', "post");
            form.appendChild(ret);*/


            button = document.createElement("button");
            button.setAttribute('type', "submit");
            button.innerHTML = 'Delete';

            button2 = document.createElement("button");
            button2.setAttribute('type', "submit");
            button2.setAttribute('formaction', "/pinEvent");
            button2.innerHTML = 'Feature Event';

            button3 = document.createElement("button");
            button3.setAttribute('type', "submit");
            button3.setAttribute('formaction', "/edit");
            button3.innerHTML = 'Edit Event';

    	    clearButton=document.createElement("button");
 	    clearButton.setAttribute('type',"submit");
	    clearButton.setAttribute('formaction',"/clearReport");
	    clearButton.innerHTML='clear';

            form.appendChild(input);
            form.appendChild(button);

            form.appendChild(pin);
            form.appendChild(button2);

            form.appendChild(edit);
            form.appendChild(button3);
	    
	    form.appendChild(clearReport);
	    form.appendChild(clearButton);

        }
    $.get("http://localhost:3000/accountId",{},function(stuff){
	    if(data.Org==stuff){
	    	button = document.createElement("button");
            	button.setAttribute('type', "submit");
            	button.innerHTML = 'Delete';

	    	button3 = document.createElement("button");
            	button3.setAttribute('type', "submit");
           	button3.setAttribute('formaction', "/edit");
            	button3.innerHTML = 'Edit Event';

	    	form.appendChild(input);
            	form.appendChild(button);
	    	form.appendChild(edit);
            	form.appendChild(button3);
	    }
    });

    });
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
updateEventsList();
