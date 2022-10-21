var tasks = [];

function AddTask() {
    var id = $("#ProviderId").val();
    $(".modal-title").html("Add Task");
    $("#btnModelSave").attr("disabled", false);
    $("#btnModelSave").unbind('click');
    $.ajax({
        method: "Get",
        data: { providerId: id },
        url: urlProviderTaskHeading,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#modelrelationship").find("div.modal-body").html(data);
            $("#modelrelationship").modal("show");
            $("#modelrelationship").find("div.modal-body").addClass("fix-height-scroll");
            $("#btnModelSave").click(function () {
                $("#btnModelSave").attr("disabled", true);
                $("#modelrelationship").find("div.modal-body").removeClass("fix-height-scroll");
                AddProviderTask(id);
            });
        },
        error: function (data) {
        }
    });
}

function TaskHeadingOnChange() {
    var id = event.target.id;    
    var checkvalue = "";
    if ($("#" + id).prop("checked") == true) {
        checkvalue = true;
        id = id.substr(4);
        tasks.push(id);
    } else {
        id = id.substr(4);
        tasks.push(id);
        tasks = jQuery.grep(tasks, function (value) {
            return value != id;
        });
    }
}

function AddProviderTask(providerId) {
    if (tasks.length > 0) {
        var postdata = JSON.stringify({ providerId: providerId, 'TaskHeadings': tasks });
        tasks = [];
        $.ajax({
            url: urlProviderTaskSaveandView,
            method: "POST",
            data: postdata,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#modelrelationship").modal("hide");
                $("#btnModelSave").unbind('click');
                $("#divProviderTasks").html(data);
                $('input[name=TaskCompleteCheck]').change(function () {
                    var cl = this.id;
                    var matches = cl.match(/(\d+)/);
                    var i = matches[0];
                    $.ajax({
                        url: urlTaskComplete,
                        data: { "providerRelationshipTaskid": i, isChecked: $("#" + cl).prop("checked") },
                        method: "GET",
                        success: function (data) {
                            var headinghtml = '';
                            var comment = '';
                            if (data.TaskStatus.Status == "Completed") {
                                headinghtml = '<span class="text_underline">' + data.TaskName + '</span>';
                                //$('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(4).find('a').hide();
                            }
                            else {
                                headinghtml = '<span>' + data.TaskName + '</span>';
                                //$('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(4).find('a').show();
                            }
                            if (data.Comment != null && data.Comment != 'null') {
                                if (data.TaskStatus.Status == "Completed") {
                                    comment = '<span class="text_underline">' + data.Comment + '</span>';
                                }
                                else {
                                    comment = '<span>' + data.Comment + '</span>';
                                }
                            }
                            $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(0).attr('checked');

                            var completedate = "";
                            if (data.CompletionDate != null || data.CompletionDate == "" || data.CompletionDate == " ") {
                                var dateObj = new Date(parseInt(data.CompletionDate.substr(6)));
                                var momentObj = moment(dateObj);
                                completedate = moment(momentObj).format("DD/MM/YYYY");
                            }
                            if (comment != undefined && comment != '') {
                                $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(2).html(comment);
                            }
                            $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(3).text(completedate);
                            $('#Taskprogressbar').html(data.TaskOverAllProgess);
                            $('#Taskprogressbar').css('width', data.TaskOverAllProgess);
                            if (data.TaskName != "" || data.TaskName != undefined) {
                                $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(1).html(headinghtml);
                                ;
                            }
                        }
                    });
                });
            },
            error: function (status) {

            }
        });
    }
    else {
        alert("Please choose a Task to save");
    }        
}


//$(document).on('click', '#CreateTask', function () {
//    var url = "@Url.Action("ProviderTaskCreate")";
//    $(".modal-title").html("Add Task");
//    $("#btnModelSave").unbind('click');
//    var id = $("#ProviderId").val();
//    $("#btnModelSave").attr("disabled", false);
//    $.ajax({
//        method: "Get",
//        data: { ProviderId: id },
//        url: url,
//        contentType: "application/json; charset=utf-8",
//        success: function (data) {
//            $("#modelrelationship").find("div.modal-body").html(data);
//            $("#modelrelationship").modal("show");
//            $("#btnModelSave").click(function () {
//                $("#btnModelSave").attr("disabled", true);
//                TaskSaveAndExit();
//            });
//        },
//        error: function (data) {

//        }
//    });
//});

$(document).on('click', ".edittask", function () {
    var str = this.id;
    var id = str.match(/\d+/);
    $("#btnModelSave").unbind('click');
    var providerId = $("#ProviderId").val();
    $("#btnModelSave").attr("disabled", false);
    var url = urlProviderTaskEdit;
    $(".modal-title").html("Edit Task");
    $.ajax({
        method: "GET",
        url: url,
        data: { "providerRelationshipTaskid": id[0]},
        success: function (result) {
            $("#modelrelationship").find("div.modal-body").html(result);
            $("#modelrelationship").modal("show");
            $("#btnModelSave").click(function () {
                $("#btnModelSave").attr("disabled", true);
                TaskSaveAndExit();
            });
        }
    });
});

