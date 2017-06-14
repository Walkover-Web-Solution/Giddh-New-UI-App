module.exports = {
  getRandomString(firstString, secondString){
    firstString = this.removeSpecialCharacters(firstString);
    secondString = this.removeSpecialCharacters(secondString);
    let d = new Date;
    let dateString = d.getTime().toString();
    let randomGenerate = this.getSixCharRandom();
    let strings = [firstString, secondString, dateString, randomGenerate];
    return strings.join('');
  },

  removeSpecialCharacters(str) {
    let finalString = str.replace(/[^a-zA-Z0-9]/g, '');
    return finalString.substr(0, 6).toLowerCase();
  },

  getSixCharRandom() {
    return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
  }
};