<?php

declare(strict_types=1);

$pathname = $_GET["pathname"] ?? "";

if ($pathname) {
    $tokens = explode("/", $pathname);

    while ($tokens) {
        $path = __DIR__ . "/../../../documents" . implode("/", $tokens) . "/index.php";

        if (file_exists($path)) {
            http_response_code(200);
            require $path;
            exit;
        }

        array_pop($tokens);
    }
}

http_response_code(400);

exit;
