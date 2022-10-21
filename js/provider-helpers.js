function loadCitiesForProvider(countryId, city) {
    loadCities(countryId, "#Provider_Address_City", city);
}

function loadCities(countryId,targetSelector, city, nullValue, nullText) {
    console.log('loadCities',countryId, targetSelector, city);
    var procemessage = "<option value='0'> Please wait...</option>";
    $(targetSelector).html(procemessage).show();
    var url = "/City/ListByCountryId/";
    populateSelectList(url, { countryId: countryId }, targetSelector, city, nullValue, nullText);
}

function loadCitiesFromCountryName(countryName, targetSelector, city) {
    var procemessage = "<option value='0'> Please wait...</option>";
    $(targetSelector).html(procemessage).show();
    var url = "/City/ListByCountryName/";
   
    populateSelectList(url, { countryName: countryName }, targetSelector, city);
}

function populateSelectList(url, inputData, targetSelector, city, nullValue, nullText) {

    if (location.href.toLowerCase().indexOf('neoopticdev') > -1) {
        url = '/intaworlddev' + url;
    }

    $.ajax({
        url: url,
        data: inputData,
        cache: false,
        type: "POST",
        success: function (data) {

            // COMPAT : if nullvalue/text aren't specified fall back to these
            nullValue = nullValue ? nullValue : '';
            nullText = nullText ? nullText : 'Select City';

            // UNCOMPAT : allow no nullValue/Text by specifying 'x' for both!
            var markup = '';
            if (nullValue != 'x') {
                "<option value='" + nullValue + "'>" + nullText + "</option>";
            }

            if (city == null) {
                for (var x = 0; x < data.length; x++) {
                   
                    markup += '<option value="' + data[x].Value + '">' + data[x].Text + '</option>';
                }
            } else {
                city = city.toUpperCase();
                for (var x = 0; x < data.length; x++) {
                    if (city == data[x].Value.toUpperCase()) {
                        markup += '<option selected="selected" value="' + data[x].Value + '">' + data[x].Text + '</option>';

                    } else {
                         markup += '<option value="' + data[x].Value + '">' + data[x].Text + '</option>';
                    }
                }
            }

            $(targetSelector).html(markup).show();
        },
        error: function (reponse) {
            console.log("error : " , reponse);
        }
    });
}

