<?php
	ob_start();

	require_once('./config.php');

	// username and password sent from form 
	$email = $_POST['email']; 
	$pwd = $_POST['password']; 

    $sql = "SELECT * FROM $usersTable WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
    $stmt->execute();    // Execute the prepared query.
    $stmt->store_result();
    // get variables from result.
    $stmt->bind_result($user_id, $email, $role, $enabled, $last_login, $db_password);
    $stmt->fetch();

    if ($stmt->num_rows == 1) {
        if (password_verify($pwd, $db_password)) {

            session_start ();
            $_SESSION["logged_in"] = true;
            // header("location: ../main/scorer.php");
            // Password is correct!
            // Get the user-agent string of the user.
            $user_browser = $_SERVER['HTTP_USER_AGENT'];
            // XSS protection as we might print this value
            $user_id = preg_replace("/[^0-9]+/", "", $user_id);
            $_SESSION['user_id'] = $user_id;
            // XSS protection as we might print this value
            // $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);
            $_SESSION['email'] = $email;
            $_SESSION['role'] = $role;
            $_SESSION['enabled'] = $enabled;
            $_SESSION['login_string'] = hash('sha512', $db_password . $user_browser);
            
            if (is_null($last_login)) {
                header("location: ../main/update-pwd.php?id=$user_id");
            } else {
                insert_login_attempt($user_id, 'SUCCESS');
                header("location: ../main/scorer.php");
                // Login successful.
                // return true;
            }
        } else {
            // Password is not correct
            // We record this attempt in the database
            // $now = time();
            insert_login_attempt($user_id, 'FAIL');
            // $conn->query("INSERT INTO $loginAttemptsTable (user_id, time) VALUES ('$user_id', NOW())");
            header("Location: ../main/error.html?error=Wrong_Password");
            // return false;
        }
    } else {
        header("Location: ../main/error.html?error=Wrong_Username");
    }

	ob_end_flush();
?>