var variantsJSONList = [];
var variantsObj = {};
var sessionInfo;

// returns only unique elements of the given array
function getUniqueElementsFromArray(arr) {
    return arr.filter(function (elem, pos) {
        return arr.indexOf(elem) == pos;
    });
}

// Get the given param from the URL
function getQueryParam(key) {
    var vars = [],
        hash;
    var q = document.URL.split('?')[1];
    if (q != undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
    }

    if (typeof (vars[key]) == "undefined")
        return "";
    else
        return vars[key];
}

// returns a string without repeated characters (letters)
function deleteRepeatedChars(str) {
    return str.split("").filter(function (elem, pos, s) {
        return s.indexOf(elem) == pos;
    }).join("");
}

function insertOriginalVariants() {

    $.ajax({
        type: 'POST',
        url: '../db/insert-original-variants.php',
        success: function (data) {
            // console.log(data);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
}

function loadVariantsJSON() {

    if (variantsJSONList.length == 0) {
        $.ajax({
            type: 'POST',
            url: '../db/get-variants-json.php',
            dataType: 'json',
            success: function (data) {
                variantsJSONList = data;
                loadVariantsObject(variantsJSONList);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    }
}

function loadVariantsObject(data) {

    // console.log(data);
    for (var index in data) {
        variantsObj[data[index].target] = data[index].variants;
        // console.log(data[index]['target']);
    }

    // console.log(variantsObj);
}

// return the score for the best fit (Forward or Backward)
function getScore(target, response) {

    target = cleanText(target).trim().toLowerCase();
    response = cleanText(response).trim().toLowerCase();

    var fwMatchedWords = calculateScoreForward(target, response);
    var bwMatchedWords = calculateScoreBackward(target, response);

    var score = (fwMatchedWords.totalMatchedWords > bwMatchedWords.totalMatchedWords) ? fwMatchedWords.totalMatchedWords : bwMatchedWords.totalMatchedWords;

    // if (score == 1) {
    //     // console.log(fwMatchedWords);
    //     for (var tIndex in fwMatchedWords) {
    //         if (tIndex != 'totalMatchedWords') {
    //             if (fwMatchedWords[tIndex][0] != '$$$$') {

    //                 var targetLen = target.split(' ').length;
    //                 var responseLen = response.split(' ').length;
    //                 var targetPos = fwMatchedWords[tIndex][1];
    //                 var responsePos = fwMatchedWords[tIndex][2];

    //                 var valid = validateScoreForSingleMatch(targetPos, targetLen, responsePos, responseLen);

    //                 if (!valid) {
    //                     score = 0;
    //                     // console.log(fwMatchedWords);
    //                 }
    //                 // console.log(valid);
    //             }
    //         }
    //     }
    // }

    return score;
}

function validateScoreForSingleMatch(targetPos, targetLen, responsePos, responseLen) {

    if (targetPos == responsePos) {
        // console.log('EQUAL');
        return true;
    }

    if (targetPos > responsePos) {
        if ((targetPos - 1) == responsePos || (targetPos - 2) == responsePos) {
            // console.log('GREATER');
            return true;
        }
    }

    if (targetPos < responsePos) {
        if ((targetPos + 1) == responsePos || (targetPos + 2) == responsePos) {
            // console.log('LOWER');
            return true;
        }
    }

    // console.log('NONE');
    return false;

}


function validateDisplacement(targetPos, responsePos) {

    if (targetPos == responsePos) {
        // console.log('EQUAL');
        return true;
    }

    if (targetPos > responsePos) {
        if ((targetPos - 1) == responsePos) {
            // console.log('GREATER');
            return true;
        }
    }

    if (targetPos < responsePos) {
        if ((targetPos + 1) == responsePos) {
            // console.log('LOWER');
            return true;
        }
    }

    // console.log('NONE');
    return false;

}

// returns a string with no dots or commas (. or ,)
function cleanText(text) {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// return the matched words for the best fit (Forward or Backward)
function getMatchedWords(target, response) {

    target = cleanText(target).trim().toLowerCase();
    response = cleanText(response).trim().toLowerCase();

    var fwMatchedWords = calculateScoreForward(target, response);
    var bwMatchedWords = calculateScoreBackward(target, response);

    return (fwMatchedWords.totalMatchedWords > bwMatchedWords.totalMatchedWords) ? fwMatchedWords : bwMatchedWords;
}

// this function calculates the score for a given target and response
function calculateScore(targetWords, responseWords) {

    var counter = 0;
    var matchedList = [];
    var matchedWordsObj = {};

    matchedWordsObj.targetCount = targetWords.length;
    matchedWordsObj.responseCount = responseWords.length;

    // fill object with targets words
    for (var tIndex in targetWords) {
        matchedWordsObj[targetWords[tIndex]] = ['$$$$', -1, -1];
    }

    for (var rIndex in responseWords) {
        rWord = responseWords[rIndex];
        // if the target word is in the response we count it
        if (targetWords.includes(rWord)) {
            matchedList.push(rWord);
            matchedWordsObj[rWord] = [rWord, targetWords.indexOf(rWord), Number(rIndex)];
        } else {
            for (var tIndex in targetWords) {
                tWord = targetWords[tIndex];

                if (checkPastTense(tWord, rWord) || checkPlurals(tWord, rWord)) {
                    matchedWordsObj[tWord] = [rWord, Number(tIndex), Number(rIndex)];
                    matchedList.push(tWord);
                } else if (variantsObj[tWord] && variantsObj[tWord].length > 0) {
                    if (variantsObj[tWord].includes(rWord)) {
                        // matchedWordsObj[tWord] = rWord;
                        matchedWordsObj[tWord] = [rWord, Number(tIndex), Number(rIndex)];
                        matchedList.push(tWord);
                    } else if (checkPastTense(tWord, rWord) || checkPlurals(tWord, rWord)) {
                        // 
                        matchedWordsObj[tWord] = [rWord, Number(tIndex), Number(rIndex)];
                        matchedList.push(tWord);
                    }
                } else if (variantsObj[rWord] && variantsObj[rWord].length > 0) {
                    if (variantsObj[rWord].includes(tWord)) {
                        // matchedWordsObj[tWord] = rWord;
                        matchedWordsObj[rWord] = [tWord, Number(tIndex), Number(rIndex)];
                        matchedList.push(tWord);
                    } else if (checkPastTense(tWord, rWord) || checkPlurals(tWord, rWord)) {
                        matchedWordsObj[rWord] = [tWord, Number(tIndex), Number(rIndex)];
                        matchedList.push(tWord);
                    }
                }
            }
        }
    }

    // console.log(JSON.stringify(matchedWordsObj));

    // var matchedWordsCounter = 0;

    // for (var tWord in matchedWordsObj) {
    //     if (matchedWordsObj[tWord][0] != '' && validateDisplacement(matchedWordsObj[tWord][1], matchedWordsObj[tWord][2])) {
    //         matchedWordsCounter++;
    //     }
    // }

    var matchedTargetList = [];

    for (var tIndex in targetWords) {
        tWord = targetWords[tIndex];
        if (matchedList.includes(tWord)) {
            matchedTargetList.push(tWord);
        }
    }

    // var x = {
    //     a: ["$$$$", -1, -1],
    //     bat: ["$$$$", -1, -1],
    //     beside: ["beside", 0, 0],
    //     sunken: ["$$$$", -1, -1],
    //     the: ["the", 1, 3],
    //     totalMatchedWords: 2
    // }

    for (var index in matchedTargetList) {
        if (index >= matchedList.indexOf(matchedTargetList[index])) {
            counter++;
        }
    }

    if (counter > 1) {
        for (var key in matchedWordsObj) {
            if (matchedWordsObj[key][0] != '$$$$') {
                dist = Math.abs(parseInt(matchedWordsObj[key][1]) - parseInt(matchedWordsObj[key][2]));
                dist2 = Math.abs((matchedWordsObj.targetCount - parseInt(matchedWordsObj[key][1])) - (matchedWordsObj.responseCount - parseInt(matchedWordsObj[key][2])));
                if (dist > 1 && dist2 > 1) {
                    counter--;
                }
            }
        }
    }

    matchedWordsObj.totalMatchedWords = counter;

    // if (matchedWordsCounter != counter) {
    //     console.log('Total Matched Words: ' + matchedWordsCounter);
    //     console.log('Matchs counted: ' + counter);
    //     console.log(matchedTargetList);
    //     console.log(matchedList);
    //     console.log(JSON.stringify(matchedWordsObj));
    // }

    // return matchedList.length
    return matchedWordsObj;
}

// This function check if one word is the past tense do the other (...ed)
function checkPastTense(firstWord, secondWord) {

    if (typeof firstWord == 'undefined' || typeof secondWord == 'undefined') {
        return false;
    }

    firstWord = firstWord.trim().toLowerCase();
    secondWord = secondWord.trim().toLowerCase();

    // if (firstWord.length < 4 || secondWord.length < 4) {
    //     return false;
    // }

    if (firstWord == secondWord) {
        return true;
    }

    if (firstWord.endsWith('ed')) {
        // if (firstWord == secondWord + 'd')
        //     return true;
        if (firstWord == secondWord + 'ed')
            return true;
    }

    if (secondWord.endsWith('ed')) {
        // if (secondWord == firstWord + 'd')
        //     return true;
        if (secondWord == firstWord + 'ed')
            return true;
    }

    return false;
}

// This function check if one word is the past tense do the other (...ed)
function checkPlurals(firstWord, secondWord) {

    if (typeof firstWord == 'undefined' || typeof secondWord == 'undefined') {
        return false;
    }

    firstWord = firstWord.trim().toLowerCase();
    secondWord = secondWord.trim().toLowerCase();

    if (firstWord == secondWord) {
        return true;
    }

    if (firstWord.endsWith('s')) {
        if (firstWord == secondWord + 's')
            return true;
        if (firstWord == secondWord + 'es')
            return true;
    }

    if (secondWord.endsWith('s')) {
        if (secondWord == firstWord + 's')
            return true;
        if (secondWord == firstWord + 'es')
            return true;
    }

    return false;
}

// this function calculates the score for a given target and response forward direction
function calculateScoreForward(target, response) {

    var targetWords = target.split(' ');
    var matchedWordsObj = {};

    // if any of the inputs is an empty string the return 0
    if (!response || !target) {

        // fill object with targets words
        for (var tIndex in targetWords) {
            matchedWordsObj[targetWords[tIndex]] = "";
        }

        matchedWordsObj.totalMatchedWords = 0;

        return matchedWordsObj;
    }

    target = target.trim().toLowerCase();
    response = response.trim().toLowerCase();

    // get rid of non alphanumeric characters
    response = response.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

    // if they are equal return full match
    if (target == response) {

        // fill object with targets words
        for (var tIndex in targetWords) {
            matchedWordsObj[targetWords[tIndex]] = targetWords[tIndex];
        }

        matchedWordsObj.totalMatchedWords = targetWords.length;

        return matchedWordsObj;
    }

    // get the unique words separated
    var targetWords = getUniqueElementsFromArray(target.split(" "));
    var responseWords = getUniqueElementsFromArray(response.split(" "));

    return calculateScore(targetWords, responseWords);

}

// this function calculates the score for a given target and response backward
function calculateScoreBackward(target, response) {

    // if any of the inputs is an empty string the return 0
    var targetWords = target.split(' ');
    var matchedWordsObj = {};

    // if any of the inputs is an empty string the return 0
    if (!response || !target) {

        // fill object with targets words
        for (var tIndex in targetWords) {
            matchedWordsObj[targetWords[tIndex]] = "";
        }

        matchedWordsObj.totalMatchedWords = 0;

        return matchedWordsObj;
    }

    target = target.trim().toLowerCase();
    response = response.trim().toLowerCase();

    // get rid of non alphanumeric characters
    response = response.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

    // if they are equal return full match
    if (target == response) {

        // fill object with targets words
        for (var tIndex in targetWords) {
            matchedWordsObj[targetWords[tIndex]] = targetWords[tIndex];
        }

        matchedWordsObj.totalMatchedWords = targetWords.length;

        return matchedWordsObj;
    }

    // get the unique words separated
    var targetWords = getUniqueElementsFromArray(target.split(" "));
    var responseWords = getUniqueElementsFromArray(response.split(" ").reverse()).reverse();

    return calculateScore(targetWords, responseWords);

}

// This function eliminates commas inside double quotes
function deleteCommasInDoubleQuotes(str) {
    // get rid of commas inside double quotes
    var result = str.replace(/"[^"]+"/g, function (match) {
        return match.replace(/,/g, '');
    });

    return result;
}

function compArrays(arr1, arr2) {
    // if the other arr1 is a falsy value, return
    if (!arr1 || !arr2)
        return false;

    // compare lengths - can save a lot of time 
    if (arr2.length != arr1.length)
        return false;

    for (var i = 0, l = arr2.length; i < l; i++) {
        // Check if we have nested arr1s
        if (arr2[i] instanceof Array && arr1[i] instanceof Array) {
            // recurse into the nested arr1s
            if (!arr2[i].equals(arr1[i]))
                return false;
        } else if (arr2[i] != arr1[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }

    return true;
}

function difference(arr1, arr2) {

    var a1 = flatten(arr1, true);
    var a2 = flatten(arr2, true);

    var a = [],
        diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = false;
    }

    for (i = 0; i < a2.length; i++) {
        if (a[a2[i]] === false) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

var flatten = function (a, shallow, r) {

    if (!r) {
        r = [];
    }

    if (shallow) {
        return r.concat.apply(r, a);
    }

    for (i = 0; i < a.length; i++) {
        if (a[i].constructor == Array) {
            flatten(a[i], shallow, r);
        } else {
            r.push(a[i]);
        }
    }

    return r;
};

function isEmail(email) {

    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
}

function getSessionVars() {

    $.ajax({
        type: 'POST',
        url: '../db/read-session.php',
        dataType: "json",
        success: function (data) {
            // console.log(data);
            sessionInfo = data;
        },
        error: function (msg) {
            // console.log(msg);
            sessionInfo = [];
        }
    });
}

function readCookie() {
    var cookiesObj = {};
    var allcookies = document.cookie;
    // console.log ("All Cookies : " + allcookies );

    // Get all the cookies pairs in an array
    var cookiearray = allcookies.split(';');

    // Now take key value pair out of this array
    for (var i = 0; i < cookiearray.length; i++) {
        name = cookiearray[i].split('=')[0];
        value = cookiearray[i].split('=')[1];
        // console.log ("Key is : " + name.trim() + " and Value is : " + value.trim());
        cookiesObj[name.trim()] = value.trim();
    }

    // console.log(cookiesObj);
    return cookiesObj;
}