<?php

declare(strict_types=1);

class Slack
{
    private ?string $url;

    public function __construct(
        int|string $channel,
        public array $message
    ) {
        $this->url = Secret::get('/slack/webhook.json')[$channel] ?? null;

        if (!$this->url) {
            new Discord(500, [
                "content" => "**Slack: 404**\n```\nchannel: {$channel}\n```",
            ]);

            http_response_code(500);
            exit;
        }
    }

    public function __destruct()
    {
        self::send($this->url, $this->message);
    }

    static public function send(string $url, array $content): void
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
