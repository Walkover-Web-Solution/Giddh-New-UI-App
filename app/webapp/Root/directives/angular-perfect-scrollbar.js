angular.module('perfect_scrollbar', []).directive('perfectScrollbar', [
  '$parse',
  '$window',
  function($parse, $window) {
    let psOptions = [
      'wheelSpeed',
      'wheelPropagation',
      'minScrollbarLength',
      'useBothWheelAxes',
      'useKeyboard',
      'suppressScrollX',
      'suppressScrollY',
      'scrollXMarginOffset',
      'scrollYMarginOffset',
      'includePadding'
    ];
    return {
    restrict: 'EA',
    transclude: true,
    template: '<div><div ng-transclude></div></div>',
    replace: true,
    link($scope, $elem, $attr) {
      let jqWindow = angular.element($window);
      let options = {};
      let update = function(event) {
        $scope.$evalAsync(function() {
          if (($attr.scrollDown === 'true') && (event !== 'mouseenter')) {
            setTimeout((function() {
              $($elem).scrollTop($($elem).prop('scrollHeight'));
            }), 100);
          }
          $elem.perfectScrollbar('update');
        });
      };

      let i = 0;
      let l = psOptions.length;
      while (i < l) {
        let opt = psOptions[i];
        if ($attr[opt] !== undefined) {
          options[opt] = $parse($attr[opt])();
        }
        i++;
      }
      options.wheelSpeed = 20;
      $scope.$evalAsync(function(event){
        $elem.perfectScrollbar(options);
        let onScrollHandler = $parse($attr.onScroll);
        $elem.scroll(function(event){
          let scrollTop = $elem.scrollTop();
          let scrollHeight = $elem.prop('scrollHeight') - $elem.height();
          $scope.$apply(function() {
            onScrollHandler($scope, {
              event,
              scrollTop,
              scrollHeight
            }
            );
          });
        });
      });
      // This is necessary when you don't watch anything with the scrollbar
      $elem.bind('mouseenter', update('mouseenter'));
      // Possible future improvement - check the type here and use the appropriate watch for non-arrays
      if ($attr.refreshOnChange) {
        $scope.$watchCollection($attr.refreshOnChange, function() {
          update();
        });
      }
      // this is from a pull request - I am not totally sure what the original issue is but seems harmless
      if ($attr.refreshOnResize) {
        jqWindow.on('resize', update);
      }
      $elem.bind('$destroy', function() {
        jqWindow.off('resize', update);
        $elem.perfectScrollbar('destroy');
      });
    }

    };
  }
]);
