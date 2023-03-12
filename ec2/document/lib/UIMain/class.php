<?php

declare(strict_types=1);

class UIMain
{
    static public array $css = [106, 107, 1003,];
    static public array $js = [];

    /*
        背景色: グレー or 白
        コンテンツ(body): 
    */
    static public function create($options)
    {
        return '<div class="c3">'

            .  '<main class="c3a ' . ($options["background"] ? "c3at" . $options["background"] : "") . '" role="main">'
            .    $options["body"]
            .  '</main>'

            .  '<nav class="c3b">'

            .      '<div class="c3b1">'
            .       '<h2 class="c3b1a">メニュー</h2>'

            .       '<div class="c3b1b">'
            .          '<h5 class="c3b1b1">検索</h5>'
            .          '<ul class="c3b1b2">'
            .            '<li><a class="a2 c3b1b2a c3b1b2at1 hb2" href="/search/lost">迷子</a></li>'
            .            '<li><a class="a2 c3b1b2a c3b1b2at2 hb2" href="/search/find">保護</a></li>'
            .          '</ul>'
            .       '</div>'

            .       '<div class="c3b1b c3b1c">'
            .          '<h5 class="c3b1b1">お役立ち</h5>'
            .          '<ul class="c3b1b2">'
            .            '<li><a class="a2 c3b1b2a hb2" href="/search/new"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="M2.629 21.37H4.47l11.342-11.343-1.841-1.841L2.629 19.529v1.841ZM21.434 8.121l-5.589-5.524L17.686.756Q18.442 0 19.544 0q1.101 0 1.857.756l1.841 1.841q.757.756.789 1.826.033 1.067-.723 1.824l-1.874 1.874Zm-1.907 1.939L5.588 24H-.001v-5.589l13.939-13.94 5.589 5.589Zm-4.635-.953-.921-.921 1.841 1.841-.92-.92Z"/></svg>掲載</a></li>'
            .            '<li><a class="a2 c3b1b2a hb2" href="/poster"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="m12 18.667 2.067-4.6 4.6-2.067-4.6-2.067L12 5.333l-2.067 4.6L5.333 12l4.6 2.067 2.067 4.6ZM2.667 24q-1.1 0-1.884-.783Q0 22.433 0 21.333V2.667q0-1.1.783-1.884Q1.567 0 2.667 0h18.666q1.1 0 1.884.783.783.784.783 1.884v18.666q0 1.1-.783 1.884-.784.783-1.884.783H2.667Zm0-2.667h18.666V2.667H2.667v18.666Zm0-18.666v18.666V2.667Z"/></svg>ポスター</a></li>'
            .          '</ul>'
            .       '</div>'

            .       '<div class="c3b1b c3b1c">'
            .          '<h5 class="c3b1b1">案内</h5>'
            .          '<ul class="c3b1b2">'
            .            '<li><a class="a2 c3b1b2a hb2" href="/terms"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="M.632 24v-2.526h15.157V24H.632Zm7.136-6.126L.632 10.737l2.652-2.716 7.2 7.137-2.716 2.716Zm8.021-8.021-7.136-7.2L11.368 0l7.137 7.137-2.716 2.716ZM21.6 22.737 5.116 6.253l1.768-1.769 16.484 16.484-1.768 1.769Z"/></svg>利用規約</a></li>'
            .            '<li><a class="a2 c3b1b2a hb2" href="/privacy"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="M12 24q-4.17-1.05-6.884-4.786Q2.4 15.48 2.4 10.92V3.6L12 0l9.6 3.6v7.32q0 4.56-2.714 8.294Q16.17 22.95 12 24Zm0-2.52q2.91-.9 4.86-3.554Q18.81 15.27 19.14 12H12V2.55l-7.2 2.7v6.21q0 .21.06.54H12v9.48Z"/></svg>プライバシーポリシー</a></li>'
            .            '<li><a class="a2 c3b1b2a hb2" href="/contact"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="M0 22.105V1.895L24 12 0 22.105Zm2.526-3.789L17.495 12 2.526 5.684v4.421L10.105 12l-7.579 1.895v4.421Zm0 0V5.684v12.632Z"/></svg>問い合わせ</a></li>'
            .          '</ul>'
            .       '</div>'

            .       '<div class="c3b1b c3b1c">'
            .          '<h5 class="c3b1b1">環境設定</h5>'
            .          '<ul class="c3b1b2">'
            .            '<li><a class="a2 c3b1b2a hb2" role="button"><svg class="c3b1b2at3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="M12 24q-5 0-8.5-3.5T0 12q0-5 3.5-8.5T12 0q.467 0 .917.033.45.034.883.1-1.367.967-2.183 2.516Q10.8 4.2 10.8 6q0 3 2.1 5.1 2.1 2.1 5.1 2.1 1.833 0 3.367-.817 1.533-.816 2.5-2.183.066.433.1.883.033.45.033.917 0 5-3.5 8.5T12 24Zm0-2.667q2.933 0 5.267-1.616 2.333-1.617 3.4-4.217-.667.167-1.334.267-.666.1-1.333.1-4.1 0-6.984-2.883Q8.133 10.1 8.133 6q0-.667.1-1.333.1-.667.267-1.334-2.6 1.067-4.216 3.4Q2.667 9.067 2.667 12q0 3.867 2.733 6.6 2.733 2.733 6.6 2.733Z"/></svg>カラーモード<svg class="c3b1b2at4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path class="c3b1b2at3a" d="m12 19.075-12-12 2.8-2.8 9.2 9.2 9.2-9.2 2.8 2.8-12 12Z"/></svg></a></li>'
            .          '</ul>'
            .       '</div>'

            .      '</div>'

            .  '</nav>'

            . '</div>';
    }
}
