/* jshint multistr:true */

var csvContent;
var data = [];
var dataJSON = [];
var tableReady = false;
var table = $('#myTable').DataTable();
var rowPos = 0;
var orgCSVFilename;
var keys = [];
var newDataLoaded = true;
var sessionInfo;

function downloadCSV(args) {
    var data, filename, link;

    // csv = csvContent;
    csv = convertArrayOfObjectsToCSV({
        data: dataJSON
    });

    if (csv == null) return;

    filename = args.filename || orgCSVFilename.replace(".csv", "") + '_scored.csv';

    if (isSafariBrowser()) {
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
        $("#download_link").attr("href", data);
        $("#download_link").attr("download", filename);
        $("#download_link").html("Click to download");
        $('#safari_download').modal('show');
    } else {
        var blob = new Blob([csv], {
            type: "data:text/csv;charset=utf-8"
        });
        saveAs(blob, filename);
    }

    // data = encodeURI(csv);
    // data = encodeURIComponent(JSON.stringify(dataJSON));

    // link = document.createElement('a');
    // link.setAttribute('href', data);
    // link.setAttribute('download', filename);
    // link.click();
}

function readSingleFile(fp) {

    console.log(cleanText('Testing, just testing 1,2,3...'));

    if (fp) {

        if ('name' in fp) {
            orgCSVFilename = fp.name.toLowerCase();
        } else {
            orgCSVFilename = fp.fileName.toLowerCase();
        }

        console.log("File Name: " + orgCSVFilename);

        var r = new FileReader();

        r.onload = function (e) {
            var contents = e.target.result;
            csvContent = contents;

            // var tableData = generateTableHTML(csvContent);
            // populateTableWithHTML(tableData);

            dataJSON = JSON.parse(generateJSON(csvContent));
            newDataLoaded = true;
            populateTableWithJSON(dataJSON);
            rowPos = 0;
        };

        r.readAsText(fp);

    } else {
        console.log("Failed to load file");
    }
}

function generateZipFile() {

    try {
        var isFileSaverSupported = !!new Blob();
        console.log('Save As is supported!!!');
    } catch (e) {
        console.log('Save As is NOT supported!!!');
    }

    var zip = new JSZip();
    zip.file("Hello1.csv", "Hello World\n");
    zip.file("Hello2.csv", "Hello World\n");
    // var img = zip.folder("test");
    // img.file("smile.gif", imgData, {base64: true});
    zip.generateAsync({
            type: "blob"
        })
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, "example.zip");
        });
}

function readCsvFiles(evt) {

    console.time('StartCalc');
    // if at least one file was selected
    if (evt.target.files.length > 0) {
        // if only one file was selected
        if (evt.target.files.length == 1) {
            // Retrieve the first (and only!) File from the FileList object
            var fp = evt.target.files[0];
            readSingleFile(fp);
        } else {

            // counter for processed files
            var processedFiles = 0;
            // create Zip file to put the scored CSV files
            var zip = new JSZip();

            // loop for each selected file
            for (var x = 0; x < evt.target.files.length; x++) {

                // Retrieve the File from the FileList object
                var fp = evt.target.files[x];

                if (fp) {

                    if ('name' in fp) {
                        orgCSVFilename = fp.name.toLowerCase();
                        // console.log("name: " + orgCSVFilename);
                    } else {
                        orgCSVFilename = fp.fileName.toLowerCase();
                        // console.log("fileName: " + orgCSVFilename);
                    }

                    var r = new FileReader();

                    r.onload = (function (f) {
                        return function (e) {

                            var csvContent = e.target.result;
                            var dataJSON = JSON.parse(generateJSON(csvContent));

                            for (var index in dataJSON) {
                                var target = dataJSON[index]['target'];
                                var response = dataJSON[index]['response'];

                                dataJSON[index].robot = getScore(target, response);

                                if (dataJSON[index].human != dataJSON[index].robot) {
                                    dataJSON[index].disagree = 'true';
                                } else {
                                    dataJSON[index].disagree = 'false';
                                }
                            }

                            var csv = convertArrayOfObjectsToCSV({
                                data: dataJSON
                            });

                            // if (csv == null) return;

                            var filename = f.name.replace(".csv", "") + '_scored.csv';

                            // add scored CSV file to the Zip
                            zip.file(filename, csv);
                            processedFiles++;
                        };
                    })(fp);

                    r.readAsText(fp);

                } else {
                    console.log("Failed to load file");
                }
            }

            r.onloadend = function (f) {
                // if all CSV files were processed
                if (processedFiles == evt.target.files.length) {

                    if (isSafariBrowser()) {
                        // console.log("Save For Safari!!!");
                        zip.generateAsync({
                                type: "blob"
                            })
                            .then(function (content) {
                                // console.log(content);
                                // saveAs(content, "scored_files.zip");
                            });
                        // if (!csv.match(/^data:text\/csv/i)) {
                        //     csv = 'data:text/csv;charset=utf-8,' + csv;
                        // }
                        // data = encodeURI(csv);
                        // $("#download_link").attr("href", data);
                        // $("#download_link").attr("download", filename);
                        // $("#download_link").html("Click to download");
                        // $('#safari_download').modal('show');
                    } else {
                        // save Zip file
                        zip.generateAsync({
                                type: "blob"
                            })
                            .then(function (content) {
                                // console.log(content);
                                console.timeEnd('StartCalc');
                                saveAs(content, "scored_files.zip");
                            });
                    }
                }
            };
        }
    } else {
        console.log('No file was selected');
    }

}

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);
    // console.log(keys);
    // headers = titleCase(keys.join(",").replace(',,', ',unknown,'), ',').split(',');
    headers = titleCase(keys.join(","), ',').split(',');
    // console.log(headers);

    result = '';
    result += headers.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    // console.log(result);
    return result;
}

