var documentSubTypeId = '';

function GetCategories(callback) {
    $.ajax({
        type: "GET",
        url: urlgetAllCat,
        data: { documentSubTypeId: documentSubTypeId },
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}


function GetSubCategories(CategoryId, documentSubTypeId, callback) {
    $.ajax({
        type: "GET",
        //url: "../api/SubCategory/" + CategoryId,
        url: urlGetSubCat,
        data: { parentid: CategoryId,  documentSubTypeId: documentSubTypeId },
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

function GetSubCategoryOnes(CategoryId, SubCategoryId, documentSubTypeId, callback) {
    $.ajax({
        type: "GET",
        //url: "../api/SubCategory/" + CategoryId + "/" + SubCategoryId,
        url: urlGetSubOne,
        data: { parentid: CategoryId, id: SubCategoryId, documentSubTypeId: documentSubTypeId },
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

function GetSubCategoryTwos(CategoryId, SubCategoryId, SubCategoryOneId, documentSubTypeId, callback) {
    $.ajax({
        type: "GET",
        url: urlGetSubTwo,
        data: { grandparentid: CategoryId, parentid: SubCategoryId, id: SubCategoryOneId, documentSubTypeId: documentSubTypeId },
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}



function expandValidity(obj, categoryId, documentId) {
    documentSubTypeId = documentId;
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
        $(obj).closest("tr").after("<tr class='Sub'><td colspan='6'>" +
            "<h2>Categories</h2>" +
            "<div id='CategoryContentContainer'  class='clearfix' >" +
            "<div class='CategoryContent' id='CategoryContent'><img alt='Loading...' src='../img/ajax-loader.gif' /></div>" +
            "<div id='SubCategoryContentContainer'><div id='SubCategoryContent'></div></div>" +
            "<div id='SubCategoryOneContentContainer'><div id='SubCategoryOneContent'></div></div>" +
            "<div id='SubCategoryTwoContentContainer'><div id='SubCategoryTwoContent'></div></div>" +
            "</td></tr>");
        GetCategories(function (err, data) {
            PopulateMainCategory(data, documentSubTypeId);
        });
    }
}

function PopulateMainCategory(data, documentSubTypeId) {
    $("#SubCategoryOneContentContainer").hide();
    $("#SubCategoryTwoContentContainer").hide();
    $("#SubCategoryContentContainer").hide();
    $("#CategoryContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#CategoryContentContainer").show();

    var output = "<div id='categoryContainer' >";
    $.each(data, function (index, value) {
        if (value.DocumentSubTypeCategoryId == null) {
            output += "<div class='clearfix'><a class='cat-edit' href='#' id='ShowSubCategoryLink_" + value.Id + "'  onclick='ShowCategory(" +
                value.Id + "," + documentSubTypeId + ");return false;'>" + value.Name +
                "</a>" +
                "<div id='divsetval_CategoryId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('CategoryId'," + value.Id + ",0) /><div class='dropdown-menu'></div></div>" +
                "</div> ";
        }
        else {
            output += "<div class='clearfix'><a class='cat-edit' href='#' id='ShowSubCategoryLink_" + value.Id + "'  onclick='ShowCategory(" +
                value.Id + "," + documentSubTypeId + ");return false;'>" + value.Name +
                "</a>" +
                "<div id='divsetval_CategoryId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('CategoryId'," + value.Id + "," + value.DocumentSubTypeCategoryId + ") checked/><div class='dropdown-menu'></div></div>" +
                "</div> ";
        }   

    });
    output += "</div><div></div>";
    $("#CategoryContent").html(output);
    //$("#NewCategoryName").focus();

}

function PopulateCategory(data, categoryId, documentSubTypeId) {
    $("#SubCategoryOneContentContainer").hide();
    $("#SubCategoryTwoContentContainer").hide();
    $("#SubCategoryContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryContentContainer").show();

    var output = "<div id='subCategoryContainer' >";
    $.each(data, function (index, value) {
        if (value.DocumentSubTypeCategoryId == null) {
            output += "<div class='clearfix'><a class='cat-edit' href='#' id='ShowSubCategoryLink_" + value.Id + "'  onclick='ShowSubCategory(" +
                categoryId + "," + value.Id + "," + documentSubTypeId + ");return false;'>" + value.Name +
                "</a>" +
                "<div id='divsetval_SubCategoryId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryId'," + value.Id + ",0) /><div class='dropdown-menu'></div></div>" +
                "</div> ";
        }
        else {
            output += "<div class='clearfix'><a class='cat-edit' href='#' id='ShowSubCategoryLink_" + value.Id + "'  onclick='ShowSubCategory(" +
                categoryId + "," + value.Id + "," + documentSubTypeId + ");return false;'>" + value.Name +
                "</a>" +
                "<div id='divsetval_SubCategoryId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryId'," + value.Id + "," + value.DocumentSubTypeCategoryId + ") checked/><div class='dropdown-menu'></div></div>" +
                "</div> ";
        }   
    });
    output += "</div><div></div>";
    $("#SubCategoryContent").html(output);
    $("#NewSubCategoryName").focus();

}

/* POPULATE THE MIDDLE COLUMN Populate Sub Category by loading it's children (SubCategoryOnes )*/
function PopulateSubCategory(data, categoryId, subCategoryId, documentSubTypeId) {
    $("#SubCategoryTwoContentContainer").hide();
    $("#SubCategoryOneContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryOneContentContainer").show();

    var output = "<div id='subCategoryOneContainer'>";
    if (data !== null) {
        $.each(data, function (index, value) {
            if (value.DocumentSubTypeCategoryId == null) {
                output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryOneLink_" + value.Id + "' " +
                    "onclick='ShowSubCategoryOne(" + categoryId + "," + subCategoryId + "," + value.Id + "," + documentSubTypeId + ");return false;'>" +
                    value.Name + "</a>" +
                    "<div id='divsetval_SubCategoryOneId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryOneId'," + value.Id + ",0) /><div class='dropdown-menu'></div></div>" +
                    "</div> ";
            }
            else {
                output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryOneLink_" + value.Id + "' " +
                    "onclick='ShowSubCategoryOne(" + categoryId + "," + subCategoryId + "," + value.Id + "," + documentSubTypeId + ");return false;'>" +
                    value.Name + "</a>" +
                    "<div id='divsetval_SubCategoryOneId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 pl10 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryOneId'," + value.Id + "," + value.DocumentSubTypeCategoryId + ") checked/><div class='dropdown-menu'></div></div>" +
                    "</div> ";
            }

        });
    }
    output += "</div><div></div>";
    //alert(output);
    $("#SubCategoryOneContent").html(output);
}

/* POPULATE THE RIGHT COLUMN Populate Sub Category One by loading it's children (SubCategoryTwos )*/
function PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId, documentSubTypeId) {
    $("#SubCategoryTwoContent").html("<img alt='Loading...' src='../img/ajax-loader.gif' />");
    $("#SubCategoryTwoContentContainer").show();
    var output = "<div id='subCategoryTwoContainer'>";
    if (data !== null) {
        $.each(data, function (index, value) {
            if (value.DocumentSubTypeCategoryId == null) {
                output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryTwoLink_" + value.Id + "' onclick='return false'>" + value.Name +
                    "</a>" +
                    "<div id='divsetval_SubCategoryTwoId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryTwoId'," + value.Id + ",0) /><div class='dropdown-menu'></div></div>" +
                    "</div>";
            }
            else {
                output += "<div class='clearfix'><a class='cat-edit'  href='#' id='ShowSubCategoryTwoLink_" + value.Id + "' onclick='return false'>" + value.Name +
                    "</a>" +
                    "<div id='divsetval_SubCategoryTwoId_" + documentSubTypeId + "_" + value.Id + "' class='btn-group margintop12 setvalidmenu'><input type='checkbox' class='dropdown-toggle validcheck' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onclick=SetValidity('SubCategoryTwoId'," + value.Id + "," + value.DocumentSubTypeCategoryId + ") checked/><div class='dropdown-menu'></div></div>" +
                    "</div>";
            }

        });
    }
    output += "</div><div></div>";
    //alert(output);
    $("#SubCategoryTwoContent").html(output);

}


function ShowCategory(categoryId, documentSubTypeId) {
    $(".sub-category-active").attr("class", "cat-edit");
    $("#ShowSubCategoryLink_" + categoryId).attr("class", "sub-category-active cat-edit");
    GetSubCategories(categoryId, documentSubTypeId, function (err, data) {
        PopulateCategory(data, categoryId, documentSubTypeId);
    });
}

function ShowSubCategory(categoryId, subCategoryId, documentSubTypeId) {
    $(".sub-category-active").attr("class", "cat-edit");
    $("#ShowSubCategoryLink_" + subCategoryId).attr("class", "sub-category-active cat-edit");
    GetSubCategoryOnes(categoryId, subCategoryId, documentSubTypeId, function (err, data) {
        PopulateSubCategory(data, categoryId, subCategoryId, documentSubTypeId);
    });
}

function ShowSubCategoryOne(categoryId, subCategoryId, subCategoryOneId, documentSubTypeId) {
    $(".sub-category-one-active").attr("class", "cat-edit");
    $("#ShowSubCategoryOneLink_" + subCategoryOneId).attr("class", "sub-category-one-active cat-edit");
    GetSubCategoryTwos(categoryId, subCategoryId, subCategoryOneId, documentSubTypeId, function (err, data) {
        PopulateSubCategoryOne(data, categoryId, subCategoryId, subCategoryOneId, documentSubTypeId);
    });
}

function SetValidity(column, columnId, primaryKey) {
    if (!$(this).parent().hasClass('open')) {
        $.ajax({
            method: "GET",
            url: urlSetValidity,
            data: { "documentSubTypeId": documentSubTypeId, "Column": column, "ColumnId": columnId, documentSubTypeCategoryId: primaryKey },
            success: function (result) {
                $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu').html(result);
                $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId).on('hidden.bs.dropdown', function () {
                    $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu').find('.setValidity-popup').remove();
                    $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu').html('');
                });
                $(document).on('click', '#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu', function (e) {
                    if (e.target.innerText != "Close") {
                        e.stopPropagation();
                    }
                    else {
                        $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu').find('.setValidity-popup').remove();
                        $('#divsetval_' + column + '_' + documentSubTypeId + '_' + columnId + ' .dropdown-menu').html('');
                    }
                });
            }
        });
    }
}

