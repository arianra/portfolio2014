'use strict';

!(function(_global, _factory){

  var $ = _global.jQuery || _global.$ || jQuery || $;

  _global.myPortfolio = _factory(_global, $, {});

}( window, function(_global, $, myPortfolio){

  myPortfolio.init = function(){

    $('#main-pages').fullpage({
      scrollingSpeed: 500,
      touchSensitivity: 25,
      scrollBar: true,
      navigation: true,
      fitToSection: false,
      autoScrolling: false,
      navigationTooltips: ['Hello', 'What I do', 'Projects', 'Contact'],
      anchors: ['Hello', 'Skills', 'Projects', 'Contact']
    });

    $('.section.contact').append( this.createRainbowHeader(17) );

    //list item rainbow gradient
    var $rainbowList = $('.skills .fa-li'),
        listRainbowColors = this.dirtyRainbow($rainbowList.length, 0);

    $rainbowList.each( function(i,v){
      $(this).css( 'color', listRainbowColors[i] );
    } );

    $.stellar({
      horizontalScrolling: false,
      verticalOffset: 40
    });


    return this;
  };

  myPortfolio.createRainbowHeader = function(colorAmount){
    var cLen = colorAmount || 12,
        rainbowArray = this.dirtyRainbow(cLen),
        $header = $('<header/>').addClass('rainbow'),
        i = -1;

    for( ; rainbowArray[++i] ; ){
      $('<div/>')
        .addClass('color-block')
        .css('background-color', rainbowArray[i])
        .css('width',''+(100/cLen)+'%')
        .appendTo($header);
    }

    return $header;
  };

  myPortfolio.dirtyRainbow = function(rainbowLength, r){
    var rLen = rainbowLength || 12,
        r = r || 0,
        m = Math,
        u = m.PI*2,
        v = m.cos,
        colorArray = [];

    var createColor = function( amount, r, colorArray ){
      if (!amount) {
        return colorArray;
      }

      r -= u/-50;
      colorArray.push( '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16) );

      return createColor( --amount, r, colorArray );
    };

    return createColor(rLen, r, colorArray);
  };

  return myPortfolio.init();
}));
