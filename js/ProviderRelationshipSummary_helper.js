
function chksummeryIncludechange(ele, module) {
    debugger;
    var id = event.target.id;
   
    var providerId = $("#ProviderId").val();
    var checkvalue = "";
    if ($("#"+id).prop("checked") == true) {
        checkvalue = true;
        if (id.indexOf("chk_Contact") > -1) {
            if (!(id.indexOf("chk_Contact_Name") > -1) && $("#chk_Contact_Name").prop("checked") != true) {
                $("#chk_Contact_Name").attr("checked", "checked");
                var postdata = JSON.stringify({
                    "providerId": providerId, "fieldName": "chk_Contact_Name", "rmModule": module, "checkvalue": checkvalue });
                $.ajax({
                    url: urlIncludeFields,
                    method: "Post",
                    data: postdata,
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                       
                    },
                    error: function (status) {

                    }
                });
            }
        }
    } else {
        checkvalue = false;
    }    
    var postdata = JSON.stringify({ "providerId": providerId, "fieldName": id, "rmModule": module, "checkvalue": checkvalue  });
    $.ajax({
        url: urlIncludeFields,
        method: "Post",
        data: postdata,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#modelrelationship").modal("show");
        },
        error: function (status) {

        }
    });
}