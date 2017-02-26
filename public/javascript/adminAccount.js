$(document).ready(function () {
    /* if button pushed pull all events, not truly needed but was used
        initially to check if page working
    */
    $('#updateEvents').click(function () {
        updateEventsList();
    });
    var allEvents = [];

});

/* pull events from data and write to page */
function updateEventsList() {
    response = $.get('http://localhost:3000/data', {}, function (data) {
        $('#eventList').empty();
        allEvents = [];
        for (i = 0; i < data.length; i++) {
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

/* filter events specifically for user, dont user search bar */
function filterEvents(string) {
    searchString = string
    for (i = 0; i < allEvents.length; i++) {
        evt = allEvents[i];
        match = false;
        for (j = 0; j < evt.searchableText.length; j++) {
            str = evt.searchableText[j];
            if (str.includes(searchString.toLowerCase()) ||
                str === "") {
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


function eventDiv(data) {
    
    //console.log(data);

    ret = document.createElement("div");
    ret.className = "Event";

    header = document.createElement("h3");
    header.appendChild(document.createTextNode(data.Title));
    ret.appendChild(header);

    startTime = document.createElement("p");
    //var date = correctDate(data.StartTime);
    startTime.appendChild(document.createTextNode("Start time: " + data.StartTime));
    ret.appendChild(startTime);

    descriptionHeader = document.createElement("h1");
    descriptionHeader.appendChild(document.createTextNode("Details: "));
    ret.appendChild(startTime);

    descriptionText = document.createElement("p");
    descriptionText.appendChild(document.createTextNode(data.Details));
    ret.appendChild(descriptionText);
    
    detailLink = document.createElement("a");
    detailLink.href = "http://localhost:3000/eventDetail?query="+data._id;
    linkText = document.createTextNode("See Event Details");
    detailLink.appendChild(linkText);
    //detailLink.title="See Event Details";
    ret.appendChild(detailLink);

    return (ret);
}
