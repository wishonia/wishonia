// scripts/localization.js

// Object containing translations for different languages
const translations = {
    "en": {
        "welcomeMessage": "Welcome to the Allocation Poll",
        "introduction": "This app allows you to express your opinion on how funds should be allocated between war and clinical research. Your voice matters in shaping a better future.",
        "startPoll": "Start Poll",
        "desiredAllocationPollHeader": "Desired Allocation Poll",
        "desiredAllocationDescription": "How do you think funds should be allocated between war (Option A) and clinical research (Option B)? Adjust the slider to reflect your desired allocation.",
        "actualAllocationPollHeader": "Actual Allocation Poll",
        "actualAllocationDescription": "How do you think funds are actually allocated between war (Option A) and clinical research (Option B)? Adjust the slider to reflect your perceived actual allocation.",
        "resultsHeader": "Results",
        "warLabel": "War",
        "researchLabel": "Clinical Research",
        // Add more translations as needed
    },
    // Add more languages as needed
};

// Function to change the language of the page
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not supported.`);
        return;
    }

    const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}".`);
        }
    });
}

// Function to detect the user's browser language and set the page language accordingly
function setInitialLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    const lang = userLang.split('-')[0]; // Get the language code without region code
    changeLanguage(lang);
}

// Add event listeners or other initialization code here if necessary
document.addEventListener('DOMContentLoaded', setInitialLanguage);

// Example usage: changeLanguage('en');
