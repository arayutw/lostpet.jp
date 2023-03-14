<?php

declare(strict_types=1);

if ("get" === _METHOD_) {
    $can_skip = false;
    $recaptcha = $_SESSION["recaptcha"] ?? null;

    if (isset($recaptcha) && is_array($recaptcha)) {
        $expires_at = $recaptcha["expires_at"] ?? null;
        $can_skip = is_int($expires_at) && $expires_at > $_SERVER["REQUEST_TIME"];
    }

    if (!$can_skip && array_key_exists("recaptcha", $_SESSION)) {
        unset($_SESSION["recaptcha"]);
    }

    $json = json_encode($can_skip);
    header('content-length:' . strlen($json));
    http_response_code(200);
    echo $json;
    exit;
}

http_response_code(400);

exit;
