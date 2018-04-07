
var variantsJSONList = [];
var table = $('#myTable').DataTable();
var currentVariants = [];

function addClickOnRowEventToTable() {
    var t = document.getElementById('myTable');

    t.onclick = function(event) {
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
        var variants = document.getElementById('variants');
        // var f4 = document.getElementById('robot');
        // var f5 = document.getElementById('human');
        index.innerHTML = cells[0].innerHTML;
        target.innerHTML = cells[1].innerHTML;
        variants.innerHTML = cells[2].innerHTML;
        // f4.innerHTML = cells[3].innerHTML;
        // f5.innerHTML = cells[4].innerHTML;
    };

    t.ondblclick = function(event) {
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

        var id = document.getElementById('modal_id');
        var target = document.getElementById('modal_target');

        $('#edit_variant').modal('show');
        id.innerHTML = cells[0].innerHTML;
        target.innerHTML = cells[1].innerHTML;

        // remove all previous tags
        $('#modal_variants').tagsinput('removeAll');

        // if there are variants add them as tags
        if (cells[2].innerHTML) {
            $('#modal_variants').tagsinput('add', cells[2].innerHTML);
            currentVariants = cells[2].innerHTML.split(",");
        }

        $("#modal_variants").focus();

    };
}

function loadTargetsAndVariantsJSON() {

    $.ajax({
        type: 'POST',
        url: '../db/get-variants-json.php',
        dataType: 'json',
        success: function(data) {
            variantsJSONList = data;
            // console.log(variantsJSONList);
            populateTableWithJSON(variantsJSONList);
        },
        error: function(msg) {
            console.log(msg);
        }
    });
}

function populateTableWithJSON(dataJSON) {

    table.destroy();
    // table = $('#myTable').DataTable();
    table = $('#myTable').DataTable( {
        data: dataJSON,
        columns: [
            { data: 'index' },
            { data: 'target' },
            { data: 'variants' }
        ],
        stateSave: true
    });
}

$(function() {

    loadTargetsAndVariantsJSON();

    $('[data-toggle="tooltip"]').tooltip();

    addClickOnRowEventToTable();

    // $("#modal_variants").change(function() {
    //     console.log('Variants changed');
    // });

    $("#save_changes").click(function() {
        var targetID = $('#modal_id').html();
        var target = $('#modal_target').html();
        var editedVariants = $('#modal_variants').tagsinput('items');
        var userID = 1;

        // console.log("ID: " + targetID + ", Target: " + target);
        // console.log("New Variant: " + newVariant);
        // console.log(currentVariants);
        // console.log(editedVariants);

        if (!compArrays(editedVariants, currentVariants)) {
            // console.log('Different');
            // console.log(currentVariants);
            // console.log(editedVariants);
            // var diff = $(currentVariants).not(editedVariants).get();
            var diff = difference(currentVariants, editedVariants);
            // console.log(diff);
            // console.log(difference(currentVariants, editedVariants));

            for (var i in diff) {
                // if the variant was removed then delete it form the DB
                if (currentVariants.includes(diff[i])) {
                    var deletedVariant = diff[i];

                    // var index = currentVariants.indexOf(deletedVariant);
                    // if (index > -1) {
                    //     currentVariants.splice(index, 1);
                    // }

                    console.log('Deleting variant: ' + deletedVariant);
                    deleteVariant(targetID, target, deletedVariant, userID);
                    
                } else {    // add the variant to the DB
                    var newVariant = diff[i];
                    console.log('Adding variant: ' + newVariant);
                    insertVariant(targetID, target, newVariant, userID);
                }
            }
        }
    });

});

function insertVariant(targetID, target, newVariant, userID) {

    $.ajax({
        type: 'POST',
        url: '../db/insert-variants.php',
        data: {
            target_id: targetID,
            target: target,
            new_variant: newVariant,
            user_id: userID
        },
        success: function(data) {
            console.log(data);
        },
        error: function(msg) {
            console.log('Error from DB: ' + msg);
        }
    });
    
}

function deleteVariant(targetID, target, deletedVariant, userID) {

    console.log([targetID, target, deletedVariant, userID]);

    $.ajax({
        type: 'POST',
        url: '../db/delete-variants.php',
        data: {
            target_id: targetID,
            target: target,
            deleted_variant: deletedVariant,
            user_id: userID
        },
        success: function(data) {
            console.log(data);
        },
        error: function(msg) {
            console.log('Error from DB: ' + msg);
        }
    });

}
