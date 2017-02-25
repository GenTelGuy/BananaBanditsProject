function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function updateEventsList() {
    response = $.get('http://localhost:3000/eventDetailQuery', {"$oid": getQueryVariable("query")}, function (data) {
        $('#eventList').empty();
        //console.log(data);
        allEvents = [];
        for (i = 0; i < data.length; i++) {
            createdDiv = eventDiv(data[i]);
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(),
                data[i].Details.toLowerCase()],
                //div: createdDiv
            }
            allEvents.push(a);
            //alert(data[i].Details);
            $('#eventList').append(createdDiv);
        }
    });
}

function eventDiv(data) {

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

    return (ret);
}


//alert(getQueryVariable("query"));
updateEventsList();