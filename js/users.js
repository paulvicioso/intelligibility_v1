
$(function() {

    $('#error_msg').hide();

    $("#sudmit_user").click(function() {
        var email = $('#email').val();
        var pwd = $('#password').val();
        var repeatedPwd = $('#repeated_password').val();
        var role = $('#role').val();

        if (!email || !pwd || !repeatedPwd || !role) {
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
                // console.log('Passwords match!!!');
                if (!isEmail(email)) {
                    $('#email').focus();
                    console.log('Not valid email!!!');
                    $('#error_msg').html('<strong>Error:</strong> Not valid email!!!');
                    $('#error_msg').show();
                } else {
                    insertNewUser(email, pwd, role);
                    $('#error_msg').hide();
                }
            }
        }

    });
});

function insertNewUser(email, pwd, role) {

    $.ajax({
        type: 'POST',
        url: '../db/insert-user.php',
        data: {
            email: email,
            password: pwd,
            role: role
        },
        success: function(data) {
            console.log(data);
        },
        error: function(msg) {
            console.log(msg);
        }
    });
}