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

    var allEvents = [];

});

// update the list of events that are shown
function updateEventsList() {
    // fetch data on the events in the database
    response = $.get('http://localhost:3000/allEventData', {}, function (data) {
        $('#eventList').empty();
        allEvents = [];
        // make divs for each event and display them
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

    ret = document.createElement("div");
    ret.className = "Event";

    header = document.createElement("h3");
    header.appendChild(document.createTextNode(data.Title));
    ret.appendChild(header);

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

    // make a link to take the user to the detail page for this event
    detailLink = document.createElement("a");
    // the url contains the id of the event object
    detailLink.href = "http://localhost:3000/eventDetail?query=" + data._id;
    linkText = document.createTextNode("See Event Details");
    detailLink.appendChild(linkText);
    ret.appendChild(detailLink);

    return (ret);
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
