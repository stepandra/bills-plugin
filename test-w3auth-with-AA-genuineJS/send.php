<?php

$entityBody = file_get_contents('php://input');

$options = array(
  'http' => array(
    'method'  => 'POST',
    'content' => $entityBody,
    'header'=>  "Content-Type: application/json\r\n" .
                "Accept: application/json\r\n"
    )
);

$context  = stream_context_create( $options );
$result = file_get_contents("https://eth-goerli.g.alchemy.com/v2/alc-key", false, $context );
$response = json_decode( $result );
print_r($response);
?>