function titleCase(str, delimiter) {

    // Step 1. Lowercase the string
    str = str.toLowerCase() // str = "i'm a little tea pot";

        // Step 2. Split the string into an array of strings
        .split(delimiter) // str = ["i'm", "a", "little", "tea", "pot"];
        // console.log(str);

        // Step 3. Map over the array
        .map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
            /* Map process
            1st word: "i'm" => word.replace(word[0], word[0].toUpperCase());
                               "i'm".replace("i", "I");
                               return word => "I'm"
            2nd word: "a" => word.replace(word[0], word[0].toUpperCase());
                             "a".replace("a", "A");
                              return word => "A"
            3rd word: "little" => word.replace(word[0], word[0].toUpperCase());
                                  "little".replace("l", "L");
                                  return word => "Little"
            4th word: "tea" => word.replace(word[0], word[0].toUpperCase());
                               "tea".replace("t", "T");
                               return word => "Tea"
            5th word: "pot" => word.replace(word[0], word[0].toUpperCase());
                               "pot".replace("p", "P");
                               return word => "Pot"                                                        
            End of the map() method */
        });

    // Step 4. Return the output
    return str.join(delimiter); // ["I'm", "A", "Little", "Tea", "Pot"].join(' ') => "I'm A Little Tea Pot"
}

function generateTableHTML(data) {

    var rows = data.split("\r");

    var tableData = "<thead>\
                    <tr>\
                        <th data-field='id' data-sortable='true'>#</th>\
                        <th data-field='target' data-sortable='true'>Target</th>\
                        <th data-field='response' data-sortable='true'>Response</th>\
                        <th data-field='human' data-sortable='true'>Human</th>\
                        <th data-field='robot' data-sortable='true'>Robot</th>\
                    </tr>\
                    </thead>\
                    <tbody>";

    $.each(rows, function (index, value) {
        // console.log(index + ": " + value);
        // ignore the header row
        if (!value.toLowerCase().includes("id,type,file")) {
            var columns = value.split(",");

            if (columns.length > 1) {
                // tableData += "<tr><th scope='row' class='col-md-1'>" + (index) + "</th>";
                tableData += "<tr><th scope='row'>" + (index) + "</th>";
                $.each(columns, function (index, value) {
                    if (index == 3 || index == 4) {
                        tableData += "<td>" + (value) + "</td>";
                        // console.log(index + ": " + value);
                    }
                });

                tableData += "<td class='text-center'>0</td><td class='text-center'>0</td></tr>";
            }
        }
    });

    tableData += "</tbody>";
    return tableData;

}

