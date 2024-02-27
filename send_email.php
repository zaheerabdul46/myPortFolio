<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['contact-name'];
    $phone = $_POST['contact-phone'];
    $email = $_POST['contact-email'];
    $subject = $_POST['subject'];
    $message = $_POST['contact-message'];
    
    // Set recipient email address
    $to = "zaheertoday@gmail.com";

    // Set email subject
    $email_subject = "New Contact Form Submission";

    // Build email content
    $email_body = "Name: $name\n";
    $email_body .= "Phone: $phone\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Subject: $subject\n";
    $email_body .= "Message:\n$message";

    // Set email headers
    $headers = "From: $name <$email>";

    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Email sent successfully
        echo "Thank you for your message. We will get back to you soon.";
    } else {
        // Email sending failed
        echo "Sorry, something went wrong. Please try again later.";
    }
} else {
    // Redirect back to the contact page if accessed directly
    header("Location: index.html#contacts");
    exit();
}
?>
