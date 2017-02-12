
$( document ).ready(function() {
    console.log( "ready!" );
    $('#test').click(function(){
        $.get('http://localhost:3000/data', {}, function(data){
            console.log(data)
            });
    });

    updateDays($('#month').val()); 
    $('#month').change(function(){
        updateDays($('#month').val()); 

    })
});

function updateDays(month){
    year=2017;
    monthDays=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(year%4==0 && year%100!=0){
        monthDays[1]=29;
    }
    $('#day').empty();
    for(i=1; i<=monthDays[month-1]; i++){
        $('#day').append($('<option>', {
            value: i,
            text: i
        }));
    }

}
