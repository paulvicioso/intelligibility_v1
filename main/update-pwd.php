<?php
// session_start();
// if(!isset($_SESSION['logged_in']) ) {
//   // header("location:admin.php");
//   header("Location: ./error.html?error=You_are_not_logged_in");
// } else {
//     setcookie("email", $_SESSION['email']);
//     setcookie("role", $_SESSION['role']);
//     setcookie("enabled", $_SESSION['enabled']);
//     setcookie("login_string", $_SESSION['login_string']);
// }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Speech Study</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <!-- bootstrap css -->
    <!-- Latest compiled Bootstrap and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/narrow-style.css">
    
    <!--[if IE]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <script src="../js/global.js"></script>
    <script src="../js/password.js"></script>

</head>

<body>
    <div class="container">
        <div class="header">
            <h3 class="text-muted">Speech Study</h3>
        </div>

        <br><br>
        
        <div class="well">
            <form class="form-horizontal" name="form1" method="post">
                <fieldset>

                    <legend>Update Password</legend>

                    <div class="form-group">
                        <label class="col-md-4 control-label">New Password</label>
                        <div class="col-md-4">
                            <input class="form-control" name="password" type="password" id="password">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Repeat New Password</label>
                        <div class="col-md-4">
                            <input class="form-control" name="repeated_password" type="password" id="repeated_password">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-2 col-md-offset-6">
                            <button id="update_pwd" type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>

        <div id="error_msg" class="alert alert-danger">
        </div>
        
        <footer class="footer">
            <!-- <p>&copy; USU 2014</p> -->
        </footer>

    </div>
    <!-- /container -->

</body>

</html>