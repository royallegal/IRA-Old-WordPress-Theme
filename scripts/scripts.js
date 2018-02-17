;(function ($) {
function getMorePosts(offset, posts_per_page, category){
  return $.ajax({
    type: 'POST',
    url: '/wp-admin/admin-ajax.php',
    data: {
      category: category,
      offset: offset,
      posts_per_page: posts_per_page,
      action: 'rls_more_posts'
    },
    error: function () {
        console.log("error");
    }
  });
}
function royal_article() {
    // Responsive iFrames
    /* $('iframe').wrap('<div class="video-container"></div>');*/

    // Parallax
    if ($('.parallax-container').length) {
        console.log('PARALLAX');
        var featured = $('.featured-image .parallax');
        var promotion = $('.promotion-image .parallax');

        if (featured.length && promotion.length) {
            console.log('BOTH');
            featured.parallax();
            promotion.parallax();
        }
        else if (featured.length) {
            console.log('FEATURED');
            featured.parallax();
        }
        else if (promotion.length) {
            console.log('PROMOTIO');
            promotion.parallax();
        }
        else {
            console.log('ELSE');
            $('.parallax').parallax();
        }
    }
}

function royal_consultation() {
    $('nav').addClass('no-shadow');
}

function royal_contact() {
    // Submission
    $('form').submit(function(e) {
        e.preventDefault();
        var first   = $("#first").val();
        var last    = $("#last").val();
        var phone   = $("#phone").val();
        var email   = $("#email").val();
        var message = $("#message").val();
        var submit  = $("button[type='submit']");
        var circles = $(".preloader-wrapper").parent();
        var confirm = $(".confirm");

        // Removes existing validation
        confirm.removeClass('pink green').addClass('hide').find('p').remove();
        $('.invalid, .valid').removeClass('invalid valid');

        // Validation
        if (first == "" || last == "" || phone == "" || email == "") {
            confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like we're missing some information. Please fill out all the fields.</p>");
        }

        else {
            // Toggle Preloader
            submit.addClass('hide');
            circles.removeClass('hide');

            $.ajax({
                type: 'POST',
                url: "/wp-admin/admin-ajax.php",
                data: {
                    action: 'contact_us_form',
                    first: first,
                    last: last,
                    phone: phone,
                    email: email,
                    message: message.replace(/(?:\r\n|\r|\n)/g, '<br/>'),
                },

                success: function(data) {
                    if (data == "0") {
                        // Error message
                        confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like there was a problem! Check back later or email us directly at <a href='mailto:scott@royallegalsolutions.com'>scott@royallegalsolutions.com</a>.</p>");
                    }
                    else {
                        // Success message
                        confirm.addClass('green').removeClass('hide').html("<p>Success! Check your email. We'll be in touch shortly.</p>");
                    }
                },

                error: function(err) {
                    // Error message
                    confirm.addClass('pink').removeClass('hide').html("<p>Oops, looks like there was a problem! Check back later or email us directly at <a href='mailto:scott@royallegalsolutions.com'>scott@royallegalsolutions.com</a>.</p>");
                },

                complete: function(res) {
                    $('form')[0].reset();
                    Materialize.updateTextFields();
                    $('form textarea').trigger('autoresize');

                    // Toggle Preloader
                    circles.addClass('hide');
                    submit.removeClass('hide');
                }
            });
        }
    });
}

function royal_filterPosts() {
    $('#search').change(function() {
        var filter = $(this).val();

        // Extend :contains selector
        jQuery.expr[':'].contains = function(a, i, m) {
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };

        // Hides cards that don't match input
        $("#feed .content .card-container:visible article .card-title a:not(:contains("+filter+"))").closest('.card-container').fadeOut();

        // Shows cards that match input
        $("#feed .content .card-container:not(:visible) article .card-title a:contains("+filter+")").closest('.card-container').fadeIn();

        // Add empty message when if no posts are visible
        var message = $('#feed #no-results');
        if ($("#feed .content .card-container:visible article .card-title a:contains("+filter+")").size() == 0) {
            if (message.hasClass('hide')) {
                setTimeout(function() {
                    $('#feed #no-results').removeClass('hide');
                }, 400);
            }
            message.find('.target').text(filter);
        } else { message.addClass('hide'); }

    }).keyup(function() {
        $(this).change();
    });
}

function royal_login() {
    $('#login-modal').modal();

    // Chooses which of the three modal forms to display
    $('#login-modal a').click(function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        royal_showForm(target);
    });

    // Submits AJAX call & loader, closes on completion
    $('#login-modal input[type=submit]').click(function(e) {
        var form = $(this).find('form');
        var action = $(form).attr('action');

        if (action == "login") {
            royal_ajaxLogin();
        }
        else if (action == "register") {
            royal_ajaxRegister();
        }
        else if (action == "reset") {
            royal_ajaxReset();
        }
        else {
            // error
            // use "classes/email.php" to send an error notification to swedy13@gmail.com
            // only send email if an error occurs on the production site
            // if (is_wpe()) { ...send password }
        }
    });
}


function royal_showLoginField(target) {
    $('#login-modal .row').addClass('hide');
    $(target).removeClass('hide');
}


function royal_ajaxLogin(form) {
    // If (login validation == "successful") {
    //     AJAX login call here...
    // }
}




$("#loginCall, .btn-loginform").click(function () {
    //alert('working...');
    $('#register-hd').hide();
    $('#register-popup').hide();
    $('#forgot-hd').hide();
    $('#forgot_password-popup').hide();

    $('#login-hd').fadeIn();
    $('#login-popup').fadeIn();
});

$("#signupCall, #signupCall2").click(function () {
    $('#login-hd').hide();
    $('#login-popup').hide();
    $('#forgot-hd').hide();
    $('#forgot_password-popup').hide();

    $('#register-hd').fadeIn();
    $('#register-popup').fadeIn();
});

$("#forgotCall").click(function () {
    $('#register-hd').hide();
    $('#register-popup').hide();
    $('#login-hd').hide();
    $('#login-popup').hide();

    $('#forgot-hd').fadeIn();
    $('#forgot_password-popup').fadeIn();
});

// Perform AJAX login/register on form submit
$('form#login-popup, form#register-popup').on('submit', function (e) {
    if (!$(this).valid()) return false;
    $('p.status', this).show().text(ajax_auth_object.loadingmessage);
    action = 'ajaxlogin';
    username =  $('form#login-popup #username').val();
    password = $('form#login-popup #password').val();
    email = '';
    security = $('form#login-popup #security').val();
    if ($(this).attr('id') == 'register-popup') {
        action = 'ajaxregister';
        username = $('#signonname').val();
        password = $('#signonpassword').val();
        email = $('#email').val();
        security = $('#signonsecurity').val();  
    }  
    ctrl = $(this);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajax_auth_object.ajaxurl,
        data: {
            'action': action,
            'username': username,
            'password': password,
            'email': email,
            'security': security
        },
        success: function (data) {
            $('p.status', ctrl).text(data.message);
            if (data.loggedin == true) {
                document.location.href = ajax_auth_object.redirecturl;
            }
        }
    });
    e.preventDefault();
});

// Perform AJAX forget password on form submit
$('form#forgot_password-popup').on('submit', function(e){
    if (!$(this).valid()) return false;
    $('p.status', this).show().text(ajax_auth_object.loadingmessage);
    ctrl = $(this);
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajax_auth_object.ajaxurl,
        data: { 
            'action': 'ajaxforgotpassword', 
            'user_login': $('#user_login').val(), 
            'security': $('#forgotsecurity').val(), 
        },
        success: function(data){                    
            $('p.status',ctrl).text(data.message);              
        }
    });
    e.preventDefault();
    return false;
});

// Client side form validation
if (jQuery("#register-popup").length) 
    jQuery("#register-popup").validate(
        {rules:{
            password2:{ equalTo:'#signonpassword' 
            }   
        }}
    );
else if (jQuery("#login-popup").length) 
    jQuery("#login-popup").validate();
