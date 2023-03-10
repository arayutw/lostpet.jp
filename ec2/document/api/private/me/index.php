<?php

declare(strict_types=1);

if ("get" === _METHOD_) {
    $json = json_encode([
        "session" => 0,
        "user" => 0,
        "TODO" => true,
    ]);
    header('content-length:' . strlen($json));
    http_response_code(200);
    echo $json;
    exit;
}

http_response_code(400);

exit;
