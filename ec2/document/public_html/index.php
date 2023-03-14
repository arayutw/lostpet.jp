<?php

declare(strict_types=1);

define("_DOMAIN_", "lostpet.jp");
define("_SERVER_", $_SERVER["SERVER_NAME"] ?? _DOMAIN_);
define("_METHOD_", strtolower($_SERVER["REQUEST_METHOD"] ?? "GET"));
define("_VERSION_", "0");

require __DIR__ . "/../lib/index.php";

set_error_handler(function ($no, $str, $file, $line) {
    new Discord(500, [
        "content" => "```{$no}: {$str}```\n{$file}:{$line}",
    ]);
});

register_shutdown_function(function () {
    $errors = error_get_last();

    if ($errors) {
        new Discord(500, [
            "content" => "```" . json_encode($errors, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "```\n" . _PATH_,
        ]);
    }
});

if (php_sapi_name() === "cli") {
    define("_IP_", "cli");
    define("_PATH_", $argv[1] ?? "/");
    define("_STAGE_", 3);
    define("_REQUEST_", 1);
    define("_UA_", "cli");

    require __DIR__ . "/../cli" . _PATH_ . ".php";

    exit;
}
define("_IP_", $_SERVER["HTTP_X_FORWARDED_FOR"] ?? ($_SERVER["REMOTE_ADDR"] ?? "unknown"));
define("_PATH_", $_SERVER["SCRIPT_NAME"]);
define("_REQUEST_", "/api/" === substr(_PATH_, 0, 5) ? (0 === strpos(_PATH_, "/api/private/") ? 3 : 2) : 1);
define("_UA_", $_SERVER["HTTP_USER_AGENT"] ?? "human");

if ("dev2." . _DOMAIN_ === _SERVER_) {
    ini_set("opcache.enable", "0");
    header("x-robots-tag: noindex");
    header("cache-control: no-cache,no-store,must-revalidate,must-understand,private");

    if (false !== strpos(_PATH_, ".")) {
        $pathinfo = pathinfo(_PATH_);

        // "css", 

        if (in_array($pathinfo["extension"], ["js",], true)) {
            $path = __DIR__ . "/../" . (false !== strpos(_PATH_, "styles") ? "styles" : "scripts") . "/dev/" . $pathinfo["basename"];

            if (!file_exists($path)) {
                new Discord(404, [
                    "content" => "**404 Not Found**\n```\npath: " . _PATH_ . "\n```",
                ]);
                http_response_code(404);
                exit;
            }

            Etag::generate(_PATH_, filemtime($path));
            $body = gzencode(file_get_contents($path), 4);
            header('cache-control: max-age=1,public');
            header("content-type: " . ("js" === $pathinfo["extension"] ? "application/javascript" : "text/css") . ";charset=utf-8");
            header("content-encoding: gzip");
            header("content-length: " . strlen($body));
            Etag::echo();
            echo $body;
            exit;
        }
    }

    define("_STAGE_", 2);
} else {
    define("_STAGE_", 1);

    if (0 === strpos(_PATH_, "/test")) {
    }
}

$tokens = explode("/", _PATH_);

if (1 === _REQUEST_) {

    while ($tokens) {
        $path = __DIR__ . "/../documents" . _PATH_ . "/index.php";

        if (file_exists($path)) {
            http_response_code(200);
            header("content-type:text/html;charset=utf-8");
            header('cross-origin-embedder-policy:require-corp');
            header('cross-origin-opener-policy:same-origin');
            header('referrer-policy:no-referrer-when-downgrade');
            require $path;
            exit;
        }

        array_pop($tokens);
    }
} else {
    if (3 === _REQUEST_) {
        session_cache_limiter("");
        session_set_cookie_params(600, "/api/private/");
        session_start();
    }

    if ("get" === _METHOD_) {
        $value = $_GET["v"] ?? "[]";
        if (isset($_GET["v"])) unset($_GET["v"]);

        if (($query = json_decode($value, true)) && is_array($query)) {
            foreach ($query as $key => $value) {
                $_GET[$key] = $value;
            }
        }
    } else {
        $_POST = json_decode(file_get_contents("php://input"), true);
    }

    if (
        (null !== ($_SERVER["HTTP_ORIGIN"] ?? null) && "https://" . _SERVER_ !== $_SERVER["HTTP_ORIGIN"])
        || (null !== ($_SERVER["HTTP_SEC_FETCH_SITE"] ?? null) && "same-origin" !== $_SERVER["HTTP_SEC_FETCH_SITE"])
        || (null !== ($_SERVER["HTTP_SEC_FETCH_MODE"] ?? null) && "same-origin" !== $_SERVER["HTTP_SEC_FETCH_MODE"])
        || (null !== ($_SERVER["HTTP_X_CSRF_TOKEN"] ?? null) && _SERVER_ !== $_SERVER["HTTP_X_CSRF_TOKEN"])
    ) {
        http_response_code(400);
        exit;
    }

    while ($tokens) {
        $path = __DIR__ . "/.." . _PATH_ . "/index.php";

        if (file_exists($path)) {
            header("content-type:application/json;charset=utf-8");
            header('x-robots-tag:noindex');
            require $path;
            exit;
        }

        array_pop($tokens);
    }
}


http_response_code(404);
exit;
