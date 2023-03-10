<?php

declare(strict_types=1);

class UIFooter
{
    static public array $css = [105, 1002,];
    static public array $js = [];

    static public function create()
    {
        return '<footer class="c2" role="contentinfo">'
            . '<h5 class="c2a">About</h5>'
            . '<ul class="c2b">'
            .   '<li><a class="ha2" href="/terms">利用規約</a></li>'
            .   '<li><a class="ha2" href="/privacy">プライバシーポリシー</a></li>'
            .   '<li><a class="ha2" href="/contact">お問い合わせ</a></li>'
            . '</ul>'
            . '<div class="c2e">'
            .   '<img alt="LOSTPET.JP | 迷子ペットのデータベース" class="c2e1" decoding="async" heigth="50" loading="lazy" src="/icon.svg" width="50">'
            . '</div>'
            . '<div class="c2c">迷子ペットとの再会をサポートしたい</div>'
            . '<div class="c2d">'
            .  '<small class="c2d1">© 2018-' . date("Y") . ' lostpet.jp</small>'
            . '</div>'
            . '</footer>';
    }
}

/*
<footer class="footer" role="contentinfo">
    <div class="footerMenu">
        
        <ul>
            
            <li><a href="/privacy">プライバシーポリシー</a></li>
            <li><a href="/contact">お問い合わせ</a></li>
        </ul>
    </div>
    
    <div class="m24">
        <img alt="迷子ペットのデータベース" decoding="async" src="/icon.svg" width="50">
    </div>
    
    <p class="footer-catchphrase m18">迷子ペットへの再会をサポートしたい</p>
    <p class="m18"><small>© 2018-2023 lostpet.jp</small></p>
</footer>
*/