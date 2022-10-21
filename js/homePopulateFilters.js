$(document).ready(function () {

    var getSelectedElementValue = function (elementId) {
        var currentElement = $(elementId);
        if (currentElement != null && currentElement != 'undefined') {
            var index = currentElement[0].selectedIndex;
            
            if (index > 0)
                return $(elementId).val();
            return -1;
        }
        return -1;
    }

    var getSelectedElementText = function (elementId) {
        var currentElement = $(elementId);
        if (currentElement != null && currentElement != 'undefined') {
            var index = currentElement[0].selectedIndex;
            if (index > 0) {
                return $(elementId + " option:selected").text();
            }
            return "";
        }
        return "";
    }

    var getElementValue = function (elementId) {        
        if ($(elementId) != null && $(elementId) != 'undefined') {
            return $(elementId).val();
        }
        return '';
    }

    var searchProviders = function () {           
        var providerName = getElementValue('#home-search-provider-name');
        if (providerName == '') providerName = ' ';
        var selectedRanking = getSelectedElementValue('#home-search-ranking');
        var selectedNetwork = getSelectedElementValue('#home-search-network');

        var selectedCountryId = getSelectedElementValue('#home-search-country');
        var selectedCity = getSelectedElementText('#home-search-city');
        
        var selectedCategoryId = getSelectedElementValue('#home-search-category');
        var selectedSubCategoryId = getSelectedElementValue('#home-search-subcategory');
        var selectedSubCategoryOneId = getSelectedElementValue('#home-search-subcategoryone');
        var selectedSubCategoryTwoId = getSelectedElementValue('#home-search-subcategorytwo');
        var selectAccessmethodId = getSelectedElementValue('#home-search-accessmethod');
        var selectPreferred = getSelectedElementValue('#home-search-Preferred');
        
        var fullUrl = "api/Search/GetCount";
        
        $.ajax({
            url: fullUrl,
            type: 'GET',
            dataType: 'json',
            data: {
                Name: providerName, CountryName: "", CountryId: selectedCountryId, City: selectedCity, CategoryId: selectedCategoryId,
                SubCategoryId: selectedSubCategoryId, SubCategoryOneId: selectedSubCategoryOneId, SubCategoryTwoId: selectedSubCategoryTwoId,
                NetworkGroupId: selectedNetwork, RankingId: selectedRanking, AccessMethodId: selectAccessmethodId, ParentAgnets : selectPreferred
            },
            success: function (result) {
                $('#home-search-provider-count').text(result + " result" + (result>1?"s":""));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#home-search-provider-count').text("0 results");
            }

        });
    }

    $('#home-search-accessmethod').on("change", searchProviders);
    $('#home-search-provider-name').on("change", searchProviders);
    $('#home-search-ranking').on("change",
        function() {
            //if ($(this).val() == "") {
            //    $('#SearchTitle_Ranking').val("");
            //} else {
            //    $('#SearchTitle_Ranking').val($("#home-search-ranking option:selected").text());
            //}
            searchProviders();
        }
       );
    $('#home-search-network').on("change",
        function () {
            //if ($(this).val() == "") {
            //    $('#SearchTitle_CustomerGroup').val("");
            //} else {
            //    $('#SearchTitle_CustomerGroup').val($("#home-search-network option:selected").text());
            //}
            searchProviders(); 
        }
    );

    $('#home-search-city').on("change",
        function () {
            //if ($(this).val() == "") {
            //    $('#SearchTitle_City').val("");
            //} else {
            //    $('#SearchTitle_City').val($("#home-search-city option:selected").text());
            //}
            searchProviders();
        });
    $('#home-search-country').on("change", function () {
        //if ($(this).val() == "") {
        //    $('#SearchTitle_Country').val("");
        //} else {
        //    $('#SearchTitle_Country').val($("#home-search-country option:selected").text());
        //}
        searchProviders();
    });

    $('#home-search-category').on("change", function () {
        //if ($(this).val() == "") {
        //    $('#SearchTitle_Category').val("");
        //} else {
        //    $('#SearchTitle_Category').val($("#home-search-category option:selected").text());
        //}
        searchProviders();
    });
    $('#home-search-subcategory').on("change", function () {
        //if ($(this).val() == "") {
        //    $('#SearchTitle_SubCategory').val("");
        //} else {
        //    $('#SearchTitle_SubCategory').val($("#home-search-subcategory option:selected").text());
        //}
        searchProviders();
    });
    $('#home-search-subcategoryone').on("change", function () {
        //if ($(this).val() == "") {
        //    $('#SearchTitle_SubCategoryOne').val("");
        //} else {
        //    $('#SearchTitle_SubCategoryOne').val($("#home-search-subcategoryone option:selected").text());
        //}
        searchProviders();
    });
    $('#home-search-subcategorytwo').on("change", function () {
        //if ($(this).val() == "") {
        //    $('#SearchTitle_SubCategoryTwo').val("");
        //} else {
        //    $('#SearchTitle_SubCategoryTwo').val($("#home-search-subcategorytwo option:selected").text());
        //}
        searchProviders();
    });
    $('#home-search-Preferred').on("change", function () {     
        searchProviders();
    });    
    if (searchPhrase != null && searchPhrase != 'undefined') {
        $('#home-search-provider-name').val(searchPhrase);
    }
    if (selectedRanking != null && selectedRanking != 'undefined') {
        $('#home-search-ranking').val(selectedRanking);
    }
    if (selectedNetwork != null && selectedNetwork != 'undefined') {        
        $('#home-search-network').val(selectedNetwork);
    }
    if (selectedSpecialism != null && selectedSpecialism != 'undefined') {
        $('#home-search-specialism').val(selectedSpecialism);
    }

    if (selectaccessmethd != null && selectaccessmethd != 'undefined') {        
        $('#home-search-accessmethod').val(selectaccessmethd);
    }
    //if (selectaccesspred != null && selectaccesspred != 'undefined') {        
    //    $('#home-search-Preferred').val(selectaccesspred);
    //}
    $('#linkClearSearch').click(function () {

        viewModel.selectedCity(undefined);
        viewModel.cities([]);

        viewModel.selectedSubCategory(undefined);
        viewModel.selectedSubCategoryOne(undefined);
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategories([]);
        viewModel.subcategoryones([]);
        viewModel.subcategorytwos([]);
        viewModel.selectedCountry(undefined);
        viewModel.selectedCategory(undefined);
        viewModel.selectaccessmethods(undefined);

        $('#home-search-provider-name').val("");
        clearSelectList($('#home-search-ranking'));
        clearSelectList($('#home-search-network'));
        clearSelectList($('#home-search-specialism'));

        if ($('#linkAdvancedSearch').attr("class") != "collapsed") {
            $('#advanced-search-panel').collapse('hide');
        }
        searchProviders();
    });

});

var clearSelectList = function (objSelectList) {
    if (objSelectList == null || objSelectList == 'undefined') {
        return;
    }
    objSelectList.prop("selectedIndex", 0);
}