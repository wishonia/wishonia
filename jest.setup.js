global.ReadableStream = require('web-streams-polyfill').ReadableStream;
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import fetch from 'node-fetch';
global.fetch = fetch; // This makes fetch globally available as it would be in the browser