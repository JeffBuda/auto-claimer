
function alreadyClaimed() {
    return !!document.getElementsByClassName("gd-button-light")[0];  //selector for the Unclaim button
}

/** @returns true if the Claim button was pressed. Prefers longer assignments */
function clickClaimButton2() {
    const availableRows = Array.from(document
        .getElementsByClassName('grading-table-row'))
        .filter(row => row.querySelectorAll('.grading-table-cell__claimed').length === 1
            && row.querySelectorAll('.grading-table-cell__claimed')[0].innerText === 'Claim');

    const assignments = availableRows.map(row => ({
        name: row.querySelectorAll('.grading-table-cell__checkpoint')[0].innerText,
        claimButton: row.querySelectorAll('.grading-table-cell__claimed')[0].querySelectorAll('button')[0]
    }));

    if (assignments.length === 0) {
        console.log('poll: no assignments found.')
        return false;
    }

    //WARNING: temporarily skip first assignment
    //NOTE: skip the first assignment from TEST ACCOUNT
    assignments.shift();// remove the first available assignment

    //prefer capstone assignments b/c they're longer
    const capstonesAssignments = assignments.filter(a => a.name.toLowerCase().indexOf('capstone') > -1);
    if (capstonesAssignments.length > 0) {
        capstonesAssignments[0].claimButton.click();
        return true;
    }

    //take any assignment available
    assignments[0].clickClaimButton.click();
    return true;
}

/** @returns true if the Claim button was pressed */
function clickClaimButton() {

    //temporary workaround for unclaimed assignment:
    const count = document.getElementsByClassName("gd-button").length;
    if (count <= 1)
        return false;

    //the first one should be unclaimed, claim the second one.
    var claimButton = document.getElementsByClassName("gd-button")[1]; //selector for the Claim button
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
        console.log('poll: document not complete');
        return false;
    }

    if (alreadyClaimed()) {
        //console.log('poll: assignment already claimed');
        //return false;
    }

    const buttonClicked = clickClaimButton();
    if (buttonClicked) {
        console.log('poll: button clicked at ' + new Date().toLocaleTimeString());
        return true;
    }

    console.log('poll: refreshing page...');
    window.location.reload();
    return false;
}

pollForClaimButton();
