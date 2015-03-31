'use strict';

!(function(_global, _factory){

  var $ = _global.jQuery || _global.$ || jQuery || $;

  if ( typeof define === 'function' && define.amd ) {
    define( ['jquery'], function($){
      _global.myPortfolio = _factory(_global, $, {});
    });
  } else {
    _global.myPortfolio = _factory(_global, $, {});
  }

}( (typeof window !== 'undefined') ? window : this, function(_global, $, myPortfolio){

  myPortfolio.init = function(){

    $('#main-pages').fullpage({
      scrollingSpeed: 500,
      touchSensitivity: 25,
      scrollBar: true,
      navigation: true,
      fitToSection: false,
      autoScrolling: false,
      navigationTooltips: ['Hello', 'What I do', 'Experience', 'Contact'],
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

    myPortfolio.validateContactForm();
    myPortfolio.contactButton = myPortfolio.contactSubmit();

    myPortfolio.projectLoadOverlay = new myPortfolio.animateSvg( $('.pageload-overlay') );

    return this;
  };

  myPortfolio.animateSvg = function($el, options){
    var s, el, opt,
        _self = this;


    _self.element = el = $el;
    _self.options = opt = $.extend( {
      speed : 200,
      easeIn : mina.linear
    }, options );

    _self.scene = s = Snap( el.find('svg')[0] );
    _self.path = s.select( 'path' );
    _self.initialPath = _self.path.attr('d');

    _self.animateInSteps = el.attr('data-in').split(';');
    _self.isAnimating = false;

    _self.show = function(){

      if ( _self.isAnimating ) {return !1;}
      _self.isAnimating = true;

      _self.runAnimation( function(){
        _self.path.attr( 'd', _self.initialPath );
        _self.isAnimating = false;
      });
      el.addClass('show');

    };
    _self.hide = function(){

    };

    _self.runAnimation = function( onComplete ){
      var step = 0,
          steps = _self.animateInSteps,
          stepsLength = steps.length,
          speed = opt.speed,
          easeIn = opt.easeIn;

      var runSteps = function(step){
        if( step === stepsLength ) {
          onComplete();
          //_self.path.stop();
          return;
        }

        _self.path.animate( { 'path' : steps[step] }, speed, easeIn, function(){ runSteps(++step); } );
      };

      runSteps(step);
    };

    return _self;
  };

  myPortfolio.contactSubmit = function(){
    var _self = this;

    $.extend( _self, {
      onSubmit: function(){
        var valid = _self.validateFields();

        $('.validate').each( function(){
          $(this).next('.validation-notification').toggleClass( 'hidden', !!$(this).hasClass('is-valid')  );
        });

        if( !valid ) {return;}

        $.ajax( 'contact.php', {
          data: {
            email: $('input').val(),
            message: $('textarea').val()
          }
        }).done(function(data){
          console.log(data);
        });

        //TEMPORARY
        _self.succesHandler();
      },
      onResponse: function(){},
      errorHandler: function(){},
      succesHandler: function(){

        $('.validate').val('').removeClass('is-valid email-invalid required-invalid');
      },
      validateFields: function(){
        var fields = $('.validate'),
            valid = true;

        if( fields.length < 1 ) {return false;}

        fields.each( function(){
          if(!valid) {return;}
          valid = ($(this).hasClass('is-valid')) ? true : false;
        });

        return valid;
      }
    });

    $('.contact-send').click(_self.onSubmit);
  };

  myPortfolio.validateContactForm = function(){

    var _self = this;

    var _validateEmail = function(input){
      var emailRegEx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return emailRegEx.test( input );
    };

    var _validateRequired = function(input){
      return input.length > 0;
    };

    var fields = $.map($('.validate'), function(el){
      var $el = $(el),
        parameters = [];

      if( $el.hasClass('validate-email') ) {parameters.push({ invalid: 'email-invalid', func: _validateEmail});}
      if( $el.hasClass('validate-required') ) {parameters.push({invalid: 'required-invalid' , func: _validateRequired});}

      $el.removeClass('validate-email validate-required');

      if( parameters.length < 1 ) {return;}

      return {
        element: $el,
        parameters: parameters,
        firstFocus: true,
        valid: false
      };
    });

    $.each( fields, function(){
      var _self = this,
          el = _self.element,
          v = _self.valid,
          f = _self.firstFocus,
          p = _self.parameters;

      var quickValidation = function(){
        v = true;

        $.each( p, function(){
          var vp = this.func(el.val());
          v = ( !v ) ? false : vp;

          el.toggleClass(this.invalid, !vp );
          el.toggleClass('is-valid', !!v );

        });

        if(v){
          el.next('.validation-notification').addClass('hidden');
        }

        return v;
      };

      el.focusout( function(){
        f = false;

        quickValidation();
      });

      el.on('input', function(){
        if( f ) { return; }

        quickValidation();
      });

    });

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