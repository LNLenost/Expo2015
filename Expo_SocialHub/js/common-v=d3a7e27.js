function searchsubmit(){var e=this;e.init=function(){var i=$(".wrapperSearch, .wrappersearch"),n=i.find(".search");i.submit(function(i){var o=e.cleanQuery(n.val());if(""!=o){var t=serp_url+"q-"+o+".html";location.href=t}i.preventDefault()})},e.cleanQuery=function(e){var i="_";return e=e.toLowerCase(),e=e.replace(/http(s?):\/\//g,""),e=e.replace(/<[^>]+>/gi,""),e=e.replace(/\?|&nbsp;| |\+|%C2%A0|%20|-|\//g,i),e=e.replace(/^(_|-|)|(_|-)$/g,"")}}function search(){var e=this;e.init=function(){var e=$("#header").find(".areasearch"),i=e.find(".triggerSearch"),n=e.find(".search"),o=e.find(".wrappersearch");i.click(function(e){o.hasClass("hiddensearch")&&(o.show(0).removeClass("hiddensearch"),n.focus(),e.preventDefault())}),n.blur(function(){$(this);setTimeout(function(){o.addClass("hiddensearch")},500),setTimeout(function(){o.hide()},1500)})}}function fontResizer(){var e=this;e.init=function(){$.creaseFont({content:".resizable",defaultSize:100,maxSize:160,minSize:70,stepSize:10,unit:"%",bFontLarge:"#fontLarge",bFontDefault:"#fontDefault",bFontSmall:"#fontSmall",animate:!1,animateSpeed:500,cookieName:"creaseFont",cookiePath:"/",cookieLifetime:0})}}function printPage(){var e=this;e.init=function(){$(".print").click(function(e){window.print(),e.preventDefault()})},e.init()}function menuMobile(){var e=this;e.init=function(){e.hamburger=$(document.createElement("a")),e.hamburger.addClass("hamburger"),e.hamburger.html("<span></span>"),e.tendinaMenu=$(document.createElement("div")).addClass("tendinaMenu scrollable");var i=$(document.createElement("div")).addClass("wrapper"),n=$("#mainMenu").find("li").clone(),o=$(".login").clone(),t=$(".langSwitcher").clone(),a=$(document.createElement("ul")).addClass("menu").append(n);i.append(t).append(o).append(a),i.appendTo(e.tendinaMenu),e.tendinaMenu.hide().appendTo($("body"));var s=$("#intestazione"),r=s.find(".intestazionedx");e.hamburger.appendTo(r),e.hamburger.find("span").click(function(){e.tendinaMenu.is(":visible")?($(document).off("touchmove"),$("html").css({height:"auto",width:"auto",overflow:"visible"}),$("body").css({overflow:"visible",height:"auto",position:"static",width:"auto"}),e.hamburger.removeClass("hamburgerActive"),e.tendinaMenu.removeClass("visible"),setTimeout(function(){e.tendinaMenu.css("display","none")},650)):($("html").css({height:"100%",width:"100%",overflow:"hidden"}),$("body").css({overflow:"hidden",height:"100%",position:"fixed",width:"100%"}),$(document).on("touchmove",function(e){$(".scrollable").has($(e.target)).length||e.preventDefault()}),e.hamburger.addClass("hamburgerActive"),e.tendinaMenu.css("display","block"),setTimeout(function(){e.tendinaMenu.addClass("visible")},10))}),$(window).resize(function(){e.tendinaMenu.is(":visible")&&$(window).width()>800&&e.hamburger.click()})}}function showHideLogin(){var e=this;e.init=function(){e.triggerShow=$(".triggerShowLogin"),e.mask=$("#mask"),e.arealogin=e.mask.find(".arealogin"),e.close=e.arealogin.find(".close"),e.body=$("body"),e.triggerShow.click(function(i){e.body.addClass("fixed"),e.mask.show(0).addClass("visible"),setTimeout(function(){e.arealogin.removeClass("closed")},300),e.disableScroll(),i.preventDefault(),menuMobile.tendinaMenu.is(":visible")&&menuMobile.hamburger.click()}),e.close.click(function(i){e.arealogin.addClass("closed"),setTimeout(function(){e.mask.removeClass("visible")},500),setTimeout(function(){e.mask.hide(0),e.body.removeClass("fixed")},800),e.enableScroll(),i.preventDefault()})},e.disableScroll=function(){$(window).on("touchmove.modaleLogin",function(e){e.preventDefault()}),$(window).on("scroll.modaleLogin mousewheel.modaleLogin",function(e){return e.preventDefault(),!1})},e.enableScroll=function(){$(window).off("touchmove.modaleLogin"),$(window).off("scroll.modaleLogin mousewheel.modaleLogin")}}function socialShare(){var e=this;e.init=function(){$(".triggerShare").click(function(){var e=$(this).attr("data-share");return e=e.replace("§url§",document.location),window.open(e,"","width=600, height=300, toolbar=no, scrollbars=yes, resizable=no"),!1})}}function showHideVideo(){var e=this;e.init=function(){e.triggerShow=$(".triggerVideo"),e.mask=$("#maskVideo"),e.areavideo=e.mask.find(".areavideo"),e.close=e.areavideo.find(".close"),e.body=$("body"),e.baseUrl="http://www.youtube.com/embed/",e.triggerShow.click(function(i){e.body.addClass("fixed"),e.mask.show(0).addClass("visible"),e.id=$(this).attr("data-id"),setTimeout(function(){e.areavideo.removeClass("closed")},300),setTimeout(function(){e.iframe=$(document.createElement("iframe")).attr({width:"640",height:"480",allowfullscreen:1,frameborder:0,autoplay:1,src:e.baseUrl+e.id+"?autoplay=1"}),e.areavideo.find(".wrapVideo").find(".video").html(e.iframe)},1e3),e.disableScroll(),i.preventDefault(),menuMobile.tendinaMenu.is(":visible")&&menuMobile.hamburger.click()}),e.close.click(function(i){e.areavideo.addClass("closed"),setTimeout(function(){e.mask.removeClass("visible")},500),setTimeout(function(){e.mask.hide(0),e.body.removeClass("fixed"),e.iframe.remove()},800),e.enableScroll(),i.preventDefault()})},e.disableScroll=function(){$(window).on("touchmove.modalevideo",function(e){e.preventDefault()}),$(window).on("scroll.modalevideo mousewheel.modalevideo",function(e){return e.preventDefault(),!1})},e.enableScroll=function(){$(window).off("touchmove.modalevideo"),$(window).off("scroll.modalevideo mousewheel.modalevideo")}}function initTooltip(){var e=this;e.init=function(){$(".triggerTooltip:not(.processed)").each(function(){$(this).qtip({content:{text:$(this).attr("data-text")},style:{classes:"qtip-tipsy qtip-shadow qtip-wr"},position:{my:$(this).attr("data-my"),at:$(this).attr("data-at"),adjust:{y:parseInt($(this).attr("data-adjy")),x:parseInt($(this).attr("data-adjx"))}},hide:{fixed:!0,delay:300},show:{solo:!0}}),$(this).addClass("processed")})}}var isTouch="ontouchstart"in window||navigator.msMaxTouchPoints>0,searchEffect,searchSubmit,fontR,printPage,menuMobile,showHideLogin,showHideVideo,socialShare,initTooltip;$(function(){isTouch&&$("body").addClass("touch"),searchEffect=new search,searchEffect.init(),searchSubmit=new searchsubmit,searchSubmit.init(),fontR=new fontResizer,fontR.init(),printPage=new printPage,menuMobile=new menuMobile,menuMobile.init(),showHideLogin=new showHideLogin,showHideLogin.init(),showHideVideo=new showHideVideo,showHideVideo.init(),socialShare=new socialShare,socialShare.init(),initTooltip=new initTooltip,initTooltip.init()});