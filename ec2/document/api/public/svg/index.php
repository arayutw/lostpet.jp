<?php

declare(strict_types=1);

$id = $_GET["id"] ?? null;

if ($id) {
    Etag::generate(_PATH_ . ":{$id}",  max([filemtime(__FILE__)]));

    $path = __DIR__ . "/../../../svg/{$id}.json";

    if (file_exists($path)) {
        Etag::echo();

        $json = file_get_contents($path);
        header("cache-control:max-age=1,public");
        header('content-length:' . strlen($json));

        echo $json;

        exit;
    }
}

http_response_code(400);

exit;
