
$( document ).ready(function() {
    $('#updateEvents').click(function(){
        updateEventsList();
    });
    $('#searchBar').keyup(function(){
        filterEvents();
        updateEventDivs();
    });

    var allEvents = [];

});

function updateEventsList(){
    response = $.get('http://localhost:3000/data', {}, function(data){
        $('#eventList').empty();
        allEvents = [];
        for(i=0; i<data.length; i++){
            createdDiv = eventDiv(data[i]);
            a = {
                visible: true,
                searchableText: [data[i].Title.toLowerCase(), 
                                data[i].Description.toLowerCase()],
                div: createdDiv
            }
            allEvents.push(a);
            $('#eventList').append(createdDiv);
        }
    });
}

function filterEvents(){
    searchString = $('#searchBar').val();
    for(i=0; i<allEvents.length; i++){
        evt = allEvents[i];
        match=false;
        for(j=0; j<evt.searchableText.length; j++){
            str=evt.searchableText[j];
            if(str.includes(searchString.toLowerCase()) || 
                str===""){
                match=true;
            }
        }
        evt.visible=match;
    }
        
}

function updateEventDivs(){
    for (i=0; i<allEvents.length; i++){
        evt=allEvents[i];
        if(evt.visible){
            evt.div.style.display='block';
        }
        else{
            evt.div.style.display='none';
        }
    }
}


function eventDiv(data){

    ret = document.createElement( "div" );
    ret.className="Event";

    header=document.createElement("h3");
    header.appendChild(document.createTextNode(data.Title));
    ret.appendChild(header);

    startTime=document.createElement("p");
    startTime.appendChild(document.createTextNode("Start time: " + data.StartMonth + "/" + data.StartDay));
    ret.appendChild(startTime);

    descriptionHeader=document.createElement("h1");
    descriptionHeader.appendChild(document.createTextNode("Description: "));
    ret.appendChild(startTime);

    descriptionText=document.createElement("p");
    descriptionText.appendChild(document.createTextNode(data.Description));
    ret.appendChild(descriptionText);
    
    return(ret);
}
