<?php

declare(strict_types=1);

class CloudFront
{
    static public function setSignedCookie(string $path, int $expires = 86400): void
    {
        $expires_at = $_SERVER["REQUEST_TIME"] + $expires;

        if ("/*" === $path) {
            new Discord(500, [
                "content" => "**Bad path**: \n```\npath: {$path}\nsource: " . __CLASS__ . "::" . __FUNCTION__ . "()\n```",
            ]);

            http_response_code(500);

            exit;
        }

        $cookie_path = "*" === substr($path, -1) ? substr($path, 0, -1) : $path;    // "/*" wildcardを削除しないと駄目

        foreach (self::getSignedCookie($path, $expires_at + 86400) as $key => $value) {
            setcookie($key, $value, [
                // "domain" => _SERVER_,	// これがあるとサブドメインに波及してしまうのでNG
                "expires" => $expires_at + 86400,
                "path" => $cookie_path,
                "httponly" => true,
                "secure" => true,
                "samesite" => 'Lax',
            ]);
        }
    }

    static public function removeSignedCookie(string $path): void
    {
        foreach ([
            "CloudFront-Policy",
            "CloudFront-Signature",
            "CloudFront-Key-Pair-Id",
        ] as $key) {
            setcookie($key, "", [
                // "domain" => _SERVER_,
                "expires" => $_SERVER["REQUEST_TIME"] - 1,
                "path" => "*" === substr($path, -1) ? substr($path, 0, -1) : $path,
                "httponly" => true,
                "secure" => true,
                "samesite" => 'Lax',
            ]);
        }
    }

    static private function getSignedCookie(string $path, int $expires_at): iterable
    {
        return self::request(__FUNCTION__, [
            [
                'policy' => json_encode([
                    "Statement" => [
                        [
                            "Resource" => "https://" . $_SERVER["SERVER_NAME"] . $path,
                            "Condition" => [
                                // スマホで自宅回線とwifi回線を切り替えた時、Appleのproxyなどに対応できない
                                // "IpAddress" => [
                                // 	"AWS:SourceIp" => _IP_ . "/32",
                                // ],
                                "DateLessThan" => [
                                    "AWS:EpochTime" => $expires_at,    // 半日の猶予を持たせる
                                ],
                            ],
                        ],
                    ],
                ]),
                'private_key' => __DIR__ . '/../../../secret/cloudfront/private.pem',
            ] + Secret::get("/cloudfront/credentials.json"),
        ]);
    }

    static private function request(string $function, array $argument): iterable
    {
        try {
            return self::getClient()->{$function}(...$argument);
        } catch (Exception $e) {
            new Discord(500, [
                "content" => __CLASS__ . "::" . __FUNCTION__ . "()\n```\n" . json_encode($argument, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n```"
            ]);

            http_response_code(500);

            exit;
        }
    }

    static private function getClient(): Aws\CloudFront\CloudFrontClient
    {
        static $client = null;

        if (!$client) {
            if (!class_exists("Aws\Sdk")) require __DIR__ . "/../../../lib/aws/vendor/autoload.php";

            $client = new \Aws\CloudFront\CloudFrontClient([
                "version" => "latest",
                "region"  => Secret::get("/cloudfront/env.json")["region"],
            ]);
        }

        return $client;
    }
}
