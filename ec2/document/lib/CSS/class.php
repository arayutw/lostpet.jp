<?php

declare(strict_types=1);

class CSS
{
    public string $filename = "";
    public string $basename = "";
    public string $pathname = "";
    public string $href = "";
    private string $text = "";

    private array $position = [];

    private array $map = [
        "global" => "",
        "min360" => "",
        "min480" => "",
        "min600" => "",
        "min768" => "",
        "min1024" => "",
        "min1120" => "",
        "min1280" => "",
        "max359" => "",
        "max479" => "",
        "max599" => "",
        "max767" => "",
        "max1023" => "",
        "max1119" => "",
        "max1279" => "",
        "hover" => "",
        "light" => "",
        "dark" => "",
        "motion" => "",
    ];

    private function split(int $style_id): array
    {
        $text = file_get_contents(__DIR__ . "/../../styles/" . (2 === _STAGE_ ? "dev" : "prod") . "/{$style_id}.css");

        $positions = [];

        foreach ([
            "@media screen and (min-width:360px){",
            "@media screen and (min-width:480px){",
            "@media screen and (min-width:600px){",
            "@media screen and (min-width:768px){",
            "@media screen and (min-width:1024px){",
            "@media screen and (min-width:1120px){",
            "@media screen and (min-width:1280px){",
            "@media screen and (max-width:359px){",
            "@media screen and (max-width:479px){",
            "@media screen and (max-width:599px){",
            "@media screen and (max-width:767px){",
            "@media screen and (max-width:1023px){",
            "@media screen and (max-width:1119px){",
            "@media screen and (max-width:1279px){",
            "@media (hover:hover) and (prefers-color-scheme:light){",
            "@media (hover:hover) and (prefers-color-scheme:dark){",
            "@media (prefers-color-scheme:light){",
            "@media (prefers-color-scheme:dark){",
            "@media (hover:hover){",
            "@media (prefers-reduced-motion:no-preference){",
        ] as $prefix) {
            $p = strpos($text, $prefix);
            if (false !== $p) $positions[] = $p;
        }

        if (!$positions) return [$text];

        sort($positions);

        $texts = [];

        if ($positions[0]) $texts[] = substr($text, 0, $positions[0]);

        for ($i = 0, $l = count($positions); $l > $i; $i++) {
            $p = $positions[$i];
            $sp = [$p];
            if (($i + 1) !== $l) $sp[] = ($positions[1 + $i] - $p);
            $texts[] = substr($text, ...$sp);
        }

        return $texts;
    }

    private function parse(int $style_id): void
    {
        foreach ($this->split($style_id) as $text) {
            if (0 === strpos($text, "@")) {
                $char = substr($text, 0, 35);
                $char8 = $char[8];

                if ("h" === $char8) {
                    if (isset($text[47]) && "(" === $char[25]) {
                        if ("l" === $text[47]) {
                            $type = "hover:light";
                            $start = 54;
                        } else {
                            $type = "hover:dark";
                            $start = 53;
                        }
                    } else {
                        $type = "hover";
                        $start = 21;
                    }
                } elseif ("r" === $char[16]) {
                    $type = "motion";
                    $start = 46;
                } elseif ("p" === $char8) {
                    if ("l" === $char[29]) {
                        $type = "light";
                        $start = 36;
                    } else {
                        $type = "dark";
                        $start = 35;
                    }
                } else {
                    $is_max = "a" === $char[20];
                    $size = (int)substr($char, -6);
                    $type = ($is_max ? "max" : "min") . "{$size}";
                    $start = (1023 === $size || 1119 === $size || 1120 === $size || 1279 === $size || 1280 === $size || 1024 === $size) ? 37 : 36;
                }
            } else {
                $type = "global";
                $start = 0;
            }

            $this->map["hover" === substr($type, 0, 5) ? "hover" : (in_array($type, ["light", "motion", "dark",], true) ? "global" : $type)] .= ($text = ($start ? substr($text, $start, -1) : $text));

            $this->position[] = [
                "id" => $style_id,
                "text" => $text,
                "type" => $type,
                "position" => [],
            ];
        }
    }

    private function build()
    {
        foreach ([
            "global",
            "min360",
            "min480",
            "min600",
            "min768",
            "min1024",
            "min1120",
            "min1280",
            "max359",
            "max479",
            "max599",
            "max767",
            "max1023",
            "max1119",
            "max1279",
            "hover",
            "light",
            "dark",
            "motion",
        ] as $key) {
            if ($this->map[$key]) {
                $p = "hover" === $key ? "@media (hover:hover){" : ("global" === $key ? "" : "@media screen and (" . ("a" === $key[1] ? "max" : "min") . "-width:" . substr($key, 3) . "px){");
                $this->text .= $p . $this->map[$key] . ($p ? "}" : "");
            }
        }

        foreach ($this->position as $key => $entry) {
            $t = $entry["text"];
            $this->position[$key]["position"] = "" === $t ? [0, 0,] : [strpos($this->text, $t), strlen($t)];
        }
    }

    private function name(int $bundle_id, int $version)
    {
        $this->filename = "i{$bundle_id}t{$version}z";
        $this->basename = $this->filename . ".css";
        $this->pathname = "/styles/" . $this->basename;
        $this->href = $this->pathname . "?v=" . _VERSION_;
    }

    public function __construct(array $style_ids)
    {
        $key = implode(":", $style_ids);
        $stage = 2 === _STAGE_ ? "dev" : "prod";

        $version = max([
            ...array_map(fn (int $id) => filemtime(__DIR__ . "/../../styles/{$stage}/{$id}.css"), $style_ids),
        ]);

        $row = RDS::fetch("SELECT `id`, `version` FROM `css` WHERE `stage`=? AND `key`=? LIMIT 1;", [
            _STAGE_,
            $key,
        ]);

        if ($row && $version === $row["version"]) {
            $this->name($row["id"], $version);
        } else {
            $bundle_id = $row ? $row["id"] : RDS::insert("INSERT INTO `css` (`stage`, `key`) VALUES (?, ?);", [
                _STAGE_,
                $key,
            ]);

            sort($style_ids);

            foreach ($style_ids as $id) $this->parse($id);

            $this->build();

            $this->name($bundle_id, $version);

            S3::putObject(Secret::get("/s3/env.json")["Bucket"], "styles/{$stage}/styles/" . $this->basename, [
                "Body" => $this->text,
                "CacheControl" => "max-age=2592000,public,immutable",
                "ContentType" => "text/css;charset=utf-8",
            ]);

            RDS::execute("UPDATE `css` SET `version`=?, `key`=?, `map`=? WHERE `id`=? LIMIT 1;", [
                $version,
                $this->filename,
                json_encode(array_map(fn (array $entry) => [
                    "id" => $entry["id"],
                    "position" => $entry["position"],
                    "type" => $entry["type"],
                ], $this->position)),
                $bundle_id,
            ]);
        }
    }
}
