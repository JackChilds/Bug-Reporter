let bugreport = {};
/** 
 * additionalInfo
 * consoleOutput
 * cookies
 * dateTime
 * html
 * localStorage
 * navigatorInfo
 * pageSnapshot
 * screenInfo
 * sessionStorage
 * windowLocation
**/ 

const pleaseUploadNotice = document.querySelector('#please-upload-notice');
const bugreportContainer = document.querySelector('#bugreport-container');
const bugreportViewer = document.querySelector('#bugreport-viewer');

function uploadBugReport() {
    // sweetalert2 popup that asks the user for the bug report JSON file
    Swal.fire({
        title: 'Upload Bug Report',
        html: '<input id="bugreport_file_input" type="file" accept="application/json" class="form-control">',
    }).then ((r) => {
        if (r.isConfirmed && document.querySelector('#bugreport_file_input').files.length > 0) {
            // read file as text with file reader API
            const file = document.querySelector('#bugreport_file_input').files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // parse the JSON
                bugreport = JSON.parse(e.target.result);
                
                console.log(bugreport);

                pleaseUploadNotice.style.display = 'none';
                bugreportContainer.style.display = 'block';
                bugreportChanged();

            }
            reader.readAsText(file);
        }
    })
}

function openImageModal() {
    Swal.fire({
        html: '<button class="m-2 btn btn-light" onclick="downloadPageSnapshot()"><i class="bi bi-download"></i> Download Image</button>',
        imageUrl: bugreport.pageSnapshot,
        imageWidth: 500,
        showConfirmButton: false,
    });
}
function downloadPageSnapshot() {
    saveAs(bugreport.pageSnapshot, "Page Snapshot.png");
}
function downloadHTMLCode() {
    saveAs(new Blob([bugreport.html], {type: "text/plain;charset=utf-8"}), "bugreport.html");
}

function createTableFrom2dArray(tableData, header) {
    // create html table from 2d array
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    var headerRow = document.createElement('tr');
    header.forEach(function(item) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(item));
        headerRow.appendChild(cell);
    });
    tableBody.appendChild(headerRow);

    tableData.forEach(function (rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function (cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);

    table.classList.add('table');

    return table;
}

function createTableFromObject(object, header) {
    // create html table from object
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    var headerRow = document.createElement('tr');
    header.forEach(function(item) {
        var cell = document.createElement('th');
        cell.appendChild(document.createTextNode(item));
        headerRow.appendChild(cell);
    });
    tableBody.appendChild(headerRow);
    
    Object.keys(object).forEach(function (key) {
        var row = document.createElement('tr');

        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(key));
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.appendChild(document.createTextNode(object[key]));
        row.appendChild(cell);

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);

    table.classList.add('table');

    return table;
}

function bugreportChanged() {
    if (bugreport.windowLocation !== null) {
        bugreportViewer.querySelector('#report-generated-from-info').innerHTML = '<p>Full URL: <span class="text-muted">' + bugreport.windowLocation.href + '</span></p><p>Hostname: <span class="text-muted">' + bugreport.windowLocation.hostname + '</span></p><p>Host: <span class="text-muted">' + bugreport.windowLocation.host + '</span></p><p>Pathname: <span class="text-muted">' + bugreport.windowLocation.pathname + '</span></p><p>Protocol: <span class="text-muted">' + bugreport.windowLocation.protocol + '</span></p><p>Port: <span class="text-muted">' + bugreport.windowLocation.port + '</span></p>';
    } else {
        bugreportViewer.querySelector('#report-generated-from-info').innerHTML = '<p class="text-muted">No window location data available in bug report</p>';
    }

    if (bugreport.pageSnapshot === null) {
        bugreportViewer.querySelector('#view-page-snapshot-btn').setAttribute('disabled', 'disabled');
    } else {
        bugreportViewer.querySelector('#view-page-snapshot-btn').removeAttribute('disabled');
    }

    bugreportViewer.querySelector('#html-code').textContent = (bugreport.html === null ? 'No HTML content available in bug report' : html_beautify(bugreport.html));
    hljs.highlightElement(bugreportViewer.querySelector('#html-code'));
    bugreportViewer.querySelector('.dateTime').innerHTML = 'Created: <span class="text-muted">' + bugreport.dateTime + '</span>';

    if (bugreport.consoleOutput !== null) {
        var table = createTableFrom2dArray(bugreport.consoleOutput, ['Date/Time', 'Message', 'Log Type']);
        bugreportViewer.querySelector('#console-log-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#console-log-table-container').innerHTML = 'No console log data available in this bug report';
    }

    if (bugreport.cookies !== null && Object.keys(bugreport.cookies).length !== 0) {
        var table = createTableFromObject(bugreport.cookies, ['Name', 'Value']);
        bugreportViewer.querySelector('#cookies-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#cookies-table-container').innerHTML = 'No cookie data available in this bug report';
    }

    if (bugreport.localStorage !== null && Object.keys(bugreport.localStorage).length !== 0) {
        var table = createTableFromObject(bugreport.localStorage, ['Name', 'Value']);
        bugreportViewer.querySelector('#local-storage-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#local-storage-table-container').innerHTML = 'No local storage data available in this bug report';
    }

    if (bugreport.sessionStorage !== null && Object.keys(bugreport.sessionStorage).length !== 0) {
        var table = createTableFromObject(bugreport.sessionStorage, ['Name', 'Value']);
        bugreportViewer.querySelector('#session-storage-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#session-storage-table-container').innerHTML = 'No session storage data available in bug report';
    }

    if (bugreport.navigatorInfo !== null && Object.keys(bugreport.navigatorInfo).length !== 0) {
        var table = createTableFromObject(bugreport.navigatorInfo, ['Property Name', 'Value']);
        bugreportViewer.querySelector('#navigator-info-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#navigator-info-table-container').innerHTML = 'No navigator information available in bug report';
    }

    if (bugreport.screenInfo !== null && Object.keys(bugreport.screenInfo).length !== 0) {
        var table = createTableFromObject(bugreport.screenInfo, ['Property Name', 'Value']);
        bugreportViewer.querySelector('#screen-info-table-container').appendChild(table);
    } else {
        bugreportViewer.querySelector('#screen-info-table-container').innerHTML = 'No screen information available in bug report';
    }
}