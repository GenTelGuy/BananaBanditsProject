$(document).ready(function () {

    updateStartDays($('#startMonth').val(), $('#startYear').val());
    $('#startMonth').change(function () {
        updateStartDays($('#startMonth').val(), $('#startYear').val());

    });
    $('#startYear').change(function () {
        updateStartDays($('#startMonth').val(), $('#startYear').val());
    });

    updateEndDays($('#endMonth').val(), $('#endYear').val());
    $('#endMonth').change(function () {
        updateEndDays($('#endMonth').val(), $('#endYear').val());

    });
    $('#endYear').change(function () {
        updateEndDays($('#endMonth').val(), $('#endYear').val());
    });
    changeAccess();
});

function updateStartDays(month, year) {
    monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 == 0 && year % 100 != 0) {
        monthDays[1] = 29;
    }
    $('#startDay').empty();
    var formattedMonth;
    if (month.charAt(0) == "0")
        formattedMonth = month.charAt(1);
    else formattedMonth = month;
    // Month starts at 0, not 1, and day always needs to be 2 characters
    for (i = 1; i <= monthDays[formattedMonth - 1]; i++) {
        if (i < 10)
            i = "0" + i;
        $('#startDay').append($('<option>', {
            value: i,
            text: i
        }));
    }
}

function changeAccess(){
	$.get('http://localhost:3000/getSignedIn', {}, function (data){
                        if(data=="USER"){
				$('#access').empty();
				console.log("Signed in");
				$('#access').append('<a href="/account">Account</a>');
				$('#list').append('<li><a href="/logout">Sign Out</a></li>');
			}

	});
}
function updateEndDays(month, year) {
    monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 == 0 && year % 100 != 0) {
        monthDays[1] = 29;
    }
    $('#endDay').empty();
    var formattedMonth;
    if (month.charAt(0) == "0")
        formattedMonth = month.charAt(1);
    else formattedMonth = month;
    for (i = 1; i <= monthDays[formattedMonth - 1]; i++) {
        if (i < 10)
            i = "0" + i;
        $('#endDay').append($('<option>', {
            value: i,
            text: i
        }));
    }
}
