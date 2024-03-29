document.addEventListener('DOMContentLoaded', function() {
    // Fetch the user's handle from the server
    fetch('/api/user/handle')
        .then(response => response.json())
        .then(data => {
            const userHandle = data.handle;
            const userReferralLink = `${window.location.origin}/${userHandle}`;
            document.getElementById('referralLink').value = userReferralLink;
        })
        .catch(error => console.error('Error fetching user handle:', error));

    // Populate the referral list
    // This part remains unchanged, assuming the referral list is fetched similarly
    const referralListElement = document.getElementById('referralList');
    // Assuming userReferrals is fetched from the server
    fetch('/api/user/referrals')
        .then(response => response.json())
        .then(data => {
            const userReferrals = data.referrals;
            userReferrals.forEach(referral => {
                const listItem = document.createElement('li');
                listItem.textContent = `${referral.name} - Polls: ${referral.completedPolls ? 'Completed' : 'Not Completed'}, Petition: ${referral.signedPetition ? 'Signed' : 'Not Signed'}`;
                referralListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching referrals:', error));
});
