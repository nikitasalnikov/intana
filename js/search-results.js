
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
      
    this.selectedCategory = ko.observable();
    this.selectedSubCategory = ko.observable();
    this.selectedSubCategoryOne = ko.observable();
    this.selectedSubCategoryTwo = ko.observable();
    this.selectedCountry = ko.observable();
    this.selectedCity = ko.observable();
    
    
    this.categories = ko.observableArray();
    this.subcategories = ko.observableArray();
    this.subcategoryones = ko.observableArray();
    this.subcategorytwos = ko.observableArray(); 
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
        else if (AccessmethodId == null) {
            viewModel.selectAccessmethods(undefined);
        }
    }.bind(this));

    this.selectPreferred.subscribe(function (AccessmethodId) {
        if (AccessmethodId == null || AccessmethodId == AccessIds) {
            viewModel.selectPreferred(undefined);
        }
    }.bind(this));
    ///End

    this.selectedCountry.subscribe(function (countryId) {        
        viewModel.selectedCity(undefined);
       
        viewModel.cities([]);
        
        if (countryId != null) {
            getSelectData("../Country/GetCities/" + countryId, function (err, data) {
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

    this.selectedCategory.subscribe(function (categoryId) {
        viewModel.selectedSubCategory(undefined);
        viewModel.selectedSubCategoryOne(undefined);
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategories([]);
        viewModel.subcategoryones([]);
        viewModel.subcategorytwos([]);
        if (categoryId != null) {
            getSelectData("../Category/CategorySubCategories/" + categoryId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.subcategories(data);
                if (viewModel.defaults.subcategory !== null) {
                    viewModel.selectedSubCategory(viewModel.defaults.subcategory);
                    viewModel.defaults.subcategory = null;
                    //alert(values.subcategoryone);
                    //alert(values.subcategorytwo);
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
            getSelectData("../Category/SubCategorySubCategoryOnes/" + subCategoryId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.subcategoryones(data);

                if (viewModel.defaults.subcategoryone !== null) {
                    viewModel.selectedSubCategoryOne(viewModel.defaults.subcategoryone);
                    viewModel.defaults.subcategoryone = null; 
                }
            });
        }
    }.bind(this));
     
    this.selectedSubCategoryOne.subscribe(function (subCategoryOneId) { 
        viewModel.selectedSubCategoryTwo(undefined);
        viewModel.subcategorytwos([]);
        if (subCategoryOneId != null) {
            getSelectData("../Category/SubCategoryOneSubCategoryTwos/" + subCategoryOneId, function (err, data) {
                if (err)
                { alert(err); return; }
                viewModel.subcategorytwos(data);
                if (viewModel.defaults.subcategorytwo !== null) {
                    viewModel.selectedSubCategoryTwo(viewModel.defaults.subcategorytwo);
                    viewModel.defaults.subcategorytwo = null;
                }
            });
        }
    }.bind(this));

    this.defaults = {};

    this.setDefaults = function (value) {        
        this.defaults = value;
        if (this.defaults.category !== null) {
            this.selectedCategory(this.defaults.category);
            this.defaults.category = null;
        }
        if (this.defaults.country !== null) {
            this.selectedCountry(this.defaults.country);
            this.defaults.country = null;
        }
        if (this.defaults.accessmethods !== null) {            
            this.selectAccessmethods(this.defaults.accessmethods);
            this.defaults.accessmethods = null;
        }
        if (this.defaults.preferred !== null) {
            this.selectPreferred(this.defaults.preferred);
            this.defaults.country = null;
        }}
}
