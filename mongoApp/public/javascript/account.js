// gets the string from the end of the url that holds the objectID
/*function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}*/


//TODO refactor div to p in function names etc

// similar to updateEventsList in post.js, but queries for an event by objectID
function updateReportedEventsList() {
    // direct to eventDetailQuery with the objectID
    response = $.get('http://localhost:3000/allEventData', {}, function (data) {
        $('#eventList').empty();
        allEvents = [];
        for (i = 0; i < data.length; i++) {
            if(!data[i].Title || !data[i].Details) continue;
	    if(!data[i].Reports) continue;
	    createdDiv = eventDiv(data[i]);
        
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(),
                data[i].Details.toLowerCase()],
		div: createdDiv
            }
            allEvents.push(a);
            $('#eventList').append(createdDiv);
            
            
            //$('#date').text(correctDate(data[i].startTime));
            //$('#time').text(correctTime())
        }
    });
}function updateEventsList() {
    // direct to eventDetailQuery with the objectID
        response = $.get('http://localhost:3000/allEventData', {}, function (data) {
        $('#eventList').empty();
        allEvents = [];
        $.get("http://localhost:3000/accountId",{},function(stuff){
	for (i = 0; i < data.length; i++) {
	    if(!data[i].Title || !data[i].Details) continue;
	    //if(!data[i].Reports) continue;
	    console.log(stuff);
	    console.log(data[i].Title);
	    console.log(data[i].Org);
	    if(data[i].Org!=stuff) continue;
	    createdDiv = eventDiv(data[i]);
        
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(),
                data[i].Details.toLowerCase()],
		div: createdDiv
            }
            allEvents.push(a);
            $('#eventList').append(createdDiv);
            
            
            //$('#date').text(correctDate(data[i].startTime));
            //$('#time').text(correctTime())
	}
	});
    });
}

// make the div for this event, same as in post.js
/*function eventDiv(data) {

    ret = document.createElement("div");
    //ret.className = "desc-text";


    anchor=document.createElement("a");
    anchor.href = "/eventDetail?query=" + data._id;
    ret.appendChild(anchor);
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

    form = document.createElement("p");
            //form.setAttribute('action', "/deleteEvent");
            //form.setAttribute('method', "post");
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

    $.get("http://localhost:3000/checkAdmin", {}, function(data) {
        if(data == "admin") {
            
            form = document.createElement("form");
            form.setAttribute('action', "/deleteEvent");
            form.setAttribute('method', "post");
            form.appendChild(ret);


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

            form.appendChild(input);
            form.appendChild(button);

            form.appendChild(pin);
            form.appendChild(button2);

            form.appendChild(edit);
            form.appendChild(button3);

        }
    });
    return form;
}*/
function eventDiv(data) {
    
    
    ret = document.createElement("div");
    ret.className = "post-preview";
    
    anchor=document.createElement("a");
    anchor.href = "/eventDetail?query=" + data._id;
    ret.appendChild(anchor);

    header = document.createElement("h2");
    header.className="post-title";
    header.appendChild(document.createTextNode(data.Title));
    anchor.appendChild(header);

    startTime = document.createElement("h3");
    startTime.className = "post-subtitle";
    startTime.appendChild(document.createTextNode("Start Time: " + correctDate(data.StartTime)));
    anchor.appendChild(startTime);

    /*descriptionHeader = document.createElement("h3");
    descriptionHeader.className = "post-subtitle";
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    anchor.appendChild(startTime);*/

    endTime = document.createElement("h3");
    endTime.className = "post-subtitle";
    endTime.appendChild(document.createTextNode("End Time: " + correctDate(data.EndTime)));
    anchor.appendChild(endTime);

    descriptionHeader = document.createElement("h3");
    descriptionHeader.className = "post-subtitle";
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    
    //ret.appendChild(endTime);

    descriptionText = document.createElement("h3");
    descriptionText.className = "post-subtitle";
    descriptionText.appendChild(document.createTextNode(data.Details));
    anchor.appendChild(descriptionText);

    // make a link to take the user to the detail page for this event
    //detailLink = document.createElement("a");
    // the url contains the id of the event object
    //detailLink.href = "http://localhost:3000/eventDetail?query=" + data._id;
    //linkText = document.createTextNode("See Event Details");
    //detailLink.appendChild(linkText);
    //anchor.appendChild(detailLink);

    var form = document.createElement("form");
    form.setAttribute('method', "post");
    form.setAttribute('action', "/deleteEvent");

    var input = document.createElement("input");
    input.setAttribute('type', "text");
    input.setAttribute('eventname', data.Title);
    input.setAttribute('value', data.Title);
    //console.log(data.Title);

    var button = document.createElement("button");
    button.setAttribute('type', "submit");
    button.innerHTML = 'Delete';
    
    var myHR = document.createElement("HR");
    ret.appendChild(myHR);

    /**form.appendChild(input);
    form.appendChild(button);
    ret.appendChild(form);*/

    return (ret);
}

function checkingUserAdminInfo(){
	$.get("http://localhost:3000/checkAdmin", {}, function(data) {
        if(data == "admin") {
		updateReportedEventsList();
	}
	else{
		updateEventsList();
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
//updateEventsList();
checkingUserAdminInfo();
