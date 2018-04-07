<?php
	ob_start();

	require_once('../resources/config.php');

	// username and password sent from form
    $id = $_POST['user_id'];
	// $email = $_POST['email'];
	$pwd = $_POST['password']; 

    $sql = "SELECT * FROM $usersTable WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $id);  // Bind "$id" to parameter.
    $stmt->execute();    // Execute the prepared query.
    $stmt->store_result();
    // get variables from result.
    $stmt->bind_result($user_id, $email, $role, $enabled, $last_login, $db_password);
    $stmt->fetch();

    if ($stmt->num_rows == 1) {
        $pwd = password_hash($pwd, PASSWORD_DEFAULT);
        $sql = "UPDATE $usersTable SET password = '$pwd' WHERE id = $user_id";
        if ($conn->query($sql)) {

            session_start ();
            $_SESSION["logged_in"] = true;
            $user_browser = $_SERVER['HTTP_USER_AGENT'];
            // XSS protection as we might print this value
            $user_id = preg_replace("/[^0-9]+/", "", $user_id);
            $_SESSION['user_id'] = $user_id;
            // XSS protection as we might print this value
            $_SESSION['email'] = $email;
            $_SESSION['role'] = $role;
            $_SESSION['enabled'] = $enabled;
            $_SESSION['login_string'] = hash('sha512', $pwd . $user_browser);

            insert_login_attempt($user_id, 'SUCCESS');
            echo "Password was updated!!!";
            // header("location: ../main/scorer.php");
        } else {
            // header("Location: ../main/error.html?error=Could_not_insert_new_password");
            echo "Error: " . $conn->error;
        }
    } else {
        // header("Location: ../main/error.html?error=Wrong_Username");
        echo "Error: User with ID: " . $id . " was not found!!!";
    }

	ob_end_flush();
?>