function generateJSON(csvData) {

    // trying to accomodate every possible new line charadter
    var rows = csvData.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);

    // open the JSON array
    var strWithJSON = "[";

    $.each(rows, function (index, value) {
        // console.log(index + ": " + value);
        // if the header row then create the keys
        if (value.toLowerCase().includes("id,type,file")) {
            keys = value.toLowerCase().split(",");
            if (keys.includes("")) {
                var x = 1;
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] == "") {
                        keys[i] = "unknown_" + x++;
                    }
                }
            }
        } else {

            var result = deleteCommasInDoubleQuotes(value);

            // get rid of the double quotes
            result = result.replace(/["]/g, "");

            var columns = result.split(",");

            if (columns.length > 1) {

                if (!keys.includes('index')) {
                    strWithJSON += '{"index": "' + index + '",';
                } else {
                    strWithJSON += '{';
                }

                $.each(columns, function (ix, val) {
                    strWithJSON += '"' + keys[ix] + '": "' + scapeDoubleQuotes(val) + '",';
                });

                if (!keys.includes('human')) {
                    strWithJSON += '"human" : "0",';
                }

                if (!keys.includes('robot')) {
                    strWithJSON += '"robot" : "0",';
                }

                if (!keys.includes('disagree')) {
                    strWithJSON += '"disagree": "false"},';
                } else {
                    // eliminate trailing comma and close the object
                    strWithJSON = strWithJSON.replace(/(^,)|(,$)/g, "");
                    strWithJSON += '},';
                }
            }
        }
    });

    // eliminate trailing comma and close the array
    strWithJSON = strWithJSON.replace(/(^,)|(,$)/g, "");
    strWithJSON += "]";

    return strWithJSON;
}

function populateTableWithJSON(dataJSON) {

    var columns = [];
    var headers = "";

    if (sessionInfo['role'] === 'user') {
        columns = [{
                data: 'index'
            },
            {
                data: 'target'
            },
            {
                data: 'response'
            },
            {
                data: 'human'
            }
        ];
        headers = "<tr>\
                        <th>#</th>\
                        <th>Target</th>\
                        <th>Response</th>\
                        <th>Score</th>\
                     </tr>";

        $("#human_label").html("Score");

    } else {
        columns = [{
                data: 'index'
            },
            {
                data: 'target'
            },
            {
                data: 'response'
            },
            {
                data: 'human'
            },
            {
                data: 'robot'
            }
        ];
        headers = "<tr>\
                        <th>#</th>\
                        <th>Target</th>\
                        <th>Response</th>\
                        <th>Human</th>\
                        <th>Robot</th>\
                     </tr>";
    }

    $('#table_header').html(headers);

    table.destroy();
    // table = $('#myTable').DataTable();
    table = $('#myTable').DataTable({
        data: dataJSON,
        columns: columns,
        stateSave: true,
        "createdRow": function (row, data, index) {
            if (sessionInfo['role'] !== 'user') {
                if (dataJSON[index].human != dataJSON[index].robot) {
                    // $('td', row).eq(0).removeClass('sorting_1');
                    $('td', row).addClass('highlight');
                }
            }
        }
    });

    if (newDataLoaded) {
        newDataLoaded = false;
        table.page('first').draw('page');
    }

    // $('#myTable').on('page.dt', function () {
    //     var info = table.page.info();
    //     console.log( 'Showing page: ' + info.page + ' of ' + info.pages );
    // });
}

function populateTableWithHTML(data) {

    $('#myTable').empty();
    $('#myTable').html(data);

    table.destroy();
    table = $('#myTable').DataTable();
}

function addClickOnRowEventToTable() {
    var t = document.getElementById('myTable');

    t.onclick = function (event) {
        event = event || window.event; //IE8
        var target = event.target || event.srcElement;

        while (target && target.nodeName != 'TR') { // find TR
            target = target.parentElement;
        }

        // if (!target) { return; } // tr should be always found
        var cells = target.cells; // cell collection - https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
        // var cells = target.getElementsByTagName('td'); //alternative
        if (!cells.length || target.parentNode.nodeName == 'THEAD') {
            return;
        }

        var index = document.getElementById('index');
        var target = document.getElementById('target');
        var response = document.getElementById('response');
        var matched = document.getElementById('matched');
        // var f4 = document.getElementById('robot');
        // var f5 = document.getElementById('human');
        index.innerHTML = cells[0].innerHTML;
        target.innerHTML = cells[1].innerHTML;
        response.innerHTML = cells[2].innerHTML;
        matched.innerHTML = JSON.stringify(getMatchedWords(target.innerHTML, response.innerHTML));
        console.log(getMatchedWords(target.innerHTML, response.innerHTML));
        // f4.innerHTML = cells[3].innerHTML;
        // f5.innerHTML = cells[4].innerHTML;
    };

    t.ondblclick = function (event) {
        event = event || window.event; //IE8
        var target = event.target || event.srcElement;

        while (target && target.nodeName != 'TR') { // find TR
            target = target.parentElement;
        }

        // if (!target) { return; } // tr should be always found
        var cells = target.cells; // cell collection - https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement
        // var cells = target.getElementsByTagName('td'); //alternative
        if (!cells.length || target.parentNode.nodeName == 'THEAD') {
            return;
        }

        rowPos = parseInt(cells[0].innerHTML) - 1;

        $('#myModal').modal('show');
        $("#mod_index").html("Row " + (rowPos + 1) + " of " + dataJSON.length);
        $("#mod_target").html(dataJSON[rowPos].target);
        $("#mod_response").html(dataJSON[rowPos].response);
        $("#mod_human").html(dataJSON[rowPos].human);
        $("#mod_robot").html(dataJSON[rowPos].robot);

    };
}

