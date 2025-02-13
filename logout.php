<?php
session_start();

function logout() {
    // Destroy the session
    session_unset(); 
    session_destroy(); 

    // Redirect to home or login page
    header("Location: login.php");
    exit();
}

// Call the function if the script is accessed directly via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    logout();
} else {
    // Optionally, you can redirect to the index page if accessed via GET
    header("Location: index.php");
    exit();
}
?>