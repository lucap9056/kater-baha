(() => {
    var temp;
    (function getNotification() {
        const xhr = XMLHttpRequest();
        xhr.open("GET",'/api/notifications?page%5Boffset%5D=0&include');
        xhr.onload = () => {
            const res = xhr.response;
            const first = JSON.stringify(res.data[0]);
            if (temp != null && temp != first) {
                if (temp == first) return;
                temp = first;
                postMessage(res);
            }
            else temp = first;
            setTimeout(getNotification,60000);
        }
    })();
    postMessage("worker open");
})();