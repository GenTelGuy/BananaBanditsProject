var allEvents = [];

$(document).ready(function () {
    
    // when user clicks the button, make a list of the events
    $('#updateEvents').click(function () {
        updateEventsList();
    });
    // when the user searches, filter the event sand update the page
    $('#searchBar').keyup(function () {
        filterEvents();
        updateEventDivs();
    });

    
    updateEventsList();
    filterEvents();
    updateEventDivs();
    changeAccess();
});

// update the list of events that are shown
function updateEventsList() {
    // fetch data on the events in the database
    response = $.get('http://localhost:3000/allEventData', {}, function (data) {
        $('#eventList').empty();
        allEvents = [];
        // make divs for each event and display them
        for (i = 0; i < data.length; i++) {
            if(!data[i].Title || !data[i].Details) continue;
	    if(!data[i].Featured) continue;
	    createdDiv = eventDiv(data[i]);
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(),
                data[i].Details.toLowerCase()],
                div: createdDiv
            }
            allEvents.push(a);
            $('#eventList').append(createdDiv);
        }
    });
}

// filter functionality
function filterEvents() {
    searchString = $('#searchBar').val();
    // search for events that match the search string and only display those
    for (i = 0; i < allEvents.length; i++) {
        evt = allEvents[i];
        match = false;
        for (j = 0; j < evt.searchableText.length; j++) {
            str = evt.searchableText[j];
            if (str.includes(searchString.toLowerCase()) ||
                searchString === "") {
                match = true;
            }
        }
        evt.visible = match;
    }

}

function updateEventDivs() {
    for (i = 0; i < allEvents.length; i++) {
        evt = allEvents[i];
        if (evt.visible) {
            evt.div.style.display = 'block';
        }
        else {
            evt.div.style.display = 'none';
        }
    }
}

// make the div for an event
function eventDiv(data) {
    
    /*<div class="post-preview">
                    <a href="post.html">
                        <h2 class="post-title">
                        	EVENT 2
						</h2>
                        <h3 class="post-subtitle">
                        	Details <br>
							Date <br>
							Location <br>
							Time <br>
							Link to Social Media <br>
						</h3>
                    </a>
                    <p class="post-meta">Posted by <a href="#">Organization</a> Date</p></div>
                <hr>*/

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

