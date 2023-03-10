<?php

declare(strict_types=1);

class Head
{
    static public function create(array $head): string
    {
        foreach ([
            [
                [
                    "meta",
                    "property",
                    "og:title",
                    "content",
                ],
                [
                    "title",
                ],
            ],
            [
                [
                    "meta",
                    "name",
                    "twitter:title",
                    "content",
                ],
                [
                    "meta",
                    "property",
                    "og:title",
                    "content",
                ],
            ],
            [
                [
                    "meta",
                    "property",
                    "og:description",
                    "content",
                ],
                [
                    "meta",
                    "name",
                    "description",
                    "content",
                ],
            ],
            [
                [
                    "meta",
                    "name",
                    "twitter:description",
                    "content",
                ],
                [
                    "meta",
                    "property",
                    "og:description",
                    "content",
                ],
            ],
        ] as [$target, $ref,]) {
            $exists = false;

            foreach ($head as $unit) {
                if (
                    $unit["tagName"] === $target[0]
                    && ($unit["attribute"][$target[1]] ?? null) === $target[2]
                    && ($unit["attribute"][$target[3]] ?? null)
                ) {
                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                foreach ($head as $unit) {
                    if (
                        $unit["tagName"] === $ref[0]
                    ) {
                        $value = null;

                        if ("title" === $ref[0]) {
                            $value = $unit["children"];
                        } else {
                            if (
                                ($unit["attribute"][$ref[1]] ?? null) === $ref[2]
                            ) {
                                $value = $unit["attribute"][$ref[3]];
                            }
                        }

                        if ($value) {
                            $head[] = [
                                "attribute" => [
                                    $target[1] => $target[2],
                                    $target[3] => $value,
                                ],
                                "tagName" => $target[0],
                            ];

                            break;
                        }
                    }
                }
            }
        }



        return Json2Node::create(array_filter(
            self::merge([
                [
                    "attribute" => [
                        "charset" => "UTF-8",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "telephone=no",
                        "name" => "format-detection",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "width=device-width,initial-scale=1.0",
                        "name" => "viewport",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "LOSTPET.JP",
                        "name" => "application-name",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "LOSTPET.JP",
                        "name" => "apple-mobile-web-app-title",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "yes",
                        "name" => "mobile-web-app-capable",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "yes",
                        "name" => "apple-mobile-web-app-capable",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "#228ae6",
                        "name" => "apple-mobile-web-app-status-bar-style",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "ja_JP",
                        "property" => "og:locale",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "LOSTPET.JP",
                        "property" => "og:site_name",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => _DOMAIN_,
                        "name" => "twitter:domain",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "@lostpetjp",
                        "name" => "twitter:site",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "@arayutw",
                        "name" => "twitter:creator",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "summary",
                        "name" => "twitter:card",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "#228ae6",
                        "name" => "msapplication-TileColor",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "#228ae6",
                        "name" => "theme-color",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "href" => "/humans.txt",
                        "rel" => "author",
                    ],
                    "tagName" => "link",
                ],
                [
                    "attribute" => [
                        "href" => "/favicon.ico",
                        "rel" => "icon",
                        "sizes" => "any",
                    ],
                    "tagName" => "link",
                ],
                [
                    "attribute" => [
                        "href" => "/icon.svg",
                        "rel" => "icon",
                        "type" => "image/svg+xml",
                    ],
                    "tagName" => "link",
                ],
                [
                    "attribute" => [
                        "href" => "/apple-touch-icon.png",
                        "rel" => "apple-touch-icon",
                    ],
                    "tagName" => "link",
                ],
                [
                    "attribute" => [
                        "href" => "/site.webmanifest",
                        "rel" => "manifest",
                    ],
                    "tagName" => "link",
                ],
                [
                    "attribute" => [
                        "content" => "/icon.png",
                        "property" => "og:image",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "image/png",
                        "property" => "og:image:type",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "2000",
                        "property" => "og:image:height",
                    ],
                    "tagName" => "meta",
                ],
                [
                    "attribute" => [
                        "content" => "2000",
                        "property" => "og:image:width",
                    ],
                    "tagName" => "meta",
                ],
            ], $head, true),
            fn (array $entry) => !(("link" === $entry["tagName"] && is_null($entry["attribute"]["href"])) || ("meta" === $entry["tagName"] && isset($entry["attribute"]["content"]) && is_null($entry["attribute"]["content"])))
        ));
    }

    static public function merge(array $head1, array $head2, bool $overwrite): array
    {
        foreach ($head2 as $entry) {
            $exists = false;

            foreach ($head1 as $index => $default_entry) {
                if (
                    $entry["tagName"] === $default_entry["tagName"]
                    && (
                        ("link" === $entry["tagName"] && isset($entry["attribute"]["rel"]) && isset($default_entry["attribute"]["rel"]) && $entry["attribute"]["rel"] === $default_entry["attribute"]["rel"])
                        || ("meta" === $entry["tagName"] && (
                            (isset($entry["attribute"]["property"]) && isset($default_entry["attribute"]["property"]) && $entry["attribute"]["property"] === $default_entry["attribute"]["property"])
                            || (isset($entry["attribute"]["name"]) && isset($default_entry["attribute"]["name"]) && $entry["attribute"]["name"] === $default_entry["attribute"]["name"])
                        ))
                        || ("title" === $entry["tagName"])
                    )
                ) {
                    if ($overwrite) {
                        $head1[$index] = $entry;
                    }

                    $exists = true;
                    break;
                }
            }

            if (!$exists) {
                $head1[] = $entry;
            }
        }

        return $head1;
    }
}
