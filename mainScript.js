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
        window.app.translator.translations["core.forum.composer_discussion.title"] = "發文";
        window.app.translator.translations["core.forum.index.all_discussions_link"] = "文章列表";
        window.app.translator.translations["core.forum.index.start_discussion_button"] = "發文";

        const BHmenub = document.createElement('div');
        BHmenub.id = 'BH_menub';
        document.getElementById('header').appendChild(BHmenub);

        const BHmenu = document.createElement('div');
        BHmenu.id = 'BH_menu';
        BHmenub.appendChild(BHmenu);

        const BHmenu_focus = document.createElement('div');
        BHmenu_focus.id = 'BHmenu_focus';
        BHmenu.appendChild(BHmenu_focus);

        document.querySelector('.Header-logo').addEventListener('click',setBHmenu);
        setBHmenu();
        function setBHmenu() {
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
                    item.classList.remove('active'); 

                    var old = BHmenu.querySelector(`.${item.className.trim()}`);
                    if (old) old.classList.remove('BH_itemFocus');
                    else BHmenu.appendChild(item);

                    var path = location.pathname.replace(/\//,'');
                    if (path == '') path = 'allDiscussions';

                    if (item.className.indexOf(path) > -1) item.classList.add('BH_itemFocus');

                    item.addEventListener('click',() => {
                        setTimeout(() => {
                            Array.prototype.slice.call(BHmenu.childNodes).map(i => {
                                i.classList.remove('BH_itemFocus');
                            });
                            item.classList.add('BH_itemFocus');
                        },10);
                    });

                    item.addEventListener('mouseenter',(e) => {
                        BHmenu_focus.style.left = `${item.offsetLeft }px`;
                        BHmenu_focus.style.width = `${item.offsetWidth + 24}px`;
                    });
                    item.addEventListener('mouseout',setFocusOut);
                }
            });

            function setFocusOut() {
                const childs = BHmenu.childNodes;
                var child = BHmenu.querySelector('.item-allDiscussions');
                for (let i = 0; i < childs.length; i++) {
                    if (childs[i].className.indexOf('BH_itemFocus') > -1) child = childs[i];
                }
                BHmenu_focus.style.left = `${child.offsetLeft }px`;
                BHmenu_focus.style.width = `${child.offsetWidth}px`;
            }

            try {
                const postBtn = document.querySelector(".item-newDiscussion.App-primaryControl");
                BHmenu.appendChild(postBtn);
            }
            catch {
                setTimeout(setBHmenu, 1000);
                return;
            }

        };
    })();
})();