function scapeDoubleQuotes(str) {
    return (str + '').replace(/[\\"]/g, '\\$&').replace(/\u0000/g, '\\0');
}

// http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
function isSafariBrowser() {
    // Check if the browser is Safari 3.0+ 
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
        (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || safari.pushNotification);

    // console.log('Is safary: ' + isSafari);
    return isSafari;
}

$(function () {

    sessionInfo = readCookie();
    // console.log(sessionInfo);

    // hide options depending on roles
    if (sessionInfo['role'] === 'user') {
        console.log('User');
        $(".admin").hide();
        $(".robot").hide();
    } else if (sessionInfo['role'] === 'researcher') {
        console.log('Researcher');
        // $('#edit_options').hide();
        $(".admin").hide();
    }

    // $("#myModal").keypress(function() {
    //     console.log( "Handler for .keypress() called." );
    // });

    $('[data-toggle="tooltip"]').tooltip();
    loadVariantsJSON();

    $("#myModal").keydown(function (e) {

        if (!e) {
            e = event;
        }

        var keyPressed = String.fromCharCode(e.which);

        // check for the arrows
        switch (e.which) {
            case 38: // Up arrow
                if (rowPos > 0) {
                    rowPos--;
                }
                break;
            case 40: // Down arrow
                if (rowPos < dataJSON.length - 1) {
                    rowPos++;
                }
                break;
            default:
                // if it is a digit then save the info
                if (e.which >= 48 && e.which <= 57) {
                    dataJSON[rowPos].human = e.which - 48;
                }
                break;
        }

        if (dataJSON[rowPos].human != dataJSON[rowPos].robot) {
            dataJSON[rowPos].disagree = 'true';
        } else {
            dataJSON[rowPos].disagree = 'false';
        }

        // if the key is a digit
        if (rowPos >= 0 && rowPos < dataJSON.length) {
            $("#mod_index").html("Row " + (rowPos + 1) + " of " + dataJSON.length);
            $("#mod_target").html(dataJSON[rowPos].target);
            $("#mod_response").html(dataJSON[rowPos].response);
            $("#mod_human").html(dataJSON[rowPos].human);
            $("#mod_robot").html(dataJSON[rowPos].robot);
        }

        e.preventDefault();
    });

    $("#show_modal").click(function () {
        // generateZipFile();
        if (dataJSON.length > 0) {
            $('#myModal').modal('show');
            $("#mod_index").html("Row " + (rowPos + 1) + " of " + dataJSON.length);
            $("#mod_target").html(dataJSON[rowPos].target);
            $("#mod_response").html(dataJSON[rowPos].response);
            $("#mod_human").html(dataJSON[rowPos].human);
            $("#mod_robot").html(dataJSON[rowPos].robot);
        } else {
            alert("No data loaded from CSV...");
        }
    });


    $("#calc_score").click(function () {
        // var target = "avoid or beat command";
        // var response = "avoid or break comand";
        // target = "connect the beer device";
        // response = "connect new device the";
        // target = "define respect instead";
        // response = "he respect finds respect inside";
        // target = "advance but sat appeal";
        // response = "advance what is set apeel";

        for (var index in dataJSON) {
            var target = dataJSON[index]['target'];
            var response = dataJSON[index]['response'];

            dataJSON[index].robot = getScore(target, response);

            if (dataJSON[index].human != dataJSON[index].robot) {
                dataJSON[index].disagree = 'true';
            } else {
                dataJSON[index].disagree = 'false';
            }
        }

        if (dataJSON.length > 0) {
            populateTableWithJSON(dataJSON);
        }

    });

    $("#edit_variants").click(function () {
        window.location.href = '../main/variants.php';
    });

    $("#add_user").click(function () {
        window.location.href = '../main/users.php';
    });

    $("#save_changes, #dismiss_modal, #close_modal").click(function () {

        if (dataJSON.length > 0) {
            $('#myModal').modal('toggle');
            populateTableWithJSON(dataJSON);
        } else {
            alert("No data loaded from CSV...");
        }
    });

    // add event listener
    $("#fileinput").change(readCsvFiles);

    addClickOnRowEventToTable();
});