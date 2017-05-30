(function() {
  module.exports = {
    getRandomString: function(firstString, secondString) {
      var d, dateString, randomGenerate, strings;
      firstString = this.removeSpecialCharacters(firstString);
      secondString = this.removeSpecialCharacters(secondString);
      d = new Date;
      dateString = d.getTime().toString();
      randomGenerate = this.getSixCharRandom();
      strings = [firstString, secondString, dateString, randomGenerate];
      return strings.join('');
    },
    removeSpecialCharacters: function(str) {
      var finalString;
      finalString = str.replace(/[^a-zA-Z0-9]/g, '');
      return finalString.substr(0, 6).toLowerCase();
    },
    getSixCharRandom: function() {
      return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
    }
  };

}).call(this);
