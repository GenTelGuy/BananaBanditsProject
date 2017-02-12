$( document ).ready(function() {

    updateStartDays($('#startMonth').val(), $('#startYear').val()); 
    $('#startMonth').change(function(){
        updateStartDays($('#startMonth').val(), $('#startYear').val()); 

    });
    $('#startYear').change(function(){
        updateStartDays($('#startMonth').val(), $('#startYear').val()); 
    });

    updateEndDays($('#endMonth').val(), $('#endYear').val()); 
    $('#endMonth').change(function(){
        updateEndDays($('#endMonth').val(), $('#endYear').val()); 

    });
    $('#endYear').change(function(){
        updateEndDays($('#endMonth').val(), $('#endYear').val()); 
    });
});

function updateStartDays(month, year){
    monthDays=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(year%4==0 && year%100!=0){
        monthDays[1]=29;
    }
    $('#startDay').empty();
    for(i=1; i<=monthDays[month-1]; i++){
        $('#startDay').append($('<option>', {
            value: i,
            text: i
        }));
    }
}

function updateEndDays(month, year){
    monthDays=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(year%4==0 && year%100!=0){
        monthDays[1]=29;
    }
    $('#endDay').empty();
    for(i=1; i<=monthDays[month-1]; i++){
        $('#endDay').append($('<option>', {
            value: i,
            text: i
        }));
    }
}
