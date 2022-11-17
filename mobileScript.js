(() => {
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
        header.appendChild(sessionMenu);

    })();
})();