# Bug Reporter

An easy to use, lightweight library for generating helpful bug reports that package all the information you will need when you want to debug your website.

## Features
- **Page snapshot**, bug reporter can generate a snapshot of the user's screen with the help of [html2canvas](https://github.com/niklasvh/html2canvas)
- **HTML Code**, bug reporter can copy the HTML code in the page and package it into the bug report
- **Browser storage**, bug reporter can get all the cookies, local storage and session storage data and include them in the bug report
- **Console logs**, bug reporter can also make a copy of the console output, and include it in the bug report
- **Navigator and screen information**, you can choose to include information about the user agent and screen information
- **Additional information**, optionally, you can also add your own information to be put into the bug report, e.g. you may ask the user about what it is they are experiencing

## Installation
The only dependency for Bug Reporter is html2canvas, which you can grab from a cdn. Note you won't need html2canvas if you are not using the page snapshot feature.
```js
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.3.3/dist/html2canvas.min.js" integrity="sha256-QT3W6xEiCZLGc8yEu9fiRM+V1UlKjJ/WEfg1VXnFns4=" crossorigin="anonymous"></script>
```
