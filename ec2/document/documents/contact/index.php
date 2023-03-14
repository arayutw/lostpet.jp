<?php

declare(strict_types=1);

Etag::generate(_PATH_,  filemtime(__FILE__));

$client = new Column2Content();

$client->id = 10;

$client->css = [
    102,
    108,
    109,
    110,
    111,
    1009,
];

$client->head = Head::merge($client->head, [
    [
        "attribute" => [
            "href" => "https://" . _DOMAIN_ . "/contact",
            "rel" => "canonical",
        ],
        "tagName" => "link",
    ],
    [
        "children" => "問い合わせフォーム | LOSTPET.JP",
        "tagName" => "title",
    ],
    [
        "attribute" => [
            "content" => "LOSTPET.JPへの要望、意見、報告を受け付ける問い合わせフォームです。返信はお約束できません。",
            "name" => "description",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "問い合わせフォーム",
            "property" => "og:title",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "website",
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
                "class" => "c9c",
            ],
            "children" => [
                [
                    "attribute" => [
                        "class" => "c9h",
                    ],
                    "children" => "問い合わせ",
                    "tagName" => "h1",
                ],
                [
                    "children" => "LOSTPET.JPに関するお問い合わせや報告、要望などを受け付けてます。お問い合わせの内容が公開されることはありません。",
                    "tagName" => "p",
                ],
            ],
            "tagName" => "div",
        ],
        [
            "attribute" => [
                "action" => "/",
                "class" => "c9f",
                "id" => "p10f",
                "method" => "GET",
                "target" => "_blank",
            ],
            "children" => [
                [
                    "attribute" => [],
                    "children" => [
                        [
                            "attribute" => [
                                "class" => "c9a",
                            ],
                            "children" => "メールアドレス",
                            "tagName" => "label",
                        ],
                        [
                            "attribute" => [
                                "autocapitalize" => "none",
                                "autocomplete" => "off",
                                "class" => "i1",
                                "inputmode" => "email",
                                "maxlength" => "100",
                                "minlength" => "6",
                                "name" => "email",
                                "placeholder" => "mail@lostpet.jp",
                                "required" => true,
                                "spellcheck" => "true",
                                "type" => "email",
                            ],
                            "tagName" => "input",
                        ],
                    ],
                    "tagName" => "div",
                ],
                [
                    "attribute" => [],
                    "children" => [
                        [
                            "attribute" => [
                                "class" => "c9a",
                            ],
                            "children" => "タイトル",
                            "tagName" => "label",
                        ],
                        [
                            "attribute" => [
                                "autocapitalize" => "none",
                                "autocomplete" => "off",
                                "class" => "i1",
                                "inputmode" => "text",
                                "maxlength" => "50",
                                "minlength" => "5",
                                "name" => "title",
                                "placeholder" => "問い合わせの種類",
                                "required" => true,
                                "spellcheck" => "true",
                                "type" => "text",
                            ],
                            "tagName" => "input",
                        ],
                    ],
                    "tagName" => "div",
                ],
                [
                    "attribute" => [],
                    "children" => [
                        [
                            "attribute" => [
                                "class" => "c9a",
                            ],
                            "children" => "内容",
                            "tagName" => "label",
                        ],
                        [
                            "attribute" => [
                                "autocapitalize" => "none",
                                "autocomplete" => "off",
                                "class" => "i2",
                                "inputmode" => "text",
                                "maxlength" => "2000",
                                "minlength" => "5",
                                "name" => "description",
                                "placeholder" => "案件について問い合わせる場合は、日付、地域、名前を教えて下さい。",
                                "required" => true,
                                "spellcheck" => "true",
                            ],
                            "tagName" => "textarea",
                        ],
                    ],
                    "tagName" => "div",
                ],
                [
                    "attribute" => [
                        "class" => "cp sk",
                        "id" => "p10c",
                    ],
                    "tagName" => "div",
                ],
                [
                    "attribute" => [
                        "class" => "btw",
                    ],
                    "children" => [
                        "attribute" => [
                            "class" => "a3 bt ht1",
                            "disabled" => true,
                        ],
                        "children" => "送信する",
                        "tagName" => "button",
                    ],
                    "tagName" => "div",
                ],
            ],
            "tagName" => "form",
        ],
    ],
    "tagName" => "div",
];

header('cache-control:max-age=1,public,immutable');

if (1 === _REQUEST_) {
    $client->schema[0]["itemListElement"][] = [
        "@type" => "ListItem",
        "position" => 2,
        "name" => "問い合わせフォーム",
        "item" => "https://" . _DOMAIN_ . "/contact",
    ];

    $client->html();
} else {
    $client->json();
}
