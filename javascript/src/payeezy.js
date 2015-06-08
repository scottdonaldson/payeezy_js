var Payeezy = function() {

    function creditCardType(number) {

        var types, type;

        types = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}$/
        };

        for (type in types) {
            if (types[type].test(number)) {
                return type;
            }
        }
    }

    function getData() {

        var output = [],
            inputs = document.getElementsByTagName('input'),
            selects = document.getElementsByTagName('select'),
            i,
            input,
            select,
            key;

        for (i = 0; i < inputs.length; i++) {
            input = inputs[i];
            key = input.getAttribute("payeezy-data");
            if (key) {
                output[key] = input.value;
            }
        }

        for (i = 0; i < selects.length; i++) {
            select = selects[i];
            key = select.getAttribute("payeezy-data");
            if (key) {
                output[key] = select.value
            }
        }

        return output;
    }

    return {
        createToken: function(cb) {

            this["clientCallback"] = cb;

            var baseURL, data, key, status, errorOutput, errors, url, script;

            baseURL = "api-cert.payeezy.com";

            // Retrieve and clean up data
            data = getData();
            for (key in data) {
                data[key] = encodeURIComponent(data[key]);
            }

            errorOutput = {};
            errors = [];

            if (!this.apikey) {
                status = 400;
                errors.push({
                    description: "Please set the API Key"
                });
            }
            if (!this.mercId) {
                status = 400;
                errors.push({
                    description: "Please set the Merchant Identifier"
                });
            }
            if (errors.length > 0) {
                errorOutput["error"] = {
                    messages: errors
                };
                cb(status, errorOutput);
                return false
            }

            url = "https://" + baseURL + "/v1/securitytokens?apikey=" + this.apikey + "&trtoken=" + this.mercId + "&callback=Payeezy.callback&type=payeezy&credit_card.type=" + data["card_type"] + "&credit_card.cardholder_name=" + data["cardholder_name"] + "&credit_card.card_number=" + data["cc_number"] + "&credit_card.exp_date=" + data["exp_month"] + data["exp_year"] + "&credit_card.cvv=" + data["cvv_code"];

            script = document.createElement("script");
            script.src = url;
            document.head.appendChild(script);
        },
        setApiKey: function(key) {
            this["apikey"] = key;
        },
        setMerchantIdentifier: function(id) {
            this["mercId"] = id;
        },
        callback: function(response) {
            this["clientCallback"](response.status, response.results);
        }
    };
}();
