<?php

declare(strict_types=1);

class Head
{
    static public function create(array $head): string
    {
        return Json2Node::create(array_filter(
            self::merge($head, [
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
            ], false),
            fn (array $entry) => !(("link" === $entry["tagName"] && is_null($entry["attribute"]["rel"])) || ("meta" === $entry["tagName"] && is_null($entry["attribute"]["property"])))
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
                        ("link" === $entry["tagName"] && $entry["attribute"]["rel"] === $default_entry["attribute"]["rel"])
                        || ("meta" === $entry["tagName"] && $entry["attribute"]["property"] === $default_entry["attribute"]["property"])
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
