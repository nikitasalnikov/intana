﻿
function GetSubCategories(CategoryId, callback) {
    $.ajax({
        type: "GET",
        url: "../api/SubCategory/" + CategoryId,
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

function GetSubCategoryOnes(CategoryId, SubCategoryId, callback) {
    $.ajax({
        type: "GET",
        url: "../api/SubCategory/" + CategoryId + "/" + SubCategoryId,
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

function GetSubCategoryTwos(CategoryId, SubCategoryId, SubCategoryOneId, callback) {
    $.ajax({
        type: "GET",
        url: "../api/SubCategory/" + CategoryId + "/" + SubCategoryId + "/" + SubCategoryOneId,
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

function AddSubCategory() {
    var NewSubCategoryName = $("#NewSubCategoryName").val();
    var NewSubCategoryParentId = $("#NewSubCategoryParentId").val();
    var subCategoryId = $("#HiddenSubCategoryId").val();
    var url = "../api/SubCategory/";
    var httpAction = "";
    if (subCategoryId == "" || subCategoryId == null) {
        data = { "ParentId": NewSubCategoryParentId, "SubCategoryName": NewSubCategoryName }; // New Subcategory
        httpAction = "POST";
    } else {
        data = { "ParentId": NewSubCategoryParentId, "Id": subCategoryId, "SubCategoryName": NewSubCategoryName }; // New Subcategory
        httpAction = "PUT";
        var sender = $('#btnSaveSubCategory');
        sender.parent().parent().parent().css("width", "33%");
    }
    
    $.ajax({
        type: httpAction,
        url: url,
        data: data,
        success: function (data) {
            GetSubCategories(NewSubCategoryParentId, function (err, data) {
                PopulateCategory(data, NewSubCategoryParentId);
            });
        },
        dataType: "json"
    });
    return false;
}

function AddSubCategoryOne() {
    var NewSubCategoryOneName = $("#NewSubCategoryOneName").val();
    var ParentId = $("#NewSubCategoryOneParentId").val();
    var CategoryId = $("#NewSubCategoryParentId").val(); /* steal from parent's form */


    var subCategoryOneId = $("#HiddenSubCategoryOneId").val();
    var url = "../api/SubCategoryOne/";
    var httpAction = "";
    
    if (subCategoryOneId == "" || subCategoryOneId == null) {
        data = { "ParentId": ParentId, "Name": NewSubCategoryOneName };
        httpAction = "POST";
    } else {
        data = { "ParentId": ParentId, "Id": subCategoryOneId, "Name": NewSubCategoryOneName }; // New Subcategory
        httpAction = "PUT";
        $("#SubCategoryContent").show();
        $("#SubCategoryOneContentContainer").css("width", "33%");
    }

    
    $.ajax({
        type: httpAction,
        url: url,
        data: data,
        success: function (data) {
            GetSubCategoryOnes(CategoryId, ParentId, function (err, data) {
                PopulateSubCategory(data, CategoryId, ParentId);
            });
        },
        dataType: "json"
    });


    return false;
}

function AddSubCategoryTwo() {
    var newSubCategoryTwoName = $("#NewSubCategoryTwoName").val();
    var subCategoryOneId = $("#NewSubCategoryTwoParentId").val();
    var subCategoryId = $("#NewSubCategoryOneParentId").val();
    var categoryId = $("#NewSubCategoryParentId").val(); /* steal from parent's form */


    var subCategoryTwoId = $("#HiddenSubCategoryTwoId").val();
    var url = "../api/SubCategoryTwo/";
    var httpAction = "";
    var requestData = {};
    if (subCategoryTwoId == "" || subCategoryTwoId == null) {
        requestData = { "ParentId": subCategoryOneId, "Name": newSubCategoryTwoName };
        httpAction = "POST";
    } else {
        requestData = { "ParentId": subCategoryOneId, "Id": subCategoryTwoId, "Name": newSubCategoryTwoName }; // New Subcategory
        httpAction = "PUT";
        $("#SubCategoryContent").show();
        $("#SubCategoryOneContentContainer").show();
        $("#SubCategoryTwoContentContainer").css("width", "33%");
    }

    
    $.ajax({
        type: httpAction,
        url: url,
        data: requestData,
        success: function (data) {
            GetSubCategoryTwos(categoryId, subCategoryId, subCategoryOneId, function (err, data) {
                PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId);
            });
        },
        dataType: "json"
    });
    return false;
}

function expandCategory(obj, categoryId) {
    $("#SubCategoryContentContainer").hide();
    $("#SubCategoryOneContentContainer").hide();
    $("#SubCategoryTwoContentContainer").hide();
    $(".Expanded").closest("tr").attr("class", "");
    if ($(obj).html() == "Collapse") {
        $(".Sub").remove();
        $(obj).html("Expand");
        $(obj).removeClass("btn-collapse");
        $(obj).addClass("btn-expand");
    }
    else {
        $(".Sub").remove();
        $(".btn-expand").html("Expand");
        $(obj).html("Collapse");
        $(obj).removeClass("btn-expand");
        $(obj).addClass("btn-collapse");

        $(obj).closest("tr").attr("class", "Expanded");
        $(obj).closest("tr").after("<tr class='Sub'><td colspan='3'>" +
                   "<h2>Sub Categories</h2>" +
                   "<div id='SubCategoryContentContainer'  class='clearfix' >" +
                    "<div class='SubCategoryContent' id='SubCategoryContent'><img alt='Loading...' src='../img/ajax-loader.gif' /></div>" +
                    "<div id='SubCategoryOneContentContainer'><div id='SubCategoryOneContent'></div></div>" +
                    "<div id='SubCategoryTwoContentContainer'><div id='SubCategoryTwoContent'></div></div>" +
                  "</td></tr>");

        GetSubCategories(categoryId, function (err, data) {
            PopulateCategory(data, categoryId);
        });
    }
}

function PopulateCategory(data, categoryId) {
    $("#SubCategoryOneContentContainer").hide();
    $("#SubCategoryTwoContentContainer").hide();
    $("#SubCategoryContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryContentContainer").show();
    var form = "<form class='addnews'>" +
       "<input type='hidden' name='NewSubCategoryParentId' id='NewSubCategoryParentId' value='" + categoryId + "'  />" +
       "<input type='hidden' name='NewSubCategoryParentId' id='HiddenSubCategoryId' />" +
       "<input type='text' class='form-control' name='SubCategoryName' id='NewSubCategoryName' placeholder='Add new' />" +
       "<input type='submit' id='btnSaveSubCategory' class='btn btn-default btn-save btn-inline'  onclick='return AddSubCategory()' value='Save' />" +
       "<input type='button' name='btnCancelSubCategoryUpdate' id='btnCancelSubCategoryUpdate' class='btn btn-default btn-save btn-inline' value='Cancel' style='display: none;' onclick='return CancelSubCategoryUpdate()' />" +
       "</form>";
    var output = "<div id='subCategoryContainer' >";
    $.each(data, function (index, value) {
        output += "<div class='clearfix'><a class='cat-edit' href='#' id='ShowSubCategoryLink_" + value.Id + "'  onclick='ShowSubCategory(" +
            categoryId + "," + value.Id + ");return false;'>" + value.Name +
            "</a><a href='#' title='Edit " + value.Name + ".' class='cat-new-edit'   onclick='EditSubCategory(" +
            categoryId + "," + value.Id + ",&quot;" + value.Name + "&quot;);return false;'><i class='fa fa-pencil'></i></a>" +
            "<a href='DeleteSub/" + value.Id  + "/?page=1&sortorder=Ascending&sortby=name' title='Remove " + value.Name + " and all of its children.' class='cat-delete' ><i class='fa fa-trash-o'></i></a></div>";
    });
    output += "</div><div>" + form + "</div>";
    $("#SubCategoryContent").html(output);
    $("#NewSubCategoryName").focus();

}

/* POPULATE THE MIDDLE COLUMN Populate Sub Category by loading it's children (SubCategoryOnes )*/
function PopulateSubCategory(data, categoryId, subCategoryId) {
    $("#SubCategoryTwoContentContainer").hide();
    $("#SubCategoryOneContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryOneContentContainer").show();
    var form = "<form class='addnews'>" +
       "<input type='hidden' name='NewSubCategoryOneParentId' id='NewSubCategoryOneParentId' value='" + subCategoryId + "'  />" +
       "<input type='hidden' name='HiddenSubCategoryOneId' id='HiddenSubCategoryOneId' value=''  />" +
       "<input type='text' class='form-control' name='SubCategoryOneName' id='NewSubCategoryOneName' placeholder='Add new' />" +
       "<input type='submit' id='btnSaveSubCategoryOne' class='btn btn-default btn-save btn-inline'  onclick='return AddSubCategoryOne()' value='Save' />" +
       "<input type='button' name='btnCancelSubCategoryTwoUpdate' id='btnCancelSubCategoryOneUpdate' class='btn btn-default btn-save btn-inline' " +
        "value='Cancel' style='display: none;' onclick='return CancelSubCategoryOneUpdate()' />" +
       "</form>";
    //alert(data);
    var output = "<div id='subCategoryOneContainer'>";
    if (data !== null) {
        $.each(data, function (index, value) {
            output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryOneLink_" + value.Id + "' " +
                "onclick='ShowSubCategoryOne(" + categoryId + "," + subCategoryId + "," + value.Id + ");return false;'>" +
                value.Name + "</a><a href='#' title='Edit " + value.Name + ".' class='cat-new-edit'   " +
                "onclick='EditSubCategoryOne(" + value.Id + ",&quot;" + value.Name + "&quot;);return false;'><i class='fa fa-pencil'></i></a>"
                + "<a href='DeleteSubOne/" + value.Id + "/' title='Remove " + value.Name + " and all of its children.' class='cat-delete'   "
              //  + "onclick='RemoveSubCategoryOne(" + categoryId + "," + subCategoryId + "," + value.Id + ");return false;'"
                + "><i class='fa fa-trash-o'>" +
                "</i></a></div>";
        });
    }
    output += "</div><div>" + form + "</div>";
    //alert(output);
    $("#SubCategoryOneContent").html(output);
    $("#NewSubCategoryOneName").focus();
}

/* POPULATE THE RIGHT COLUMN Populate Sub Category One by loading it's children (SubCategoryTwos )*/
function PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId) {
    $("#SubCategoryTwoContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryTwoContentContainer").show();
    var form = "<form>" +
       "<input type='hidden' name='NewSubCategoryTwoParentId' id='NewSubCategoryTwoParentId' value='" + subCategoryOneId + "'  />" +
       "<input type='hidden' name='HiddenSubCategoryOneId' id='HiddenSubCategoryTwoId' value=''  />" +
       "<input type='text' class='form-control' name='SubCategoryTwoName' id='NewSubCategoryTwoName' placeholder='Add new' />" +
       "<input type='submit' class='btn btn-default btn-save btn-inline'  onclick='return AddSubCategoryTwo()' value='Save' />" +
       "<input type='button' name='btnCancelSubCategoryTwoUpdate' id='btnCancelSubCategoryTwoUpdate' class='btn btn-default btn-save btn-inline' " +
        "value='Cancel' style='display: none;' onclick='return CancelSubCategoryTwoUpdate()'  />" +
       "</form>";
    //alert(data);
    var output = "<div id='subCategoryTwoContainer'>";
    if (data !== null) {
        $.each(data, function (index, value) {
            output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryTwoLink_" + value.Id + "' onclick='return false'>" + value.Name +
                "</a><a href='#' title='Edit " + value.Name + ".' class='cat-new-edit'   " +
                "onclick='EditSubCategoryTwo(" + value.Id + ",&quot;" + value.Name + "&quot;);return false;'><i class='fa fa-pencil'></i></a>" +
                "<a href='DeleteSubTwo/" + value.Id + "/' title='Remove " + value.Name + " and all of its children.' class='cat-delete'   "
                //+ "onclick='RemoveSubCategoryTwo(" + categoryId + "," + subCategoryId + "," + subCategoryOneId + "," + value.Id + ");return false;'" +
                + "><i class='fa fa-trash-o'></i></a></div>";
        });
    }
    output += "</div><div>" + form + "</div>";
    //alert(output);
    $("#SubCategoryTwoContent").html(output);
    $("#NewSubCategoryTwoName").focus();

}

function ShowSubCategory(categoryId, subCategoryId) {
    $(".sub-category-active").attr("class", "cat-edit");
    $("#ShowSubCategoryLink_" + subCategoryId).attr("class", "sub-category-active cat-edit");
    GetSubCategoryOnes(categoryId, subCategoryId, function (err, data) {
        PopulateSubCategory(data, categoryId, subCategoryId);
    });
}

function ShowSubCategoryOne(categoryId, subCategoryId, subCategoryOneId) {
    $(".sub-category-one-active").attr("class", "cat-edit");
    $("#ShowSubCategoryOneLink_" + subCategoryOneId).attr("class", "sub-category-one-active cat-edit");
    GetSubCategoryTwos(categoryId, subCategoryId, subCategoryOneId, function (err, data) {
        PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId);
    });
}

function RemoveSubCategory(categoryId, subCategoryId) {
    if (confirm('Delete this record and it\'s children?')) {
        $.ajax({
            type: "DELETE",
            url: "../api/SubCategory/" + subCategoryId,
            success: function (response) {
                if (response != null ) {
                    if (response.status == "ok") {
                        GetSubCategories(categoryId, function(err, data) {
                            PopulateCategory(data, categoryId);
                        });
                    } else {
                        if (response.status == "error" ) {
                            if (response.message == "providers_exist") {
                                alert("Record can be deleted. Providers are associate with this record.");
                            } else {
                                alert("Server error occurred while processing request. "+response.message);
                            }
                        }
                    }
                } 
            },
            dataType: "json",
            error:function() {
                
            }
        });
    }
}

function EditSubCategory(categoryId, subCategoryId,name) {
    $("#HiddenSubCategoryId").val(subCategoryId); // Set current sub category id.
    $("#NewSubCategoryName").val(name); // Set sub category name to text input.
    var container = $("#subCategoryContainer");
    container.hide(); // Hide container.

    // Hide child categories.

    $("#SubCategoryOneContentContainer").hide();
    $("#SubCategoryTwoContentContainer").hide();

    
    var cancelButton = $('#btnCancelSubCategoryUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null) {
        cancelButton.parent().parent().parent().css("width","50%");
        cancelButton.show();
    }
}

function CancelSubCategoryUpdate() {
    var cancelButton = $('#btnCancelSubCategoryUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null ) {
        cancelButton.parent().parent().parent().css("width", "33%");
        cancelButton.hide();
    }
    $("#HiddenSubCategoryId").val(""); // Set current sub category id.
    $("#NewSubCategoryName").val(""); // Set sub category name to text input.
    var container = $("#subCategoryContainer");
    container.show(); // Hide container.
    // Get SAVE button's parent element which is FORM.
}

function RemoveSubCategoryOne(categoryId, subCategoryId, subCategoryOneId) {
    if (confirm('Delete this record and it\'s children?')) {
        $.ajax({
            type: "DELETE",
            url: "../api/SubCategoryOne/" + subCategoryOneId,
            success: function (response) {
                if (response != null) {
                    if (response.status == "ok") {
                        GetSubCategoryOnes(categoryId, subCategoryId, function (err, data) {
                            PopulateSubCategory(data, categoryId, subCategoryId);
                        });
                    } else {
                        if (response.status == "error") {
                            if (response.message == "providers_exist") {
                                alert("Record can be deleted. Providers are associate with this record.");
                            } else {
                                alert("Server error occurred while processing request. " + response.message);
                            }
                        }
                    }
                }
            },
            dataType: "json"
        });
    }
}

function EditSubCategoryOne(subCategoryId, name) {
    
    $("#HiddenSubCategoryOneId").val(subCategoryId); // Set current sub category id.
    $("#NewSubCategoryOneName").val(name); // Set sub category name to text input.
    $("#SubCategoryContent").hide();
    $("#subCategoryOneContainer").hide(); // Hide container.
    // Hide child categories.
    $("#SubCategoryTwoContentContainer").hide();


    var cancelButton = $('#btnCancelSubCategoryOneUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null) {
        $("#SubCategoryOneContentContainer").css("width", "50%");
        cancelButton.show();
    }
}

function CancelSubCategoryOneUpdate() {
    $("#SubCategoryOneContentContainer").css("width", "33%");
    var cancelButton = $('#btnCancelSubCategoryOneUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null) {
        cancelButton.hide();
    }
    $("#HiddenSubCategoryOneId").val(""); // Set current sub category id.
    $("#NewSubCategoryOneName").val(""); // Set sub category name to text input.
    
    $('#SubCategoryContent').show();
    $("#subCategoryOneContainer").show();
}

function RemoveSubCategoryTwo(categoryId, subCategoryId, subCategoryOneId, subCategoryTwoId) {
    if (confirm('Delete this record?')) {
        $.ajax({
            type: "DELETE",
            url: "../api/SubCategoryTwo/" + subCategoryTwoId,
            success: function (response) {
                if (response != null) {
                    if (response.status == "ok") {
                        GetSubCategoryTwos(categoryId, subCategoryId, subCategoryOneId, function (err, data) {
                            PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId);
                        });
                    } else {
                        if (response.status == "error") {
                            if (response.message == "providers_exist") {
                                alert("Record can be deleted. Providers are associate with this record.");
                            } else {
                                alert("Server error occurred while processing request. " + response.message);
                            }
                        }
                    }
                }
            },
            dataType: "json"
        });
    }
}

function EditSubCategoryTwo(subCategoryTwoId, name) {

    $("#HiddenSubCategoryTwoId").val(subCategoryTwoId); // Set current sub category id.
    $("#NewSubCategoryTwoName").val(name); // Set sub category name to text input.
    $("#SubCategoryContent").hide();
    $("#SubCategoryOneContentContainer").hide(); // Hide container.
    // Hide child categories.
    $("#subCategoryTwoContainer").hide();


    var cancelButton = $('#btnCancelSubCategoryTwoUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null) {
        $("#SubCategoryTwoContentContainer").css("width", "50%");
        cancelButton.show();
    }
}

function CancelSubCategoryTwoUpdate() {
    $("#SubCategoryTwoContentContainer").css("width", "33%");
    var cancelButton = $('#btnCancelSubCategoryTwoUpdate');
    if (typeof (cancelButton) !== "undefined" && cancelButton !== null) {
        cancelButton.hide();
    }
    $("#HiddenSubCategoryTwoId").val(""); // Set current sub category id.
    $("#NewSubCategoryTwoName").val(""); // Set sub category name to text input.

    $('#SubCategoryContent').show();
    $("#SubCategoryOneContentContainer").show();
    $("#subCategoryTwoContainer").show();
}



    

