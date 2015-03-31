<?php

  $email = Trim( stripslashes( $_POST['email'] ) );
  $message = Trim( stripslashes( $_POST['message'] ) );

  $to_email = 'hello@arianrazi.com';
	$subject = 'arianrazi.com -- Message from Contact Form';

	$message =  'E-mail: ' . $email . '\r\n\n'
            . 'Message:\r\n' . $message;

	$headers =  'From: ' . mysql_escape_string('hello@arianrazi.com') . '\r\n'
		        . 'Reply-To: '		. mysql_escape_string('hello@arianrazi.com') . '\r\n'
		        . 'X-Mailer: PHP/'	. phpversion();


	if (!mail($to_email,$subject,$message,$headers))
	{
		echo false;
	}
	else
	{
		echo true;
	}

?>
