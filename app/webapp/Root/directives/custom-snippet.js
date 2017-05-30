angular.module('custom_snippet_giddh', [])
  .filter('propsFilter', () =>
    function(items, props) {
      let out = [];
      if (angular.isArray(items)) {
        let keys = Object.keys(props);
        items.forEach(function(item) {
          let itemMatches = false;
          let i = 0;
          while (i < keys.length) {
            let prop = keys[i];
            let text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
            i++;
          }
          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }
      return out;
    }
).filter('hilite', function($sce){
    let escapeRegexp = queryToEscape => (`${queryToEscape}`).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    return function(matchItem, query) {
      if (query && matchItem) {
        let str = $sce.trustAsHtml('<span class="ui-select-hilite">$&</span>');
        return (`${matchItem}`).replace(new RegExp(escapeRegexp(query), 'gi'), str); 
      } else { 
        return matchItem;
      }
    };
});
