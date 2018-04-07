<?php

require_once('../resources/config.php');

session_start();

$my_session = array($_SESSION["logged_in"], $_SESSION['email'], $_SESSION['role'], $_SESSION['enabled'], $_SESSION['login_string']);

echo json_encode($my_session);

?>