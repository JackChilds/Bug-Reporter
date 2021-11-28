/*
*
* Bug Reporter
* By Jack Childs 2021
*
*/

const BugReporter = {
    _consoleLog: window.console.log,
    _consoleError: window.console.error,
    _consoleWarn: window.console.warn,
    _consoleInfo: window.console.info,
    consoleOutput: [],
    _getCookies: function () {
        var cookies = { };
        if (document.cookie && document.cookie != '') {
            var split = document.cookie.split(';');
            for (var i = 0; i < split.length; i++) {
                var name_value = split[i].split("=");
                name_value[0] = name_value[0].replace(/^ /, '');
                cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
            }
        }

        return (cookies == { } ? null : cookies);
    },
    _getLocalStorage: function () {
        var obj = {}; 
        Object.keys(localStorage).forEach((key) => {
            obj[key] = localStorage.getItem(key);
        });
        return obj;
    },
    _getSessionStorage: function () {
        var obj = {};
        Object.keys(sessionStorage).forEach((key) => {
            obj[key] = sessionStorage.getItem(key);
        });
        return obj;
    },
    _getDateString: function () {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        const h = date.getHours();
        const min = date.getMinutes();
        const s = date.getSeconds();
        const ms = date.getMilliseconds();
        return `${y}-${m}-${d} ${h}:${min}:${s}:${ms}`;
    },
    _getHTMLString: function () {
        var elementBackup = [];
        // make a copy in a variable of tags with the data-bugreporter-hide attribute
        const copy = document.querySelectorAll('[data-bugreporter-hide]');
        copy.forEach((element) => {
            elementBackup.push([element]);
        });
        // get the dom location for each of the elements
        for (let i = 0; i < copy.length; i++) {
            elementBackup[i][1] = BugReporter._getDOMLocation(copy[i]);
        }
        // now remove the elements from the DOM
        for (let i = 0; i < copy.length; i++) {
            copy[i].parentNode.removeChild(copy[i]);
        }
        // now get the HTML
        var html = document.documentElement.outerHTML;

        // now restore the elements using the dom location
        for (let i = 0; i < elementBackup.length; i++) {
            const element = elementBackup[i][0];
            const location = elementBackup[i][1];
            if (location[1] === null) {
                // its the first element in the parent node
            } else if (location[2] === null) {
                // its the last element in the parent node
                location[0].insertBefore(element, null);
            } else {
                // its somewhere in the middle
                location[0].insertBefore(element, location[2]);
            }
        }
        return html;
    },
    _getDOMLocation: function (e) {
        // return an array with the elements parent node, sibling before node and sibling after node
        return [e.parentNode, e.previousSibling, e.nextSibling];
    },
    html2canvasSettings: {
        allowTaint: true,
        useCORS: true,
    },
    generate: function (options, c) {
        document.querySelectorAll("[data-bugreporter-hide]").forEach(function (el) {
            el.style.visibility = "hidden"; 
        });

        const prefs = {
            cookies: (options.cookies === undefined) ? true : options.cookies,
            localStorage: (options.localStorage === undefined) ? true : options.localStorage,
            sessionStorage: (options.sessionStorage === undefined) ? true : options.sessionStorage,
            html: (options.html === undefined) ? true : options.html,
            windowLocation: (options.windowLocation === undefined) ? true : options.windowLocation,
            navigatorInfo: (options.navigatorInfo === undefined) ? true : options.navigatorInfo,
            takeSnapshot: (options.takeSnapshot === undefined) ? true : options.takeSnapshot,
            screenInfo: (options.screenInfo === undefined) ? true : options.screenInfo
        }

        if (prefs.takeSnapshot) {
            html2canvas(document.body, this.html2canvasSettings).then(function(canvas) {
                document.querySelectorAll("[data-bugreporter-hide]").forEach(function (el) {
                    el.style.visibility = "visible"; 
                });
                BugReporter._generateProcessData({prefs: prefs, img: canvas.toDataURL("image/png")}, c);
            });
        } else {
            BugReporter._generateProcessData({prefs: prefs}, c);
        }
    },
    _generateProcessData: function (data, c) {
        let dataToBeSent = {
            pageSnapshot: (data.img === undefined) ? null : data.img,
            dateTime: BugReporter._getDateString(),
            consoleOutput: BugReporter.consoleOutput,
            cookies: (data.prefs.cookies ? BugReporter._getCookies() : null),
            localStorage: (data.prefs.localStorage ? BugReporter._getLocalStorage() : null),
            sessionStorage: (data.prefs.sessionStorage ? BugReporter._getSessionStorage() : null),
            html: (data.prefs.html ? BugReporter._getHTMLString() : null),
            windowLocation: (data.prefs.windowLocation ? {href: window.location.href, pathname: window.location.pathname, host: window.location.host, hostname: window.location.hostname, port: window.location.port, protocol: window.location.protocol, origin: window.location.origin, hash: window.location.hash} : null),
            navigatorInfo: (data.prefs.navigatorInfo ? {cookieEnabled: navigator.cookieEnabled, language: navigator.language, hardwareConcurrency: navigator.hardwareConcurrency, vendor: navigator.vendor, userAgent: navigator.userAgent} : null),
            screenInfo: (data.prefs.screenInfo ? {width: window.screen.width, height: window.screen.height, availWidth: window.screen.availWidth, availHeight: window.screen.availHeight, colorDepth: window.screen.colorDepth, pixelDepth: window.screen.pixelDepth} : null)
        }

        c(JSON.stringify(dataToBeSent));
    }
}

console.log = function (msg) {
    BugReporter._consoleLog(msg);
    BugReporter.consoleOutput.push([BugReporter._getDateString(), msg, 'console.log']);
}
console.warn = function (msg) {
    BugReporter._consoleWarn(msg);
    BugReporter.consoleOutput.push([BugReporter._getDateString(), msg, 'console.warn']);
}
console.error = function (msg) {
    BugReporter._consoleError(msg);
    BugReporter.consoleOutput.push([BugReporter._getDateString(), msg, 'console.error']);
}
console.info = function (msg) {
    BugReporter._consoleInfo(msg);
    BugReporter.consoleOutput.push([BugReporter._getDateString(), msg, 'console.info']);
}