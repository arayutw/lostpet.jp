<?php

declare(strict_types=1);

class Secret
{
    static private array $cache = [];

    static public function get(string $path)
    {
        $path = __DIR__ . "/../../../secret{$path}";

        if (isset(self::$cache[$path])) return self::$cache[$path];

        $body = (file_exists($path) ? file_get_contents($path) : null);

        if (!$body) {
            Discord::send(content: [
                "content" => "**Secret: 404**\n```\npath: {$path}\n```",
            ]);

            http_response_code(500);

            exit;
        }

        self::$cache[$path] = '.json' === substr($path, -5) ? json_decode($body, true) : $body;

        return self::$cache[$path];
    }
}
