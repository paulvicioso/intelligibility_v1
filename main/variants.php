<?php
// session_start();
// if(!isset($_SESSION['logged_in']) ) {
//   // header("location:admin.php");
//   header("Location: ./error.html?error=You_are_not_logged_in");
// }
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE = edge">
    <meta name="viewport" content="width = device-width, initial-scale = 1">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!--<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.css">-->
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap.tagsinput/0.4.2/bootstrap-tagsinput.css" />

    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/narrow-style.css">
    <link rel="stylesheet" href="../css/column-height.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="//cdn.jsdelivr.net/bootstrap.tagsinput/0.4.2/bootstrap-tagsinput.min.js"></script>
    <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.js"></script>

    <script src="../js/global.js" type="text/javascript"></script>
    <script src="../js/variants.js" type="text/javascript"></script>
    <script src="../js/jszip.min.js" type="text/javascript"></script>
    <script src="../js/FileSaver.js" type="text/javascript"></script>

    <title>Edit Variants</title>

    <style>
        .bootstrap-tagsinput {
            /*background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
            display: block;
            padding: 4px 6px;
            color: #555;
            vertical-align: middle;
            border-radius: 4px;
            max-width: 100%;
            line-height: 22px;
            cursor: text;*/
            font-size:18px;
        }
        
        .bootstrap-tagsinput input {
            /*border: none;
            box-shadow: none;
            outline: none;
            background-color: transparent;
            padding: 5px 10px 5px 10px;
            margin: 0;
            width: auto;
            max-width: inherit;*/
            padding: 5px 10px 5px 10px;
            /*height: 300px;*/
        }
    </style>

</head>

<body>

    <div class="container">
        <div class="header">
            <h2 class="text-muted">Edit Variants</h2>
        </div>

        <br>

        <!--<div class="row">
            <div class="table-header col-md-12">
                <div class="col-md-6">
                    <h4>Target Words</h4>
                </div>
                <div class="btn-group col-md-6">
                    <label class="btn btn-default btn-table" data-toggle="tooltip" title="Upload Response CSV File">
                        <span class="glyphicon glyphicon-folder-open" aria-hidden="true">
                            <input id="fileinput" type="file" style="display: none;" multiple="multiple">
                        </span>
                    </label>
                    <label class="btn btn-default btn-table" onclick='downloadCSV({});' data-toggle="tooltip" title="Download Scored CSV File">
                        <span class="glyphicon glyphicon-download-alt"></span>
                    </label>
                    <label id="show_modal" class="btn btn-default btn-table" data-toggle="tooltip" title="Edit Scores">
                        <span class="glyphicon glyphicon-list-alt"></span>
                    </label>
                    <label id="calc_score" class="btn btn-default btn-table" data-toggle="tooltip" title="Calculate Score">
                        <span class="glyphicon glyphicon-flash"></span>
                    </label>
                </div>
            </div>
        </div>

        <br>-->

        <div class="row">
            <div class="col-md-12">
                <table id="myTable" class="stripe row-border hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Target</th>
                            <th>Variants</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>

        <br>
        <br>

        <div class="well">
            <form class="form-horizontal">
                <fieldset>

                    <legend>Variants</legend>

                    <div class="form-group">
                        <label class="col-md-4 control-label">Index</label>
                        <div class="col-md-4">
                            <label id="index" class="form-control"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Target</label>
                        <div class="col-md-4">
                            <label id="target" class="form-control"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Variants</label>
                        <div class="col-md-8">
                            <label id="variants" class="form-control"></label>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>

        <div id="edit_variant" class="modal fade">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Insert New Variant</h4>
                    </div>
                    <div class="modal-body">
                        <div class="well">
                            <form class="form-horizontal">
                                <fieldset>
                                    <label id="modal_id" hidden></label>
                                    <div class="form-group">
                                        <label class="col-md-4 control-label">Target</label>
                                        <div class="col-md-8">
                                            <label id="modal_target" class="form-control"></label>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-4 control-label">Variants</label>
                                        <div class="col-md-8">
                                            <input id="modal_variants" data-role="tagsinput" class="form-control" type="text" autofocus>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="cancel" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button id="save_changes" type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
    <!--/container-->
</body>

</html>