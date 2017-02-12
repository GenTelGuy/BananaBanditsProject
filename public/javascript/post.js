
$( document ).ready(function() {
    console.log( "ready!" );
    $('#test').click(function(){
        $.get('http://localhost:3000/data', {}, function(data){
            console.log(data)
            });
    });

    
});


