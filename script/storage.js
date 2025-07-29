'use strict';

function saveToStorage(key, value) {
    localStorage.setItem(key, value);
}

function getFromStorage(key, defaultVal) {
    const value = localStorage.getItem(key);
    return value !== null && value !== undefined ? value : defaultVal;
}