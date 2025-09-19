<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "company";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the input data from the AJAX request
$input = filter_input_array(INPUT_POST);

if ($input['action'] === 'edit') {
    // Sanitize and prepare the update query
    $name = mysqli_real_escape_string($conn, $input['name']);
    $gender = mysqli_real_escape_string($conn, $input['gender']);
    $age = mysqli_real_escape_string($conn, $input['age']);
    $designation = mysqli_real_escape_string($conn, $input['designation']);
    $address = mysqli_real_escape_string($conn, $input['address']);
    $id = mysqli_real_escape_string($conn, $input['id']);

    $query = "
        UPDATE developers
        SET name = '".$name."',
            gender = '".$gender."',
            age = '".$age."',
            designation = '".$designation."',
            address = '".$address."'
        WHERE id = '".$id."'
    ";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }

} else if ($input['action'] === 'delete') {
    // Sanitize and prepare the delete query
    $id = mysqli_real_escape_string($conn, $input['id']);
    
    $query = "
        DELETE FROM developers
        WHERE id = '".$id."'
    ";

    if (mysqli_query($conn, $query)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
}

$conn->close();

// Set the content type to application/json
header('Content-Type: application/json');
?>