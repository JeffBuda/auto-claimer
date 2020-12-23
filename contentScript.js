
function alreadyClaimed() {
    return !!document.getElementsByClassName("gd-button-light")[0];  //selector for the Unclaim button
}

/* only poll if we don't already have an assignment claimed **/
var polling = true;

function clickClaimButton() {
    var claimButton = document.getElementsByClassName("gd-button")[0]; //selector for the Claim button
    if (claimButton) {
        claimButton.click();
        return true;
    } else {
        return false;
    }
}

function tryAgainLater() {
    setTimeout(
        () => {
            pollForClaimButton();
        },
        30 * 1000);
}

function pollForClaimButton() {
    if(alreadyClaimed()) {
        console.warn('An assignment has already been claimed. Refresh page to start polling.');
        return;
    }
    if (!polling || document.readyState !== 'complete') {
        tryAgainLater();
    }
    const buttonClicked = clickClaimButton();

    if (buttonClicked) {
        polling = false;
        chrome.runtime.sendMessage({ buttonClicked: true });
    } else {
        console.warn(`No assignments found at ${new Date().toLocaleTimeString()}. Refreshing page...`);
        window.location.reload();
    }
}

(() => {
    tryAgainLater();
})();

