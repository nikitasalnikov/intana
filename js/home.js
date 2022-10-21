
function getSelectData(url, callback) {    
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            callback(null, data);
        },
        dataType: "json"
    });
}

var searchLookupViewModel = function (categories) {

    this.selectedCountry = ko.observable();
    this.selectedCity = ko.observable();
    
    this.countries = ko.observableArray();
    this.cities = ko.observableArray();

    /// Add New function of Access Method and Preffer Route
    this.selectAccessmethods = ko.observable();
    this.selectPreferred = ko.observable();    
    this.accessmethods = ko.observableArray();
    this.preferred = ko.observableArray();

    this.selectAccessmethods.subscribe(function (AccessmethodId) {              
        if (AccessmethodId != AccessIds) {
            viewModel.selectPreferred(undefined);            
        }
        else if (AccessmethodId == AccessIds && AccessmethodId==null) {
            viewModel.selectAccessmethods(undefined);
        }        
    }.bind(this));

    this.selectPreferred.subscribe(function (AccessmethodId) {
        
        if (AccessmethodId == null || AccessmethodId == AccessIds) {            
            viewModel.selectPreferred(undefined);
        }
    }.bind(this));
    //End

    this.selectedCountry.subscribe(function (countryId) {        
        viewModel.selectedCity(undefined);
        viewModel.cities([]);
        if (countryId != null) {
            getSelectData("Country/GetCities/" + countryId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.cities(data);                
                if (viewModel.defaults.city !== null) {
                    viewModel.selectedCity(viewModel.defaults.city);
                    viewModel.defaults.city = null;
                }
            });
        }
    }.bind(this));


    this.selectedCategory = ko.observable();
    this.selectedSubCategory = ko.observable();
    this.selectedSubCategoryOne = ko.observable();
    this.selectedSubCategoryTwo = ko.observable();
    this.categories = ko.observableArray();
    this.subcategories = ko.observableArray();
    this.subcategoryones = ko.observableArray();
    this.subcategorytwos = ko.observableArray();

    this.selectedCategory.subscribe(function (categoryId) {
        viewModel.selectedSubCategory(undefined);
        viewModel.selectedSubCategoryOne(undefined);
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategories([]);
        viewModel.subcategoryones([]);
        viewModel.subcategorytwos([]);
        if (categoryId != null) {
            getSelectData("Category/CategorySubCategories/" + categoryId, function (err, data) {
                if (err)
                { alert(err); return; }
                
                viewModel.subcategories(data);
                
                if (viewModel.defaults.selectedSubCategory !== null) {
                    viewModel.selectedSubCategory(viewModel.defaults.selectedSubCategory);
                    viewModel.defaults.selectedSubCategory = null;
                }
            });
        }
    }.bind(this));

    this.selectedSubCategory.subscribe(function (subCategoryId) {
        viewModel.selectedSubCategoryOne(undefined);
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategoryones([]);
        viewModel.subcategorytwos([]);
        if (subCategoryId != null) {
            getSelectData("Category/SubCategorySubCategoryOnes/" + subCategoryId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.subcategoryones(data);
                if (viewModel.defaults.selectedSubCategoryOne !== null) {
                    viewModel.selectedSubCategoryOne(viewModel.defaults.selectedSubCategoryOne);
                    viewModel.defaults.selectedSubCategoryOne = null;
                }
            });
        }
    }.bind(this));

    this.selectedSubCategoryOne.subscribe(function (subCategoryOneId) {
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategorytwos([]);
        if (subCategoryOneId != null) {
            getSelectData("Category/SubCategoryOneSubCategoryTwos/" + subCategoryOneId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.subcategorytwos(data);
                if (viewModel.defaults.selectedSubCategoryTwo !== null) {
                    viewModel.selectedSubCategoryTwo(viewModel.defaults.selectedSubCategoryTwo);
                    viewModel.defaults.selectedSubCategoryTwo = null;
                }
            });
        }
    }.bind(this));

    this.defaults = {};
    this.setDefaults = function (value) {
        this.defaults = value;
    }
    this.setCaptionStyling = function (option, item) {
        //if (item == 'undefined') {
        //   option.
        //}
        
        //ko.applyBindingsToNode(option, { disable: item.disable }, item);
    }
}





