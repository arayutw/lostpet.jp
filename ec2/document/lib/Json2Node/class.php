<?php

declare(strict_types=1);

class Json2Node
{
    static public function create(mixed $options): string
    {
        if (null === $options) {
            return '';
        } elseif (is_string($options['tagName'] ?? null)) {
            return self::convert($options);
        } elseif (is_iterable($options)) {
            $html = '';

            foreach ($options as $option) {
                if (null !== $option) {
                    $html .= self::create($option);
                }
            }

            return $html;
        }
        return (string)$options;
    }

    static private function convert(array $options): string
    {
        $tag_name = $options['tagName'] ?? null;
        $attributes = $options['attribute'] ?? null;
        $children = $options['children'] ?? null;
        $content = null !== $children ? self::create($children) : '';

        $tokens = [];

        if ($attributes) {
            foreach ($attributes as $name => $value) {
                if (null !== $value && ('class' !== $name || $value)) {
                    $tokens[] = $name . (true !== $value ? "=\"{$value}\"" : '');
                }
            }

            sort($tokens);
        }

        return '<' . $tag_name . ($tokens ? " " . implode(" ", $tokens) : "") . '>' . (in_array($tag_name, [
            'br',
            'img',
            'input',
            'link',
            'meta',
            'path',
            'source',
        ], true) ? "" : ($content . '</' . $tag_name . '>'));
    }

    static public function autolink(string $str): array
    {
        $check_str = $str;
        $offset = 0;
        $entries = [];
        $try_count = 0;

        while (20 > ++$try_count) {
            if (!preg_match("/((https?):\/\/)([a-z0-9-]+\.)?[a-z0-9-]+(\.[a-z]{2,6}){1,3}(\/[a-z0-9.,_\/~#&=;@%+?-]*)?/is", $check_str, $matches)) {
                break;
            }

            $url = $matches[0];
            $start = strpos($str, $url, $offset);
            $length = strlen($url);

            $entries[] = [$start, $length, substr($str, $start, $length)];

            $offset = $start + $length;
            $check_str = substr($str, $offset);
        }

        $nodes = [];
        $current = 0;

        foreach ($entries as $entry) {
            $start = $entry[0];
            $length = $entry[1];
            $url = substr($str, $start, $length);

            if ($start > $current) {
                $nodes[] = substr($str, $current, $start - $current);
            }

            $info = parse_url($url);
            $is_samesite = strpos($info["host"], _DOMAIN_);
            $suffix = $info["path"] . ($info["query"] ?? "") . ($info["fragment"] ?? "");

            $nodes[] = [
                "attribute" => [
                    "class" => "a1",
                    "href" => $url,
                ] + (!$is_samesite ? [
                    "target" => "_blank",
                    "rel" => "external nofollow noopener",
                ] : []),
                "children" => $info["scheme"] . "://" . $info["host"] . (strlen($suffix) > 51 ? substr($suffix, 0, 50) . "..." : $suffix),
                "tagName" => "a",
            ];

            $current = $start + $length;
        }

        $nodes[] = substr($str, $current);

        return $nodes;
    }
}
