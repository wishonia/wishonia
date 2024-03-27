// utils/helpers.js

// Function to validate email format
function isValidEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

// Function to validate password strength
function isValidPassword(password) {
    // Example: Validate password length for simplicity
    return password.length >= 8;
}

// Function to format the allocation percentage for display
function formatAllocationPercentage(percentage) {
    return `${percentage}%`;
}

// Function to dynamically update the text content of an element
function updateTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Function to redirect to a specific page
function redirectToPage(pageName) {
    window.location.href = `${pageName}.html`;
}

// Function to save data to local storage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Function to retrieve data from local storage
function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Function to clear specific data from local storage
function clearLocalStorageItem(key) {
    localStorage.removeItem(key);
}

// Function to clear all data from local storage
function clearAllLocalStorage() {
    localStorage.clear();
}

// Exporting functions for use in other scripts
export {
    isValidEmail,
    isValidPassword,
    formatAllocationPercentage,
    updateTextContent,
    redirectToPage,
    saveToLocalStorage,
    getFromLocalStorage,
    clearLocalStorageItem,
    clearAllLocalStorage
};
