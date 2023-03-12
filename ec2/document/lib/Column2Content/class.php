<?php

declare(strict_types=1);

class Column2Content
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

    public function html()
    {
        $this->css = [...array_unique([
            ...$this->css,
            ...UIHeader::$css,
            ...UIFooter::$css,
            ...UIMain::$css,
        ])];

        $css = new CSS($this->css);

        $html = '<!DOCTYPE html>'
            . '<html class="t1" lang="ja">'

            . '<head>'
            .   '<link as="style" href="' . $css->href . '" rel="preload">'
            // .   implode("", array_map(fn (int $id) => '<link as="style" href="/styles/' . $id . '.css?v=' . _VERSION_ . '" rel="preload">', $this->css))
            .   '<link as="script" href="/script.js?v=' . _VERSION_ . '" rel="preload">'
            .   Head::html(Head::create($this->head))
            .   '<link href="' . $css->href . '" rel="stylesheet">'
            .   '<script>'
            .       '(function(){var t;("2"===(t=localStorage.getItem("t"))||"1"!==t&&matchMedia("(prefers-color-scheme:dark)").matches)&&document.documentElement.classList.replace("t1","t2"),("2"===(t=localStorage.getItem("r"))||"1"!==t&&matchMedia("(prefers-reduced-motion)").matches)&&document.documentElement.classList.add("r2")}())'
            .       ';self.a=' . json_encode([
                "document" => [
                    "id" => 1,
                    "data" => [
                        "id" => $this->id,
                    ],
                ],
                "version" => _VERSION_,
            ])
            .       ';document.currentScript.remove()'
            .   '</script>'
            . '</head>'

            . '<body>'
            .   UIHeader::create()
            .   UIMain::create([
                "background" => 1,
                "body" => Json2Node::create($this->body)
            ])
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
            "head" => Head::create($this->head),
            "id" => 1,
            "data" => [
                "body" => $this->body,
                "id" => $this->id,
            ],
        ]);

        Etag::echo();

        header('content-length:' . strlen($json));
        http_response_code(200);

        echo $json;
    }
}
