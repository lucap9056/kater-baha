(() => {
    'use strict';
    (function search() {
        const head = document.querySelector(".container");
        const search = document.querySelector(".item-search");

        if (search) {
            search.parentNode.removeChild(search);
            head.appendChild(search);
        }
        else setTimeout(search, 1000);
    })();

    (function headerItem() {
        try {
            const locale = document.querySelector(".item-locale");
            locale.parentNode.removeChild(locale);
        }
        catch {
            setTimeout(headerItem, 1000);
            return;
        }
        const itemSession = document.querySelector(".item-session");
        console.log(itemSession);
        const itemSessionBtn = itemSession.querySelector(".Dropdown-toggle");
        const childs = itemSessionBtn.childNodes;
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            itemSessionBtn.removeChild(child);
            if (child.className != 'Button-label') {
                if (child.className.trim() == 'Avatar' && window.app.session.user) {
                    const a = document.createElement('a');
                    a.href = `/u/${window.app.session.user.username()}`;
                    a.appendChild(child);
                    itemSession.appendChild(a);
                }
                else itemSession.appendChild(child);
            };
        }

        const client = document.createElement('div');
        client.className = "BH_Client";

        const clientUrl = document.createElement('a');
        clientUrl.href = `/u/${window.app.session.user.username()}`;
        client.appendChild(clientUrl);


        const clientAvatar = document.createElement('img');
        clientAvatar.className = 'BH_ClientAvatar';
        clientAvatar.src = window.app.session.user.data.attributes.avatarUrl;
        clientUrl.appendChild(clientAvatar);

        const clientName = document.createElement('div');
        clientName.className = 'BH_ClientName';
        clientName.innerText = window.app.session.user.data.attributes.displayName;
        clientUrl.appendChild(clientName);

        const clientId = document.createElement('div');
        clientId.className = 'BH_ClientId';
        clientId.innerText = window.app.session.user.data.attributes.username;
        clientUrl.appendChild(clientId);

        const clientMenu = itemSession.querySelector('.Dropdown-menu').querySelector('.item-profile');
        console.log(clientMenu);
        console.log(client);
        clientMenu.innerHTML = "";
        clientMenu.appendChild(client);
    })();

    (function createBHmenu() {

        const BHmenub = document.createElement('div');
        BHmenub.id = 'BH_menub';
        document.getElementById('header').appendChild(BHmenub);
        const BHmenu = document.createElement('div');
        BHmenu.id = 'BH_menu';
        BHmenub.appendChild(BHmenu);

        (function setBHmenu() {

            var item_list;
            try {
                item_list = document.querySelector('.item-nav').querySelector('.Dropdown-menu.dropdown-menu ').childNodes;
            }
            catch {
                setTimeout(setBHmenu, 1000);
                return;
            }
            Array.prototype.slice.call(item_list).map(item => {
                if (/allDiscussions|rankings|following|bookmarks|tags|separator/.test(item.className)) {
                    BHmenu.appendChild(item);
                }
            });

            const postBtn = document.querySelector(".item-newDiscussion.App-primaryControl");
            postBtn.querySelector('button').innerText = "發文";

            BHmenu.appendChild(postBtn);

        })();
    })();
})();