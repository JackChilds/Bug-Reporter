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

        return cookies;
    },
    _getLocalStorage: function () {
        var obj = {}; 
        Object.keys(localStorage).forEach((key) => {
            obj[key] = localStorage.getItem(key);
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
        }


        html2canvas(document.body, this.html2canvasSettings).then(function(canvas) {
            document.querySelectorAll("[data-bugreporter-hide]").forEach(function (el) {
                el.style.visibility = "visible"; 
            });

            document.body.appendChild(canvas);
            canvas.style.display = "none";
            // now encode canvas to base64 and console.log it
            const img = canvas.toDataURL("image/png");

            // now generate JSON with all of the necessary data
            let dataToBeSent = {
                pageSnapshot: img,
                date: BugReporter._getDateString(),
                consoleOutput: BugReporter.consoleOutput,
                cookies: (prefs.cookies ? BugReporter._getCookies() : null),
                localStorage: (prefs.localStorage ? BugReporter._getLocalStorage() : null),
                // TODO: add HTML with tags omitted where data-bugreporter-hide attribute is present
            }

            console.log(dataToBeSent);

            c(img);
        });
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