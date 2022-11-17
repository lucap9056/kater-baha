(() => {
    (function Session() {
        var header;
        try {
            header = document.querySelector('#header-secondary .Header-controls');
        }
        catch {
            setTimeout(1000, Session);
            return;
        }

        const sessionItem = document.createElement('li');
        sessionItem.className = 'BH_item-session';
        header.appendChild(sessionItem);

        const li_list = document.querySelector('.item-session .Dropdown-menu').childNodes;
        for (let i = 0; i < li_list.length; i++) {
            sessionItem.appendChild(li_list[i]);
        }

    })();
})();