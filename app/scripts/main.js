'use strict';

!(function(_global, _factory){

  var $ = _global.jQuery || _global.$ || jQuery || $;

  _global.myPortfolio = _factory(_global, $, {});

}( window, function(_global, $, myPortfolio){

  myPortfolio.init = function(){

    $('#main-pages').fullpage({
      scrollingSpeed: 500
    });

    return this;
  };

  return myPortfolio.init();
}));
