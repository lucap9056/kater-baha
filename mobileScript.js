(function BHload() {
    'use strict';
    const updateTime = "卡巴姆特mobile 最後更新時間:2022/11/19 07:10";
    try {
        var test = app.translator.translations["fof-gamification.forum.ranking.amount"];
        flarum.core.app.translator.addTranslations({
            "kabamut.name": "卡巴姆特",
            "kabamut.settings.preview": "顯示文章預覽",
            "kabamut.settings.notification": "卡特原版通知欄"
        });
    }
    catch {
        setTimeout(BHload, 1000);
        return;
    }

    const welcomeImage = (() => {
        const img = document.createElement('img');
        img.className = "BH_welcomeImage";
        img.src = "https://p2.bahamut.com.tw/FORUM/welcome/60076_1_1668294299.GIF?v=1668294300";

        return {
            append: () => {
                if (location.pathname.replace(/\//, '') != "") return;
                const home = document.querySelector('.IndexPage .container');
                if (home == null || home.querySelector('.BH_welcomeImage')) return;
                home.insertBefore(img, home.querySelector('div'));
            }
        }
    })();

    var temp;
    (function pageCheck() {
        Timer(pageCheck, 1000);
        var path = location.pathname;
        welcomeImage.append();
        if (path == temp) return;
        const url = location.pathname.split('/');
        switch (url[1]) {
            case "t":
            case "":

                break;
            case "u":

                break;
            case "d":

                break;
            case "settings":

                break;
        }
        temp = path;
    })();

    (function Session() {
        var header;
        try {
            header = document.getElementById('header-secondary').getElementsByClassName('Header-controls')[0];

        }
        catch {
            setTimeout(1000, Session);
            return;
        }
        if (document.querySelector('.item-settings') == null) {
            setTimeout(1000, Session);
            return;
        }
        const sessionItem = document.querySelector('.item-session');
        const sessionMenu = sessionItem.querySelector('.Dropdown-menu');
        sessionMenu.className = 'BH_item-session';

        const itemNav = document.querySelector('.item-nav .ButtonGroup .Dropdown-menu');
        itemNav.className = 'item-select';
        header.appendChild(itemNav);
        header.appendChild(sessionMenu);

    })();

    function Timer(call, t) {
        if (t == null) window.requestAnimationFrame(call);
        else setTimeout(() => window.requestAnimationFrame(call), t);
    }
})();