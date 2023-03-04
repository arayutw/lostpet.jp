<?php

declare(strict_types=1);

class Secret
{
    static private array $cache = [];

    static public function get(string $path)
    {
        $path = __DIR__ . "/../../../secret{$path}";

        $body = is_string(self::$cache[$path] ?? null) ? self::$cache[$path] : (file_exists($path) ? file_get_contents($path) : null);

        if (!$body) {
            self::$cache[$path] = $body;

            Discord::send(content: [
                "content" => "**Secret: 404**\n```\npath: {$path}\n```",
            ]);

            http_response_code(500);

            exit;
        }

        return '.json' === substr($path, -5) ? json_decode($body, true) : $body;
    }
}
