<?php

declare(strict_types=1);

Etag::generate(_PATH_,  filemtime(__FILE__));

$client = new DocDocument();

$client->id = 2;

$client->head = Head::merge($client->head, [
    [
        "attribute" => [
            "href" => "https://" . _DOMAIN_ . "/terms",
            "rel" => "canonical",
        ],
        "tagName" => "link",
    ],
    [
        "children" => "利用規約 | LOSTPET.JP",
        "tagName" => "title",
    ],
    [
        "attribute" => [
            "content" => "",
            "name" => "description",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "利用規約",
            "property" => "og:title",
        ],
        "tagName" => "meta",
    ],
    [
        "attribute" => [
            "content" => "",
            "property" => "og:description",
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
    [
        "attribute" => [
            "content" => "https://" . _DOMAIN_ . "/terms",
            "property" => "og:url",
        ],
        "tagName" => "meta",
    ],
], true);

$client->body = [
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "適用",
                "tagName" => "h2",
            ],
            [
                "children" => "この利用規約(以下、本規約)は、迷子ペットのデータベース(以下、本サービス)を利用する全ユーザーに適用されるものとします。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "登録",
                "tagName" => "h2",
            ],
            [
                "children" => [
                    "本サービスの利用を希望するユーザーは、定められた方法に従って申請を行ない、運営が承認することで登録が完了するものとします。その際取得する情報の管理については",
                    [
                        "attribute" => [
                            "class" => "a1",
                            "href" => "/privacy",
                        ],
                        "children" => "プライバシーポリシー",
                        "tagName" => "a",
                    ],
                    "にて定めてます。",
                ],
                "tagName" => "p",
            ],
            [
                "children" => "運営は下記の項目のいずれかに該当すると判断した場合、申請を承認しないこと、過去に遡って承認を取り消すことがあります。承認を拒否した理由について運営は開示義務を負いません。",
                "tagName" => "p",
            ],
            [
                "children" => array_map(fn (string $text) => [
                    "children" => $text,
                    "tagName" => "li",
                ], [
                    "過去に申請拒否を受けた者からの申請",
                    "登録内容に虚偽、誤記、記載漏れがある場合",
                    "反社会勢力、またはそれに準ずる者、またはこれらに関与する者からの申請",
                    "その他、運営が不適切と判断した場合",
                    "次章の禁止事項を守らない者からの申請",
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
                    "class" => "c2",
                ],
                "children" => "禁止事項",
                "tagName" => "h2",
            ],
            [
                "children" => "当サービスを利用するユーザーは、下記の禁止事項を守るものとします。",
                "tagName" => "p",
            ],
            [
                "children" => array_map(fn (string $text) => [
                    "children" => $text,
                    "tagName" => "li",
                ], [
                    "誹謗中傷",
                    "詐欺",
                    "営業、勧誘",
                    "第三者のなりすまし",
                    "権利侵害",
                    "反社会勢力への利益供与",
                    "不正アクセス",
                    "予定されている目的以外での個人情報収集",
                    "通常の利用の範囲を超えて、サーバーに負担をかける行為",
                    "その他、運営が不適切だと判断する行為",
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
                    "class" => "c2",
                ],
                "children" => "責任",
                "tagName" => "h2",
            ],
            [
                "children" => "ユーザーは自己責任において本サービスの登録情報を管理することとします。第三者への譲渡・貸与、不正アクセスなど、いかなる理由があっても、当サイトが提供する認証方法(パスワード認証、SNSアカウント認証)を突破した場合は、当サイトは該当者をユーザー本人として扱います。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "権利",
                "tagName" => "h2",
            ],
            [
                "children" => "本サービスに投稿したデータの権利は、ユーザー本人に帰属します。ただし法律が定める範囲において、サイト運営(広報など)に必要な範囲での権利を運営に譲渡するものとします。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "免責事項",
                "tagName" => "h2",
            ],
            [
                "children" => "本サービスは、事実上、または法律上の瑕疵(安全性、正確性、欠陥性など)がないことを保証していません。",
                "tagName" => "p",
            ],
            [
                "children" => "本サービスは、本サービスの利用に起因して生じたあらゆる損害について一切の責任を負いません。",
                "tagName" => "p",
            ],
            [
                "children" => "本サービスを通じて発生したユーザーと他ユーザー(または第三者)との間の紛争については、当事者間で解決するものとします。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "サービス",
                "tagName" => "h2",
            ],
            [
                "children" => "運営は、ユーザーに通知することなく本サービスの内容を変更したり、本サービスの提供を中止できるものとします。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "改定",
                "tagName" => "h2",
            ],
            [
                "children" => "将来、必要に応じて本規約を改定することがあります。ユーザーは改定された利用規約に同意したものとみなされます。改定した場合、ウェブサイト上でユーザーに通知します。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "準拠法と管轄裁判所",
                "tagName" => "h2",
            ],
            [
                "children" => "本規約の解釈は、日本法を準拠法とします。本サービスによって紛争が生じた場合は、東京地方裁判所を専属的合意管轄とします。",
                "tagName" => "p",
            ],
        ],
        "tagName" => "section",
    ],
    [
        "children" => [
            [
                "attribute" => [
                    "class" => "c2",
                ],
                "children" => "附則",
                "tagName" => "h2",
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
];

if (1 === _REQUEST_) {
    header('cache-control:max-age=1,public,immutable');
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

class DocDocument
{
    public int $id = 0;

    public array $schema = [
        [
            "@context" => "https://schema.org",
            "@type" => "BreadcrumbList",
            "itemListElement" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "ホーム",
                    "item" => "https://" . _DOMAIN_ . "/",
                ],
            ],
        ]
    ];

    public array $body = [];

    public array $css = [
        1,
    ];

    public array $head = [];

    public function __construct()
    {
    }

    public function html()
    {
        $this->css = [...array_unique([
            ...$this->css,
            ...UIHeader::$css,
        ])];

        $css = new CSS($this->css);

        $html = '<!DOCTYPE html>'
            . '<html class="t1" lang="ja">'

            . '<head>'
            .   '<link as="style" href="' . $css->href . '" rel="preload">'
            .   '<link as="script" href="/script.js?v=' . _VERSION_ . '" rel="preload">'
            .   Head::create($this->head)
            .   '<link href="' . $css->href . '" rel="stylesheet">'
            .   '<script>'
            .       '(function(){var t;("2"===(t=localStorage.getItem("t"))||"1"!==t&&matchMedia("(prefers-color-scheme:dark)").matches)&&document.documentElement.classList.replace("t1","t2"),("2"===(t=localStorage.getItem("r"))||"1"!==t&&matchMedia("(prefers-reduced-motion)").matches)&&document.documentElement.classList.add("r2")}())'
            .       ';self.a=' . json_encode([
                "document" => [
                    "id" => 1,
                    "data" => [
                        "content" => $this->id,
                    ],
                ],
                "version" => _VERSION_,
            ])
            .       ';document.currentScript.remove()'
            .   '</script>'
            . '</head>'

            . '<body>'
            .   UIHeader::create()
            .   Json2Node::create($this->body)
            .   UIFooter::create()
            .   '<script src="/script.js?v=' . _VERSION_ . '"></script>'
            .   '<script type="application/ld+json">' . json_encode($this->schema) . '</script>'
            . '</body>'

            . '<html>';

        header('content-length:' . strlen($html));

        echo $html;
    }

    public function json()
    {
        $json = json_encode([
            "id" => 1,
            "data" => [
                "body" => $this->body,
                "content" => $this->id, // 2=利用規約, 3=プライバシーポリシー
                "head" => $this->head,
            ],
        ]);

        Etag::echo();

        header('content-length:' . strlen($json));
        http_response_code(200);

        echo $json;
    }
}
