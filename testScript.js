(() => {
    'use strict';
    (function setLang() {
        try {
            flarum.core.app.translator.addTranslations({
                "core.forum.composer_discussion.title": "發文",
                "core.forum.index.all_discussions_link": "文章列表",
                "core.forum.index.start_discussion_button": "發文"
            });

            const alertId = app.alerts.show("卡特-巴哈模式使用中");
            setTimeout(() => {
                app.alerts.clear(alertId);
            }, 3000);
        }
        catch {
            setTimeout(setLang, 1000);
        }
    })();

    const BHmenu = (() => {
        var mode = "";

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
                get: () => {
                    return li;
                },
                find: (tagName) => {
                    const tag = Object.values(app.store.data.tags).find(e => e.data.attributes.slug == tagName);
                    li = document.createElement('li');
                    li.className = `item-tag${tag.data.id}`;
                    const a = document.createElement('a');
                    a.className = 'TagLinkButton hasIcon';
                    a.href = `/t/${tag.data.attributes.slug}`;
                    li.appendChild(a);

                    const span = document.createElement('span');
                    span.innerText = tag.data.attributes.name;
                    span.className = 'Button-label';
                    a.appendChild(span);
                },
                set: (element) => {
                    const clone = element.cloneNode(true);
                    clone.addEventListener('click', () => clone.querySelector('a').click());
                    menu.replaceChild(clone, li);
                    li = clone;
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
            get: () => {
                return mode;
            },
            clear: () => {
                menu.innerHTML = "";
            },
            setTag: tagItem.find,
            create: () => {
                const li_list = {
                    "core.forum.index.all_discussions_link": '/',
                    "fof-gamification.forum.nav.name": '/rankings',
                    "flarum-subscriptions.forum.badge.following_tooltip": '/following',
                    "clarkwinkelmann-bookmarks.forum.badge": '/bookmarks',
                    "flarum-tags.forum.index.tags_link": '/tags',
                };
                mode = 'd';
                menu.appendChild(menu_focus);
                Object.keys(li_list).map((id, i) => {
                    const li = document.createElement('li');
                    if (i == 0) li.className = 'item-allDiscussions active';

                    const a = document.createElement('a');
                    a.href = li_list[id];
                    li.appendChild(a);

                    const span = document.createElement('span');
                    span.className = 'Button-label';
                    span.innerText = app.translator.translations[id];
                    a.appendChild(span);

                    li.addEventListener('click', () => a.click());

                    li.addEventListener('mouseenter', () => {
                        setTimeout(() => {
                            menu_focus.style.left = `${li.offsetLeft}px`;
                            menu_focus.style.width = `${li.offsetWidth}px`;
                        }, 10);
                    });
                    item.addEventListener('mouseout', setFocusOut);

                    menu.appendChild(li);
                });

                const reply = document.createElement('li');
                reply.className = "item-newDiscussion App-primaryControl";

                const replySpan = document.createElement('span');
                replySpan.className = 'Button-label';
                replySpan.innerText = app.translator.translations["core.forum.discussion_controls.reply_button"];
                reply.appendChild(replySpan);
                reply.addEventListener('click', () => {
                    document.querySelector('.SplitDropdown-button').click();
                });

                menu.appendChild(reply);
            },
            discussions: () => {
                mode = 'd';
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
                                tagItem.hide();
                            });

                            item.addEventListener('mouseenter', (e) => {
                                setTimeout(() => {
                                    menu_focus.style.left = `${item.offsetLeft}px`;
                                    menu_focus.style.width = `${item.offsetWidth}px`;
                                }, 10);
                            });
                            item.addEventListener('mouseout', setFocusOut);

                            if (/allDiscussions/.test(item.className)) {
                                const tag = tagItem.get();
                                menu.appendChild(tag);
                                if (tag.style.display != 'none') {
                                    item.classList.remove('active');
                                    tag.classList.add('active');
                                    tag.addEventListener('click', () => tag.querySelector('a').click());
                                }
                            }
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
                mode = 'u';
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

    const previewImage = (() => {

    })();

    var temp;
    function pageCheck() {
        setTimeout(() => window.requestAnimationFrame(pageCheck), 1000);
        var path = location.pathname;
        if (path == temp) return;
        const url = location.pathname.split('/');
        switch (url[1]) {
            case "t":
                BHmenu.setTag(url[2]);
            case "":
                BHmenu.clear();
                BHmenu.discussions();
                break;
            case "u":
                BHmenu.clear();
                BHmenu.user();
                break;
            case "d":
                if (BHmenu.get() != 'd') {
                    BHmenu.clear();
                    BHmenu.create();
                }
                break;
        }
        temp = path;
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
        const clientMenu = itemSession.querySelector('.Dropdown-menu').querySelector('.item-profile');
        const clientUrl = clientMenu.querySelector('a');
        clientUrl.style.display = 'none';
        const childs = itemSessionBtn.childNodes;
        for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            itemSessionBtn.removeChild(child);
            if (child.className != 'Button-label') {
                if (child.className.trim() == 'Avatar' && window.app.session.user) {
                    child.addEventListener('click', () => clientUrl.click());
                }
                itemSession.appendChild(child);
            };
        }

        const client = document.createElement('div');
        client.className = "BH_Client";
        client.addEventListener('click', () => clientUrl.click());

        const clientAvatar = document.createElement('img');
        clientAvatar.className = 'BH_ClientAvatar';
        clientAvatar.src = window.app.session.user.data.attributes.avatarUrl;
        client.appendChild(clientAvatar);

        const clientName = document.createElement('div');
        clientName.className = 'BH_ClientName';
        clientName.innerText = window.app.session.user.data.attributes.displayName;
        client.appendChild(clientName);

        const clientId = document.createElement('div');
        clientId.className = 'BH_ClientId';
        clientId.innerText = window.app.session.user.data.attributes.username;
        client.appendChild(clientId);

        clientMenu.querySelector('a').innerHTML = "";
        clientMenu.appendChild(client);
    })();

})();