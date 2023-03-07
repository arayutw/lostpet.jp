<?php

declare(strict_types=1);

class Head
{
    static public function create(array $head): string
    {
        return Json2Node::create(array_filter(
            $head,
            fn (array $entry) => !(("link" === $entry["tagName"] && is_null($entry["attribute"]["rel"])) || ("meta" === $entry["tagName"] && is_null($entry["attribute"]["property"])))
        ));
    }

    static public function merge(array $head1, array $head2): array
    {
        foreach ($head2 as $entry) {
            $overwrite = false;

            foreach ($head1 as $index => $default_entry) {
                if (
                    $entry["tagName"] === $default_entry["tagName"]
                    && (
                        ("link" === $entry["tagName"] && $entry["attribute"]["rel"] === $default_entry["attribute"]["rel"])
                        || ("meta" === $entry["tagName"] && $entry["attribute"]["property"] === $default_entry["attribute"]["property"])
                        || ("title" === $entry["tagName"])
                    )
                ) {
                    $head1[$index] = $entry;
                    $overwrite = true;
                    break;
                }
            }

            if (!$overwrite) {
                $head1[] = $entry;
            }
        }

        return $head1;
    }
}
