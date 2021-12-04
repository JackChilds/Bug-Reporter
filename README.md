# Bug Reporter

An easy to use, lightweight library for generating helpful bug reports that package all the information you will need when you want to debug your website.

## Features
- **Page snapshot**, bug reporter can generate a snapshot of the user's screen with the help of [html2canvas](https://github.com/niklasvh/html2canvas)
- **HTML Code**, bug reporter can copy the HTML code in the page and package it into the bug report
- **Browser storage**, bug reporter can get all the cookies, local storage and session storage data and include them in the bug report
- **Console logs**, bug reporter can also make a copy of the console output, and include it in the bug report
- **Navigator and screen information**, you can choose to include information about the user agent and screen information
- **Additional information**, optionally, you can also add your own information to be put into the bug report, e.g. you may ask the user about what it is they are experiencing

To see for yourself, take a look at the [demo](https://morcreate.net/github/BugReporter/) and then upload the bug report to the [dashboard](https://morcreate.net/github/BugReporter/dashboard/) to have a look at the data collected.

## Installation
The only dependency for Bug Reporter is html2canvas, which you can grab from a cdn. Note you won't need html2canvas if you are not using the page snapshot feature.
```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.3.3/dist/html2canvas.min.js" integrity="sha256-QT3W6xEiCZLGc8yEu9fiRM+V1UlKjJ/WEfg1VXnFns4=" crossorigin="anonymous"></script>
```
Now, include the `bugreporter.min.js` in your project from the `dist/` directory.
Or use the cdn:
```html
<script src="https://cdn.jsdelivr.net/gh/JackChilds/Bug-Reporter@main/dist/bugreporter.min.js"></script>
```

## Usage

To use the bug reporter for basic usage just edit the example below.
```js
BugReporter.generate({
    additionalInfo: [ // the additionalData array allows you to specify additional information to go alongside the bug report
        ['User feedback', 'some text'],
        ['More information', 'some more text'],
        ['An array of integers', [1,2,3,4,5]]
    ],
    // default preferences:
    cookies: true, // bug reporter will include cookie data
    localStorage: true, // bug reporter will include localStorage data
    sessionStorage: true, // bug reporter will include sessionStorage data
    html: true, // bug reporter will include a copy of all the HTML on the page, tags with the 'data-bugreporter-hide' attribute will be omitted
    windowLocation: true, // bug reporter will include window.location data
    navigatorInfo: true, // bug reporter will include navigator data, including userAgent and language
    takeSnapshot: true, // bug reporter will use html2canvas library to take a snapshot of the page. Note: you need to include html2canvas.js in your page
    screenInfo: true, // bug reporter will include screen data

}, (data) => {
    const d = JSON.parse(data);

    // now do something with the data like send it to your server via a post request where the JSON can then be saved for debugging purposes
});
```
Alternatively, take a look at the `demo/` folder and modify the `index.html` file to fit your needs. 

Data that bug reporter returns (when all features are enabled):
- data.**additionalInfo**, the additionalInfo field
- data.**consoleOutput**, a 2d array structured like this: `[ [date/time of console message, message logged to console, console log type] ]`
- data.**cookies**, an object containing the cookies on the website
- data.**dateTime**, the date/time that the bug report was created
- data.**html**, the HTML code on the page
- data.**localStorage**, an object containing the local storage on the website
- data.**navigatorInfo**
  - **.cookieEnabled**, same as `navigator.cookieEnabled`
  - **.language**, same as `navigator.language`
  - **.hardwareConcurrency**, same as `navigator.hardwareConcurrency`
  - **.vendor**, same as `navigator.vendor`
  - **.userAgent**, same as `navigator.userAgent`
- data.**pageSnapshot**, a base64 image URL generated by html2canvas
- data.**screenInfo**
  - **.width**, same as `window.screen.width`
  - **.height**, same as `window.screen.height`
  - **.availWidth**, same as `window.screen.availWidth`
  - **.availHeight**, same as `window.screen.availHeight`
  - **.colorDepth**, same as `window.screen.colorDepth`
  - **.pixelDepth**, same as `window.screen.pixelDepth`
- data.**sessionStorage**, an object containing the session storage on the website
- data.**windowLocation**
  - **.href**, same as `window.location.href`
  - **.pathname**, same as `window.location.pathname`
  - **.host**, same as `window.location.host`
  - **.hostname**, same as `window.location.hostname`
  - **.port**, same as `window.location.port`
  - **.protocol**, same as `window.location.protocol`
  - **.origin**, same as `window.location.origin`
  - **.hash**, same as `window.location.hash`

### Hiding elements from the page snapshot and HTML code
Privacy is important: if you want to hide any element from the page snapshot and HTML code,simply add the `data-bugreporter-hide` attribute to the element.
E.g.
```html
<p data-bugreporter-hide>
    Some text that will be hidden in the bug report because it might contain sensitive information
</p>
```

### Building a dashboard to view bug reports
The build a dashboard for bug reporter you have multiple options:
- you could use the [bug reporter dashboard](https://github.com/JackChilds/Bug-Reporter-Dashboard) project which is customizable and gives instructions on how to integrate it with your own system.
- You could use the pre-made dashboard in this repository - `dashboard/`.
- You can make a new dashboard from scratch, just take the bug report JSON file, parse it to an object and display the contents to the user.



## License
Apache License, version 2.0
