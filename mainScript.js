(() => {
    'use strict';
    flarum.core.app.translator.addTranslations({
        "core.forum.composer_discussion.title": "發文",
        "core.forum.index.all_discussions_link": "文章列表",
        "core.forum.index.start_discussion_button": "發文"
    });

    const BHmenu = (() => {
        const header = document.createElement('div');
        header.id = 'BH_header';
        document.getElementById('header').appendChild(header);

        const menu = document.createElement('div');
        menu.id = 'BH_headerMenu';
        header.appendChild(menu);

        const menu_focus = document.createElement('div');
        menu_focus.id = 'BH_headerMenuFocus';
        menu.appendChild(menu_focus);
        
        const tagItem = (() => {
            var li = document.createElement('li');
            li.style.display = 'none';

            return {
                get: li,
                set: (element) => {
                    console.log(element);
                    menu.replaceChild(element,li);
                    li = element;
                    li.style.display = 'block';
                },
                hide: () => li.style.display = 'none'
            }
        })();


        function setFocusOut() {
            const childs = menu.querySelector(".Dropdown-menu") || menu;
            var child = menu.querySelector('.item-allDiscussions') || menu.querySelector('.item-posts');
            if (child == null) return;
            for (let i = 0; i < childs.childNodes.length; i++) {
                if (childs.childNodes[i].className.indexOf('active') > -1) child = childs.childNodes[i];
            }
            menu_focus.style.left = `${child.offsetLeft}px`;
            menu_focus.style.width = `${child.offsetWidth}px`;
        }

        return {
            clear: () => {
                menu.innerHTML = "";
            },
            discussions: () => {

                menu.appendChild(menu_focus);
                (function setMenu() {
                    var item_list;
                    try {
                        item_list = document.querySelector('.item-nav').querySelector('.Dropdown-menu.dropdown-menu ').childNodes;
                    }
                    catch {
                        setTimeout(setMenu, 1000);
                        return;
                    }

                    Array.prototype.slice.call(item_list).map(item => {
                        if (/allDiscussions|rankings|following|bookmarks|tags|separator/.test(item.className)) {
                            if (menu.querySelector(`.${item.className.replace('active').trim()}`)) return;
                            menu.appendChild(item);

                            item.addEventListener('click', () => {
                                Array.prototype.slice.call(menu.childNodes).map(i => i.classList.remove('active'));
                                item.classList.add('active');

                                item.querySelector('a').click();
                            });

                            item.addEventListener('mouseenter', (e) => {
                                setTimeout(() => {
                                    menu_focus.style.left = `${item.offsetLeft}px`;
                                    menu_focus.style.width = `${item.offsetWidth}px`;
                                }, 10);
                            });
                            item.addEventListener('mouseout', setFocusOut);

                            if (menu.childNodes.length == 1) menu.appendChild(tagItem.get);
                        }
                        else item.addEventListener('click', () => tagItem.set(item));
                    });
                    setFocusOut();
                })();

                (function setPostBtn() {
                    try {
                        const postBtn = document.querySelector(".item-newDiscussion.App-primaryControl");
                        postBtn.querySelector('button').style.pointerEvents = 'auto';
                        menu.appendChild(postBtn);
                    }
                    catch {
                        setTimeout(setPostBtn, 1000);
                        return;
                    }
                })();
            },
            user: () => {

                menu.appendChild(menu_focus);
                (function setMenu() {
                    var userMenu = document.querySelector('ul.affix-top') || document.querySelector('ul.affix');
                    if (userMenu) {
                        userMenu = userMenu.querySelector('.Dropdown-menu');
                        menu.appendChild(userMenu);
                        const childs = userMenu.childNodes;
                        for (let i = 0; i < childs.length; i++) {
                            const child = childs[i];
                            child.addEventListener('click', () => {
                                Array.prototype.slice.call(childs).map(i => i.classList.remove('active'));
                                child.classList.add('active');
                                child.querySelector('a').click();
                            });

                            child.addEventListener('mouseenter', () => {
                                setTimeout(() => {
                                    menu_focus.style.left = `${child.offsetLeft}px`;
                                    menu_focus.style.width = `${child.offsetWidth}px`;
                                }, 10);
                            });
                            child.addEventListener('mouseout', setFocusOut);
                        }
                        setFocusOut();
                    }
                    else setTimeout(setMenu, 1000);
                })();
            }
        }
    })();

    var temp;
    function pageCheck() {
        setTimeout(() => window.requestAnimationFrame(pageCheck), 3000);
        var path = location.pathname;
        if (path == temp) return;
        temp = path;
        const mode = location.pathname.split('/')[1];
        console.log(mode);
        switch (mode) {
            case "":
            case "t":
                BHmenu.clear();
                BHmenu.discussions();
                break;
            case "u":
                BHmenu.clear();
                BHmenu.user();
                break;
        }
    }
    window.requestAnimationFrame(pageCheck);


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
        clientMenu.innerHTML = "";
        clientMenu.appendChild(client);
    })();

})();