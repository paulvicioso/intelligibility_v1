
var id;

$(function() {

    // get the user ID from the param
    id = getQueryParam('id');
    $('#error_msg').hide();

    $("#update_pwd").click(function() {

        var pwd = $('#password').val();
        var repeatedPwd = $('#repeated_password').val();

        if (!id || !pwd || !repeatedPwd) {
            console.log('Must complete all fields!!!');
            $('#error_msg').html('<strong>Error:</strong> Must complete all fields!!!');
            $('#error_msg').show();
            $('#email').focus();
        } else {
            
            if (pwd !== repeatedPwd) {
                console.log('Passwords do not match!!!');
                $('#error_msg').html('<strong>Error:</strong> Passwords do not match!!!');
                $('#error_msg').show();
                $('#password').val("");
                $('#repeated_password').val("");
                $('#password').focus();
            } else {
                updatePassword(id, pwd);
                $('#error_msg').hide();
                window.location.href = "../main/scorer.php";
            }
        }

    });
});

function updatePassword(user_id, newPwd) {

    $.ajax({
        type: 'POST',
        url: '../db/db-update-pwd.php',
        data: {
            user_id: user_id,
            password: newPwd
        },
        success: function(data) {
            console.log(data);
        },
        error: function(msg) {
            console.log(msg);
        }
    });
}