$(document).ready(function () {
    /* This below sections is for Marking individual or entire Task heading tasks as Complete*/
    $('input[name=TaskCompleteCheck]').change(function () {
        var cl = this.id;
        var matches = cl.match(/(\d+)/);
        var i = matches[0];
      
        $.ajax({
            url: urlTaskComplete,
            data: { "providerRelationshipTaskid": i, isChecked: $("#" + cl).prop("checked") },
            method: "GET",
            success: function (data) {
              
                var headinghtml = '';
                var comment = '';
                if (data.TaskStatus.Status == "Completed") {
                    headinghtml = '<span class="text_underline">' + data.TaskDisplay + '</span>';
                    //$('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(4).find('a').hide();
                }
                else {
                    headinghtml = '<span>' + data.TaskDisplay + '</span>';
                    //$('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(4).find('a').show();
                }
                $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(0).attr('checked');

                var completedate = "";
                if (data.CompletionDate != null || data.CompletionDate == "" || data.CompletionDate == " ") {
                    var dateObj = new Date(parseInt(data.CompletionDate.substr(6)));
                    var momentObj = moment(dateObj);
                    completedate = moment(momentObj).format("DD/MM/YYYY");
                }
                if (data.Comment != null && data.Comment != 'null') {
                    if (data.TaskStatus.Status == "Completed") {
                        comment = '<span class="text_underline">' + data.Comment + '</span>';
                    }
                    else {
                        comment = '<span>' + data.Comment + '</span>';
                    }
                }
                if (comment != undefined && comment != '' ) {

                    $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(2).html(comment);
                }
                $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(3).text(completedate);
                $('#Taskprogressbar').html(data.TaskOverAllProgess + '%');
                $('#Taskprogressbar').css('width', data.TaskOverAllProgess + '%');
                if (data.TaskName != "" || data.TaskName != undefined) {
                    $('#TaskRowId_' + data.ProviderRelationshipTaskId).find("td").eq(1).html(headinghtml);
                }

                if (!$("#" + cl).prop("checked")) {
                    $('#completeall_' + data.ProviderTaskHeadingId).removeClass('btn-disable');
                }
            }
        });
    });
});



function TaskAllComplete(providerTaskHeadingId) {
    $.ajax({
        url: urlTaskCompleteAll,
        data: { "providerTaskHeadingId": providerTaskHeadingId },
        method: "post",
        success: function (data) {
            //$("#TaskAllComplete").attr('disabled', 'disabled');
           
            for (var j = 0; j < data.length; j++) {
               

                var completedate = "";
                if (data[j].CompletionDate != null || data[j].CompletionDate == "" || data[j].CompletionDate == " ") {
                    var dateObj = new Date(parseInt(data[j].CompletionDate.substr(6)));
                    var momentObj = moment(dateObj);
                    completedate = moment(momentObj).format("DD/MM/YYYY");
                }
                
                var headinghtml = '<span class="text_underline">' + data[j].TaskDisplay + '</span>';
                if (data[j].TaskStatus.Status == "Completed") {
                    headinghtml = '<span class="text_underline">' + data[j].TaskDisplay + '</span>';
                    $("#TaskComplete_" + data[j].ProviderRelationshipTaskId).prop('checked', true);
                }
                else {
                    headinghtml = '<span>' + data[j].TaskDisplay + '</span>';
                    $("#TaskComplete_" + data[j].ProviderRelationshipTaskId).prop('checked', false);
                }
                $('#Taskprogressbar').html(data[0].TaskOverAllProgess + '%');
                $('#Taskprogressbar').css('width', data[0].TaskOverAllProgess + '%');
                
                $('#TaskRowId_' + data[j].ProviderRelationshipTaskId).find("td").eq(1).html(headinghtml);
                $('#TaskRowId_' + data[j].ProviderRelationshipTaskId).find("td").eq(3).text(completedate);
                //$('#TaskRowId_' + data[j].ProviderRelationshipTaskId).find("td").eq(3).html("");
            }
        }
    });
    $('#completeall_' + providerTaskHeadingId).addClass('btn-disable');
} 


var providerRelationshipTaskId = "";
$(document).on('click', ".remindertask", function (e) {
    if ($(this).parent().hasClass('open')) {
        var str = this.id;
        var id = str.match(/\d+/);
        if (id == null) {
            providerRelationshipTaskId = 0;
        }
        else {

            providerRelationshipTaskId = id[0];
        }
       
        $.ajax({
            method: "GET",
            url: urlTaskHeadingReminder,
            data: { "providerRelationshipTaskId": providerRelationshipTaskId, "tableName": "ProviderRelationshipTask" },
            success: function (result) {
                $('#ddmenu_' + providerRelationshipTaskId).html(result);
            }
        });
    }
   
});



function closeForm(id) {
    $('#div_' + id).removeClass('open');
    $('#div_' + id + ' .dropdown-menu').html('');
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}