<?php

declare(strict_types=1);

class Discord
{
    private ?string $url;

    public function __construct(
        int|string $channel,
        public array $message
    ) {
        $this->url = Secret::get('/discord/webhook.json')[$channel] ?? null;

        if (!$this->url) {
            self::send(content: [
                "content" => "**Discord: 404**\n```\nchannel: {$channel}\n```",
            ]);

            http_response_code(500);
            exit;
        }
    }

    public function __destruct()
    {
        self::send($this->url, $this->message);
    }

    static public function send(?string $url = "https://discord.com/api/webhooks/1081413110767829074/TpdQUCi-Eb8uc1RSHnlAh5aNaeXff-wCSmjFohmDH9jitwLRHe2TQ8RkTdxmUeFnbTuS", array $content): void
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($content));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_exec($ch);
        curl_close($ch);
    }
}
