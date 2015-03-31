<?php



  $email = Trim( stripslashes( $_POST["email"] ) );
  $message = Trim( stripslashes( $_POST["message"] ) );

  $to_email = "hello@arianrazi.com";
	$subject = "arianrazi.com -- Message from Contact Form";

	$message =  "E-mail:\r\n" . $email . "\r\n\n"
            . "Message:\r\n" . $message;

	$headers =  "From: " . mysql_escape_string($email) . "\r\n"
		        . "Reply-To: " . mysql_escape_string("hello@arianrazi.com") . "\r\n"
		        . "X-Mailer: PHP/" . phpversion();

  header('Content-Type: application/json');

	if (!mail($to_email,$subject,$message,$headers))
	{
		echo json_encode(array('error' => "mail function returned false"));
	}
	else
	{
		echo json_encode(array('success' => '1'));
	}

?>
