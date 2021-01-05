
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

/** @returns true if the Claim button was clicked */
function pollForClaimButton() {
    if (document.readyState !== 'complete') {
        return false;
    }

    if (alreadyClaimed()) {
        return false;
    }
    
    const buttonClicked = clickClaimButton();
    if(buttonClicked) {
        return true;
    }

    window.location.reload();
    return false;
}

pollForClaimButton();
