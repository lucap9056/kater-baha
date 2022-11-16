(function BHload() {
    'use strict';
    try {
        var test = app.translator.translations["fof-gamification.forum.ranking.amount"];
        flarum.core.app.translator.addTranslations({
            "core.forum.composer_discussion.title": "發文",
            "core.forum.index.all_discussions_link": "文章列表",
            "core.forum.index.start_discussion_button": "發文",
            "kabamut.name": "卡巴姆特",
            "kabamut.settings.preview": "顯示文章預覽"
        });
    }
    catch {
        setTimeout(BHload, 1000);
        return;
    }

    var config = {
        preview: true
    };
    try {
        config = Object.assign(config, JSON.parse(document.cookie.split('kabamut=')[1].split(';')[0]));
    }
    catch {
    }


    const updateTime = "卡巴姆特 最後更新時間:2022/11/17 05:05";
    var BH_store = {
        data: {
            notifications: {},
            discussions: {},
            posts: {},
            users: {}
        }
    };

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
                    a.className = 'BH_item-link';
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

    const settings = (() => {

        const inputDisplay = document.createElement('div');
        inputDisplay.className = 'Checkbox-display';
        inputDisplay.ariaHidden = true;

        const text = document.createTextNode(app.translator.translations["kabamut.settings.preview"]);

        const label = document.createElement('label');
        label.className = `Checkbox on Checkbox--switch`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = true;
        input.addEventListener('change', () => {
            if (input.checked) label.className = label.className.replace(/off/, 'on');
            else label.className = label.className.replace(/on/, 'off');
            config.preview = input.checked;
            saveSettings();
        });
        label.appendChild(input);
        label.appendChild(inputDisplay);
        label.appendChild(text);

        if (!config.preview) {
            input.checked = false;
            label.className = label.className.replace(/on/, 'off');
        }

        const li = document.createElement('li');
        li.className = 'item-previewImage';
        li.appendChild(label);

        const ul = document.createElement('ul');
        ul.appendChild(li);

        const fieldset = document.createElement('fieldset');
        fieldset.className = 'Settings-kabamut';
        fieldset.innerHTML = `<legend>${app.translator.translations["kabamut.name"]}</legend>`;
        fieldset.appendChild(ul);

        const item_li = document.createElement('li');
        item_li.className = 'item-kabamut';
        item_li.appendChild(fieldset);

        function saveSettings() {
            document.cookie = `kabamut=${JSON.stringify(config)}; expires=Thu Jan 01 2122 00:00:00 GMT`;
        }

        return {
            load: () => {
                document.querySelector('.SettingsPage > ul').appendChild(item_li);
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

    var temp;
    function pageCheck() {
        Timer(pageCheck, 1000);
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
            case "settings":
                settings.load();
                break;
        }
        temp = path;
    }
    Timer(pageCheck);


    (function setLang() {
        try {
            BHmenu.setReply(app.translator.translations["core.forum.discussion_controls.reply_button"]);
            const alertId = app.alerts.show(updateTime);
            setTimeout(() => app.alerts.clear(alertId), 3000);
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

    (function PreviewImage() {
        (function getDiscussionTimer() {
            const path = location.pathname;
            const discussion = document.querySelector('.DiscussionListItem');
            if ((!/^\/t\//.test(path) && path != "/") || discussion == null || !config.preview) {
                Timer(getDiscussionTimer, 1000);
                return;
            }
            (function getDiscussion(msgID) {
                const discussion = document.querySelector('.DiscussionListItem');
                if (discussion == null) {
                    app.alerts.clear(msgID);
                    Timer(getDiscussionTimer, 1000);
                    return;
                }

                discussion.classList.remove('DiscussionListItem');
                discussion.classList.add('BH_DiscussionListItem');
                discussion.addEventListener('click', () => {
                    const a = discussion.querySelector('a.DiscussionListItem-main');
                    a.click();
                });
                try {
                    const id = discussion.parentNode.dataset.id;
                    setPreviewImage(discussion, id);
                }
                catch {

                }
                getDiscussion(msgID);
            })(app.alerts.show("preview image loading"));
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
                const tag = app.store.data.tags[discussion.relationships.tags.data[0].id];
                const previewImg = document.createElement('div');
                previewImg.className = 'BH_previewImage';
                previewImg.dataset.text = tag.data.attributes.name;
                previewImg.style.color = tag.data.attributes.color;
                previewImg.style.borderColor = tag.data.attributes.color;
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

    (function notifications() {
        const IconUrl = '/assets/favicon-gtoqtyic.png';
        var IconUrl_alert;
        const iconElement = document.createElement('link');
        iconElement.rel = 'icon';
        iconElement.href = IconUrl;
        document.head.appendChild(iconElement);
        (() => {
            const canvas = document.createElement('canvas');
            const icon = new Image();
            icon.onload = () => {
                canvas.width = icon.width;
                canvas.height = icon.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(icon, 0, 0);
                ctx.beginPath();
                ctx.fillStyle = "#F00";
                ctx.arc(52, 12, 12, 0, 2 * Math.PI);
                ctx.fill();

                const dataURL = canvas.toDataURL('image/png');
                const base64 = atob(dataURL.split(',')[1]);
                const array = []
                for (let i = 0; i < base64.length; i++) {
                    array.push(base64.charCodeAt(i))
                }
                const iconFile = new Blob([new Uint8Array(array)], { type: 'image/png' });
                IconUrl_alert = URL.createObjectURL(iconFile);
                console.log(IconUrl_alert);
            }
            icon.src = IconUrl;
        })();



        if (document.querySelector('.item-notifications') == null) {
            setTimeout(notifications, 1000);
            return;
        }
        var notifications_list = {};
        var notifications_num = 0;
        var notifications_next = "";
        var notifications_state = "";
        const notificationNoreadNum = document.createElement('span');
        notificationNoreadNum.id = 'BH_notificationNoreadNum';

        const notificationsTable = document.createElement('div');
        notificationsTable.id = 'BH_notificationsTable';

        const notificationBtn = document.createElement('li');
        notificationBtn.id = 'BH_notificationBtn';
        notificationBtn.appendChild(notificationNoreadNum);

        const notificationsLi = document.createElement('li');
        notificationsLi.id = 'BH_notificationLi';
        notificationsLi.appendChild(notificationBtn);
        notificationsLi.appendChild(notificationsTable);

        const headerNotification = document.querySelector('.item-notifications');
        headerNotification.parentNode.insertBefore(notificationsLi, headerNotification);
        headerNotification.style.display = 'none';

        notificationsTable.addEventListener('scroll', (e) => {
            if (notifications_state == "" && notificationsTable.scrollTop == notificationsTable.scrollTopMax) {
                notifications_state = "loading";
                getNotification(notifications_next, (res) => {
                    if (res.links.next) notifications_next = res.links.next;
                    else notifications_state = "end";
                    res.data.map(data => {
                        if (BH_store.data.notifications[data.id]) return;
                        BH_store.data.notifications[data.id] = data;
                        const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
                        if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) return;

                        const notification = createNotificationItem(data);
                        if (!data.attributes.isRead) {
                            notifications_num++;
                            notification.item.classList.add('BH_noRead');
                        }
                        notifications_list[id] = notification;
                        notificationsTable.appendChild(notification.item);
                    });
                    notifications_state = "";
                });
            }
        });

        notificationBtn.addEventListener('click', () => {
            Object.values(notifications_list).map(item => item.updateTime());
            setTimeout(() => notificationsTable.style.display = 'block', 10);
            if (notifications_num > 0) allRead();
            notifications_num = 0;
            notificationNoreadNum.style.display = 'none';
        });

        function allRead() {
            iconElement.href = IconUrl;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `/api/notifications/read`);
            xhr.setRequestHeader('X-CSRF-Token', app.session.csrfToken);
            xhr.send();
        }

        document.addEventListener('click', () => {
            if (notificationsTable.style.display == 'block') {
                notificationsTable.style.display = 'none';
                (function removeNoRead() {
                    const item = notificationsTable.querySelector('.BH_noRead');
                    if (item) {
                        item.classList.remove('BH_noRead');
                        removeNoRead();
                    }
                })();
            }
        });
        getNotification("page[limit]=30&sort=-createdAt", (res) => {
            notifications_next = res.links.next;
            res.data.map(data => {
                BH_store.data.notifications[data.id] = data;
                const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;

                if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) return;

                const notification = createNotificationItem(data);
                if (!data.attributes.isRead) {
                    notifications_num++;
                    notification.item.classList.add('BH_noRead');
                }
                notifications_list[id] = notification;
                notificationsTable.appendChild(notification.item);
            });

            setNotificationNoreadNum();
        });

        function getNotificationTimer() {
            setTimeout(getNotificationTimer, 300000);
            getNotification('page[limit]=20&sort=-createdAt', (res) => {
                res.data.filter(e => e.attributes.isRead == false).reverse().map(data => {
                    if (BH_store.data.notifications[data.id]) return;
                    BH_store.data.notifications[data.id] = data;

                    const notification = createNotificationItem(data);
                    notifications_num++;
                    notification.item.classList.add('BH_noRead');


                    const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
                    if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) {
                        notifications_list[id].item.parentNode.removeChild(notifications_list[id].item);
                        notifications_list[id] = notification;
                    }

                    notificationsTable.insertBefore(notification.item, notificationsTable.firstChild);
                });
                setNotificationNoreadNum();
            });
        }
        Timer(getNotificationTimer, 300000);

        function setNotificationNoreadNum() {
            if (notifications_num > 0) {
                notificationNoreadNum.innerText = (notifications_num > 99) ? '99+' : notifications_num;
                notificationNoreadNum.style.display = 'block';
                iconElement.href = IconUrl_alert;
            }
            else notificationNoreadNum.style.display = 'none';
        }

        function createNotificationItem(data) {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'BH_notificationItem';

            const userID = data.relationships.fromUser.data.id;
            const fromUser = BH_store.data.users[userID] || app.store.data.users[userID];
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
                    post = BH_store.data.posts[data.relationships.subject.data.id];
                    discussion = BH_store.data.discussions[post.data.relationships.discussion.data.id];
                    url = `/d/${discussion.data.id}/${post.data.attributes.number}`;
                    break;
                case "discussions":
                    discussion = BH_store.data.discussions[data.relationships.subject.data.id];
                    url = `/d/${discussion.data.id}`;
                    break;
            }

            const discussionTitle = discussion.data.attributes.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            switch (data.attributes.contentType) {
                case "vote":
                    const div = document.createElement('div');
                    div.innerHTML = post.data.attributes.contentHtml;

                    notificationText.innerHTML = `在 <span class="BH_notificationLinkText">${discussionTitle}</span> 中獲得了推<br><span class="BH_notificationContentText">${div.innerText}</span>`;
                    break;
                case "newPost":
                    notificationText.innerHTML = `在 <span class="BH_notificationLinkText">${discussionTitle}</span> 中有了新的回應`;
                    break;
                case "postMentioned":
                    notificationText.innerHTML = `<span class="BH_notificationLinkText">${fromUser.data.attributes.displayName}</span> 在回覆中提到了你`;
                    break;
            }

            const notificationTime = document.createElement('span');
            notificationTime.className = 'BH_notificationTime';
            notificationTime.innerText = getTime(data.attributes.createdAt);
            notificationItem.appendChild(notificationTime);

            notificationItem.addEventListener('click', () => {
                window.open(url);
            });

            return {
                item: notificationItem,
                updateTime: () => {
                    notificationTime.innerText = getTime(data.attributes.createdAt);
                }
            };
        }

        function getTime(timeText) {
            const time = new Date(timeText);
            const ms = parseInt(new Date() - time);
            const s = ms / 1000;
            const m = s / 60;
            const h = m / 60;
            const d = h / 24;
            const t = [d, h, m, s];
            const f = ["天", "小時", "分鐘", "秒"];


            for (let i = 0; i < t.length; i++) {
                if (Math.floor(t[i]) > 0) return `${Math.floor(t[i])}${f[i]}前`;
            }
            return "";
        }

        async function getNotification(url, callback) {
            if (!/http/.test(url)) url = `/api/notifications?${url}`;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => {
                const res = JSON.parse(xhr.response);
                res.included.map(item => {
                    BH_store.data[item.type][item.id] = { data: item };
                });
                if (callback) callback(res);
            }
            xhr.send();
        }
    })();

    (function DiscussionElement() {
        const DiscussionImage = (() => {
            const fullScreenImageBorder = document.createElement('div');
            fullScreenImageBorder.id = 'BH_fullScreenImageBorder';

            const fullScreenImageClose = document.createElement('div');
            fullScreenImageClose.id = 'BH_fullScreenImageClose';
            fullScreenImageBorder.appendChild(fullScreenImageClose);
            fullScreenImageClose.addEventListener('click', () => {
                document.body.removeChild(fullScreenImageBorder);
                document.body.style.overflowY = 'scroll';
            });

            var ImgMove;
            var mouseMove;
            const fullScreenImage = document.createElement('img');
            fullScreenImage.id = 'BH_fullScreenImage';
            fullScreenImageBorder.appendChild(fullScreenImage);
            fullScreenImage.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
            fullScreenImageBorder.addEventListener('mousedown', (e) => mouseMove = { x: e.clientX, y: e.clientY });
            fullScreenImageBorder.addEventListener('mousemove', (e) => {
                if (mouseMove) {
                    ImgMove.x += e.clientX - mouseMove.x;
                    ImgMove.y += e.clientY - mouseMove.y;
                    mouseMove = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    fullScreenImage.style.top = `calc(50% - ${fullScreenImage.height / 2 - ImgMove.y}px)`;
                    fullScreenImage.style.left = `calc(50% - ${fullScreenImage.width / 2 - ImgMove.x}px)`;
                }
            });
            fullScreenImageBorder.addEventListener('mouseup', () => {
                mouseMove = null;
            });

            fullScreenImageBorder.addEventListener('wheel', (e) => {
                if (e.wheelDeltaY > 0) {
                    fullScreenImage.width *= 1.05;
                    fullScreenImage.height *= 1.05;
                }
                else {
                    fullScreenImage.width *= 0.95;
                    fullScreenImage.height *= 0.95;
                }
                fullScreenImage.style.top = `calc(50% - ${fullScreenImage.height / 2 - ImgMove.y}px)`;
                fullScreenImage.style.left = `calc(50% - ${fullScreenImage.width / 2 - ImgMove.x}px)`;
            });

            const fullScreenImageUrl = document.createElement('div');
            fullScreenImageUrl.id = 'BH_fullScreenImageUrl';
            fullScreenImageBorder.appendChild(fullScreenImageUrl);
            fullScreenImageUrl.addEventListener('click', () => window.open(fullScreenImageUrl.dataset.url));

            function imgVisible(img) {
                fullScreenImage.style.display = 'none';
                fullScreenImage.src = img.src;
                const Img = new Image();
                Img.addEventListener('error', (e) => {
                    console.log(e);
                });
                Img.addEventListener('load', () => {
                    fullScreenImage.src = img.src;
                    const maxWidth = window.innerWidth - 100;
                    const maxHeight = window.innerHeight - 100;
                    const widthS = maxWidth / Img.width;
                    const heightS = maxHeight / Img.height;

                    if (widthS < 1 || heightS < 1) {
                        if (widthS < heightS) {
                            fullScreenImage.width = Img.width * widthS;
                            fullScreenImage.height = Img.height * widthS;
                        }
                        else {
                            fullScreenImage.width = Img.width * heightS;
                            fullScreenImage.height = Img.height * heightS;
                        }
                    }
                    else {
                        fullScreenImage.width = Img.width;
                        fullScreenImage.height = Img.height;
                    }
                    ImgMove = {
                        x: 0,
                        y: 0
                    };
                    fullScreenImage.style.top = `calc(50% - ${fullScreenImage.height / 2}px)`;
                    fullScreenImage.style.left = `calc(50% - ${fullScreenImage.width / 2}px)`;
                    fullScreenImage.style.display = 'block';
                });
                Img.src = img.src;
                if (img.parentNode.tagName == 'A') {
                    const url = img.parentNode.href;
                    fullScreenImageUrl.dataset.url = url;
                    fullScreenImageUrl.innerText = url;
                    fullScreenImageUrl.style.display = 'block';
                }
                else fullScreenImageUrl.style.display = 'none';
                document.body.appendChild(fullScreenImageBorder);
                document.body.style.overflowY = 'hidden';
            }

            return {
                load: imgVisible
            }
        })();

        document.addEventListener('click', (e) => {
            if (!/^\/d\//.test(location.pathname)) return;
            if (e.target.id != "" || e.target.className != "") return;
            switch (e.target.tagName) {
                case "IMG":
                    e.preventDefault();
                    DiscussionImage.load(e.target);
                    break;
                case "A":
                    e.preventDefault();
                    window.open(e.target.href);
                    break;
            }
        });
    })();

    function Timer(call, t) {
        if (t == null) window.requestAnimationFrame(call);
        else setTimeout(() => window.requestAnimationFrame(call), t);
    }
})();