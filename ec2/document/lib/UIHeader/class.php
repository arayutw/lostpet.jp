<?php

declare(strict_types=1);

class UIHeader
{
    static public array $css = [101, 102, 1001,];
    static public array $js = [];

    static public function create()
    {
        return '<header class="c1" role="banner">'
            . '<a class="c1a" href="/"><picture><source srcset="/logo.svg" media="(min-width: 480px)"><img class="c1a1" src="/icon.svg"></picture></a>'
            . '<a class="a3 c1b ht1" href="/">サイトに掲載</a>'
            . '</header>';
    }
}
