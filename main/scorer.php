<?php
session_start();
if(!isset($_SESSION['logged_in']) ) {
  // header("location:admin.php");
  header("Location: ./error.html?error=You_are_not_logged_in");
} else {
    setcookie("email", $_SESSION['email']);
    setcookie("role", $_SESSION['role']);
    setcookie("enabled", $_SESSION['enabled']);
    setcookie("login_string", $_SESSION['login_string']);
}
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

    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/narrow-style.css">
    <link rel="stylesheet" href="../css/column-height.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <!--<script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.0/bootstrap-table.min.js"></script>-->
    <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.js"></script>

    <script src="../js/global.js" type="text/javascript"></script>
    <script src="../js/main.js" type="text/javascript"></script>
    <script src="../js/jszip.min.js" type="text/javascript"></script>
    <script src="../js/FileSaver.js" type="text/javascript"></script>

    <title>Intelligibility Scorer</title>

</head>

<body>

    <div class="container">
        <div class="header">
            <h2 class="text-muted">Intelligibility Scorer</h2>
        </div>

        <br>
        <br>

        <div class="row">
            <div class="table-header col-md-12">
                <div class="btn-group col-md-6">
                    <label id="edit_variants" class="btn btn-default btn-table admin" data-toggle="tooltip" title="Edit Variants">
                        <span class="glyphicon glyphicon-pencil"></span>
                    </label>
                    <label id="add_user" class="btn btn-default btn-table admin" data-toggle="tooltip" title="Add a User">
                        <span class="glyphicon glyphicon-user"></span>
                    </label>
                </div>

                <div class="btn-group col-md-6">
                    <label id="calc_score" class="btn btn-default btn-table robot pull-right" data-toggle="tooltip" title="Calculate Score">
                        <span class="glyphicon glyphicon-flash"></span>
                    </label>
                    <label id="show_modal" class="btn btn-default btn-table pull-right" data-toggle="tooltip" title="Edit Scores">
                        <span class="glyphicon glyphicon-list-alt"></span>
                    </label>
                    <label class="btn btn-default btn-table pull-right" onclick='downloadCSV({});' data-toggle="tooltip" title="Download Scored CSV File">
                        <span class="glyphicon glyphicon-download-alt"></span>
                    </label>
                    <label class="btn btn-default btn-table pull-right" data-toggle="tooltip" title="Upload Response CSV File">
                        <span class="glyphicon glyphicon-folder-open" aria-hidden="true">
                            <input id="fileinput" type="file" style="display: none;" multiple="multiple">
                        </span>
                    </label>
                </div>
            </div>
        </div>

        <br>

        <div class="row">
            <div class="col-md-12">
                <table id="myTable" class="stripe row-border hover">
                    <thead id="table_header">
                    </thead>
                </table>
            </div>
        </div>

        <br>
        <br>

        <div class="well" hidden>
            <form class="form-horizontal">
                <fieldset>

                    <legend>Data from row</legend>

                    <div class="form-group">
                        <label class="col-md-4 control-label">Index</label>
                        <div class="col-md-4">
                            <label id="index" class="form-control"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Target</label>
                        <div class="col-md-8">
                            <label id="target" class="form-control"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Response</label>
                        <div class="col-md-8">
                            <label id="response" class="form-control"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label">Matched</label>
                        <div class="col-md-8">
                            <label id="matched" class="form-control"></label>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button id="close_modal" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">Intelligibility Score</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <label id="mod_index"></label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="row-height">
                                <div class="col-xs-8 col-height">
                                </div>
                                <div class="col-xs-2 col-height score-header">
                                    <label id="human_label">Human Score</label>
                                </div>
                                <div class="col-xs-2 col-height score-header robot">
                                    <label id="robot_label">Robot Score</label>
                                </div>
                            </div>
                            <div class="row-height">
                                <div class="col-xs-8 col-height">
                                    <div class="inside">
                                        <div id="mod_target" class="alert alert-info target">
                                        </div>
                                        <div id="mod_response" class="alert alert-warning response">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-2 col-height col-middle rounded">
                                    <div class="inside">
                                        <h1 id="mod_human" class="display-1">4</h1>
                                    </div>
                                </div>
                                <div class="col-xs-2 col-height col-middle rounded robot">
                                    <div class="inside">
                                        <h1 id="mod_robot" class="display-1">0</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <!--<button id="dismiss_modal" type="button" class="btn btn-default">Close</button>-->
                        <button id="save_changes" type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

        <div id="safari_download" class="modal fade">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">Intelligibility Score</h4>
                    </div>
                    <div class="modal-body">
                        <a id="download_link" href="#"></a>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
    <!--/container-->
</body>

</html>