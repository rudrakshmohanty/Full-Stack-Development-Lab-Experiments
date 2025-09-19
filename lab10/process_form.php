<?php

// Set the content type to application/json for the response
header('Content-Type: application/json');

// This will hold our response data
$response = array(
    'success' => false,
    'message' => ''
);

// Only process POST requests.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace.
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $message = trim($_POST["message"]);

    // --- Validation ---
    
    // Check that data was sent.
    if ( empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Set a 400 (bad request) response code and exit.
        http_response_code(400);
        $response['message'] = 'Oops! Please complete all fields and use a valid email.';
        echo json_encode($response);
        exit;
    }
    
    // Set a 200 (okay) response code.
    http_response_code(200);
    $response['success'] = true;
    $response['message'] = 'Thank You! Your message has been sent.';

} else {
    // Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    $response['message'] = 'There was a problem with your submission, please try again.';
}

// Echo the JSON response
echo json_encode($response);

?>
