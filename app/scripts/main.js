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
      //scrollOverflow: true,
      autoScrolling: false,
      navigationTooltips: ['Hello', 'Skills', 'Projects', 'Contact'],
      anchors: ['Hello', 'Skills', 'Projects', 'Contact'],
      sectionsColor: [ '#00B4FF', '#FFFFFF', '#262626', '#CCF390']
    });

    $('.section.contact').append( this.createRainbowHeader(17) );

    //list item rainbow gradient
    var $rainbowList = $('.skills .fa-li'),
        listRainbowColors = this.dirtyRainbow($rainbowList.length);

    $rainbowList.each( function(i,v){
      $(this).css( 'color', listRainbowColors[i] );
    } );

    $.stellar({
      horizontalScrolling: false,
      verticalOffset: 40
    });


    return this;
  };

  myPortfolio.createRainbowHeader = function(arrLen){
    var arrayLength = arrLen || 12,
        rainbowArray = this.dirtyRainbow(arrayLength),
        $header = $('<header/>').addClass('rainbow');

    for( var i = arrayLength; --i >= 0 ; ){
      $('<div/>')
        .addClass('color-block')
        .css('background-color', rainbowArray[i])
        .css('width',''+(100/arrayLength)+'%')
        .appendTo($header);
    }

    return $header;
  };

  myPortfolio.dirtyRainbow = function(arrayLength){
    var arrayLength = arrayLength || 12,
        m = Math,
        r = 0,
        u = m.PI* 2,
        v = m.cos,
        colorArray = [];

    for( var i = arrayLength; --i >= 0 ; ){
      r -= u/-50;
      colorArray.push( '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16) );
    }

    return colorArray;
  };

  return myPortfolio.init();
}));
