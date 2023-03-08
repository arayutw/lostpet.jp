<?php

declare(strict_types=1);

foreach ([
    "CloudFront",
    "CSS",
    "Discord",
    "Document",
    "DynamoDB",
    "Encode",
    "Etag",
    "Head",
    "Json2Node",
    "Me",
    "RDS",
    "S3",
    "SES",
    "Secret",
    "Slack",
    "Turnstile",
    "utils",
] as $name) {
    require __DIR__ . "/{$name}/index.php";
}
