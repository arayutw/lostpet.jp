<?php

declare(strict_types=1);

$id = $_GET["id"] ?? null;
$version = $_GET["version"] ?? null;

if ($id && $version) {
    Etag::generate(_PATH_ . ":{$id}",  max(filemtime(__FILE__), $version));

    $row = RDS::fetch("SELECT `map` FROM `css` WHERE `id`=? AND `version`=? LIMIT 1;", [
        $id,
        $version,
    ]);

    if ($row) {
        Etag::echo();

        $json = $row["map"];
        header('content-length:' . strlen($json));
        http_response_code(200);

        echo $json;

        exit;
    }

    http_response_code(404);

    exit;
}

http_response_code(400);

exit;
