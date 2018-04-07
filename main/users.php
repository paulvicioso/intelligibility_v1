<?php
session_start();
if(!isset($_SESSION['logged_in']) ) {
  // header("location:admin.php");
  header("Location: ./error.html?error=You_are_not_logged_in");
} else {
    if ($_SESSION['role'] != 'administrator') {
        header("Location: ./error.html?error=You_do_not_have_permisson_to_access_this_page");
    }
}
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
    <!--<script src="../js/jquery.cookie.js"></script>-->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    
    <script src="../js/global.js"></script>
    <script src="../js/users.js"></script>

</head>

<body>
    <div class="container">
        <div class="header">
            <h3 class="text-muted">Intelligibility Scorer</h3>
        </div>

        <div class="well">
            <form class="form-horizontal">
                <fieldset>

                    <legend>Insert New User</legend>
                    
                    <div class="form-group">
                        <label class="col-md-4 control-label">Username (email)</label>
                        <div class="col-md-8">
                            <input id="email" class="form-control" type="text" placeholder="Email">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Password</label>
                        <div class="col-md-8">
                            <input id="password" class="form-control" type="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Repeat Password</label>
                        <div class="col-md-8">
                            <input id="repeated_password" class="form-control" type="password" placeholder="Repeat Password">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Role</label>
                        <div class="col-md-8">
                            <select id="role" class="form-control" >
                                <option value="administrator">Administrator</option>
                                <option value="researcher">Researcher</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </fieldset>
            </form>
            <div class="row">
                <div class="col-md-offset-8 col-md-4">
                    <button id="sudmit_user" class="btn btn-default pull-right">Submit</button>
                </div>
            </div>
        </div>
        
        <div id="error_msg" class="alert alert-danger">
        </div>
        <br>
        <br>
        <footer class="footer">
            <!-- <p>&copy; USU 2014</p> -->
        </footer>

    </div>
    <!-- /container -->

</body>

</html>