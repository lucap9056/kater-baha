(() => {
    'use strict';
    const updateTime = "卡特-巴哈模式 最後更新時間:2022/11/15 05:15";
    const admin = (() => {
        const admin_list = document.createElement('div');
        admin_list.id = 'BH_adminList';

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/users?filter[group]=1,4`);
        xhr.onload = () => {

            const users = JSON.parse(xhr.response).data;

            users.map(user => {
                const div = document.createElement('div');
                div.className = 'BH_adminItem';

                const img = document.createElement('img');
                img.className = 'BH_adminItemImg';
                img.src = user.attributes.avatarUrl || "";
                img.addEventListener('error', () => img.style.display = "none");
                div.appendChild(img);

                const userBlock = document.createElement('div');
                userBlock.className = 'BH_adminItemBlock';
                div.appendChild(userBlock);

                const userCover = document.createElement('img');
                userCover.className = 'BH_adminItemCover';
                userCover.src = user.attributes.cover_thumbnail || "";
                userCover.addEventListener('error', () => userCover.style.display = 'none');
                userBlock.appendChild(userCover);

                const userAvatar = document.createElement('img');
                userAvatar.className = 'BH_adminItemAvatar';
                userAvatar.src = user.attributes.avatarUrl || "";
                userAvatar.addEventListener('error', () => userCover.style.display = 'none');
                userBlock.appendChild(userAvatar);

                const userName = document.createElement('div');
                userName.className = 'BH_adminItemName';
                userName.innerText = user.attributes.displayName;
                userBlock.appendChild(userName);

                const userId = document.createElement('div');
                userId.className = 'BH_adminItemId';
                userBlock.appendChild(userId);

                const a = document.createElement('a');
                a.innerText = user.attributes.username;
                a.href = `/u/${user.attributes.username}`;
                userId.appendChild(a);
                userAvatar.addEventListener('click', () => a.click());

                admin_list.appendChild(div);
            });

            append();
        }
        xhr.send();

        function append() {
            const path = location.pathname;
            if (path != "/" && !/^\/d\//.test(path)) return;
            const parent = document.querySelector('.IndexPage .container') || document.querySelector('.Hero .container');
            if (parent) parent.appendChild(admin_list);
        }
        return {
            append: append
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

        const replyBtn = document.createElement('li');
        replyBtn.id = 'BH-replay';
        replyBtn.addEventListener('click', () => {
            document.querySelector('.SplitDropdown-button').click();
        });

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
            setReply: (e) => {
                if (e) {
                    replyBtn.innerText = e;
                    return;
                }
                menu.appendChild(replyBtn);
            },
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
                    li.addEventListener('mouseout', setFocusOut);

                    menu.appendChild(li);
                });

                menu.appendChild(replyBtn);
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

    const welcomeImage = (() => {
        const img = document.createElement('img');
        img.className = "BH_welcomeImage";
        img.width = 1100;
        img.height = 320;
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

    (function previewImage() {

        (function getDiscussionTimer() {
            setTimeout(() => window.requestAnimationFrame(getDiscussionTimer), 3000);
            const path = location.pathname;
            if (!/^\/t\//.test(path) && path != "/") return;
            (function getDiscussion() {
                const discussion = document.querySelector('.DiscussionListItem');
                if (discussion) {
                    discussion.classList.remove('DiscussionListItem');
                    discussion.classList.add('BH_DiscussionListItem');
                    try {
                        const id = discussion.parentNode.dataset.id;
                        setPreviewImage(discussion, id);
                    }
                    catch {

                    }
                    getDiscussion();
                }
                else return;
            })();
        })();

        async function setPreviewImage(element, id) {
            const discussion = app.store.data.discussions[id].data;
            const post = app.store.data.posts[discussion.relationships.firstPost.data.id];

            const div = document.createElement('div');
            div.innerHTML = post.data.attributes.contentHtml;
            const img = div.querySelector('img');

            if (img) {
                const previewImg = document.createElement('img');
                previewImg.className = 'BH_previewImage';
                previewImg.src = img.src;
                element.appendChild(previewImg);
            }
            else {
                const previewImg = document.createElement('div');
                previewImg.className = 'BH_previewImage';
                previewImg.classList.add(`BH_previewImageTag${discussion.relationships.tags.data[0].id}`);
                element.appendChild(previewImg);
            }

            var content = div.innerText.replace(/\n/g, '');
            if (content.length > 100) content = content.substring(0, 100) + '...';
            const previewContent = document.createElement('div');
            previewContent.className = 'BH_previewContent';
            previewContent.innerText = content;
            element.querySelector('.DiscussionListItem-content').appendChild(previewContent);
        }
    })();

    var temp;
    function pageCheck() {
        setTimeout(() => window.requestAnimationFrame(pageCheck), 1000);
        var path = location.pathname;
        welcomeImage.append();
        if (path == temp) return;
        const url = location.pathname.split('/');
        switch (url[1]) {
            case "t":
                BHmenu.setTag(url[2]);
            case "":
                BHmenu.clear();
                BHmenu.discussions();
                admin.append();
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
                else BHmenu.setReply();
                admin.append();
                break;
        }
        temp = path;
    }
    window.requestAnimationFrame(pageCheck);


    (function setLang() {
        try {
            flarum.core.app.translator.addTranslations({
                "core.forum.composer_discussion.title": "發文",
                "core.forum.index.all_discussions_link": "文章列表",
                "core.forum.index.start_discussion_button": "發文"
            });
            BHmenu.setReply(app.translator.translations["core.forum.discussion_controls.reply_button"]);
            const alertId = app.alerts.show(updateTime);
            setTimeout(() => {
                app.alerts.clear(alertId);
            }, 3000);
        }
        catch {
            setTimeout(setLang, 1000);
        }
    })();

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


    (function notifications() {
        if (document.querySelector('.item-notifications') == null) {
            setTimeout(notifications, 1000);
            return;
        }
        var notifications_list = {};
        var notifications_num = 0;
        const notificationsTable = document.createElement('div');
        notificationsTable.id = 'BH_notificationsTable';

        const notificationBtn = document.createElement('li');
        notificationBtn.id = 'BH_notificationBtn';

        const notificationsLi = document.createElement('li');
        notificationsLi.id = 'BH_notificationLi';
        notificationsLi.appendChild(notificationBtn);
        notificationsLi.appendChild(notificationsTable);

        const headerNotification = document.querySelector('.item-notifications');
        headerNotification.parentNode.insertBefore(notificationsLi, headerNotification);
        headerNotification.style.display = 'none';

        notificationBtn.addEventListener('click', () => {


            const read = new XMLHttpRequest();
            read.open("POST", "/api/notifications/read");
            read.send();
        });

        getNotification("/api/notifications?page[limit]=20", (res) => {

            res.data.map(data => {
                if (data.attributes.contentType != 'postMentioned') {
                    const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
                    if (notifications_list[id]) return;
                }

                if (!data.attributes.isRead) notifications_num++;

                const notificationItem = document.createElement('div');
                notificationItem.className = 'BH_notificationItem';

                const fromUser = app.store.data.users[data.relationships.fromUser.data.id];
                const notificationFromUser = document.createElement('img');
                notificationFromUser.className = 'BH_notificationFromUser';
                notificationFromUser.src = fromUser.data.attributes.avatarUrl;
                notificationItem.appendChild(notificationFromUser);

                const notificationText = document.createElement('div');
                notificationText.className = 'BH_notificationText';
                notificationItem.appendChild(notificationText);

                var url = "";
                var post;
                var discussion;
                switch (data.relationships.subject.data.type) {
                    case "posts":
                        post = app.store.data.posts[data.relationships.subject.data.id];
                        discussion = app.store.data.discussions[post.data.relationships.discussion.data.id];
                        url = `/d/${discussion.id}/${post.id}`;
                        break;
                    case "discussions":
                        discussion = app.store.data.discussions[data.relationships.subject.data.id];
                        url = `/d/${discussion.id}`;
                        break;
                }

                const discussionTitle = discussion.data.attributes.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

                switch (data.attributes.contentType) {
                    case "vote":
                        notificationText.innerHTML = `在 <p class="BH_notificationLinkText">${discussionTitle}</p> 中獲得了推`;
                        break;
                    case "newPost":
                        notificationText.innerHTML = `在 <p class="BH_notificationLinkText">${discussionTitle}</p> 中有了新的回應`;
                        break;
                    case "postMentioned":
                        notificationText.innerHTML = `<p class="BH_notificationLinkText">${fromUser.data.attributes.displayName}</p> 在回覆中提到了你`;
                        break;
                }

                const notificationTime = document.createElement('span');
                notificationTime.className = 'BH_notificationTime';

                notificationsTable.appendChild(notificationItem);
                notificationItem.addEventListener('click', () => {
                    if (url != "") location.assign(url);
                });
            });
        });

        function getNotification(url, callback) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => {
                const res = JSON.parse(xhr.response);
                res.included.map(item => {
                    app.store.data[item.type][item.id] = {
                        data: item,
                        freshness: new Date(),
                        exists: true,
                        store: app.store
                    }
                });
                callback(res);
            }
            xhr.send();
        }
    })();

})();