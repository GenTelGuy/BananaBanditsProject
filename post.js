$('#test').click(function(){
   $.get('http://localhost:3000/data', {}, function(data){
        console.log("ABCDEFG")
   });
});

alert("ABC");
