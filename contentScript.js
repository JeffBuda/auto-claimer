function getUrlsFromSelectedLinks() {
    const selection = window.getSelection();
    const urls = [];
    if (!selection.rangeCount) {
        return urls;
    }
    const range = selection.getRangeAt(0);

    // selected elements:
    range.cloneContents().querySelectorAll('*')
        .forEach(selected => selected.querySelectorAll('a')
            .forEach(link => {
                urls.push(link.href);
            }));

    return urls;
}

function getUrlsFromText(text) {
    const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/gi;
    const urls = [];
    do {
        var url = urlRegex.exec(text);
        if (url) {
            urls.push(url[0]);
        } else {
            break;
        }
    } while (true);
    return urls;
}

(() => {
    const uniqueUrls = new Set([
        ...getUrlsFromText(document.getSelection().toString()),
        ...getUrlsFromSelectedLinks()]);

    chrome.runtime.sendMessage({ urls: [...uniqueUrls] });

})();

