<?php

declare(strict_types=1);

class SES
{
    static public function send(?string $from = "",  string $to = "",  string $title = "",  string $body = "")
    {
        $body .= "\n\n【心当たりがない方へ】"
            . "\nこのメールが届いた心当たりがない場合、お手数ですが破棄して下さい。"
            . "\nリンクをクリックしない限り、操作者は何もできません。"

            . "\n\n【操作者】"
            . "\nIPアドレス: " . _IP_

            . "\n\n【送信元】"
            . "\nhttps://" . _SERVER_ . "/"

            . "\n\n※このメールに返信しても届きません。";

        $try_count = 0;

        while (2 > ++$try_count) {
            try {
                $args = [
                    'Destination' => [
                        'ToAddresses' => [
                            $to,
                        ],
                    ],
                    'Message' => [
                        'Body' => [
                            'Text' => [
                                'Charset' => 'UTF-8',
                                'Data' => $body,
                            ],
                        ],
                        'Subject' => [
                            'Charset' => 'UTF-8',
                            'Data' => $title,
                        ],
                    ],
                    'Source' => $from ? $from : "no-reply@" . _DOMAIN_,
                ];

                $response = self::client()->sendEmail($args);

                $args["Destination"]["ToAddresses"][0] = $email_encode = Encode::encode("/email/salt.txt", $to);

                S3::putObject(Secret::get("/s3/env.json")["Bucket"], "ses/{$email_encode}/" . date("Y/m/d/His") . ".json", [
                    "Body" => json_encode($args),
                    "ContentType" => "application/json;charset=utf-8",
                ]);

                if (isset($response["@metadata"]["statusCode"]) && $response["@metadata"]["statusCode"] === 200) {
                    return true;
                } else {
                    http_response_code(500);

                    exit;
                }
            } catch (Aws\Exception\AwsException $e) {
                new Discord(500, [
                    "content" => implode("\n", [
                        "```\n" . json_encode([
                            $from,
                            $to,
                            $title,
                            $body,
                        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n```",
                        $e->getAwsRequestId(),
                        $e->getAwsErrorType(),
                        $e->getAwsErrorCode(),
                    ]) . "\n" . __CLASS__ . "::" . __FUNCTION__ . "()",
                ]);

                switch ($e->getAwsErrorCode()) {
                    case "AccessDeniedException":
                    case "IncompleteSignature":
                    case "InvalidAction":
                    case "InvalidClientTokenId":
                    case "InvalidParameterCombination":
                    case "InvalidParameterValue":
                    case "InvalidQueryParameter":
                    case "MalformedQueryString":
                    case "MissingAction":
                    case "MissingAuthenticationToken":
                    case "MissingParameter":
                    case "OptInRequired":
                    case "RequestExpired":
                    case "ThrottlingException":
                    case "ValidationError":
                        http_response_code(500);

                        exit;
                }

                sleep(1);
            } catch (Exception $e) {
                new Discord(500, [
                    "content" => implode("\n", [
                        "```\n" . json_encode([
                            $from,
                            $to,
                            $title,
                            $body,
                        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n```",
                        $e->getMessage(),
                        __CLASS__ . "::" . __FUNCTION__,
                    ]),
                ]);

                http_response_code(500);

                exit;
            }
        }
    }

    static private function client(): Aws\Ses\SesClient
    {
        static $client = null;

        if ($client === null) {
            if (!class_exists("Aws\Sdk")) {
                require __DIR__ . "/../../../lib/aws/vendor/autoload.php";
            }

            $client = new Aws\Ses\SesClient([
                "version" => "latest",
                "region" => Secret::get("/ses/env.json")["region"],
            ]);
        }

        return $client;
    }
}
