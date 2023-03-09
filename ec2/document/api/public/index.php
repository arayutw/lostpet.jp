<?php

declare(strict_types=1);

$id = $_GET["id"];
$version = $_GET["version"] ?? 0;

if ($id && $version) {
    Etag::generate($id,  max(filemtime(__FILE__), $version));

    $row = RDS::fetch("SELECT `version`, `map` FROM `css` WHERE `id`=? LIMIT 1;", [
        $id,
    ]);

    if ($row) {
        Etag::echo();

        $body = $row["map"];

        header('cache-control:max-age=1,public,immutable');
        header('content-length:' . strlen($body));
        http_response_code(200);

        echo $body;

        exit;
    }
}

http_response_code(400);

exit;
