
class DataLoader {
    /**
     * Creates an instance of DataLoader.
     * @public
     */
    constructor() {
        this.each = null;
        this.prediction = null;
        this.stock_varation = {};
        this.celan_variation = {};
    }

    _loadPredict(container,url) {
      var process = function (thisInstance, response) {
          thisInstance.prediction = response;

          //console.log(response);
      }
      var callBack = function (thisInstance, response) {
          process(thisInstance, response);
      };
      $.ajax({
          type: "GET",
          url: url,
          async: false,
          dataType: 'json',
          success: function (response) {
              callBack(container, response);
          },
          error: function(status) {
            console.log(status);
          }
      });
    };

    _loadEach(container,url) {
      var process = function (thisInstance, response) {
          thisInstance.each = response;
      }
      var callBack = function (thisInstance, response) {
          process(thisInstance, response);
      };
      $.ajax({
          type: "GET",
          url: url,
          async: false,
          dataType: 'json',
          success: function (response) {
              callBack(container, response);
          },
          error: function(status) {
            console.log(status);
          }
      });
    };
    _loadStockVariation(container, url) {
        var process = function (thisInstance, response) {
            thisInstance.stock_varation = response;
        }
        var callBack = function (thisInstance, response) {
            process(thisInstance, response);
        };

        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                callBack(container, response);
            }
        });
    };

    _loadCelanVariation(container, url) {
        var process = function (thisInstance, response) {
            thisInstance.celan_variation = response;
        }
        var callBack = function (thisInstance, response) {
            process(thisInstance, response);
        };

        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "JSON",
            success: function (response) {
                callBack(container, response);
            }
        });
    };


    LoadPredict(url) {
      this._loadPredict(this,url);
    };
    LoadEach(url) {
      this._loadEach(this,url);
    };

    LoadStockVariation(url) {
        this._loadStockVariation(this, url);
    };

    LoadCelanVariation(url) {
        this._loadCelanVariation(this, url);
    };

    getStockVariation() {
        return this.stock_varation;
    };

    getCelanVariation() {
        return this.celan_variation;
    };

    getEach() {
      return this.each;
    };

    getPredict() {
      return this.prediction;
    };
}
