<?php

declare(strict_types=1);

Etag::generate(_PATH_,  filemtime(__FILE__));

$client = new Column2Content();

$client->id = 6;

$client->css = [
    ...$client->css,
    104,
    1004,
    1005,
];

$client->head = Head::merge($client->head, [
    [
        "attribute" => [
            "href" => "https://" . _DOMAIN_ . "/privacy",
            "rel" => "canonical",
        ],
        "tagName" => "link",
    ],
    [
        "children" => "プライバシーポリシー | LOSTPET.JP",
        "tagName" => "title",
    ],
    [
        "attribute" => [
            "content" => "LOSTPET.JPが掲げるプライバシーポリシーです。利用者様の個人情報を適切に扱うことを宣言します。",
            "name" => "description",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "プライバシーポリシー",
            "property" => "og:title",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "article",
            "property" => "og:type",
        ],
        "tagName" => "meta",
    ],
], true);

$client->body = [
    "attribute" => [
        "class" => "c4",
    ],
    "children" => [
        [
            "attribute" => [
                "class" => "c5c",
            ],
            "children" => [
                [
                    "attribute" => [
                        "class" => "c5a",
                    ],
                    "children" => "プライバシーポリシー",
                    "tagName" => "h1",
                ],
                [
                    "children" => "LOSTPET.JPが掲げるプライバシーポリシーです。利用者様の個人情報を適切に扱うことを宣言します。",
                    "tagName" => "p",
                ],
            ],
            "tagName" => "header",
        ],
        ...[
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "個人情報の定義",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "本プライバシーポリシーにおいて個人情報とは、個人情報保護法第2条第1項により定義された個人情報を意味します。",
                        "tagName" => "p",
                    ],
                ],
                "tagName" => "section",
            ],
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "個人情報の利用目的",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "個人情報を、以下の目的で利用いたします。",
                        "tagName" => "p",
                    ],
                    [
                        "children" => array_map(fn (string $text) => [
                            "children" => $text,
                            "tagName" => "li",
                        ], [
                            "個人を特定できない範囲においての統計情報の作成および利用。",
                            "個人を特定できない範囲においての新規開発に必要なデータの解析や分析。",
                        ]),
                        "tagName" => "ul",
                    ],
                ],
                "tagName" => "section",
            ],
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "第三者のトラッキングシステム",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "本サービスは、統計を作成したり広告を配信するために第三者のツールを利用しています。cookieやウェブビーコンを通し、情報は、個人識別できない範囲で第三者が直接、取得する仕組みです。具体的に利用しているツールは以下です。詳細は各サイトをご覧下さい。",
                        "tagName" => "p",
                    ],
                    [
                        "children" => array_map(fn (array $text) => [
                            "children" => $text,
                            "tagName" => "li",
                        ], [
                            [
                                "Google Analytics (",
                                [
                                    "attribute" => [
                                        "class" => "a1",
                                        "href" => "//www.google.com/analytics/",
                                        "rel" => "noopener",
                                        "target" => "_blank",
                                    ],
                                    "children" => "https://www.google.com/analytics/",
                                    "tagName" => "a",
                                ],
                                ")",
                            ],
                            [
                                "Google Adsense (",
                                [
                                    "attribute" => [
                                        "class" => "a1",
                                        "href" => "//policies.google.com/technologies/ads?hl=ja",
                                        "rel" => "noopener",
                                        "target" => "_blank",
                                    ],
                                    "children" => "https://policies.google.com/technologies/ads?hl=ja",
                                    "tagName" => "a",
                                ],
                                ")",
                            ],
                        ]),
                        "tagName" => "ul",
                    ],
                ],
                "tagName" => "section",
            ],
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "個人情報の開示",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "個人情報保護法その他の法令により開示の義務を負う場合、請求に従って遅滞なく開示を行います。",
                        "tagName" => "p",
                    ],
                ],
                "tagName" => "section",
            ],
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "改定",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "将来、必要に応じて本プライバシーポリシーを改定することがあります。ユーザーは改定された利用規約に同意したものとみなされます。改定した場合、ウェブサイト上でユーザーに通知します。",
                        "tagName" => "p",
                    ],
                ],
                "tagName" => "section",
            ],
            [
                "children" => [
                    [
                        "attribute" => [
                            "class" => "c5b",
                        ],
                        "children" => "附則",
                        "tagName" => "h2",
                    ],
                    [
                        "children" => "将来、必要に応じて本プライバシーポリシーを改定することがあります。ユーザーは改定された利用規約に同意したものとみなされます。改定した場合、ウェブサイト上でユーザーに通知します。",
                        "tagName" => "p",
                    ],
                    [
                        "children" => array_map(fn (string $text) => [
                            "children" => $text,
                            "tagName" => "li",
                        ], [
                            "2018年3月18日 制定",
                            "2019年5月1日 改定",
                        ]),
                        "tagName" => "ul",
                    ],
                ],
                "tagName" => "section",
            ],
        ],
    ],
    "tagName" => "article",
];

header('cache-control:max-age=1,public,immutable');

if (1 === _REQUEST_) {
    // header('x-robots-tag:noindex');

    $client->schema[0]["itemListElement"][] = [
        "@type" => "ListItem",
        "position" => 2,
        "name" => "利用規約",
        "item" => "https://" . _DOMAIN_ . "/terms",
    ];

    $client->html();
} else {
    $client->json();
}
