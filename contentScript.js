
function alreadyClaimed() {
    return !!document.getElementsByClassName("gd-button-light")[0];  //selector for the Unclaim button
}

/** @returns true if the Claim button was pressed */
function clickClaimButton() {
    var claimButton = document.getElementsByClassName("gd-button")[0]; //selector for the Claim button
    if (claimButton) {
        claimButton.click();
        return true;
    } else {
        return false;
    }
}

function pollForClaimButton() {
    if (document.readyState !== 'complete') {
        return;
    }

    if (alreadyClaimed()) {
        return;
    }
    const buttonClicked = clickClaimButton();

    if (!buttonClicked) {
        window.location.reload();
    }
}

pollForClaimButton();
