const { parseDependencies, stringifyObj, logObj } = require('./parseDependencies')

const code = `
var PaymentPagePackageView = require('components/paymentPagePackage/views/PaymentPagePackageView.js');
var PaymentPagePackageFeaturesInfoView = require('components/paymentPagePackage/views/PaymentPagePackageFeaturesInfoView.js');

var BaseModel = Backbone.Model.extend({
});

var MyModel = BaseModel.extend({
});

var FormattedMixin = {
  /**
   * @abstract
   */
  format: function () {}
};

var WebSocketApiMixin = {
};

var MyFormattedModel = MyModel.extend(_.extend({}, WebSocketApiMixin, FormatedMixin, Undef, {
  format: function () {
    return 42
  }
}));

var PaymentPagePackageSmsInfoView = PaymentPagePackageInfoView.extend({
    renderVodInfo: false,
});

export default BaseModel.extend({})
module.exports = BaseView.extend({})
`;

const expected = {
  "PaymentPagePackageSmsInfoView": [
    "PaymentPagePackageInfoView"
  ],
  "BaseModel": [
    "Backbone.Model"
  ],
  "MyModel": [
    "BaseModel"
  ],
  "MyFormattedModel": [
    "MyModel",
    "WebSocketApiMixin",
    "FormatedMixin",
    "Undef"
  ]
};

const actual = parseDependencies(code);
// logObj(actual)

// So called tests
console.assert(stringifyObj(actual) === stringifyObj(expected));