if(jQuery('#forgot_password-popup').length)
    jQuery('#forgot_password-popup').validate();

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.Macy=n()}(this,function(){"use strict";function t(t,n){var e=void 0;return function(){e&&clearTimeout(e),e=setTimeout(t,n)}}function n(t,n){for(var e=t.length,o=e,r=[];e--;)r.push(n(t[o-e-1]));return r}function e(t,n){A(t,n,arguments.length>2&&void 0!==arguments[2]&&arguments[2])}function o(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=0;s<o.length;s++){var a=parseInt(o[s],10);r>=a&&(i=n.breakAt[a],O(i,e))}return e}function r(t){for(var n=t.options,e=t.responsiveOptions,o=t.keys,r=t.docWidth,i=void 0,s=o.length-1;s>=0;s--){var a=parseInt(o[s],10);r<=a&&(i=n.breakAt[a],O(i,e))}return e}function i(t){var n=document.body.clientWidth,e={columns:t.columns};L(t.margin)?e.margin={x:t.margin.x,y:t.margin.y}:e.margin={x:t.margin,y:t.margin};var i=Object.keys(t.breakAt);return t.mobileFirst?o({options:t,responsiveOptions:e,keys:i,docWidth:n}):r({options:t,responsiveOptions:e,keys:i,docWidth:n})}function s(t){return i(t).columns}function a(t){return i(t).margin}function c(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=s(t),o=a(t).x,r=100/e;return n?1===e?"100%":(o=(e-1)*o/e,"calc("+r+"% - "+o+"px)"):r}function u(t,n){var e=s(t.options),o=0,r=void 0,i=void 0;return 1===++n?0:(i=a(t.options).x,r=(i-(e-1)*i/e)*(n-1),o+=c(t.options,!1)*(n-1),"calc("+o+"% + "+r+"px)")}function l(t){var n=0,e=t.container;m(t.rows,function(t){n=t>n?t:n}),e.style.height=n+"px"}function p(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){var e=0,r=parseInt(n.offsetHeight,10);isNaN(r)||(t.rows.forEach(function(n,o){n<t.rows[e]&&(e=o)}),n.style.position="absolute",n.style.top=t.rows[e]+"px",n.style.left=""+t.cols[e],t.rows[e]+=isNaN(r)?0:r+i,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}function h(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],r=s(t.options),i=a(t.options).y;C(t,r,e),m(n,function(n){t.lastcol===r&&(t.lastcol=0);var e=M(n,"height");e=parseInt(n.offsetHeight,10),isNaN(e)||(n.style.position="absolute",n.style.top=t.rows[t.lastcol]+"px",n.style.left=""+t.cols[t.lastcol],t.rows[t.lastcol]+=isNaN(e)?0:e+i,t.lastcol+=1,o&&(n.dataset.macyComplete=1))}),o&&(t.tmpRows=null),l(t)}var f=function t(n,e){if(!(this instanceof t))return new t(n,e);if(n=n.replace(/^\s*/,"").replace(/\s*$/,""),e)return this.byCss(n,e);for(var o in this.selectors)if(e=o.split("/"),new RegExp(e[1],e[2]).test(n))return this.selectors[o](n);return this.byCss(n)};f.prototype.byCss=function(t,n){return(n||document).querySelectorAll(t)},f.prototype.selectors={},f.prototype.selectors[/^\.[\w\-]+$/]=function(t){return document.getElementsByClassName(t.substring(1))},f.prototype.selectors[/^\w+$/]=function(t){return document.getElementsByTagName(t)},f.prototype.selectors[/^\#[\w\-]+$/]=function(t){return document.getElementById(t.substring(1))};var m=function(t,n){for(var e=t.length,o=e;e--;)n(t[o-e-1])},v=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.running=!1,this.events=[],this.add(t)};v.prototype.run=function(){if(!this.running&&this.events.length>0){var t=this.events.shift();this.running=!0,t(),this.running=!1,this.run()}},v.prototype.add=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return!!n&&(Array.isArray(n)?m(n,function(n){return t.add(n)}):(this.events.push(n),void this.run()))},v.prototype.clear=function(){this.events=[]};var d=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.instance=t,this.data=n,this},g=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.events={},this.instance=t};g.prototype.on=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return!(!t||!n)&&(Array.isArray(this.events[t])||(this.events[t]=[]),this.events[t].push(n))},g.prototype.emit=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!t||!Array.isArray(this.events[t]))return!1;var e=new d(this.instance,n);m(this.events[t],function(t){return t(e)})};var y=function(t){return!("naturalHeight"in t&&t.naturalHeight+t.naturalWidth===0)||t.width+t.height!==0},E=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return new Promise(function(t,e){if(n.complete)return y(n)?t(n):e(n);n.addEventListener("load",function(){return y(n)?t(n):e(n)}),n.addEventListener("error",function(){return e(n)})}).then(function(n){e&&t.emit(t.constants.EVENT_IMAGE_LOAD,{img:n})}).catch(function(n){return t.emit(t.constants.EVENT_IMAGE_ERROR,{img:n})})},w=function(t,e){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return n(e,function(n){return E(t,n,o)})},A=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Promise.all(w(t,n,e)).then(function(){t.emit(t.constants.EVENT_IMAGE_COMPLETE)})},I=function(n){return t(function(){n.emit(n.constants.EVENT_RESIZE),n.queue.add(function(){return n.recalculate(!0,!0)})},100)},N=function(t){if(t.container=f(t.options.container),t.container instanceof f||!t.container)return!!t.options.debug&&console.error("Error: Container not found");delete t.options.container,t.container.length&&(t.container=t.container[0]),t.container.style.position="relative"},T=function(t){t.queue=new v,t.events=new g(t),t.rows=[],t.resizer=I(t)},b=function(t){var n=f("img",t.container);window.addEventListener("resize",t.resizer),t.on(t.constants.EVENT_IMAGE_LOAD,function(){return t.recalculate(!1,!1)}),t.on(t.constants.EVENT_IMAGE_COMPLETE,function(){return t.recalculate(!0,!0)}),t.options.useOwnImageLoader||e(t,n,!t.options.waitForImages),t.emit(t.constants.EVENT_INITIALIZED)},_=function(t){N(t),T(t),b(t)},L=function(t){return t===Object(t)&&"[object Array]"!==Object.prototype.toString.call(t)},O=function(t,n){L(t)||(n.columns=t),L(t)&&t.columns&&(n.columns=t.columns),L(t)&&t.margin&&!L(t.margin)&&(n.margin={x:t.margin,y:t.margin}),L(t)&&t.margin&&L(t.margin)&&t.margin.x&&(n.margin.x=t.margin.x),L(t)&&t.margin&&L(t.margin)&&t.margin.y&&(n.margin.y=t.margin.y)},M=function(t,n){return window.getComputedStyle(t,null).getPropertyValue(n)},C=function(t,n){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t.lastcol||(t.lastcol=0),t.rows.length<1&&(e=!0),e){t.rows=[],t.cols=[],t.lastcol=0;for(var o=n-1;o>=0;o--)t.rows[o]=0,t.cols[o]=u(t,o)}else if(t.tmpRows){t.rows=[];for(var o=n-1;o>=0;o--)t.rows[o]=t.tmpRows[o]}else{t.tmpRows=[];for(var o=n-1;o>=0;o--)t.tmpRows[o]=t.rows[o]}},V=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=n?t.container.children:f(':scope > *:not([data-macy-complete="1"])',t.container),r=c(t.options);return m(o,function(t){n&&(t.dataset.macyComplete=0),t.style.width=r}),t.options.trueOrder?(h(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED)):(p(t,o,n,e),t.emit(t.constants.EVENT_RECALCULATED))},R=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},x={columns:4,margin:2,trueOrder:!1,waitForImages:!1,useImageLoader:!0,breakAt:{},useOwnImageLoader:!1,onInit:!1};!function(){try{document.createElement("a").querySelector(":scope *")}catch(t){!function(){function t(t){return function(e){if(e&&n.test(e)){var o=this.getAttribute("id");o||(this.id="q"+Math.floor(9e6*Math.random())+1e6),arguments[0]=e.replace(n,"#"+this.id);var r=t.apply(this,arguments);return null===o?this.removeAttribute("id"):o||(this.id=o),r}return t.apply(this,arguments)}}var n=/:scope\b/gi,e=t(Element.prototype.querySelector);Element.prototype.querySelector=function(t){return e.apply(this,arguments)};var o=t(Element.prototype.querySelectorAll);Element.prototype.querySelectorAll=function(t){return o.apply(this,arguments)}}()}}();var q=function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x;if(!(this instanceof t))return new t(n);this.options={},R(this.options,x,n),_(this)};return q.init=function(t){return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "),new q(t)},q.prototype.recalculateOnImageLoad=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return e(this,f("img",this.container),!t)},q.prototype.runOnImageLoad=function(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=f("img",this.container);return this.on(this.constants.EVENT_IMAGE_COMPLETE,t),n&&this.on(this.constants.EVENT_IMAGE_LOAD,t),e(this,o,n)},q.prototype.recalculate=function(){var t=this,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return e&&this.queue.clear(),this.queue.add(function(){return V(t,n,e)})},q.prototype.remove=function(){window.removeEventListener("resize",this.resizer),m(this.container.children,function(t){t.removeAttribute("data-macy-complete"),t.removeAttribute("style")}),this.container.removeAttribute("style")},q.prototype.reInit=function(){this.recalculate(!0,!0),this.emit(this.constants.EVENT_INITIALIZED),window.addEventListener("resize",this.resizer),this.container.style.position="relative"},q.prototype.on=function(t,n){this.events.on(t,n)},q.prototype.emit=function(t,n){this.events.emit(t,n)},q.constants={EVENT_INITIALIZED:"macy.initialized",EVENT_RECALCULATED:"macy.recalculated",EVENT_IMAGE_LOAD:"macy.image.load",EVENT_IMAGE_ERROR:"macy.image.error",EVENT_IMAGE_COMPLETE:"macy.images.complete",EVENT_RESIZE:"macy.resize"},q.prototype.constants=q.constants,q});

function royal_menus() {
    // Mobile Menu
    $("#mobile-menu").sideNav({
        menuWidth: 260,
        edge: 'right'
    });


    // Dropdowns
    $("nav .dropdown-button").dropdown({
        constrainWidth: false
    });


    // Hero Displays
    if ($('.hero-container, .parallax-container').length) {
        $('nav').addClass('transparent');
    }
}


function royal_toggle_menus(top) {
    if (top > 5 && $('nav').hasClass('transparent')) {
        $('nav').removeClass('transparent');
    }
    else if (top < 5 && !$('nav').hasClass('transparent')) {
        $('nav').addClass('transparent');
    }
}

function royal_modals() {

    function autoplay(video) {
        video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    function autostop(video) {
        video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }

    // Home Page Video
    if ($('#home').length > 0) {
        var video = document.getElementById("player");
        $('.modal').modal({
            ready: function(modal) {
                if ($(modal).hasClass('video')) {
                    autoplay(video);
                }
            },
            complete: function(modal) {
                if ($(modal).hasClass('video')) {
                    autostop(video);
                }
            }
        });
    }


    // Blog Videos
    if ($('#feed').length > 0) {
        $('.modal').modal({
            ready: function(modal) {
                var $modal = $(modal);
                var videoSrc = $modal.data('video-src');
                var $iframe = $modal.find('iframe');

                if($iframe && !$iframe.attr('src')){
                    $iframe.attr('src', videoSrc + "?enablejsapi=1&showinfo=0")
                    $iframe.on('load', function(){
                        autoplay(this);
                    })
                }else{
                    autoplay($iframe.get(0));
                }
            },
            complete: function(modal) {
                var $modal = $(modal);
                var $iframe = $modal.find('iframe');
                autostop($iframe.get(0));
            }
        })
    }
}

// Moves the WooCommerce notice to the top of the page
function royal_moveNotice() {
    $('.notice').each(function() {
        $(this).prependTo($('main'));
    });
}


// Moves newly added WooCommerce cart notices to the top of the page
function royal_refreshCartNotice() {
    var cartLoop = setInterval(function() {
        if ($('main .container .notice').length > 0) {
            royal_moveNotice();
            clearInterval(cartLoop);
        }
    }, 250);
}

function royal_quiz() {

    // Asset Protection Quiz
    if ($('#asset-protection-quiz').length) {
        // Materialize carousel settings
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators:true
        });

        // Questions panel display & navigation
        $('.toggle-section').hide();
        $('.btn-quiz-toggle').unbind('click').bind('click',function(){
            $('.toggle-section').slideToggle('fast',function(){
                if($('.toggle-section').css('display')=='block'){
                    $('.btn-quiz-toggle').html("CLOSE QUIZ");
                    $('.btn-quiz-toggle').addClass("close");
                }else{
                    $('.btn-quiz-toggle').html("TAKE THE QUIZ");
                    $('.btn-quiz-toggle').removeClass("close");
                }
            });
        });

        // Results & email
        // Code goes here...
    }

}

$(document).ready(function() {
    'use strict';

    // ---- GLOBAL ---- //
    royal_menus();
    royal_login();


    // ---- GENERAL ---- //
    if($.fn.parallax && $('.parallax').length){
        $('.parallax').parallax();
    }
    console.log("asdasd")
    if($.fn.carousel && $('.carousel-slider').length){
        console.log("gogogo")
        $('.carousel-slider').carousel({
            duration: 350,
            fullWidth: true
        });
    } 


    // ---- MOBILE ---- //


    // ---- LANDING PAGES ---- //
    if ($('#home').length) {
        $('.carousel-slider').carousel({
            duration: 350,
            fullWidth: true
        });
        setTimeout(autoplay, 9000);
        function autoplay() {
            $('.carousel-slider').carousel('next');
            setTimeout(autoplay, 12000);
        }
    }


    // ---- PROMOTIONS ---- //
    if ($('.modal-trigger').length) {
        royal_modals();
    }
    /* if ($('.quiz').length){
     *     royal_quiz();
     * }*/


    // ---- WOOCOMMERCE ---- //
    if ($('body.woocommerce').length) {
        royal_woocommerce();
    }


    // ---- BLOG ---- //
    if ($('#feed').length) {
        $('.carousel.carousel-slider').carousel({fullWidth: true});
        var columns =  $('#feed .col').first().hasClass('m9') ? 3 : 4;
        var $msnry = $('.masonry').masonry( {
            itemSelector: 'article',
            percentPosition: true,
            fitWidth: true,
            hiddenStyle: {
              transform: 'translateY(100px)',
              opacity: 0
            },
            visibleStyle: {
              transform: 'translateY(0px)',
              opacity: 1
            }
          });

        //button to load more posts via ajax
        $('[data-load-more-posts]').on('click', function(){
            var $this = $(this);
            $this.data('active-text', $this.text()).text("Loading posts...").attr('disabled', true);
            var offset = $this.data("offset");
            var postsPerPage = $this.data("posts-per-page");
            getMorePosts(offset, postsPerPage).then(function(res){
                var $res = $(res);
                $msnry.append( $res ).masonry( 'appended', $res );
                var newOffset = offset+postsPerPage;
                var newParams = '?offset='+ newOffset;
                window.history.pushState({urlPath:newParams},"",newParams)
                $this.data("offset",newOffset);
                $this.text($this.data('active-text')).attr('disabled', false);
            })
        })

        $('[data-toggle-sidebar]').on('click', function(){
            $msnry.masonry('layout', true)
            $('#feed .col').first().toggleClass('m9').toggleClass('m12');
            $('#feed .col').last().toggleClass('collapsed');
            setTimeout(function(){
                $msnry.masonry('layout', true)
            }, 400)
        })

        royal_filterPosts();
    }
    if ($('main#article').length > 0) {
        royal_article();
    }
});

/* $(window).resize(function() {
 *     if ($('.my-account').length) {
 *     }
 * })*/

var didScroll;
$(window).scroll(function(){
    didScroll = true;
    var top = $(window).scrollTop();

    if ($('.hero-container, .parallax-container').length) {
        royal_toggle_menus(top);
    }

    if ($('.consultation').length > 0) {
        var hero = $('.hero-container').height();
        if (top > hero && $('nav').hasClass('no-shadow')) {
            $('nav').removeClass('no-shadow');
        }
        else if (top < hero && !$('nav').hasClass('no-shadow')) {
            $('nav').addClass('no-shadow');
        }
    }
});

setInterval(function() {
    if (didScroll) {
        /* toggleNav();*/
        didScroll = false;
    }
}, 250);


function royal_woocommerce() {

    // ---- Notices ---- //
    if ($('.notice').length > 0) {
        royal_moveNotice();
    }
    $(document.body).on('updated_cart_totals', function() {
        royal_moveNotice();
    });

    // ---- Products ---- //
    if ($('main#product').length > 0) {
        $('select').material_select();
    }

    // ---- Cart ---- //
    if ($('.woocommerce-cart-form').length > 0) {
        $('.product-remove a').click(function() {
            royal_refreshCartNotice();
        });
    }

    // ---- Checkout ----- //
    /* $('#payment [type=radio]').click(function() {
     *     console.log('click');
     * });*/
}

<<<<<<< HEAD
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJhcnRpY2xlLmpzIiwiY29uc3VsdGF0aW9uLmpzIiwiY29udGFjdC5qcyIsImZpbHRlclBvc3RzLmpzIiwibG9naW4uanMiLCJtYXNvbnJ5LmpzIiwibWVudXMuanMiLCJtb2RhbHMuanMiLCJub3RpY2UuanMiLCJxdWl6LmpzIiwicmVhZHkuanMiLCJyZXNpemUuanMiLCJzY3JvbGwuanMiLCJ2YWxpZGF0ZS5qcyIsIndvb2NvbW1lcmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZ2V0TW9yZVBvc3RzKG9mZnNldCwgcG9zdHNfcGVyX3BhZ2UsIGNhdGVnb3J5KXtcbiAgcmV0dXJuICQuYWpheCh7XG4gICAgdHlwZTogJ1BPU1QnLFxuICAgIHVybDogJy93cC1hZG1pbi9hZG1pbi1hamF4LnBocCcsXG4gICAgZGF0YToge1xuICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5LFxuICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICBwb3N0c19wZXJfcGFnZTogcG9zdHNfcGVyX3BhZ2UsXG4gICAgICBhY3Rpb246ICdybHNfbW9yZV9wb3N0cydcbiAgICB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XG4gICAgfVxuICB9KTtcbn0iLCJmdW5jdGlvbiByb3lhbF9hcnRpY2xlKCkge1xuICAgIC8vIFJlc3BvbnNpdmUgaUZyYW1lc1xuICAgIC8qICQoJ2lmcmFtZScpLndyYXAoJzxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48L2Rpdj4nKTsqL1xuXG4gICAgLy8gUGFyYWxsYXhcbiAgICBpZiAoJCgnLnBhcmFsbGF4LWNvbnRhaW5lcicpLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmxvZygnUEFSQUxMQVgnKTtcbiAgICAgICAgdmFyIGZlYXR1cmVkID0gJCgnLmZlYXR1cmVkLWltYWdlIC5wYXJhbGxheCcpO1xuICAgICAgICB2YXIgcHJvbW90aW9uID0gJCgnLnByb21vdGlvbi1pbWFnZSAucGFyYWxsYXgnKTtcblxuICAgICAgICBpZiAoZmVhdHVyZWQubGVuZ3RoICYmIHByb21vdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCT1RIJyk7XG4gICAgICAgICAgICBmZWF0dXJlZC5wYXJhbGxheCgpO1xuICAgICAgICAgICAgcHJvbW90aW9uLnBhcmFsbGF4KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmVhdHVyZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRkVBVFVSRUQnKTtcbiAgICAgICAgICAgIGZlYXR1cmVkLnBhcmFsbGF4KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocHJvbW90aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BST01PVElPJyk7XG4gICAgICAgICAgICBwcm9tb3Rpb24ucGFyYWxsYXgoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFTFNFJyk7XG4gICAgICAgICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZnVuY3Rpb24gcm95YWxfY29uc3VsdGF0aW9uKCkge1xuICAgICQoJ25hdicpLmFkZENsYXNzKCduby1zaGFkb3cnKTtcbn1cbiIsImZ1bmN0aW9uIHJveWFsX2NvbnRhY3QoKSB7XG4gICAgLy8gU3VibWlzc2lvblxuICAgICQoJ2Zvcm0nKS5zdWJtaXQoZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBmaXJzdCAgID0gJChcIiNmaXJzdFwiKS52YWwoKTtcbiAgICAgICAgdmFyIGxhc3QgICAgPSAkKFwiI2xhc3RcIikudmFsKCk7XG4gICAgICAgIHZhciBwaG9uZSAgID0gJChcIiNwaG9uZVwiKS52YWwoKTtcbiAgICAgICAgdmFyIGVtYWlsICAgPSAkKFwiI2VtYWlsXCIpLnZhbCgpO1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoXCIjbWVzc2FnZVwiKS52YWwoKTtcbiAgICAgICAgdmFyIHN1Ym1pdCAgPSAkKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpO1xuICAgICAgICB2YXIgY2lyY2xlcyA9ICQoXCIucHJlbG9hZGVyLXdyYXBwZXJcIikucGFyZW50KCk7XG4gICAgICAgIHZhciBjb25maXJtID0gJChcIi5jb25maXJtXCIpO1xuXG4gICAgICAgIC8vIFJlbW92ZXMgZXhpc3RpbmcgdmFsaWRhdGlvblxuICAgICAgICBjb25maXJtLnJlbW92ZUNsYXNzKCdwaW5rIGdyZWVuJykuYWRkQ2xhc3MoJ2hpZGUnKS5maW5kKCdwJykucmVtb3ZlKCk7XG4gICAgICAgICQoJy5pbnZhbGlkLCAudmFsaWQnKS5yZW1vdmVDbGFzcygnaW52YWxpZCB2YWxpZCcpO1xuXG4gICAgICAgIC8vIFZhbGlkYXRpb25cbiAgICAgICAgaWYgKGZpcnN0ID09IFwiXCIgfHwgbGFzdCA9PSBcIlwiIHx8IHBob25lID09IFwiXCIgfHwgZW1haWwgPT0gXCJcIikge1xuICAgICAgICAgICAgY29uZmlybS5hZGRDbGFzcygncGluaycpLnJlbW92ZUNsYXNzKCdoaWRlJykuaHRtbChcIjxwPk9vcHMsIGxvb2tzIGxpa2Ugd2UncmUgbWlzc2luZyBzb21lIGluZm9ybWF0aW9uLiBQbGVhc2UgZmlsbCBvdXQgYWxsIHRoZSBmaWVsZHMuPC9wPlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVG9nZ2xlIFByZWxvYWRlclxuICAgICAgICAgICAgc3VibWl0LmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICBjaXJjbGVzLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogXCIvd3AtYWRtaW4vYWRtaW4tYWpheC5waHBcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2NvbnRhY3RfdXNfZm9ybScsXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiBmaXJzdCxcbiAgICAgICAgICAgICAgICAgICAgbGFzdDogbGFzdCxcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICc8YnIvPicpLFxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ2dyZWVuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+U3VjY2VzcyEgQ2hlY2sgeW91ciBlbWFpbC4gV2UnbGwgYmUgaW4gdG91Y2ggc2hvcnRseS48L3A+XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtISBDaGVjayBiYWNrIGxhdGVyIG9yIGVtYWlsIHVzIGRpcmVjdGx5IGF0IDxhIGhyZWY9J21haWx0bzpzY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbSc+c2NvdHRAcm95YWxsZWdhbHNvbHV0aW9ucy5jb208L2E+LjwvcD5cIik7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybScpWzBdLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIE1hdGVyaWFsaXplLnVwZGF0ZVRleHRGaWVsZHMoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybSB0ZXh0YXJlYScpLnRyaWdnZXIoJ2F1dG9yZXNpemUnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUb2dnbGUgUHJlbG9hZGVyXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZXMuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0LnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImZ1bmN0aW9uIHJveWFsX2ZpbHRlclBvc3RzKCkge1xuICAgICQoJyNzZWFyY2gnKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmaWx0ZXIgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICAgIC8vIEV4dGVuZCA6Y29udGFpbnMgc2VsZWN0b3JcbiAgICAgICAgalF1ZXJ5LmV4cHJbJzonXS5jb250YWlucyA9IGZ1bmN0aW9uKGEsIGksIG0pIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkoYSkudGV4dCgpLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihtWzNdLnRvVXBwZXJDYXNlKCkpID49IDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSGlkZXMgY2FyZHMgdGhhdCBkb24ndCBtYXRjaCBpbnB1dFxuICAgICAgICAkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOnZpc2libGUgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOm5vdCg6Y29udGFpbnMoXCIrZmlsdGVyK1wiKSlcIikuY2xvc2VzdCgnLmNhcmQtY29udGFpbmVyJykuZmFkZU91dCgpO1xuXG4gICAgICAgIC8vIFNob3dzIGNhcmRzIHRoYXQgbWF0Y2ggaW5wdXRcbiAgICAgICAgJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjpub3QoOnZpc2libGUpIGFydGljbGUgLmNhcmQtdGl0bGUgYTpjb250YWlucyhcIitmaWx0ZXIrXCIpXCIpLmNsb3Nlc3QoJy5jYXJkLWNvbnRhaW5lcicpLmZhZGVJbigpO1xuXG4gICAgICAgIC8vIEFkZCBlbXB0eSBtZXNzYWdlIHdoZW4gaWYgbm8gcG9zdHMgYXJlIHZpc2libGVcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAkKCcjZmVlZCAjbm8tcmVzdWx0cycpO1xuICAgICAgICBpZiAoJChcIiNmZWVkIC5jb250ZW50IC5jYXJkLWNvbnRhaW5lcjp2aXNpYmxlIGFydGljbGUgLmNhcmQtdGl0bGUgYTpjb250YWlucyhcIitmaWx0ZXIrXCIpXCIpLnNpemUoKSA9PSAwKSB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS5oYXNDbGFzcygnaGlkZScpKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWQgI25vLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgICAgICAgICAgICAgIH0sIDQwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlLmZpbmQoJy50YXJnZXQnKS50ZXh0KGZpbHRlcik7XG4gICAgICAgIH0gZWxzZSB7IG1lc3NhZ2UuYWRkQ2xhc3MoJ2hpZGUnKTsgfVxuXG4gICAgfSkua2V5dXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykuY2hhbmdlKCk7XG4gICAgfSk7XG59XG4iLCJmdW5jdGlvbiByb3lhbF9sb2dpbigpIHtcbiAgICAkKCcjbG9naW4tbW9kYWwnKS5tb2RhbCgpO1xuXG4gICAgLy8gQ2hvb3NlcyB3aGljaCBvZiB0aGUgdGhyZWUgbW9kYWwgZm9ybXMgdG8gZGlzcGxheVxuICAgICQoJyNsb2dpbi1tb2RhbCBhJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgcm95YWxfc2hvd0Zvcm0odGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIC8vIFN1Ym1pdHMgQUpBWCBjYWxsICYgbG9hZGVyLCBjbG9zZXMgb24gY29tcGxldGlvblxuICAgICQoJyNsb2dpbi1tb2RhbCBpbnB1dFt0eXBlPXN1Ym1pdF0nKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBmb3JtID0gJCh0aGlzKS5maW5kKCdmb3JtJyk7XG4gICAgICAgIHZhciBhY3Rpb24gPSAkKGZvcm0pLmF0dHIoJ2FjdGlvbicpO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJsb2dpblwiKSB7XG4gICAgICAgICAgICByb3lhbF9hamF4TG9naW4oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZWdpc3RlclwiKSB7XG4gICAgICAgICAgICByb3lhbF9hamF4UmVnaXN0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZXNldFwiKSB7XG4gICAgICAgICAgICByb3lhbF9hamF4UmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVycm9yXG4gICAgICAgICAgICAvLyB1c2UgXCJjbGFzc2VzL2VtYWlsLnBocFwiIHRvIHNlbmQgYW4gZXJyb3Igbm90aWZpY2F0aW9uIHRvIHN3ZWR5MTNAZ21haWwuY29tXG4gICAgICAgICAgICAvLyBvbmx5IHNlbmQgZW1haWwgaWYgYW4gZXJyb3Igb2NjdXJzIG9uIHRoZSBwcm9kdWN0aW9uIHNpdGVcbiAgICAgICAgICAgIC8vIGlmIChpc193cGUoKSkgeyAuLi5zZW5kIHBhc3N3b3JkIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIHJveWFsX3Nob3dMb2dpbkZpZWxkKHRhcmdldCkge1xuICAgICQoJyNsb2dpbi1tb2RhbCAucm93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAkKHRhcmdldCkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbn1cblxuXG5mdW5jdGlvbiByb3lhbF9hamF4TG9naW4oZm9ybSkge1xuICAgIC8vIElmIChsb2dpbiB2YWxpZGF0aW9uID09IFwic3VjY2Vzc2Z1bFwiKSB7XG4gICAgLy8gICAgIEFKQVggbG9naW4gY2FsbCBoZXJlLi4uXG4gICAgLy8gfVxufVxuXG5cblxuXG4kKFwiI2xvZ2luQ2FsbCwgLmJ0bi1sb2dpbmZvcm1cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgIC8vYWxlcnQoJ3dvcmtpbmcuLi4nKTtcbiAgICAkKCcjcmVnaXN0ZXItaGQnKS5oaWRlKCk7XG4gICAgJCgnI3JlZ2lzdGVyLXBvcHVwJykuaGlkZSgpO1xuICAgICQoJyNmb3Jnb3QtaGQnKS5oaWRlKCk7XG4gICAgJCgnI2ZvcmdvdF9wYXNzd29yZC1wb3B1cCcpLmhpZGUoKTtcblxuICAgICQoJyNsb2dpbi1oZCcpLmZhZGVJbigpO1xuICAgICQoJyNsb2dpbi1wb3B1cCcpLmZhZGVJbigpO1xufSk7XG5cbiQoXCIjc2lnbnVwQ2FsbCwgI3NpZ251cENhbGwyXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjbG9naW4taGQnKS5oaWRlKCk7XG4gICAgJCgnI2xvZ2luLXBvcHVwJykuaGlkZSgpO1xuICAgICQoJyNmb3Jnb3QtaGQnKS5oaWRlKCk7XG4gICAgJCgnI2ZvcmdvdF9wYXNzd29yZC1wb3B1cCcpLmhpZGUoKTtcblxuICAgICQoJyNyZWdpc3Rlci1oZCcpLmZhZGVJbigpO1xuICAgICQoJyNyZWdpc3Rlci1wb3B1cCcpLmZhZGVJbigpO1xufSk7XG5cbiQoXCIjZm9yZ290Q2FsbFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgJCgnI3JlZ2lzdGVyLWhkJykuaGlkZSgpO1xuICAgICQoJyNyZWdpc3Rlci1wb3B1cCcpLmhpZGUoKTtcbiAgICAkKCcjbG9naW4taGQnKS5oaWRlKCk7XG4gICAgJCgnI2xvZ2luLXBvcHVwJykuaGlkZSgpO1xuXG4gICAgJCgnI2ZvcmdvdC1oZCcpLmZhZGVJbigpO1xuICAgICQoJyNmb3Jnb3RfcGFzc3dvcmQtcG9wdXAnKS5mYWRlSW4oKTtcbn0pO1xuXG4vLyBQZXJmb3JtIEFKQVggbG9naW4vcmVnaXN0ZXIgb24gZm9ybSBzdWJtaXRcbiQoJ2Zvcm0jbG9naW4tcG9wdXAsIGZvcm0jcmVnaXN0ZXItcG9wdXAnKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoISQodGhpcykudmFsaWQoKSkgcmV0dXJuIGZhbHNlO1xuICAgICQoJ3Auc3RhdHVzJywgdGhpcykuc2hvdygpLnRleHQoYWpheF9hdXRoX29iamVjdC5sb2FkaW5nbWVzc2FnZSk7XG4gICAgYWN0aW9uID0gJ2FqYXhsb2dpbic7XG4gICAgdXNlcm5hbWUgPSAgJCgnZm9ybSNsb2dpbi1wb3B1cCAjdXNlcm5hbWUnKS52YWwoKTtcbiAgICBwYXNzd29yZCA9ICQoJ2Zvcm0jbG9naW4tcG9wdXAgI3Bhc3N3b3JkJykudmFsKCk7XG4gICAgZW1haWwgPSAnJztcbiAgICBzZWN1cml0eSA9ICQoJ2Zvcm0jbG9naW4tcG9wdXAgI3NlY3VyaXR5JykudmFsKCk7XG4gICAgaWYgKCQodGhpcykuYXR0cignaWQnKSA9PSAncmVnaXN0ZXItcG9wdXAnKSB7XG4gICAgICAgIGFjdGlvbiA9ICdhamF4cmVnaXN0ZXInO1xuICAgICAgICB1c2VybmFtZSA9ICQoJyNzaWdub25uYW1lJykudmFsKCk7XG4gICAgICAgIHBhc3N3b3JkID0gJCgnI3NpZ25vbnBhc3N3b3JkJykudmFsKCk7XG4gICAgICAgIGVtYWlsID0gJCgnI2VtYWlsJykudmFsKCk7XG4gICAgICAgIHNlY3VyaXR5ID0gJCgnI3NpZ25vbnNlY3VyaXR5JykudmFsKCk7ICBcbiAgICB9ICBcbiAgICBjdHJsID0gJCh0aGlzKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogYWpheF9hdXRoX29iamVjdC5hamF4dXJsLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAnYWN0aW9uJzogYWN0aW9uLFxuICAgICAgICAgICAgJ3VzZXJuYW1lJzogdXNlcm5hbWUsXG4gICAgICAgICAgICAncGFzc3dvcmQnOiBwYXNzd29yZCxcbiAgICAgICAgICAgICdlbWFpbCc6IGVtYWlsLFxuICAgICAgICAgICAgJ3NlY3VyaXR5Jzogc2VjdXJpdHlcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICQoJ3Auc3RhdHVzJywgY3RybCkudGV4dChkYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgICAgaWYgKGRhdGEubG9nZ2VkaW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBhamF4X2F1dGhfb2JqZWN0LnJlZGlyZWN0dXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIFBlcmZvcm0gQUpBWCBmb3JnZXQgcGFzc3dvcmQgb24gZm9ybSBzdWJtaXRcbiQoJ2Zvcm0jZm9yZ290X3Bhc3N3b3JkLXBvcHVwJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpe1xuICAgIGlmICghJCh0aGlzKS52YWxpZCgpKSByZXR1cm4gZmFsc2U7XG4gICAgJCgncC5zdGF0dXMnLCB0aGlzKS5zaG93KCkudGV4dChhamF4X2F1dGhfb2JqZWN0LmxvYWRpbmdtZXNzYWdlKTtcbiAgICBjdHJsID0gJCh0aGlzKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogYWpheF9hdXRoX29iamVjdC5hamF4dXJsLFxuICAgICAgICBkYXRhOiB7IFxuICAgICAgICAgICAgJ2FjdGlvbic6ICdhamF4Zm9yZ290cGFzc3dvcmQnLCBcbiAgICAgICAgICAgICd1c2VyX2xvZ2luJzogJCgnI3VzZXJfbG9naW4nKS52YWwoKSwgXG4gICAgICAgICAgICAnc2VjdXJpdHknOiAkKCcjZm9yZ290c2VjdXJpdHknKS52YWwoKSwgXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpeyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCdwLnN0YXR1cycsY3RybCkudGV4dChkYXRhLm1lc3NhZ2UpOyAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbi8vIENsaWVudCBzaWRlIGZvcm0gdmFsaWRhdGlvblxuaWYgKGpRdWVyeShcIiNyZWdpc3Rlci1wb3B1cFwiKS5sZW5ndGgpIFxuICAgIGpRdWVyeShcIiNyZWdpc3Rlci1wb3B1cFwiKS52YWxpZGF0ZShcbiAgICAgICAge3J1bGVzOntcbiAgICAgICAgICAgIHBhc3N3b3JkMjp7IGVxdWFsVG86JyNzaWdub25wYXNzd29yZCcgXG4gICAgICAgICAgICB9ICAgXG4gICAgICAgIH19XG4gICAgKTtcbmVsc2UgaWYgKGpRdWVyeShcIiNsb2dpbi1wb3B1cFwiKS5sZW5ndGgpIFxuICAgIGpRdWVyeShcIiNsb2dpbi1wb3B1cFwiKS52YWxpZGF0ZSgpO1xuaWYoalF1ZXJ5KCcjZm9yZ290X3Bhc3N3b3JkLXBvcHVwJykubGVuZ3RoKVxuICAgIGpRdWVyeSgnI2ZvcmdvdF9wYXNzd29yZC1wb3B1cCcpLnZhbGlkYXRlKCk7XG4iLCIhZnVuY3Rpb24odCxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1uKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShuKTp0Lk1hY3k9bigpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdCh0LG4pe3ZhciBlPXZvaWQgMDtyZXR1cm4gZnVuY3Rpb24oKXtlJiZjbGVhclRpbWVvdXQoZSksZT1zZXRUaW1lb3V0KHQsbil9fWZ1bmN0aW9uIG4odCxuKXtmb3IodmFyIGU9dC5sZW5ndGgsbz1lLHI9W107ZS0tOylyLnB1c2gobih0W28tZS0xXSkpO3JldHVybiByfWZ1bmN0aW9uIGUodCxuKXtBKHQsbixhcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdKX1mdW5jdGlvbiBvKHQpe2Zvcih2YXIgbj10Lm9wdGlvbnMsZT10LnJlc3BvbnNpdmVPcHRpb25zLG89dC5rZXlzLHI9dC5kb2NXaWR0aCxpPXZvaWQgMCxzPTA7czxvLmxlbmd0aDtzKyspe3ZhciBhPXBhcnNlSW50KG9bc10sMTApO3I+PWEmJihpPW4uYnJlYWtBdFthXSxPKGksZSkpfXJldHVybiBlfWZ1bmN0aW9uIHIodCl7Zm9yKHZhciBuPXQub3B0aW9ucyxlPXQucmVzcG9uc2l2ZU9wdGlvbnMsbz10LmtleXMscj10LmRvY1dpZHRoLGk9dm9pZCAwLHM9by5sZW5ndGgtMTtzPj0wO3MtLSl7dmFyIGE9cGFyc2VJbnQob1tzXSwxMCk7cjw9YSYmKGk9bi5icmVha0F0W2FdLE8oaSxlKSl9cmV0dXJuIGV9ZnVuY3Rpb24gaSh0KXt2YXIgbj1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLGU9e2NvbHVtbnM6dC5jb2x1bW5zfTtMKHQubWFyZ2luKT9lLm1hcmdpbj17eDp0Lm1hcmdpbi54LHk6dC5tYXJnaW4ueX06ZS5tYXJnaW49e3g6dC5tYXJnaW4seTp0Lm1hcmdpbn07dmFyIGk9T2JqZWN0LmtleXModC5icmVha0F0KTtyZXR1cm4gdC5tb2JpbGVGaXJzdD9vKHtvcHRpb25zOnQscmVzcG9uc2l2ZU9wdGlvbnM6ZSxrZXlzOmksZG9jV2lkdGg6bn0pOnIoe29wdGlvbnM6dCxyZXNwb25zaXZlT3B0aW9uczplLGtleXM6aSxkb2NXaWR0aDpufSl9ZnVuY3Rpb24gcyh0KXtyZXR1cm4gaSh0KS5jb2x1bW5zfWZ1bmN0aW9uIGEodCl7cmV0dXJuIGkodCkubWFyZ2lufWZ1bmN0aW9uIGModCl7dmFyIG49IShhcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXSl8fGFyZ3VtZW50c1sxXSxlPXModCksbz1hKHQpLngscj0xMDAvZTtyZXR1cm4gbj8xPT09ZT9cIjEwMCVcIjoobz0oZS0xKSpvL2UsXCJjYWxjKFwiK3IrXCIlIC0gXCIrbytcInB4KVwiKTpyfWZ1bmN0aW9uIHUodCxuKXt2YXIgZT1zKHQub3B0aW9ucyksbz0wLHI9dm9pZCAwLGk9dm9pZCAwO3JldHVybiAxPT09KytuPzA6KGk9YSh0Lm9wdGlvbnMpLngscj0oaS0oZS0xKSppL2UpKihuLTEpLG8rPWModC5vcHRpb25zLCExKSoobi0xKSxcImNhbGMoXCIrbytcIiUgKyBcIityK1wicHgpXCIpfWZ1bmN0aW9uIGwodCl7dmFyIG49MCxlPXQuY29udGFpbmVyO20odC5yb3dzLGZ1bmN0aW9uKHQpe249dD5uP3Q6bn0pLGUuc3R5bGUuaGVpZ2h0PW4rXCJweFwifWZ1bmN0aW9uIHAodCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdLG89IShhcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXSl8fGFyZ3VtZW50c1szXSxyPXModC5vcHRpb25zKSxpPWEodC5vcHRpb25zKS55O0ModCxyLGUpLG0obixmdW5jdGlvbihuKXt2YXIgZT0wLHI9cGFyc2VJbnQobi5vZmZzZXRIZWlnaHQsMTApO2lzTmFOKHIpfHwodC5yb3dzLmZvckVhY2goZnVuY3Rpb24obixvKXtuPHQucm93c1tlXSYmKGU9byl9KSxuLnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIixuLnN0eWxlLnRvcD10LnJvd3NbZV0rXCJweFwiLG4uc3R5bGUubGVmdD1cIlwiK3QuY29sc1tlXSx0LnJvd3NbZV0rPWlzTmFOKHIpPzA6citpLG8mJihuLmRhdGFzZXQubWFjeUNvbXBsZXRlPTEpKX0pLG8mJih0LnRtcFJvd3M9bnVsbCksbCh0KX1mdW5jdGlvbiBoKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXSxvPSEoYXJndW1lbnRzLmxlbmd0aD4zJiZ2b2lkIDAhPT1hcmd1bWVudHNbM10pfHxhcmd1bWVudHNbM10scj1zKHQub3B0aW9ucyksaT1hKHQub3B0aW9ucykueTtDKHQscixlKSxtKG4sZnVuY3Rpb24obil7dC5sYXN0Y29sPT09ciYmKHQubGFzdGNvbD0wKTt2YXIgZT1NKG4sXCJoZWlnaHRcIik7ZT1wYXJzZUludChuLm9mZnNldEhlaWdodCwxMCksaXNOYU4oZSl8fChuLnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIixuLnN0eWxlLnRvcD10LnJvd3NbdC5sYXN0Y29sXStcInB4XCIsbi5zdHlsZS5sZWZ0PVwiXCIrdC5jb2xzW3QubGFzdGNvbF0sdC5yb3dzW3QubGFzdGNvbF0rPWlzTmFOKGUpPzA6ZStpLHQubGFzdGNvbCs9MSxvJiYobi5kYXRhc2V0Lm1hY3lDb21wbGV0ZT0xKSl9KSxvJiYodC50bXBSb3dzPW51bGwpLGwodCl9dmFyIGY9ZnVuY3Rpb24gdChuLGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIHQpKXJldHVybiBuZXcgdChuLGUpO2lmKG49bi5yZXBsYWNlKC9eXFxzKi8sXCJcIikucmVwbGFjZSgvXFxzKiQvLFwiXCIpLGUpcmV0dXJuIHRoaXMuYnlDc3MobixlKTtmb3IodmFyIG8gaW4gdGhpcy5zZWxlY3RvcnMpaWYoZT1vLnNwbGl0KFwiL1wiKSxuZXcgUmVnRXhwKGVbMV0sZVsyXSkudGVzdChuKSlyZXR1cm4gdGhpcy5zZWxlY3RvcnNbb10obik7cmV0dXJuIHRoaXMuYnlDc3Mobil9O2YucHJvdG90eXBlLmJ5Q3NzPWZ1bmN0aW9uKHQsbil7cmV0dXJuKG58fGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHQpfSxmLnByb3RvdHlwZS5zZWxlY3RvcnM9e30sZi5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFwuW1xcd1xcLV0rJC9dPWZ1bmN0aW9uKHQpe3JldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHQuc3Vic3RyaW5nKDEpKX0sZi5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFx3KyQvXT1mdW5jdGlvbih0KXtyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodCl9LGYucHJvdG90eXBlLnNlbGVjdG9yc1svXlxcI1tcXHdcXC1dKyQvXT1mdW5jdGlvbih0KXtyZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodC5zdWJzdHJpbmcoMSkpfTt2YXIgbT1mdW5jdGlvbih0LG4pe2Zvcih2YXIgZT10Lmxlbmd0aCxvPWU7ZS0tOyluKHRbby1lLTFdKX0sdj1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07dGhpcy5ydW5uaW5nPSExLHRoaXMuZXZlbnRzPVtdLHRoaXMuYWRkKHQpfTt2LnByb3RvdHlwZS5ydW49ZnVuY3Rpb24oKXtpZighdGhpcy5ydW5uaW5nJiZ0aGlzLmV2ZW50cy5sZW5ndGg+MCl7dmFyIHQ9dGhpcy5ldmVudHMuc2hpZnQoKTt0aGlzLnJ1bm5pbmc9ITAsdCgpLHRoaXMucnVubmluZz0hMSx0aGlzLnJ1bigpfX0sdi5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxuPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07cmV0dXJuISFuJiYoQXJyYXkuaXNBcnJheShuKT9tKG4sZnVuY3Rpb24obil7cmV0dXJuIHQuYWRkKG4pfSk6KHRoaXMuZXZlbnRzLnB1c2gobiksdm9pZCB0aGlzLnJ1bigpKSl9LHYucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5ldmVudHM9W119O3ZhciBkPWZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp7fTtyZXR1cm4gdGhpcy5pbnN0YW5jZT10LHRoaXMuZGF0YT1uLHRoaXN9LGc9ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXSYmYXJndW1lbnRzWzBdO3RoaXMuZXZlbnRzPXt9LHRoaXMuaW5zdGFuY2U9dH07Zy5wcm90b3R5cGUub249ZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXSYmYXJndW1lbnRzWzBdLG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0mJmFyZ3VtZW50c1sxXTtyZXR1cm4hKCF0fHwhbikmJihBcnJheS5pc0FycmF5KHRoaXMuZXZlbnRzW3RdKXx8KHRoaXMuZXZlbnRzW3RdPVtdKSx0aGlzLmV2ZW50c1t0XS5wdXNoKG4pKX0sZy5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF0sbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06e307aWYoIXR8fCFBcnJheS5pc0FycmF5KHRoaXMuZXZlbnRzW3RdKSlyZXR1cm4hMTt2YXIgZT1uZXcgZCh0aGlzLmluc3RhbmNlLG4pO20odGhpcy5ldmVudHNbdF0sZnVuY3Rpb24odCl7cmV0dXJuIHQoZSl9KX07dmFyIHk9ZnVuY3Rpb24odCl7cmV0dXJuIShcIm5hdHVyYWxIZWlnaHRcImluIHQmJnQubmF0dXJhbEhlaWdodCt0Lm5hdHVyYWxXaWR0aD09PTApfHx0LndpZHRoK3QuaGVpZ2h0IT09MH0sRT1mdW5jdGlvbih0LG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl07cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHQsZSl7aWYobi5jb21wbGV0ZSlyZXR1cm4geShuKT90KG4pOmUobik7bi5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHkobik/dChuKTplKG4pfSksbi5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixmdW5jdGlvbigpe3JldHVybiBlKG4pfSl9KS50aGVuKGZ1bmN0aW9uKG4pe2UmJnQuZW1pdCh0LmNvbnN0YW50cy5FVkVOVF9JTUFHRV9MT0FELHtpbWc6bn0pfSkuY2F0Y2goZnVuY3Rpb24obil7cmV0dXJuIHQuZW1pdCh0LmNvbnN0YW50cy5FVkVOVF9JTUFHRV9FUlJPUix7aW1nOm59KX0pfSx3PWZ1bmN0aW9uKHQsZSl7dmFyIG89YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXTtyZXR1cm4gbihlLGZ1bmN0aW9uKG4pe3JldHVybiBFKHQsbixvKX0pfSxBPWZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXTtyZXR1cm4gUHJvbWlzZS5hbGwodyh0LG4sZSkpLnRoZW4oZnVuY3Rpb24oKXt0LmVtaXQodC5jb25zdGFudHMuRVZFTlRfSU1BR0VfQ09NUExFVEUpfSl9LEk9ZnVuY3Rpb24obil7cmV0dXJuIHQoZnVuY3Rpb24oKXtuLmVtaXQobi5jb25zdGFudHMuRVZFTlRfUkVTSVpFKSxuLnF1ZXVlLmFkZChmdW5jdGlvbigpe3JldHVybiBuLnJlY2FsY3VsYXRlKCEwLCEwKX0pfSwxMDApfSxOPWZ1bmN0aW9uKHQpe2lmKHQuY29udGFpbmVyPWYodC5vcHRpb25zLmNvbnRhaW5lciksdC5jb250YWluZXIgaW5zdGFuY2VvZiBmfHwhdC5jb250YWluZXIpcmV0dXJuISF0Lm9wdGlvbnMuZGVidWcmJmNvbnNvbGUuZXJyb3IoXCJFcnJvcjogQ29udGFpbmVyIG5vdCBmb3VuZFwiKTtkZWxldGUgdC5vcHRpb25zLmNvbnRhaW5lcix0LmNvbnRhaW5lci5sZW5ndGgmJih0LmNvbnRhaW5lcj10LmNvbnRhaW5lclswXSksdC5jb250YWluZXIuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwifSxUPWZ1bmN0aW9uKHQpe3QucXVldWU9bmV3IHYsdC5ldmVudHM9bmV3IGcodCksdC5yb3dzPVtdLHQucmVzaXplcj1JKHQpfSxiPWZ1bmN0aW9uKHQpe3ZhciBuPWYoXCJpbWdcIix0LmNvbnRhaW5lcik7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0LnJlc2l6ZXIpLHQub24odC5jb25zdGFudHMuRVZFTlRfSU1BR0VfTE9BRCxmdW5jdGlvbigpe3JldHVybiB0LnJlY2FsY3VsYXRlKCExLCExKX0pLHQub24odC5jb25zdGFudHMuRVZFTlRfSU1BR0VfQ09NUExFVEUsZnVuY3Rpb24oKXtyZXR1cm4gdC5yZWNhbGN1bGF0ZSghMCwhMCl9KSx0Lm9wdGlvbnMudXNlT3duSW1hZ2VMb2FkZXJ8fGUodCxuLCF0Lm9wdGlvbnMud2FpdEZvckltYWdlcyksdC5lbWl0KHQuY29uc3RhbnRzLkVWRU5UX0lOSVRJQUxJWkVEKX0sXz1mdW5jdGlvbih0KXtOKHQpLFQodCksYih0KX0sTD1mdW5jdGlvbih0KXtyZXR1cm4gdD09PU9iamVjdCh0KSYmXCJbb2JqZWN0IEFycmF5XVwiIT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpfSxPPWZ1bmN0aW9uKHQsbil7TCh0KXx8KG4uY29sdW1ucz10KSxMKHQpJiZ0LmNvbHVtbnMmJihuLmNvbHVtbnM9dC5jb2x1bW5zKSxMKHQpJiZ0Lm1hcmdpbiYmIUwodC5tYXJnaW4pJiYobi5tYXJnaW49e3g6dC5tYXJnaW4seTp0Lm1hcmdpbn0pLEwodCkmJnQubWFyZ2luJiZMKHQubWFyZ2luKSYmdC5tYXJnaW4ueCYmKG4ubWFyZ2luLng9dC5tYXJnaW4ueCksTCh0KSYmdC5tYXJnaW4mJkwodC5tYXJnaW4pJiZ0Lm1hcmdpbi55JiYobi5tYXJnaW4ueT10Lm1hcmdpbi55KX0sTT1mdW5jdGlvbih0LG4pe3JldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0LG51bGwpLmdldFByb3BlcnR5VmFsdWUobil9LEM9ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdO2lmKHQubGFzdGNvbHx8KHQubGFzdGNvbD0wKSx0LnJvd3MubGVuZ3RoPDEmJihlPSEwKSxlKXt0LnJvd3M9W10sdC5jb2xzPVtdLHQubGFzdGNvbD0wO2Zvcih2YXIgbz1uLTE7bz49MDtvLS0pdC5yb3dzW29dPTAsdC5jb2xzW29dPXUodCxvKX1lbHNlIGlmKHQudG1wUm93cyl7dC5yb3dzPVtdO2Zvcih2YXIgbz1uLTE7bz49MDtvLS0pdC5yb3dzW29dPXQudG1wUm93c1tvXX1lbHNle3QudG1wUm93cz1bXTtmb3IodmFyIG89bi0xO28+PTA7by0tKXQudG1wUm93c1tvXT10LnJvd3Nbb119fSxWPWZ1bmN0aW9uKHQpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdJiZhcmd1bWVudHNbMV0sZT0hKGFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdKXx8YXJndW1lbnRzWzJdLG89bj90LmNvbnRhaW5lci5jaGlsZHJlbjpmKCc6c2NvcGUgPiAqOm5vdChbZGF0YS1tYWN5LWNvbXBsZXRlPVwiMVwiXSknLHQuY29udGFpbmVyKSxyPWModC5vcHRpb25zKTtyZXR1cm4gbShvLGZ1bmN0aW9uKHQpe24mJih0LmRhdGFzZXQubWFjeUNvbXBsZXRlPTApLHQuc3R5bGUud2lkdGg9cn0pLHQub3B0aW9ucy50cnVlT3JkZXI/KGgodCxvLG4sZSksdC5lbWl0KHQuY29uc3RhbnRzLkVWRU5UX1JFQ0FMQ1VMQVRFRCkpOihwKHQsbyxuLGUpLHQuZW1pdCh0LmNvbnN0YW50cy5FVkVOVF9SRUNBTENVTEFURUQpKX0sUj1PYmplY3QuYXNzaWdufHxmdW5jdGlvbih0KXtmb3IodmFyIG49MTtuPGFyZ3VtZW50cy5sZW5ndGg7bisrKXt2YXIgZT1hcmd1bWVudHNbbl07Zm9yKHZhciBvIGluIGUpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsbykmJih0W29dPWVbb10pfXJldHVybiB0fSx4PXtjb2x1bW5zOjQsbWFyZ2luOjIsdHJ1ZU9yZGVyOiExLHdhaXRGb3JJbWFnZXM6ITEsdXNlSW1hZ2VMb2FkZXI6ITAsYnJlYWtBdDp7fSx1c2VPd25JbWFnZUxvYWRlcjohMSxvbkluaXQ6ITF9OyFmdW5jdGlvbigpe3RyeXtkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKS5xdWVyeVNlbGVjdG9yKFwiOnNjb3BlICpcIil9Y2F0Y2godCl7IWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXtyZXR1cm4gZnVuY3Rpb24oZSl7aWYoZSYmbi50ZXN0KGUpKXt2YXIgbz10aGlzLmdldEF0dHJpYnV0ZShcImlkXCIpO298fCh0aGlzLmlkPVwicVwiK01hdGguZmxvb3IoOWU2Kk1hdGgucmFuZG9tKCkpKzFlNiksYXJndW1lbnRzWzBdPWUucmVwbGFjZShuLFwiI1wiK3RoaXMuaWQpO3ZhciByPXQuYXBwbHkodGhpcyxhcmd1bWVudHMpO3JldHVybiBudWxsPT09bz90aGlzLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpOm98fCh0aGlzLmlkPW8pLHJ9cmV0dXJuIHQuYXBwbHkodGhpcyxhcmd1bWVudHMpfX12YXIgbj0vOnNjb3BlXFxiL2dpLGU9dChFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yKTtFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yPWZ1bmN0aW9uKHQpe3JldHVybiBlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07dmFyIG89dChFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsKTtFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsPWZ1bmN0aW9uKHQpe3JldHVybiBvLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KCl9fSgpO3ZhciBxPWZ1bmN0aW9uIHQoKXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06eDtpZighKHRoaXMgaW5zdGFuY2VvZiB0KSlyZXR1cm4gbmV3IHQobik7dGhpcy5vcHRpb25zPXt9LFIodGhpcy5vcHRpb25zLHgsbiksXyh0aGlzKX07cmV0dXJuIHEuaW5pdD1mdW5jdGlvbih0KXtyZXR1cm4gY29uc29sZS53YXJuKFwiRGVwcmVjaWF0ZWQ6IE1hY3kuaW5pdCB3aWxsIGJlIHJlbW92ZWQgaW4gdjMuMC4wIG9wdCB0byB1c2UgTWFjeSBkaXJlY3RseSBsaWtlIHNvIE1hY3koeyAvKm9wdGlvbnMgaGVyZSovIH0pIFwiKSxuZXcgcSh0KX0scS5wcm90b3R5cGUucmVjYWxjdWxhdGVPbkltYWdlTG9hZD1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07cmV0dXJuIGUodGhpcyxmKFwiaW1nXCIsdGhpcy5jb250YWluZXIpLCF0KX0scS5wcm90b3R5cGUucnVuT25JbWFnZUxvYWQ9ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0mJmFyZ3VtZW50c1sxXSxvPWYoXCJpbWdcIix0aGlzLmNvbnRhaW5lcik7cmV0dXJuIHRoaXMub24odGhpcy5jb25zdGFudHMuRVZFTlRfSU1BR0VfQ09NUExFVEUsdCksbiYmdGhpcy5vbih0aGlzLmNvbnN0YW50cy5FVkVOVF9JTUFHRV9MT0FELHQpLGUodGhpcyxvLG4pfSxxLnByb3RvdHlwZS5yZWNhbGN1bGF0ZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMsbj1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXSYmYXJndW1lbnRzWzBdLGU9IShhcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXSl8fGFyZ3VtZW50c1sxXTtyZXR1cm4gZSYmdGhpcy5xdWV1ZS5jbGVhcigpLHRoaXMucXVldWUuYWRkKGZ1bmN0aW9uKCl7cmV0dXJuIFYodCxuLGUpfSl9LHEucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbigpe3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5yZXNpemVyKSxtKHRoaXMuY29udGFpbmVyLmNoaWxkcmVuLGZ1bmN0aW9uKHQpe3QucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1tYWN5LWNvbXBsZXRlXCIpLHQucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIil9KSx0aGlzLmNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKX0scS5wcm90b3R5cGUucmVJbml0PWZ1bmN0aW9uKCl7dGhpcy5yZWNhbGN1bGF0ZSghMCwhMCksdGhpcy5lbWl0KHRoaXMuY29uc3RhbnRzLkVWRU5UX0lOSVRJQUxJWkVEKSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMucmVzaXplciksdGhpcy5jb250YWluZXIuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwifSxxLnByb3RvdHlwZS5vbj1mdW5jdGlvbih0LG4pe3RoaXMuZXZlbnRzLm9uKHQsbil9LHEucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24odCxuKXt0aGlzLmV2ZW50cy5lbWl0KHQsbil9LHEuY29uc3RhbnRzPXtFVkVOVF9JTklUSUFMSVpFRDpcIm1hY3kuaW5pdGlhbGl6ZWRcIixFVkVOVF9SRUNBTENVTEFURUQ6XCJtYWN5LnJlY2FsY3VsYXRlZFwiLEVWRU5UX0lNQUdFX0xPQUQ6XCJtYWN5LmltYWdlLmxvYWRcIixFVkVOVF9JTUFHRV9FUlJPUjpcIm1hY3kuaW1hZ2UuZXJyb3JcIixFVkVOVF9JTUFHRV9DT01QTEVURTpcIm1hY3kuaW1hZ2VzLmNvbXBsZXRlXCIsRVZFTlRfUkVTSVpFOlwibWFjeS5yZXNpemVcIn0scS5wcm90b3R5cGUuY29uc3RhbnRzPXEuY29uc3RhbnRzLHF9KTtcbiIsImZ1bmN0aW9uIHJveWFsX21lbnVzKCkge1xuICAgIC8vIE1vYmlsZSBNZW51XG4gICAgJChcIiNtb2JpbGUtbWVudVwiKS5zaWRlTmF2KHtcbiAgICAgICAgbWVudVdpZHRoOiAyNjAsXG4gICAgICAgIGVkZ2U6ICdyaWdodCdcbiAgICB9KTtcblxuXG4gICAgLy8gRHJvcGRvd25zXG4gICAgJChcIm5hdiAuZHJvcGRvd24tYnV0dG9uXCIpLmRyb3Bkb3duKHtcbiAgICAgICAgY29uc3RyYWluV2lkdGg6IGZhbHNlXG4gICAgfSk7XG5cblxuICAgIC8vIEhlcm8gRGlzcGxheXNcbiAgICBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XG4gICAgICAgICQoJ25hdicpLmFkZENsYXNzKCd0cmFuc3BhcmVudCcpO1xuICAgIH1cbn1cblxuXG5mdW5jdGlvbiByb3lhbF90b2dnbGVfbWVudXModG9wKSB7XG4gICAgaWYgKHRvcCA+IDUgJiYgJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcbiAgICAgICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvcCA8IDUgJiYgISQoJ25hdicpLmhhc0NsYXNzKCd0cmFuc3BhcmVudCcpKSB7XG4gICAgICAgICQoJ25hdicpLmFkZENsYXNzKCd0cmFuc3BhcmVudCcpO1xuICAgIH1cbn1cbiIsImZ1bmN0aW9uIHJveWFsX21vZGFscygpIHtcblxuICAgIGZ1bmN0aW9uIGF1dG9wbGF5KHZpZGVvKSB7XG4gICAgICAgIHZpZGVvLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwbGF5VmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGF1dG9zdG9wKHZpZGVvKSB7XG4gICAgICAgIHZpZGVvLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwYXVzZVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicpO1xuICAgIH1cblxuICAgIC8vIEhvbWUgUGFnZSBWaWRlb1xuICAgIGlmICgkKCcjaG9tZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJcIik7XG4gICAgICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcbiAgICAgICAgICAgIHJlYWR5OiBmdW5jdGlvbihtb2RhbCkge1xuICAgICAgICAgICAgICAgIGlmICgkKG1vZGFsKS5oYXNDbGFzcygndmlkZW8nKSkge1xuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSh2aWRlbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xuICAgICAgICAgICAgICAgIGlmICgkKG1vZGFsKS5oYXNDbGFzcygndmlkZW8nKSkge1xuICAgICAgICAgICAgICAgICAgICBhdXRvc3RvcCh2aWRlbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIEJsb2cgVmlkZW9zXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcubW9kYWwnKS5tb2RhbCh7XG4gICAgICAgICAgICByZWFkeTogZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XG4gICAgICAgICAgICAgICAgdmFyIHZpZGVvU3JjID0gJG1vZGFsLmRhdGEoJ3ZpZGVvLXNyYycpO1xuICAgICAgICAgICAgICAgIHZhciAkaWZyYW1lID0gJG1vZGFsLmZpbmQoJ2lmcmFtZScpO1xuXG4gICAgICAgICAgICAgICAgaWYoJGlmcmFtZSAmJiAhJGlmcmFtZS5hdHRyKCdzcmMnKSl7XG4gICAgICAgICAgICAgICAgICAgICRpZnJhbWUuYXR0cignc3JjJywgdmlkZW9TcmMgKyBcIj9lbmFibGVqc2FwaT0xJnNob3dpbmZvPTBcIilcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXkoJGlmcmFtZS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24obW9kYWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG1vZGFsID0gJChtb2RhbCk7XG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XG4gICAgICAgICAgICAgICAgYXV0b3N0b3AoJGlmcmFtZS5nZXQoMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cbiIsIi8vIE1vdmVzIHRoZSBXb29Db21tZXJjZSBub3RpY2UgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxuZnVuY3Rpb24gcm95YWxfbW92ZU5vdGljZSgpIHtcbiAgICAkKCcubm90aWNlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5wcmVwZW5kVG8oJCgnbWFpbicpKTtcbiAgICB9KTtcbn1cblxuXG4vLyBNb3ZlcyBuZXdseSBhZGRlZCBXb29Db21tZXJjZSBjYXJ0IG5vdGljZXMgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZVxuZnVuY3Rpb24gcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKSB7XG4gICAgdmFyIGNhcnRMb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCdtYWluIC5jb250YWluZXIgLm5vdGljZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY2FydExvb3ApO1xuICAgICAgICB9XG4gICAgfSwgMjUwKTtcbn1cbiIsImZ1bmN0aW9uIHJveWFsX3F1aXooKSB7XG5cbiAgICAvLyBBc3NldCBQcm90ZWN0aW9uIFF1aXpcbiAgICBpZiAoJCgnI2Fzc2V0LXByb3RlY3Rpb24tcXVpeicpLmxlbmd0aCkge1xuICAgICAgICAvLyBNYXRlcmlhbGl6ZSBjYXJvdXNlbCBzZXR0aW5nc1xuICAgICAgICAkKCcuY2Fyb3VzZWwuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xuICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgaW5kaWNhdG9yczp0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFF1ZXN0aW9ucyBwYW5lbCBkaXNwbGF5ICYgbmF2aWdhdGlvblxuICAgICAgICAkKCcudG9nZ2xlLXNlY3Rpb24nKS5oaWRlKCk7XG4gICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS51bmJpbmQoJ2NsaWNrJykuYmluZCgnY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCcudG9nZ2xlLXNlY3Rpb24nKS5zbGlkZVRvZ2dsZSgnZmFzdCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZigkKCcudG9nZ2xlLXNlY3Rpb24nKS5jc3MoJ2Rpc3BsYXknKT09J2Jsb2NrJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5odG1sKFwiQ0xPU0UgUVVJWlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmFkZENsYXNzKFwiY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tcXVpei10b2dnbGUnKS5odG1sKFwiVEFLRSBUSEUgUVVJWlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLnJlbW92ZUNsYXNzKFwiY2xvc2VcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlc3VsdHMgJiBlbWFpbFxuICAgICAgICAvLyBDb2RlIGdvZXMgaGVyZS4uLlxuICAgIH1cblxufVxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLSBHTE9CQUwgLS0tLSAvL1xuICAgIHJveWFsX21lbnVzKCk7XG4gICAgcm95YWxfbG9naW4oKTtcblxuXG4gICAgLy8gLS0tLSBHRU5FUkFMIC0tLS0gLy9cbiAgICBpZigkLmZuLnBhcmFsbGF4ICYmICQoJy5wYXJhbGxheCcpLmxlbmd0aCl7XG4gICAgICAgICQoJy5wYXJhbGxheCcpLnBhcmFsbGF4KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiYXNkYXNkXCIpXG4gICAgaWYoJC5mbi5jYXJvdXNlbCAmJiAkKCcuY2Fyb3VzZWwtc2xpZGVyJykubGVuZ3RoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJnb2dvZ29cIilcbiAgICAgICAgJCgnLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzNTAsXG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBcblxuXG4gICAgLy8gLS0tLSBNT0JJTEUgLS0tLSAvL1xuXG5cbiAgICAvLyAtLS0tIExBTkRJTkcgUEFHRVMgLS0tLSAvL1xuICAgIGlmICgkKCcjaG9tZScpLmxlbmd0aCkge1xuICAgICAgICAkKCcuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xuICAgICAgICAgICAgZHVyYXRpb246IDM1MCxcbiAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dChhdXRvcGxheSwgOTAwMCk7XG4gICAgICAgIGZ1bmN0aW9uIGF1dG9wbGF5KCkge1xuICAgICAgICAgICAgJCgnLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKCduZXh0Jyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGF1dG9wbGF5LCAxMjAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIC0tLS0gUFJPTU9USU9OUyAtLS0tIC8vXG4gICAgaWYgKCQoJy5tb2RhbC10cmlnZ2VyJykubGVuZ3RoKSB7XG4gICAgICAgIHJveWFsX21vZGFscygpO1xuICAgIH1cbiAgICAvKiBpZiAoJCgnLnF1aXonKS5sZW5ndGgpe1xuICAgICAqICAgICByb3lhbF9xdWl6KCk7XG4gICAgICogfSovXG5cblxuICAgIC8vIC0tLS0gV09PQ09NTUVSQ0UgLS0tLSAvL1xuICAgIGlmICgkKCdib2R5Lndvb2NvbW1lcmNlJykubGVuZ3RoKSB7XG4gICAgICAgIHJveWFsX3dvb2NvbW1lcmNlKCk7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tIEJMT0cgLS0tLSAvL1xuICAgIGlmICgkKCcjZmVlZCcpLmxlbmd0aCkge1xuICAgICAgICAkKCcuY2Fyb3VzZWwuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe2Z1bGxXaWR0aDogdHJ1ZX0pO1xuICAgICAgICB2YXIgY29sdW1ucyA9ICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS5oYXNDbGFzcygnbTknKSA/IDMgOiA0O1xuICAgICAgICB2YXIgJG1zbnJ5ID0gJCgnLm1hc29ucnknKS5tYXNvbnJ5KCB7XG4gICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICdhcnRpY2xlJyxcbiAgICAgICAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIGZpdFdpZHRoOiB0cnVlLFxuICAgICAgICAgICAgaGlkZGVuU3R5bGU6IHtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxMDBweCknLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZVN0eWxlOiB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMHB4KScsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAvL2J1dHRvbiB0byBsb2FkIG1vcmUgcG9zdHMgdmlhIGFqYXhcbiAgICAgICAgJCgnW2RhdGEtbG9hZC1tb3JlLXBvc3RzXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRoaXMuZGF0YSgnYWN0aXZlLXRleHQnLCAkdGhpcy50ZXh0KCkpLnRleHQoXCJMb2FkaW5nIHBvc3RzLi4uXCIpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJHRoaXMuZGF0YShcIm9mZnNldFwiKTtcbiAgICAgICAgICAgIHZhciBwb3N0c1BlclBhZ2UgPSAkdGhpcy5kYXRhKFwicG9zdHMtcGVyLXBhZ2VcIik7XG4gICAgICAgICAgICBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c1BlclBhZ2UpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICB2YXIgJHJlcyA9ICQocmVzKTtcbiAgICAgICAgICAgICAgICAkbXNucnkuYXBwZW5kKCAkcmVzICkubWFzb25yeSggJ2FwcGVuZGVkJywgJHJlcyApO1xuICAgICAgICAgICAgICAgIHZhciBuZXdPZmZzZXQgPSBvZmZzZXQrcG9zdHNQZXJQYWdlO1xuICAgICAgICAgICAgICAgIHZhciBuZXdQYXJhbXMgPSAnP29mZnNldD0nKyBuZXdPZmZzZXQ7XG4gICAgICAgICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt1cmxQYXRoOm5ld1BhcmFtc30sXCJcIixuZXdQYXJhbXMpXG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0YShcIm9mZnNldFwiLG5ld09mZnNldCk7XG4gICAgICAgICAgICAgICAgJHRoaXMudGV4dCgkdGhpcy5kYXRhKCdhY3RpdmUtdGV4dCcpKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlLXNpZGViYXJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRtc25yeS5tYXNvbnJ5KCdsYXlvdXQnLCB0cnVlKVxuICAgICAgICAgICAgJCgnI2ZlZWQgLmNvbCcpLmZpcnN0KCkudG9nZ2xlQ2xhc3MoJ205JykudG9nZ2xlQ2xhc3MoJ20xMicpO1xuICAgICAgICAgICAgJCgnI2ZlZWQgLmNvbCcpLmxhc3QoKS50b2dnbGVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJG1zbnJ5Lm1hc29ucnkoJ2xheW91dCcsIHRydWUpXG4gICAgICAgICAgICB9LCA0MDApXG4gICAgICAgIH0pXG5cbiAgICAgICAgcm95YWxfZmlsdGVyUG9zdHMoKTtcbiAgICB9XG4gICAgaWYgKCQoJ21haW4jYXJ0aWNsZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcm95YWxfYXJ0aWNsZSgpO1xuICAgIH1cbn0pO1xuIiwiLyogJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAqICAgICBpZiAoJCgnLm15LWFjY291bnQnKS5sZW5ndGgpIHtcbiAqICAgICB9XG4gKiB9KSovXG4iLCJ2YXIgZGlkU2Nyb2xsO1xuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpe1xuICAgIGRpZFNjcm9sbCA9IHRydWU7XG4gICAgdmFyIHRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIGlmICgkKCcuaGVyby1jb250YWluZXIsIC5wYXJhbGxheC1jb250YWluZXInKS5sZW5ndGgpIHtcbiAgICAgICAgcm95YWxfdG9nZ2xlX21lbnVzKHRvcCk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5jb25zdWx0YXRpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBoZXJvID0gJCgnLmhlcm8tY29udGFpbmVyJykuaGVpZ2h0KCk7XG4gICAgICAgIGlmICh0b3AgPiBoZXJvICYmICQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xuICAgICAgICAgICAgJCgnbmF2JykucmVtb3ZlQ2xhc3MoJ25vLXNoYWRvdycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRvcCA8IGhlcm8gJiYgISQoJ25hdicpLmhhc0NsYXNzKCduby1zaGFkb3cnKSkge1xuICAgICAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ25vLXNoYWRvdycpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIGlmIChkaWRTY3JvbGwpIHtcbiAgICAgICAgLyogdG9nZ2xlTmF2KCk7Ki9cbiAgICAgICAgZGlkU2Nyb2xsID0gZmFsc2U7XG4gICAgfVxufSwgMjUwKTtcbiIsIiIsImZ1bmN0aW9uIHJveWFsX3dvb2NvbW1lcmNlKCkge1xuXG4gICAgLy8gLS0tLSBOb3RpY2VzIC0tLS0gLy9cbiAgICBpZiAoJCgnLm5vdGljZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcm95YWxfbW92ZU5vdGljZSgpO1xuICAgIH1cbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCd1cGRhdGVkX2NhcnRfdG90YWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcbiAgICB9KTtcblxuICAgIC8vIC0tLS0gUHJvZHVjdHMgLS0tLSAvL1xuICAgIGlmICgkKCdtYWluI3Byb2R1Y3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0gQ2FydCAtLS0tIC8vXG4gICAgaWYgKCQoJy53b29jb21tZXJjZS1jYXJ0LWZvcm0nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5wcm9kdWN0LXJlbW92ZSBhJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByb3lhbF9yZWZyZXNoQ2FydE5vdGljZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tIENoZWNrb3V0IC0tLS0tIC8vXG4gICAgLyogJCgnI3BheW1lbnQgW3R5cGU9cmFkaW9dJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKCdjbGljaycpO1xuICAgICAqIH0pOyovXG59XG4iXX0=
=======
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJhcnRpY2xlLmpzIiwiY29uc3VsdGF0aW9uLmpzIiwiY29udGFjdC5qcyIsImZpbHRlclBvc3RzLmpzIiwibG9naW4uanMiLCJtYXNvbnJ5LmpzIiwibWVudXMuanMiLCJtb2RhbHMuanMiLCJub3RpY2UuanMiLCJxdWl6LmpzIiwicmVhZHkuanMiLCJyZXNpemUuanMiLCJzY3JvbGwuanMiLCJ2YWxpZGF0ZS5qcyIsIndvb2NvbW1lcmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c19wZXJfcGFnZSwgY2F0ZWdvcnkpe1xuICByZXR1cm4gJC5hamF4KHtcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgdXJsOiAnL3dwLWFkbWluL2FkbWluLWFqYXgucGhwJyxcbiAgICBkYXRhOiB7XG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgIHBvc3RzX3Blcl9wYWdlOiBwb3N0c19wZXJfcGFnZSxcbiAgICAgIGFjdGlvbjogJ3Jsc19tb3JlX3Bvc3RzJ1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiKTtcbiAgICB9XG4gIH0pO1xufSIsImZ1bmN0aW9uIHJveWFsX2FydGljbGUoKSB7XG4gICAgLy8gUmVzcG9uc2l2ZSBpRnJhbWVzXG4gICAgLyogJCgnaWZyYW1lJykud3JhcCgnPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjwvZGl2PicpOyovXG5cbiAgICAvLyBQYXJhbGxheFxuICAgIGlmICgkKCcucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQQVJBTExBWCcpO1xuICAgICAgICB2YXIgZmVhdHVyZWQgPSAkKCcuZmVhdHVyZWQtaW1hZ2UgLnBhcmFsbGF4Jyk7XG4gICAgICAgIHZhciBwcm9tb3Rpb24gPSAkKCcucHJvbW90aW9uLWltYWdlIC5wYXJhbGxheCcpO1xuXG4gICAgICAgIGlmIChmZWF0dXJlZC5sZW5ndGggJiYgcHJvbW90aW9uLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0JPVEgnKTtcbiAgICAgICAgICAgIGZlYXR1cmVkLnBhcmFsbGF4KCk7XG4gICAgICAgICAgICBwcm9tb3Rpb24ucGFyYWxsYXgoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmZWF0dXJlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGRUFUVVJFRCcpO1xuICAgICAgICAgICAgZmVhdHVyZWQucGFyYWxsYXgoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwcm9tb3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUFJPTU9USU8nKTtcbiAgICAgICAgICAgIHByb21vdGlvbi5wYXJhbGxheCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0VMU0UnKTtcbiAgICAgICAgICAgICQoJy5wYXJhbGxheCcpLnBhcmFsbGF4KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJmdW5jdGlvbiByb3lhbF9jb25zdWx0YXRpb24oKSB7XG4gICAgJCgnbmF2JykuYWRkQ2xhc3MoJ25vLXNoYWRvdycpO1xufVxuIiwiZnVuY3Rpb24gcm95YWxfY29udGFjdCgpIHtcbiAgICAvLyBTdWJtaXNzaW9uXG4gICAgJCgnZm9ybScpLnN1Ym1pdChmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGZpcnN0ICAgPSAkKFwiI2ZpcnN0XCIpLnZhbCgpO1xuICAgICAgICB2YXIgbGFzdCAgICA9ICQoXCIjbGFzdFwiKS52YWwoKTtcbiAgICAgICAgdmFyIHBob25lICAgPSAkKFwiI3Bob25lXCIpLnZhbCgpO1xuICAgICAgICB2YXIgZW1haWwgICA9ICQoXCIjZW1haWxcIikudmFsKCk7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJChcIiNtZXNzYWdlXCIpLnZhbCgpO1xuICAgICAgICB2YXIgc3VibWl0ICA9ICQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIik7XG4gICAgICAgIHZhciBjaXJjbGVzID0gJChcIi5wcmVsb2FkZXItd3JhcHBlclwiKS5wYXJlbnQoKTtcbiAgICAgICAgdmFyIGNvbmZpcm0gPSAkKFwiLmNvbmZpcm1cIik7XG5cbiAgICAgICAgLy8gUmVtb3ZlcyBleGlzdGluZyB2YWxpZGF0aW9uXG4gICAgICAgIGNvbmZpcm0ucmVtb3ZlQ2xhc3MoJ3BpbmsgZ3JlZW4nKS5hZGRDbGFzcygnaGlkZScpLmZpbmQoJ3AnKS5yZW1vdmUoKTtcbiAgICAgICAgJCgnLmludmFsaWQsIC52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkIHZhbGlkJyk7XG5cbiAgICAgICAgLy8gVmFsaWRhdGlvblxuICAgICAgICBpZiAoZmlyc3QgPT0gXCJcIiB8fCBsYXN0ID09IFwiXCIgfHwgcGhvbmUgPT0gXCJcIiB8fCBlbWFpbCA9PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25maXJtLmFkZENsYXNzKCdwaW5rJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKFwiPHA+T29wcywgbG9va3MgbGlrZSB3ZSdyZSBtaXNzaW5nIHNvbWUgaW5mb3JtYXRpb24uIFBsZWFzZSBmaWxsIG91dCBhbGwgdGhlIGZpZWxkcy48L3A+XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBUb2dnbGUgUHJlbG9hZGVyXG4gICAgICAgICAgICBzdWJtaXQuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgIGNpcmNsZXMucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi93cC1hZG1pbi9hZG1pbi1hamF4LnBocFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnY29udGFjdF91c19mb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IGZpcnN0LFxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBsYXN0LFxuICAgICAgICAgICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZS5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJzxici8+JyksXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT0gXCIwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0hIENoZWNrIGJhY2sgbGF0ZXIgb3IgZW1haWwgdXMgZGlyZWN0bHkgYXQgPGEgaHJlZj0nbWFpbHRvOnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tJz5zY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbTwvYT4uPC9wPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3MgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlybS5hZGRDbGFzcygnZ3JlZW4nKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5TdWNjZXNzISBDaGVjayB5b3VyIGVtYWlsLiBXZSdsbCBiZSBpbiB0b3VjaCBzaG9ydGx5LjwvcD5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm0uYWRkQ2xhc3MoJ3BpbmsnKS5yZW1vdmVDbGFzcygnaGlkZScpLmh0bWwoXCI8cD5Pb3BzLCBsb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW0hIENoZWNrIGJhY2sgbGF0ZXIgb3IgZW1haWwgdXMgZGlyZWN0bHkgYXQgPGEgaHJlZj0nbWFpbHRvOnNjb3R0QHJveWFsbGVnYWxzb2x1dGlvbnMuY29tJz5zY290dEByb3lhbGxlZ2Fsc29sdXRpb25zLmNvbTwvYT4uPC9wPlwiKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtJylbMF0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgTWF0ZXJpYWxpemUudXBkYXRlVGV4dEZpZWxkcygpO1xuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtIHRleHRhcmVhJykudHJpZ2dlcignYXV0b3Jlc2l6ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSBQcmVsb2FkZXJcbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlcy5hZGRDbGFzcygnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiZnVuY3Rpb24gcm95YWxfZmlsdGVyUG9zdHMoKSB7XG4gICAgJCgnI3NlYXJjaCcpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpbHRlciA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgICAgLy8gRXh0ZW5kIDpjb250YWlucyBzZWxlY3RvclxuICAgICAgICBqUXVlcnkuZXhwclsnOiddLmNvbnRhaW5zID0gZnVuY3Rpb24oYSwgaSwgbSkge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeShhKS50ZXh0KCkudG9VcHBlckNhc2UoKS5pbmRleE9mKG1bM10udG9VcHBlckNhc2UoKSkgPj0gMDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBIaWRlcyBjYXJkcyB0aGF0IGRvbid0IG1hdGNoIGlucHV0XG4gICAgICAgICQoXCIjZmVlZCAuY29udGVudCAuY2FyZC1jb250YWluZXI6dmlzaWJsZSBhcnRpY2xlIC5jYXJkLXRpdGxlIGE6bm90KDpjb250YWlucyhcIitmaWx0ZXIrXCIpKVwiKS5jbG9zZXN0KCcuY2FyZC1jb250YWluZXInKS5mYWRlT3V0KCk7XG5cbiAgICAgICAgLy8gU2hvd3MgY2FyZHMgdGhhdCBtYXRjaCBpbnB1dFxuICAgICAgICAkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOm5vdCg6dmlzaWJsZSkgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOmNvbnRhaW5zKFwiK2ZpbHRlcitcIilcIikuY2xvc2VzdCgnLmNhcmQtY29udGFpbmVyJykuZmFkZUluKCk7XG5cbiAgICAgICAgLy8gQWRkIGVtcHR5IG1lc3NhZ2Ugd2hlbiBpZiBubyBwb3N0cyBhcmUgdmlzaWJsZVxuICAgICAgICB2YXIgbWVzc2FnZSA9ICQoJyNmZWVkICNuby1yZXN1bHRzJyk7XG4gICAgICAgIGlmICgkKFwiI2ZlZWQgLmNvbnRlbnQgLmNhcmQtY29udGFpbmVyOnZpc2libGUgYXJ0aWNsZSAuY2FyZC10aXRsZSBhOmNvbnRhaW5zKFwiK2ZpbHRlcitcIilcIikuc2l6ZSgpID09IDApIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmhhc0NsYXNzKCdoaWRlJykpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZCAjbm8tcmVzdWx0cycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2UuZmluZCgnLnRhcmdldCcpLnRleHQoZmlsdGVyKTtcbiAgICAgICAgfSBlbHNlIHsgbWVzc2FnZS5hZGRDbGFzcygnaGlkZScpOyB9XG5cbiAgICB9KS5rZXl1cChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5jaGFuZ2UoKTtcbiAgICB9KTtcbn1cbiIsImZ1bmN0aW9uIHJveWFsX2xvZ2luKCkge1xuICAgICQoJyNsb2dpbi1tb2RhbCcpLm1vZGFsKCk7XG5cbiAgICAvLyBDaG9vc2VzIHdoaWNoIG9mIHRoZSB0aHJlZSBtb2RhbCBmb3JtcyB0byBkaXNwbGF5XG4gICAgJCgnI2xvZ2luLW1vZGFsIGEnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuYXR0cignaHJlZicpO1xuICAgICAgICByb3lhbF9zaG93Rm9ybSh0YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgLy8gU3VibWl0cyBBSkFYIGNhbGwgJiBsb2FkZXIsIGNsb3NlcyBvbiBjb21wbGV0aW9uXG4gICAgJCgnI2xvZ2luLW1vZGFsIGlucHV0W3R5cGU9c3VibWl0XScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpLmZpbmQoJ2Zvcm0nKTtcbiAgICAgICAgdmFyIGFjdGlvbiA9ICQoZm9ybSkuYXR0cignYWN0aW9uJyk7XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImxvZ2luXCIpIHtcbiAgICAgICAgICAgIHJveWFsX2FqYXhMb2dpbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PSBcInJlZ2lzdGVyXCIpIHtcbiAgICAgICAgICAgIHJveWFsX2FqYXhSZWdpc3RlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PSBcInJlc2V0XCIpIHtcbiAgICAgICAgICAgIHJveWFsX2FqYXhSZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXJyb3JcbiAgICAgICAgICAgIC8vIHVzZSBcImNsYXNzZXMvZW1haWwucGhwXCIgdG8gc2VuZCBhbiBlcnJvciBub3RpZmljYXRpb24gdG8gc3dlZHkxM0BnbWFpbC5jb21cbiAgICAgICAgICAgIC8vIG9ubHkgc2VuZCBlbWFpbCBpZiBhbiBlcnJvciBvY2N1cnMgb24gdGhlIHByb2R1Y3Rpb24gc2l0ZVxuICAgICAgICAgICAgLy8gaWYgKGlzX3dwZSgpKSB7IC4uLnNlbmQgcGFzc3dvcmQgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuZnVuY3Rpb24gcm95YWxfc2hvd0xvZ2luRmllbGQodGFyZ2V0KSB7XG4gICAgJCgnI2xvZ2luLW1vZGFsIC5yb3cnKS5hZGRDbGFzcygnaGlkZScpO1xuICAgICQodGFyZ2V0KS5yZW1vdmVDbGFzcygnaGlkZScpO1xufVxuXG5cbmZ1bmN0aW9uIHJveWFsX2FqYXhMb2dpbihmb3JtKSB7XG4gICAgLy8gSWYgKGxvZ2luIHZhbGlkYXRpb24gPT0gXCJzdWNjZXNzZnVsXCIpIHtcbiAgICAvLyAgICAgQUpBWCBsb2dpbiBjYWxsIGhlcmUuLi5cbiAgICAvLyB9XG59XG5cblxuXG5cbiQoXCIjbG9naW5DYWxsLCAuYnRuLWxvZ2luZm9ybVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgLy9hbGVydCgnd29ya2luZy4uLicpO1xuICAgICQoJyNyZWdpc3Rlci1oZCcpLmhpZGUoKTtcbiAgICAkKCcjcmVnaXN0ZXItcG9wdXAnKS5oaWRlKCk7XG4gICAgJCgnI2ZvcmdvdC1oZCcpLmhpZGUoKTtcbiAgICAkKCcjZm9yZ290X3Bhc3N3b3JkLXBvcHVwJykuaGlkZSgpO1xuXG4gICAgJCgnI2xvZ2luLWhkJykuZmFkZUluKCk7XG4gICAgJCgnI2xvZ2luLXBvcHVwJykuZmFkZUluKCk7XG59KTtcblxuJChcIiNzaWdudXBDYWxsLCAjc2lnbnVwQ2FsbDJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICQoJyNsb2dpbi1oZCcpLmhpZGUoKTtcbiAgICAkKCcjbG9naW4tcG9wdXAnKS5oaWRlKCk7XG4gICAgJCgnI2ZvcmdvdC1oZCcpLmhpZGUoKTtcbiAgICAkKCcjZm9yZ290X3Bhc3N3b3JkLXBvcHVwJykuaGlkZSgpO1xuXG4gICAgJCgnI3JlZ2lzdGVyLWhkJykuZmFkZUluKCk7XG4gICAgJCgnI3JlZ2lzdGVyLXBvcHVwJykuZmFkZUluKCk7XG59KTtcblxuJChcIiNmb3Jnb3RDYWxsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjcmVnaXN0ZXItaGQnKS5oaWRlKCk7XG4gICAgJCgnI3JlZ2lzdGVyLXBvcHVwJykuaGlkZSgpO1xuICAgICQoJyNsb2dpbi1oZCcpLmhpZGUoKTtcbiAgICAkKCcjbG9naW4tcG9wdXAnKS5oaWRlKCk7XG5cbiAgICAkKCcjZm9yZ290LWhkJykuZmFkZUluKCk7XG4gICAgJCgnI2ZvcmdvdF9wYXNzd29yZC1wb3B1cCcpLmZhZGVJbigpO1xufSk7XG5cbi8vIFBlcmZvcm0gQUpBWCBsb2dpbi9yZWdpc3RlciBvbiBmb3JtIHN1Ym1pdFxuJCgnZm9ybSNsb2dpbi1wb3B1cCwgZm9ybSNyZWdpc3Rlci1wb3B1cCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghJCh0aGlzKS52YWxpZCgpKSByZXR1cm4gZmFsc2U7XG4gICAgJCgncC5zdGF0dXMnLCB0aGlzKS5zaG93KCkudGV4dChhamF4X2F1dGhfb2JqZWN0LmxvYWRpbmdtZXNzYWdlKTtcbiAgICBhY3Rpb24gPSAnYWpheGxvZ2luJztcbiAgICB1c2VybmFtZSA9ICAkKCdmb3JtI2xvZ2luLXBvcHVwICN1c2VybmFtZScpLnZhbCgpO1xuICAgIHBhc3N3b3JkID0gJCgnZm9ybSNsb2dpbi1wb3B1cCAjcGFzc3dvcmQnKS52YWwoKTtcbiAgICBlbWFpbCA9ICcnO1xuICAgIHNlY3VyaXR5ID0gJCgnZm9ybSNsb2dpbi1wb3B1cCAjc2VjdXJpdHknKS52YWwoKTtcbiAgICBpZiAoJCh0aGlzKS5hdHRyKCdpZCcpID09ICdyZWdpc3Rlci1wb3B1cCcpIHtcbiAgICAgICAgYWN0aW9uID0gJ2FqYXhyZWdpc3Rlcic7XG4gICAgICAgIHVzZXJuYW1lID0gJCgnI3NpZ25vbm5hbWUnKS52YWwoKTtcbiAgICAgICAgcGFzc3dvcmQgPSAkKCcjc2lnbm9ucGFzc3dvcmQnKS52YWwoKTtcbiAgICAgICAgZW1haWwgPSAkKCcjZW1haWwnKS52YWwoKTtcbiAgICAgICAgc2VjdXJpdHkgPSAkKCcjc2lnbm9uc2VjdXJpdHknKS52YWwoKTsgIFxuICAgIH0gIFxuICAgIGN0cmwgPSAkKHRoaXMpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBhamF4X2F1dGhfb2JqZWN0LmFqYXh1cmwsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICdhY3Rpb24nOiBhY3Rpb24sXG4gICAgICAgICAgICAndXNlcm5hbWUnOiB1c2VybmFtZSxcbiAgICAgICAgICAgICdwYXNzd29yZCc6IHBhc3N3b3JkLFxuICAgICAgICAgICAgJ2VtYWlsJzogZW1haWwsXG4gICAgICAgICAgICAnc2VjdXJpdHknOiBzZWN1cml0eVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgJCgncC5zdGF0dXMnLCBjdHJsKS50ZXh0KGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5sb2dnZWRpbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IGFqYXhfYXV0aF9vYmplY3QucmVkaXJlY3R1cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gUGVyZm9ybSBBSkFYIGZvcmdldCBwYXNzd29yZCBvbiBmb3JtIHN1Ym1pdFxuJCgnZm9ybSNmb3Jnb3RfcGFzc3dvcmQtcG9wdXAnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSl7XG4gICAgaWYgKCEkKHRoaXMpLnZhbGlkKCkpIHJldHVybiBmYWxzZTtcbiAgICAkKCdwLnN0YXR1cycsIHRoaXMpLnNob3coKS50ZXh0KGFqYXhfYXV0aF9vYmplY3QubG9hZGluZ21lc3NhZ2UpO1xuICAgIGN0cmwgPSAkKHRoaXMpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBhamF4X2F1dGhfb2JqZWN0LmFqYXh1cmwsXG4gICAgICAgIGRhdGE6IHsgXG4gICAgICAgICAgICAnYWN0aW9uJzogJ2FqYXhmb3Jnb3RwYXNzd29yZCcsIFxuICAgICAgICAgICAgJ3VzZXJfbG9naW4nOiAkKCcjdXNlcl9sb2dpbicpLnZhbCgpLCBcbiAgICAgICAgICAgICdzZWN1cml0eSc6ICQoJyNmb3Jnb3RzZWN1cml0eScpLnZhbCgpLCBcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICQoJ3Auc3RhdHVzJyxjdHJsKS50ZXh0KGRhdGEubWVzc2FnZSk7ICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59KTtcblxuLy8gQ2xpZW50IHNpZGUgZm9ybSB2YWxpZGF0aW9uXG5pZiAoalF1ZXJ5KFwiI3JlZ2lzdGVyLXBvcHVwXCIpLmxlbmd0aCkgXG4gICAgalF1ZXJ5KFwiI3JlZ2lzdGVyLXBvcHVwXCIpLnZhbGlkYXRlKFxuICAgICAgICB7cnVsZXM6e1xuICAgICAgICAgICAgcGFzc3dvcmQyOnsgZXF1YWxUbzonI3NpZ25vbnBhc3N3b3JkJyBcbiAgICAgICAgICAgIH0gICBcbiAgICAgICAgfX1cbiAgICApO1xuZWxzZSBpZiAoalF1ZXJ5KFwiI2xvZ2luLXBvcHVwXCIpLmxlbmd0aCkgXG4gICAgalF1ZXJ5KFwiI2xvZ2luLXBvcHVwXCIpLnZhbGlkYXRlKCk7XG5pZihqUXVlcnkoJyNmb3Jnb3RfcGFzc3dvcmQtcG9wdXAnKS5sZW5ndGgpXG4gICAgalF1ZXJ5KCcjZm9yZ290X3Bhc3N3b3JkLXBvcHVwJykudmFsaWRhdGUoKTtcbiIsIiFmdW5jdGlvbih0LG4pe1wib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPW4oKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKG4pOnQuTWFjeT1uKCl9KHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiB0KHQsbil7dmFyIGU9dm9pZCAwO3JldHVybiBmdW5jdGlvbigpe2UmJmNsZWFyVGltZW91dChlKSxlPXNldFRpbWVvdXQodCxuKX19ZnVuY3Rpb24gbih0LG4pe2Zvcih2YXIgZT10Lmxlbmd0aCxvPWUscj1bXTtlLS07KXIucHVzaChuKHRbby1lLTFdKSk7cmV0dXJuIHJ9ZnVuY3Rpb24gZSh0LG4pe0EodCxuLGFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl0pfWZ1bmN0aW9uIG8odCl7Zm9yKHZhciBuPXQub3B0aW9ucyxlPXQucmVzcG9uc2l2ZU9wdGlvbnMsbz10LmtleXMscj10LmRvY1dpZHRoLGk9dm9pZCAwLHM9MDtzPG8ubGVuZ3RoO3MrKyl7dmFyIGE9cGFyc2VJbnQob1tzXSwxMCk7cj49YSYmKGk9bi5icmVha0F0W2FdLE8oaSxlKSl9cmV0dXJuIGV9ZnVuY3Rpb24gcih0KXtmb3IodmFyIG49dC5vcHRpb25zLGU9dC5yZXNwb25zaXZlT3B0aW9ucyxvPXQua2V5cyxyPXQuZG9jV2lkdGgsaT12b2lkIDAscz1vLmxlbmd0aC0xO3M+PTA7cy0tKXt2YXIgYT1wYXJzZUludChvW3NdLDEwKTtyPD1hJiYoaT1uLmJyZWFrQXRbYV0sTyhpLGUpKX1yZXR1cm4gZX1mdW5jdGlvbiBpKHQpe3ZhciBuPWRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsZT17Y29sdW1uczp0LmNvbHVtbnN9O0wodC5tYXJnaW4pP2UubWFyZ2luPXt4OnQubWFyZ2luLngseTp0Lm1hcmdpbi55fTplLm1hcmdpbj17eDp0Lm1hcmdpbix5OnQubWFyZ2lufTt2YXIgaT1PYmplY3Qua2V5cyh0LmJyZWFrQXQpO3JldHVybiB0Lm1vYmlsZUZpcnN0P28oe29wdGlvbnM6dCxyZXNwb25zaXZlT3B0aW9uczplLGtleXM6aSxkb2NXaWR0aDpufSk6cih7b3B0aW9uczp0LHJlc3BvbnNpdmVPcHRpb25zOmUsa2V5czppLGRvY1dpZHRoOm59KX1mdW5jdGlvbiBzKHQpe3JldHVybiBpKHQpLmNvbHVtbnN9ZnVuY3Rpb24gYSh0KXtyZXR1cm4gaSh0KS5tYXJnaW59ZnVuY3Rpb24gYyh0KXt2YXIgbj0hKGFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdKXx8YXJndW1lbnRzWzFdLGU9cyh0KSxvPWEodCkueCxyPTEwMC9lO3JldHVybiBuPzE9PT1lP1wiMTAwJVwiOihvPShlLTEpKm8vZSxcImNhbGMoXCIrcitcIiUgLSBcIitvK1wicHgpXCIpOnJ9ZnVuY3Rpb24gdSh0LG4pe3ZhciBlPXModC5vcHRpb25zKSxvPTAscj12b2lkIDAsaT12b2lkIDA7cmV0dXJuIDE9PT0rK24/MDooaT1hKHQub3B0aW9ucykueCxyPShpLShlLTEpKmkvZSkqKG4tMSksbys9Yyh0Lm9wdGlvbnMsITEpKihuLTEpLFwiY2FsYyhcIitvK1wiJSArIFwiK3IrXCJweClcIil9ZnVuY3Rpb24gbCh0KXt2YXIgbj0wLGU9dC5jb250YWluZXI7bSh0LnJvd3MsZnVuY3Rpb24odCl7bj10Pm4/dDpufSksZS5zdHlsZS5oZWlnaHQ9bitcInB4XCJ9ZnVuY3Rpb24gcCh0LG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl0sbz0hKGFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdKXx8YXJndW1lbnRzWzNdLHI9cyh0Lm9wdGlvbnMpLGk9YSh0Lm9wdGlvbnMpLnk7Qyh0LHIsZSksbShuLGZ1bmN0aW9uKG4pe3ZhciBlPTAscj1wYXJzZUludChuLm9mZnNldEhlaWdodCwxMCk7aXNOYU4ocil8fCh0LnJvd3MuZm9yRWFjaChmdW5jdGlvbihuLG8pe248dC5yb3dzW2VdJiYoZT1vKX0pLG4uc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiLG4uc3R5bGUudG9wPXQucm93c1tlXStcInB4XCIsbi5zdHlsZS5sZWZ0PVwiXCIrdC5jb2xzW2VdLHQucm93c1tlXSs9aXNOYU4ocik/MDpyK2ksbyYmKG4uZGF0YXNldC5tYWN5Q29tcGxldGU9MSkpfSksbyYmKHQudG1wUm93cz1udWxsKSxsKHQpfWZ1bmN0aW9uIGgodCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdLG89IShhcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXSl8fGFyZ3VtZW50c1szXSxyPXModC5vcHRpb25zKSxpPWEodC5vcHRpb25zKS55O0ModCxyLGUpLG0obixmdW5jdGlvbihuKXt0Lmxhc3Rjb2w9PT1yJiYodC5sYXN0Y29sPTApO3ZhciBlPU0obixcImhlaWdodFwiKTtlPXBhcnNlSW50KG4ub2Zmc2V0SGVpZ2h0LDEwKSxpc05hTihlKXx8KG4uc3R5bGUucG9zaXRpb249XCJhYnNvbHV0ZVwiLG4uc3R5bGUudG9wPXQucm93c1t0Lmxhc3Rjb2xdK1wicHhcIixuLnN0eWxlLmxlZnQ9XCJcIit0LmNvbHNbdC5sYXN0Y29sXSx0LnJvd3NbdC5sYXN0Y29sXSs9aXNOYU4oZSk/MDplK2ksdC5sYXN0Y29sKz0xLG8mJihuLmRhdGFzZXQubWFjeUNvbXBsZXRlPTEpKX0pLG8mJih0LnRtcFJvd3M9bnVsbCksbCh0KX12YXIgZj1mdW5jdGlvbiB0KG4sZSl7aWYoISh0aGlzIGluc3RhbmNlb2YgdCkpcmV0dXJuIG5ldyB0KG4sZSk7aWYobj1uLnJlcGxhY2UoL15cXHMqLyxcIlwiKS5yZXBsYWNlKC9cXHMqJC8sXCJcIiksZSlyZXR1cm4gdGhpcy5ieUNzcyhuLGUpO2Zvcih2YXIgbyBpbiB0aGlzLnNlbGVjdG9ycylpZihlPW8uc3BsaXQoXCIvXCIpLG5ldyBSZWdFeHAoZVsxXSxlWzJdKS50ZXN0KG4pKXJldHVybiB0aGlzLnNlbGVjdG9yc1tvXShuKTtyZXR1cm4gdGhpcy5ieUNzcyhuKX07Zi5wcm90b3R5cGUuYnlDc3M9ZnVuY3Rpb24odCxuKXtyZXR1cm4obnx8ZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwodCl9LGYucHJvdG90eXBlLnNlbGVjdG9ycz17fSxmLnByb3RvdHlwZS5zZWxlY3RvcnNbL15cXC5bXFx3XFwtXSskL109ZnVuY3Rpb24odCl7cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodC5zdWJzdHJpbmcoMSkpfSxmLnByb3RvdHlwZS5zZWxlY3RvcnNbL15cXHcrJC9dPWZ1bmN0aW9uKHQpe3JldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0KX0sZi5wcm90b3R5cGUuc2VsZWN0b3JzWy9eXFwjW1xcd1xcLV0rJC9dPWZ1bmN0aW9uKHQpe3JldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0LnN1YnN0cmluZygxKSl9O3ZhciBtPWZ1bmN0aW9uKHQsbil7Zm9yKHZhciBlPXQubGVuZ3RoLG89ZTtlLS07KW4odFtvLWUtMV0pfSx2PWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXTt0aGlzLnJ1bm5pbmc9ITEsdGhpcy5ldmVudHM9W10sdGhpcy5hZGQodCl9O3YucHJvdG90eXBlLnJ1bj1mdW5jdGlvbigpe2lmKCF0aGlzLnJ1bm5pbmcmJnRoaXMuZXZlbnRzLmxlbmd0aD4wKXt2YXIgdD10aGlzLmV2ZW50cy5zaGlmdCgpO3RoaXMucnVubmluZz0hMCx0KCksdGhpcy5ydW5uaW5nPSExLHRoaXMucnVuKCl9fSx2LnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLG49YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXTtyZXR1cm4hIW4mJihBcnJheS5pc0FycmF5KG4pP20obixmdW5jdGlvbihuKXtyZXR1cm4gdC5hZGQobil9KToodGhpcy5ldmVudHMucHVzaChuKSx2b2lkIHRoaXMucnVuKCkpKX0sdi5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLmV2ZW50cz1bXX07dmFyIGQ9ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnt9O3JldHVybiB0aGlzLmluc3RhbmNlPXQsdGhpcy5kYXRhPW4sdGhpc30sZz1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07dGhpcy5ldmVudHM9e30sdGhpcy5pbnN0YW5jZT10fTtnLnByb3RvdHlwZS5vbj1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF0sbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXSYmYXJndW1lbnRzWzFdO3JldHVybiEoIXR8fCFuKSYmKEFycmF5LmlzQXJyYXkodGhpcy5ldmVudHNbdF0pfHwodGhpcy5ldmVudHNbdF09W10pLHRoaXMuZXZlbnRzW3RdLnB1c2gobikpfSxnLnByb3RvdHlwZS5lbWl0PWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXSxuPWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdP2FyZ3VtZW50c1sxXTp7fTtpZighdHx8IUFycmF5LmlzQXJyYXkodGhpcy5ldmVudHNbdF0pKXJldHVybiExO3ZhciBlPW5ldyBkKHRoaXMuaW5zdGFuY2Usbik7bSh0aGlzLmV2ZW50c1t0XSxmdW5jdGlvbih0KXtyZXR1cm4gdChlKX0pfTt2YXIgeT1mdW5jdGlvbih0KXtyZXR1cm4hKFwibmF0dXJhbEhlaWdodFwiaW4gdCYmdC5uYXR1cmFsSGVpZ2h0K3QubmF0dXJhbFdpZHRoPT09MCl8fHQud2lkdGgrdC5oZWlnaHQhPT0wfSxFPWZ1bmN0aW9uKHQsbil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0mJmFyZ3VtZW50c1syXTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24odCxlKXtpZihuLmNvbXBsZXRlKXJldHVybiB5KG4pP3Qobik6ZShuKTtuLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKXtyZXR1cm4geShuKT90KG4pOmUobil9KSxuLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGZ1bmN0aW9uKCl7cmV0dXJuIGUobil9KX0pLnRoZW4oZnVuY3Rpb24obil7ZSYmdC5lbWl0KHQuY29uc3RhbnRzLkVWRU5UX0lNQUdFX0xPQUQse2ltZzpufSl9KS5jYXRjaChmdW5jdGlvbihuKXtyZXR1cm4gdC5lbWl0KHQuY29uc3RhbnRzLkVWRU5UX0lNQUdFX0VSUk9SLHtpbWc6bn0pfSl9LHc9ZnVuY3Rpb24odCxlKXt2YXIgbz1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdO3JldHVybiBuKGUsZnVuY3Rpb24obil7cmV0dXJuIEUodCxuLG8pfSl9LEE9ZnVuY3Rpb24odCxuKXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdO3JldHVybiBQcm9taXNlLmFsbCh3KHQsbixlKSkudGhlbihmdW5jdGlvbigpe3QuZW1pdCh0LmNvbnN0YW50cy5FVkVOVF9JTUFHRV9DT01QTEVURSl9KX0sST1mdW5jdGlvbihuKXtyZXR1cm4gdChmdW5jdGlvbigpe24uZW1pdChuLmNvbnN0YW50cy5FVkVOVF9SRVNJWkUpLG4ucXVldWUuYWRkKGZ1bmN0aW9uKCl7cmV0dXJuIG4ucmVjYWxjdWxhdGUoITAsITApfSl9LDEwMCl9LE49ZnVuY3Rpb24odCl7aWYodC5jb250YWluZXI9Zih0Lm9wdGlvbnMuY29udGFpbmVyKSx0LmNvbnRhaW5lciBpbnN0YW5jZW9mIGZ8fCF0LmNvbnRhaW5lcilyZXR1cm4hIXQub3B0aW9ucy5kZWJ1ZyYmY29uc29sZS5lcnJvcihcIkVycm9yOiBDb250YWluZXIgbm90IGZvdW5kXCIpO2RlbGV0ZSB0Lm9wdGlvbnMuY29udGFpbmVyLHQuY29udGFpbmVyLmxlbmd0aCYmKHQuY29udGFpbmVyPXQuY29udGFpbmVyWzBdKSx0LmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbj1cInJlbGF0aXZlXCJ9LFQ9ZnVuY3Rpb24odCl7dC5xdWV1ZT1uZXcgdix0LmV2ZW50cz1uZXcgZyh0KSx0LnJvd3M9W10sdC5yZXNpemVyPUkodCl9LGI9ZnVuY3Rpb24odCl7dmFyIG49ZihcImltZ1wiLHQuY29udGFpbmVyKTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHQucmVzaXplciksdC5vbih0LmNvbnN0YW50cy5FVkVOVF9JTUFHRV9MT0FELGZ1bmN0aW9uKCl7cmV0dXJuIHQucmVjYWxjdWxhdGUoITEsITEpfSksdC5vbih0LmNvbnN0YW50cy5FVkVOVF9JTUFHRV9DT01QTEVURSxmdW5jdGlvbigpe3JldHVybiB0LnJlY2FsY3VsYXRlKCEwLCEwKX0pLHQub3B0aW9ucy51c2VPd25JbWFnZUxvYWRlcnx8ZSh0LG4sIXQub3B0aW9ucy53YWl0Rm9ySW1hZ2VzKSx0LmVtaXQodC5jb25zdGFudHMuRVZFTlRfSU5JVElBTElaRUQpfSxfPWZ1bmN0aW9uKHQpe04odCksVCh0KSxiKHQpfSxMPWZ1bmN0aW9uKHQpe3JldHVybiB0PT09T2JqZWN0KHQpJiZcIltvYmplY3QgQXJyYXldXCIhPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9LE89ZnVuY3Rpb24odCxuKXtMKHQpfHwobi5jb2x1bW5zPXQpLEwodCkmJnQuY29sdW1ucyYmKG4uY29sdW1ucz10LmNvbHVtbnMpLEwodCkmJnQubWFyZ2luJiYhTCh0Lm1hcmdpbikmJihuLm1hcmdpbj17eDp0Lm1hcmdpbix5OnQubWFyZ2lufSksTCh0KSYmdC5tYXJnaW4mJkwodC5tYXJnaW4pJiZ0Lm1hcmdpbi54JiYobi5tYXJnaW4ueD10Lm1hcmdpbi54KSxMKHQpJiZ0Lm1hcmdpbiYmTCh0Lm1hcmdpbikmJnQubWFyZ2luLnkmJihuLm1hcmdpbi55PXQubWFyZ2luLnkpfSxNPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHQsbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuKX0sQz1mdW5jdGlvbih0LG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl07aWYodC5sYXN0Y29sfHwodC5sYXN0Y29sPTApLHQucm93cy5sZW5ndGg8MSYmKGU9ITApLGUpe3Qucm93cz1bXSx0LmNvbHM9W10sdC5sYXN0Y29sPTA7Zm9yKHZhciBvPW4tMTtvPj0wO28tLSl0LnJvd3Nbb109MCx0LmNvbHNbb109dSh0LG8pfWVsc2UgaWYodC50bXBSb3dzKXt0LnJvd3M9W107Zm9yKHZhciBvPW4tMTtvPj0wO28tLSl0LnJvd3Nbb109dC50bXBSb3dzW29dfWVsc2V7dC50bXBSb3dzPVtdO2Zvcih2YXIgbz1uLTE7bz49MDtvLS0pdC50bXBSb3dzW29dPXQucm93c1tvXX19LFY9ZnVuY3Rpb24odCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0mJmFyZ3VtZW50c1sxXSxlPSEoYXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0pfHxhcmd1bWVudHNbMl0sbz1uP3QuY29udGFpbmVyLmNoaWxkcmVuOmYoJzpzY29wZSA+ICo6bm90KFtkYXRhLW1hY3ktY29tcGxldGU9XCIxXCJdKScsdC5jb250YWluZXIpLHI9Yyh0Lm9wdGlvbnMpO3JldHVybiBtKG8sZnVuY3Rpb24odCl7biYmKHQuZGF0YXNldC5tYWN5Q29tcGxldGU9MCksdC5zdHlsZS53aWR0aD1yfSksdC5vcHRpb25zLnRydWVPcmRlcj8oaCh0LG8sbixlKSx0LmVtaXQodC5jb25zdGFudHMuRVZFTlRfUkVDQUxDVUxBVEVEKSk6KHAodCxvLG4sZSksdC5lbWl0KHQuY29uc3RhbnRzLkVWRU5UX1JFQ0FMQ1VMQVRFRCkpfSxSPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKHQpe2Zvcih2YXIgbj0xO248YXJndW1lbnRzLmxlbmd0aDtuKyspe3ZhciBlPWFyZ3VtZW50c1tuXTtmb3IodmFyIG8gaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxvKSYmKHRbb109ZVtvXSl9cmV0dXJuIHR9LHg9e2NvbHVtbnM6NCxtYXJnaW46Mix0cnVlT3JkZXI6ITEsd2FpdEZvckltYWdlczohMSx1c2VJbWFnZUxvYWRlcjohMCxicmVha0F0Ont9LHVzZU93bkltYWdlTG9hZGVyOiExLG9uSW5pdDohMX07IWZ1bmN0aW9uKCl7dHJ5e2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpLnF1ZXJ5U2VsZWN0b3IoXCI6c2NvcGUgKlwiKX1jYXRjaCh0KXshZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3JldHVybiBmdW5jdGlvbihlKXtpZihlJiZuLnRlc3QoZSkpe3ZhciBvPXRoaXMuZ2V0QXR0cmlidXRlKFwiaWRcIik7b3x8KHRoaXMuaWQ9XCJxXCIrTWF0aC5mbG9vcig5ZTYqTWF0aC5yYW5kb20oKSkrMWU2KSxhcmd1bWVudHNbMF09ZS5yZXBsYWNlKG4sXCIjXCIrdGhpcy5pZCk7dmFyIHI9dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIG51bGw9PT1vP3RoaXMucmVtb3ZlQXR0cmlidXRlKFwiaWRcIik6b3x8KHRoaXMuaWQ9bykscn1yZXR1cm4gdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXZhciBuPS86c2NvcGVcXGIvZ2ksZT10KEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3IpO0VsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3I9ZnVuY3Rpb24odCl7cmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfTt2YXIgbz10KEVsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpO0VsZW1lbnQucHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGw9ZnVuY3Rpb24odCl7cmV0dXJuIG8uYXBwbHkodGhpcyxhcmd1bWVudHMpfX0oKX19KCk7dmFyIHE9ZnVuY3Rpb24gdCgpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTp4O2lmKCEodGhpcyBpbnN0YW5jZW9mIHQpKXJldHVybiBuZXcgdChuKTt0aGlzLm9wdGlvbnM9e30sUih0aGlzLm9wdGlvbnMseCxuKSxfKHRoaXMpfTtyZXR1cm4gcS5pbml0PWZ1bmN0aW9uKHQpe3JldHVybiBjb25zb2xlLndhcm4oXCJEZXByZWNpYXRlZDogTWFjeS5pbml0IHdpbGwgYmUgcmVtb3ZlZCBpbiB2My4wLjAgb3B0IHRvIHVzZSBNYWN5IGRpcmVjdGx5IGxpa2Ugc28gTWFjeSh7IC8qb3B0aW9ucyBoZXJlKi8gfSkgXCIpLG5ldyBxKHQpfSxxLnByb3RvdHlwZS5yZWNhbGN1bGF0ZU9uSW1hZ2VMb2FkPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXTtyZXR1cm4gZSh0aGlzLGYoXCJpbWdcIix0aGlzLmNvbnRhaW5lciksIXQpfSxxLnByb3RvdHlwZS5ydW5PbkltYWdlTG9hZD1mdW5jdGlvbih0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXSYmYXJndW1lbnRzWzFdLG89ZihcImltZ1wiLHRoaXMuY29udGFpbmVyKTtyZXR1cm4gdGhpcy5vbih0aGlzLmNvbnN0YW50cy5FVkVOVF9JTUFHRV9DT01QTEVURSx0KSxuJiZ0aGlzLm9uKHRoaXMuY29uc3RhbnRzLkVWRU5UX0lNQUdFX0xPQUQsdCksZSh0aGlzLG8sbil9LHEucHJvdG90eXBlLnJlY2FsY3VsYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxuPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF0sZT0hKGFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdKXx8YXJndW1lbnRzWzFdO3JldHVybiBlJiZ0aGlzLnF1ZXVlLmNsZWFyKCksdGhpcy5xdWV1ZS5hZGQoZnVuY3Rpb24oKXtyZXR1cm4gVih0LG4sZSl9KX0scS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKCl7d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLnJlc2l6ZXIpLG0odGhpcy5jb250YWluZXIuY2hpbGRyZW4sZnVuY3Rpb24odCl7dC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW1hY3ktY29tcGxldGVcIiksdC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKX0pLHRoaXMuY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpfSxxLnByb3RvdHlwZS5yZUluaXQ9ZnVuY3Rpb24oKXt0aGlzLnJlY2FsY3VsYXRlKCEwLCEwKSx0aGlzLmVtaXQodGhpcy5jb25zdGFudHMuRVZFTlRfSU5JVElBTElaRUQpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5yZXNpemVyKSx0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbj1cInJlbGF0aXZlXCJ9LHEucHJvdG90eXBlLm9uPWZ1bmN0aW9uKHQsbil7dGhpcy5ldmVudHMub24odCxuKX0scS5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0LG4pe3RoaXMuZXZlbnRzLmVtaXQodCxuKX0scS5jb25zdGFudHM9e0VWRU5UX0lOSVRJQUxJWkVEOlwibWFjeS5pbml0aWFsaXplZFwiLEVWRU5UX1JFQ0FMQ1VMQVRFRDpcIm1hY3kucmVjYWxjdWxhdGVkXCIsRVZFTlRfSU1BR0VfTE9BRDpcIm1hY3kuaW1hZ2UubG9hZFwiLEVWRU5UX0lNQUdFX0VSUk9SOlwibWFjeS5pbWFnZS5lcnJvclwiLEVWRU5UX0lNQUdFX0NPTVBMRVRFOlwibWFjeS5pbWFnZXMuY29tcGxldGVcIixFVkVOVF9SRVNJWkU6XCJtYWN5LnJlc2l6ZVwifSxxLnByb3RvdHlwZS5jb25zdGFudHM9cS5jb25zdGFudHMscX0pO1xuIiwiZnVuY3Rpb24gcm95YWxfbWVudXMoKSB7XG4gICAgLy8gTW9iaWxlIE1lbnVcbiAgICAkKFwiI21vYmlsZS1tZW51XCIpLnNpZGVOYXYoe1xuICAgICAgICBtZW51V2lkdGg6IDI2MCxcbiAgICAgICAgZWRnZTogJ3JpZ2h0J1xuICAgIH0pO1xuXG5cbiAgICAvLyBEcm9wZG93bnNcbiAgICAkKFwibmF2IC5kcm9wZG93bi1idXR0b25cIikuZHJvcGRvd24oe1xuICAgICAgICBjb25zdHJhaW5XaWR0aDogZmFsc2VcbiAgICB9KTtcblxuXG4gICAgLy8gSGVybyBEaXNwbGF5c1xuICAgIGlmICgkKCcuaGVyby1jb250YWluZXIsIC5wYXJhbGxheC1jb250YWluZXInKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIHJveWFsX3RvZ2dsZV9tZW51cyh0b3ApIHtcbiAgICBpZiAodG9wID4gNSAmJiAkKCduYXYnKS5oYXNDbGFzcygndHJhbnNwYXJlbnQnKSkge1xuICAgICAgICAkKCduYXYnKS5yZW1vdmVDbGFzcygndHJhbnNwYXJlbnQnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9wIDwgNSAmJiAhJCgnbmF2JykuaGFzQ2xhc3MoJ3RyYW5zcGFyZW50JykpIHtcbiAgICAgICAgJCgnbmF2JykuYWRkQ2xhc3MoJ3RyYW5zcGFyZW50Jyk7XG4gICAgfVxufVxuIiwiZnVuY3Rpb24gcm95YWxfbW9kYWxzKCkge1xuXG4gICAgZnVuY3Rpb24gYXV0b3BsYXkodmlkZW8pIHtcbiAgICAgICAgdmlkZW8uY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSgne1wiZXZlbnRcIjpcImNvbW1hbmRcIixcImZ1bmNcIjpcInBsYXlWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXV0b3N0b3AodmlkZW8pIHtcbiAgICAgICAgdmlkZW8uY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSgne1wiZXZlbnRcIjpcImNvbW1hbmRcIixcImZ1bmNcIjpcInBhdXNlVmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyk7XG4gICAgfVxuXG4gICAgLy8gSG9tZSBQYWdlIFZpZGVvXG4gICAgaWYgKCQoJyNob21lJykubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcbiAgICAgICAgJCgnLm1vZGFsJykubW9kYWwoe1xuICAgICAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQobW9kYWwpLmhhc0NsYXNzKCd2aWRlbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5KHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQobW9kYWwpLmhhc0NsYXNzKCd2aWRlbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9zdG9wKHZpZGVvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gQmxvZyBWaWRlb3NcbiAgICBpZiAoJCgnI2ZlZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5tb2RhbCcpLm1vZGFsKHtcbiAgICAgICAgICAgIHJlYWR5OiBmdW5jdGlvbihtb2RhbCkge1xuICAgICAgICAgICAgICAgIHZhciAkbW9kYWwgPSAkKG1vZGFsKTtcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW9TcmMgPSAkbW9kYWwuZGF0YSgndmlkZW8tc3JjJyk7XG4gICAgICAgICAgICAgICAgdmFyICRpZnJhbWUgPSAkbW9kYWwuZmluZCgnaWZyYW1lJyk7XG5cbiAgICAgICAgICAgICAgICBpZigkaWZyYW1lICYmICEkaWZyYW1lLmF0dHIoJ3NyYycpKXtcbiAgICAgICAgICAgICAgICAgICAgJGlmcmFtZS5hdHRyKCdzcmMnLCB2aWRlb1NyYyArIFwiP2VuYWJsZWpzYXBpPTEmc2hvd2luZm89MFwiKVxuICAgICAgICAgICAgICAgICAgICAkaWZyYW1lLm9uKCdsb2FkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5KHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSgkaWZyYW1lLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihtb2RhbCkge1xuICAgICAgICAgICAgICAgIHZhciAkbW9kYWwgPSAkKG1vZGFsKTtcbiAgICAgICAgICAgICAgICB2YXIgJGlmcmFtZSA9ICRtb2RhbC5maW5kKCdpZnJhbWUnKTtcbiAgICAgICAgICAgICAgICBhdXRvc3RvcCgkaWZyYW1lLmdldCgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiLy8gTW92ZXMgdGhlIFdvb0NvbW1lcmNlIG5vdGljZSB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG5mdW5jdGlvbiByb3lhbF9tb3ZlTm90aWNlKCkge1xuICAgICQoJy5ub3RpY2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnByZXBlbmRUbygkKCdtYWluJykpO1xuICAgIH0pO1xufVxuXG5cbi8vIE1vdmVzIG5ld2x5IGFkZGVkIFdvb0NvbW1lcmNlIGNhcnQgbm90aWNlcyB0byB0aGUgdG9wIG9mIHRoZSBwYWdlXG5mdW5jdGlvbiByb3lhbF9yZWZyZXNoQ2FydE5vdGljZSgpIHtcbiAgICB2YXIgY2FydExvb3AgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCQoJ21haW4gLmNvbnRhaW5lciAubm90aWNlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcm95YWxfbW92ZU5vdGljZSgpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjYXJ0TG9vcCk7XG4gICAgICAgIH1cbiAgICB9LCAyNTApO1xufVxuIiwiZnVuY3Rpb24gcm95YWxfcXVpeigpIHtcblxuICAgIC8vIEFzc2V0IFByb3RlY3Rpb24gUXVpelxuICAgIGlmICgkKCcjYXNzZXQtcHJvdGVjdGlvbi1xdWl6JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIE1hdGVyaWFsaXplIGNhcm91c2VsIHNldHRpbmdzXG4gICAgICAgICQoJy5jYXJvdXNlbC5jYXJvdXNlbC1zbGlkZXInKS5jYXJvdXNlbCh7XG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWUsXG4gICAgICAgICAgICBpbmRpY2F0b3JzOnRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUXVlc3Rpb25zIHBhbmVsIGRpc3BsYXkgJiBuYXZpZ2F0aW9uXG4gICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLmhpZGUoKTtcbiAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLnVuYmluZCgnY2xpY2snKS5iaW5kKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoJy50b2dnbGUtc2VjdGlvbicpLnNsaWRlVG9nZ2xlKCdmYXN0JyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKCQoJy50b2dnbGUtc2VjdGlvbicpLmNzcygnZGlzcGxheScpPT0nYmxvY2snKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJDTE9TRSBRVUlaXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykuYWRkQ2xhc3MoXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1xdWl6LXRvZ2dsZScpLmh0bWwoXCJUQUtFIFRIRSBRVUlaXCIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcuYnRuLXF1aXotdG9nZ2xlJykucmVtb3ZlQ2xhc3MoXCJjbG9zZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVzdWx0cyAmIGVtYWlsXG4gICAgICAgIC8vIENvZGUgZ29lcyBoZXJlLi4uXG4gICAgfVxuXG59XG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyAtLS0tIEdMT0JBTCAtLS0tIC8vXHJcbiAgICByb3lhbF9tZW51cygpO1xyXG4gICAgcm95YWxfbG9naW4oKTtcclxuXHJcblxyXG4gICAgLy8gLS0tLSBHRU5FUkFMIC0tLS0gLy9cclxuICAgIGlmKCQuZm4ucGFyYWxsYXggJiYgJCgnLnBhcmFsbGF4JykubGVuZ3RoKXtcclxuICAgICAgICAkKCcucGFyYWxsYXgnKS5wYXJhbGxheCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyAtLS0tIE1PQklMRSAtLS0tIC8vXHJcblxyXG5cclxuICAgIC8vIC0tLS0gTEFORElORyBQQUdFUyAtLS0tIC8vXHJcbiAgICBpZiAoJCgnI2hvbWUnKS5sZW5ndGgpIHtcclxuICAgICAgICAkKCcuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogMzUwLFxyXG4gICAgICAgICAgICBmdWxsV2lkdGg6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KGF1dG9wbGF5LCA5MDAwKTtcclxuICAgICAgICBmdW5jdGlvbiBhdXRvcGxheSgpIHtcclxuICAgICAgICAgICAgJCgnLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKCduZXh0Jyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoYXV0b3BsYXksIDEyMDAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIC0tLS0gUFJPTU9USU9OUyAtLS0tIC8vXHJcbiAgICBpZiAoJCgnLm1vZGFsLXRyaWdnZXInKS5sZW5ndGgpIHtcclxuICAgICAgICByb3lhbF9tb2RhbHMoKTtcclxuICAgIH1cclxuICAgIC8qIGlmICgkKCcucXVpeicpLmxlbmd0aCl7XHJcbiAgICAgKiAgICAgcm95YWxfcXVpeigpO1xyXG4gICAgICogfSovXHJcblxyXG5cclxuICAgIC8vIC0tLS0gV09PQ09NTUVSQ0UgLS0tLSAvL1xyXG4gICAgaWYgKCQoJ2JvZHkud29vY29tbWVyY2UnKS5sZW5ndGgpIHtcclxuICAgICAgICByb3lhbF93b29jb21tZXJjZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyAtLS0tIEJMT0cgLS0tLSAvL1xyXG4gICAgaWYgKCQoJyNmZWVkJykubGVuZ3RoKSB7XHJcbiAgICAgICAgJCgnLmNhcm91c2VsLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtmdWxsV2lkdGg6IHRydWV9KTtcclxuICAgICAgICB2YXIgY29sdW1ucyA9ICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS5oYXNDbGFzcygnbTknKSA/IDMgOiA0O1xyXG4gICAgICAgIHZhciAkbXNucnkgPSAkKCcubWFzb25yeScpLm1hc29ucnkoIHtcclxuICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnYXJ0aWNsZScsXHJcbiAgICAgICAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgZml0V2lkdGg6IHRydWUsXHJcbiAgICAgICAgICAgIGhpZGRlblN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxMDBweCknLFxyXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmlzaWJsZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwcHgpJyxcclxuICAgICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2J1dHRvbiB0byBsb2FkIG1vcmUgcG9zdHMgdmlhIGFqYXhcclxuICAgICAgICAkKCdbZGF0YS1sb2FkLW1vcmUtcG9zdHNdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgJHRoaXMuZGF0YSgnYWN0aXZlLXRleHQnLCAkdGhpcy50ZXh0KCkpLnRleHQoXCJMb2FkaW5nIHBvc3RzLi4uXCIpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkdGhpcy5kYXRhKFwib2Zmc2V0XCIpO1xyXG4gICAgICAgICAgICB2YXIgcG9zdHNQZXJQYWdlID0gJHRoaXMuZGF0YShcInBvc3RzLXBlci1wYWdlXCIpO1xyXG4gICAgICAgICAgICBnZXRNb3JlUG9zdHMob2Zmc2V0LCBwb3N0c1BlclBhZ2UpLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgICAgIHZhciAkcmVzID0gJChyZXMpO1xyXG4gICAgICAgICAgICAgICAgJG1zbnJ5LmFwcGVuZCggJHJlcyApLm1hc29ucnkoICdhcHBlbmRlZCcsICRyZXMgKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdPZmZzZXQgPSBvZmZzZXQrcG9zdHNQZXJQYWdlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1BhcmFtcyA9ICc/b2Zmc2V0PScrIG5ld09mZnNldDtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7dXJsUGF0aDpuZXdQYXJhbXN9LFwiXCIsbmV3UGFyYW1zKVxyXG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0YShcIm9mZnNldFwiLG5ld09mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy50ZXh0KCR0aGlzLmRhdGEoJ2FjdGl2ZS10ZXh0JykpLmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZS1zaWRlYmFyXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICRtc25yeS5tYXNvbnJ5KCdsYXlvdXQnLCB0cnVlKVxyXG4gICAgICAgICAgICAkKCcjZmVlZCAuY29sJykuZmlyc3QoKS50b2dnbGVDbGFzcygnbTknKS50b2dnbGVDbGFzcygnbTEyJyk7XHJcbiAgICAgICAgICAgICQoJyNmZWVkIC5jb2wnKS5sYXN0KCkudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkbXNucnkubWFzb25yeSgnbGF5b3V0JywgdHJ1ZSlcclxuICAgICAgICAgICAgfSwgNDAwKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJveWFsX2ZpbHRlclBvc3RzKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJCgnbWFpbiNhcnRpY2xlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJveWFsX2FydGljbGUoKTtcclxuICAgIH1cclxufSk7XHJcbiIsIi8qICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gKiAgICAgaWYgKCQoJy5teS1hY2NvdW50JykubGVuZ3RoKSB7XG4gKiAgICAgfVxuICogfSkqL1xuIiwidmFyIGRpZFNjcm9sbDtcbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcbiAgICBkaWRTY3JvbGwgPSB0cnVlO1xuICAgIHZhciB0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICBpZiAoJCgnLmhlcm8tY29udGFpbmVyLCAucGFyYWxsYXgtY29udGFpbmVyJykubGVuZ3RoKSB7XG4gICAgICAgIHJveWFsX3RvZ2dsZV9tZW51cyh0b3ApO1xuICAgIH1cblxuICAgIGlmICgkKCcuY29uc3VsdGF0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaGVybyA9ICQoJy5oZXJvLWNvbnRhaW5lcicpLmhlaWdodCgpO1xuICAgICAgICBpZiAodG9wID4gaGVybyAmJiAkKCduYXYnKS5oYXNDbGFzcygnbm8tc2hhZG93JykpIHtcbiAgICAgICAgICAgICQoJ25hdicpLnJlbW92ZUNsYXNzKCduby1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0b3AgPCBoZXJvICYmICEkKCduYXYnKS5oYXNDbGFzcygnbm8tc2hhZG93JykpIHtcbiAgICAgICAgICAgICQoJ25hdicpLmFkZENsYXNzKCduby1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZiAoZGlkU2Nyb2xsKSB7XG4gICAgICAgIC8qIHRvZ2dsZU5hdigpOyovXG4gICAgICAgIGRpZFNjcm9sbCA9IGZhbHNlO1xuICAgIH1cbn0sIDI1MCk7XG4iLCIiLCJmdW5jdGlvbiByb3lhbF93b29jb21tZXJjZSgpIHtcblxuICAgIC8vIC0tLS0gTm90aWNlcyAtLS0tIC8vXG4gICAgaWYgKCQoJy5ub3RpY2UnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJveWFsX21vdmVOb3RpY2UoKTtcbiAgICB9XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbigndXBkYXRlZF9jYXJ0X3RvdGFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgICByb3lhbF9tb3ZlTm90aWNlKCk7XG4gICAgfSk7XG5cbiAgICAvLyAtLS0tIFByb2R1Y3RzIC0tLS0gLy9cbiAgICBpZiAoJCgnbWFpbiNwcm9kdWN0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tIENhcnQgLS0tLSAvL1xuICAgIGlmICgkKCcud29vY29tbWVyY2UtY2FydC1mb3JtJykubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcucHJvZHVjdC1yZW1vdmUgYScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcm95YWxfcmVmcmVzaENhcnROb3RpY2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLSBDaGVja291dCAtLS0tLSAvL1xuICAgIC8qICQoJyNwYXltZW50IFt0eXBlPXJhZGlvXScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAqICAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICAgKiB9KTsqL1xufVxuIl19
>>>>>>> merge

})(jQuery);