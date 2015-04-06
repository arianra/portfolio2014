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
    var fpNav;

    $('#main-pages').fullpage({
      scrollingSpeed: 500,
      touchSensitivity: 25,
      scrollBar: true,
      navigation: true,
      fitToSection: false, // todo responsible for auto scrolling between pages
      autoScrolling: false,
      keyboardScrolling: true,
      navigationTooltips: ['Hello', 'What I offer', 'Experience', 'Contact'],
      anchors: ['hello', 'skills', 'projects', 'contact'],

      afterRender: function(e){
        fpNav = $('#fp-nav');

        $('.column-introduction').find('h1, h2, h3, p').addClass('run-anim');
      },
      afterLoad: function(anchorLink, index){
        fpNav.removeClass('hello skills projects contact').addClass(anchorLink);
      }

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
    myPortfolio.contactButton = myPortfolio.ContactSubmit();

    //myPortfolio.projectLoadOverlay = new myPortfolio.AnimateSvg( $('.pageload-overlay') );
    myPortfolio.projectSwither= new myPortfolio.ProjectSwitcher();

    return this;
  };

  myPortfolio.ProjectSwitcher = function(animatedOverlay){
    var currentProject,
        _self = this,
        leaders = $('.project-leader'),
        closeButtons = $('.close-project'),
        containers = $('.container'),
        firstPage = containers.filter('.leaders-page'),
        projectPages = containers.filter('.project-page');

    _self.animatedOverlay = animatedOverlay || new myPortfolio.AnimateSvg( $('.pageload-overlay') );

    $.extend( _self, {
      init: function(){
        _self.initListeners();

        return _self;
      },
      initListeners: function(){
        leaders.click(function(e){
          var projectAnchor = $(this).attr('data-project'),
              fillColor = getStyleRuleValue('background-color','.section.projects.'+projectAnchor);

          _self.showProject(projectAnchor, fillColor);
        });
        closeButtons.click(function(e){
          e.preventDefault();

          _self.closeProject();
        });
      },
      showProject: function(anchor, fillColor){
        _self.animatedOverlay.show(
          function(){
            var projectContainer = projectPages.filter('.' + anchor);
            currentProject = projectContainer;

            _self.switchPage(firstPage,projectContainer);
            _self.animatedOverlay.hide(undefined, fillColor);
          }, fillColor);
      },
      closeProject: function(){
        var fillColor = getStyleRuleValue('background-color','.section.projects');

        _self.animatedOverlay.show(function(){
          _self.switchPage( currentProject, firstPage );
          _self.animatedOverlay.hide(undefined, fillColor);
        },fillColor);
      },
      switchPage: function( from, to ){
        var f = ( from instanceof jQuery ) ? from : $(from),
            t = ( to instanceof jQuery ) ? to : $(to),
            section = $('.section.projects'),
            navBar = $('#fp-nav');

        f.addClass('hidden');
        t.removeClass('hidden');

        if(f.is(firstPage) && t.attr('data-project') ){
          section.addClass(t.attr('data-project'));
          navBar.css('display','none');
        }

        if(t.is(firstPage) && f.attr('data-project') ){
          section.removeClass(f.attr('data-project'));
          navBar.css('display',''); //$.show forces display block which interferes with css media queries
        }

        $.fn.fullpage.moveTo('projects');
        $.fn.fullpage.reBuild();
      }
    });

    return _self.init();
  };

  myPortfolio.AnimateSvg = function($el, options){
    var s, el, opt,
        _self = this;


    _self.element = el = $el;
    _self.options = opt = $.extend( {
      speedIn : 100,
      speedOut: 100,
      easeIn : mina.linear,
      easeOut: mina.linear,
      fill: '#fff'
    }, options );

    _self.scene = s = Snap( el.find('svg')[0] );
    _self.path = s.select( 'path' );
    _self.$path = $('.pageload-overlay svg path');
    _self.initialPath = _self.path.attr('d');

    _self.animateInSteps = el.attr('data-in').split(';');
    _self.animateOutSteps = el.attr('data-out').split(';');
    _self.isAnimating = false;

    _self.show = function( callback, fillColor ){
      var fill = fillColor || opt.fill;

      if ( _self.isAnimating ) {return !1;}
      _self.isAnimating = true;
      _self.$path.css('fill',fill);

      _self.runAnimation( true, function(){
        //onComplete callback
        _self.isAnimating = false;

        // todo removeclass show here and maybe boolean for show state, also initialpath or endpath for hide
        if(callback){callback();}
      });
      el.addClass('show');

    };
    _self.hide = function( callback, fillColor ){
      var fill = fillColor || opt.fill;

      _self.isAnimating = true;
      _self.$path.css('fill',fill);

      // todo perhaps stop old animation with path.stop, but shouldn't be necessary
      // todo start with addclass show and path set to endpath of animateInSteps (last in array, ~[4])

      _self.runAnimation( false, function(){
        //onComplete callback
        _self.path.attr( 'd', _self.initialPath );
        _self.isAnimating = false;
        el.removeClass('show');

        if(callback){callback();}
      });

    };

    _self.runAnimation = function( isAnimateIn, onComplete ){
      var step = 0,
          steps = (isAnimateIn) ? _self.animateInSteps : _self.animateOutSteps,
          stepsLength = steps.length,
          speed = (isAnimateIn) ? opt.speedIn : opt.speedOut,
          easeIn = (isAnimateIn) ? opt.easeIn : opt.easeOut;

      var runSteps = function(step){
        if( step === stepsLength ) {
          onComplete();
          return;
        }

        _self.path.animate( { 'path' : steps[step] }, speed, easeIn, function(){ runSteps(++step); } );
      };

      runSteps(step);
    };

    return _self;
  };

  myPortfolio.ContactSubmit = function(){
    var _self = this;

    $.extend( _self, {
      onSubmit: function(){
        var valid = _self.validateFields();

        $('.validate').each( function(){
          $(this).next('.validation-notification').toggleClass( 'hidden', !!$(this).hasClass('is-valid')  );
        });

        if( !valid ) {return;}

        $.ajax( 'contact.php', {
          method: 'POST',
          data: {
            email: $('input').val(),
            message: $('textarea').val()
          }
        }).done(function(data){
          _self.onResponse(data);
        }).fail(function(jqXHR){
          _self.errorHandler();
        });
      },
      onResponse: function(data){
        if('success' in data){
          _self.succesHandler();
          return;
        }
        _self.errorHandler();
      },
      errorHandler: function(){
        $('.send-notification.error').show();
      },
      succesHandler: function(){
        $('.send-notification.success').show();

        $('.validate')
          .val('')
          .removeClass('is-valid email-invalid required-invalid');
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

  function getStyleRuleValue(style, selector, sheet) {
    var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
    for (var i = 0, l = sheets.length; i < l; i++) {
      var sheet = sheets[i];
      if( !sheet.cssRules ) { continue; }
      for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
        var rule = sheet.cssRules[j];
        if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
          return rule.style[style];
        }
      }
    }
    return null;
  }

  return myPortfolio.init();
}));
