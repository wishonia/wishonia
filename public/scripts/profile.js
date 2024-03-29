document.addEventListener('DOMContentLoaded', function() {
    // Assuming the user's unique referral link and referral list are fetched from the server
    // For demonstration, using placeholders
    const userReferralLink = "https://example.com/referral?user=123";
    const userReferrals = [
        { name: "Alice", completedPolls: true, signedPetition: false },
        { name: "Bob", completedPolls: false, signedPetition: false },
        { name: "Charlie", completedPolls: true, signedPetition: true }
    ];

    // Set the referral link in the input box
    document.getElementById('referralLink').value = userReferralLink;

    // Populate the referral list
    const referralListElement = document.getElementById('referralList');
    userReferrals.forEach(referral => {
        const listItem = document.createElement('li');
        listItem.textContent = `${referral.name} - Polls: ${referral.completedPolls ? 'Completed' : 'Not Completed'}, Petition: ${referral.signedPetition ? 'Signed' : 'Not Signed'}`;
        referralListElement.appendChild(listItem);
    });
});
