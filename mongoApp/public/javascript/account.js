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
$(document).ready(function(){
	//$('#testbutton').click(function(){
		setOrgName();
		changeAccess();
	//});
});

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
	for (i = data.length-1; i >= 0; i--) {
	    if(!data[i].Title || !data[i].Details) continue;
	    //if(!data[i].Reports) continue;
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

    endTime = document.createElement("h3");
    endTime.className = "post-subtitle";
    endTime.appendChild(document.createTextNode("End Time: " + correctDate(data.EndTime)));
    anchor.appendChild(endTime);

    descriptionHeader = document.createElement("h3");
    descriptionHeader.className = "post-subtitle";
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    

    descriptionText = document.createElement("h3");
    descriptionText.className = "post-subtitle";
    descriptionText.appendChild(document.createTextNode(data.Details));
    anchor.appendChild(descriptionText);

    var form = document.createElement("form");
    form.setAttribute('method', "post");
    form.setAttribute('action', "/deleteEvent");

    var input = document.createElement("input");
    input.setAttribute('type', "text");
    input.setAttribute('eventname', data.Title);
    input.setAttribute('value', data.Title);

    var button = document.createElement("button");
    button.setAttribute('type', "submit");
    button.innerHTML = 'Delete';
    
    var myHR = document.createElement("HR");
    ret.appendChild(myHR);

    return (ret);
}
function setOrgName(){
	$.get("http://localhost:3000/fetchOrgName",{}, function(stuff){
	$('#orgTitle').append("<h1>"+stuff+"</h1>");
	});
	
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
//alert(getQueryVariable("query"));
updateEventsList();
//setOrgName();
