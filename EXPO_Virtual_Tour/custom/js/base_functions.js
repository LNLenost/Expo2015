var krpano;
var current_pano = "";
var active_stargate = "";

var hlookat = 0;
var vlookat = 0;
var fov = 60;

var mappa = 'pano33034';

var GET_scena;
var GET_hotspot;
var GET_hlookat = "";
var GET_vlookat = "";
var GET_fov = "";
var GET_language;
var GET_participant = "";

var language = "EN";
var active_hotspot_info = 0;
var map_participants_visible = false;

var data;
var foody_spots;
var jsonDataFile_path = "custom/data/";

var myScroll;
var ios = false;
if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))
	ios = true;

// INIT FUNCTIONS ----------------------------------------------------------------------------------------------

$(document).ready(function() {
	 
	loadJSONDataAndInitInterface();
    
	var viewPortScale = 1 / window.devicePixelRatio;
	$('#viewport').attr('content', 'user-scalable=no, initial-scale='+viewPortScale+', width=device-width');
	
	$('.splash-image').click(function() {
		window.open('http://virtual.expo2015.org/qatar/?from=expovt');
  	});

});

function js_startup() {
	// console.log(arguments.callee.name);
	
	$('.skip-container').click(function () {
		hideSplashScreen();
	});
	
	krpano = document.getElementById("krpanoSWFObject");
	
	showInterfaceMenu();
	
	krpano.set("autorotate.enabled", "false");
	krpano.set("autorotate.speen", 0);
	
	krpano.set("events.onloadcomplete", "js(onLoadCompleteFunction())");
	krpano.set("events.onpreviewcomplete", "js(onPreviewCompleteFunction())");
	krpano.set("events.onremovepano", "js(onRemovePanoFunction())");
	krpano.set("events.onResize", "js(onResizeFunction())");
	
	// krpano.set("events.onmousewheel", "js(onMouseWheel())");
	
//	krpano.set("events.onstartautorotation", "js(onRemoveDisplayedObjectFunction())");
//	krpano.set("events.onresumeautorotation", "js(onResumeDisplayedObjectFunction())");
	
	krpano.set("layer[button7].height", "52");
	krpano.set("layer[button7].width", "260");
    setTimeout(function(){ krpano.set("layer[button7].visible", "false"); }, 4000);
	
	krpano.set("view.keep", true);
	
	// krpano.call("setViewArchitectural();");

//	$(".owl-carousel").hide();

	$(".header-title-container").unbind();
	$(".header-title-container").click(function () {
		showPanoDescription(krpano.get("scene[get(xml.scene)].name"));
	});
	
	changeScenaFromURL ();
}

function showHideParticipantsOnMap () {
        
    if (krpano.get("xml.scene") == mappa) {
        if (!map_participants_visible) {
            map_participants_visible = true;
            showMapParticipant();
        }
        else {
            map_participants_visible = false;
            hideMapParticipant();
        }
    }   
}

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function loadJSONDataAndInitInterface() {
	
	GET_language = GetURLParameter("language");
	
	if (typeof GET_language != 'undefined') {
		language = GET_language;
		
		changeLanguageSelector();
	}
	
	$.getJSON( jsonDataFile_path+language+"_EXPO_data.json", function( output ) {
		data = output;
		initInterface();
	});
	
	loadFoodySpots();
}

function loadJSONData() {

	$.getJSON( jsonDataFile_path+language+"_EXPO_data.json", function( output ) {
		data = output;

		initMenu();
		
		if (krpano != null)
			changeTooltipsLanguage();
//		else
//			console.log("changeTooltipsLanguage can't be called")
	});
}

function loadFoodySpots () {
    if (typeof foody_spots == "undefined" ) {
        $.getJSON( jsonDataFile_path+"foody_spots.json", function( output ) {
            foody_spots = output;
        });
    }
}

function changeTooltipsLanguage () {
	
	changeExpoPanoIcon();
	
	$.each(data.hotspot_zoom, function(index, item) {
		krpano.set("data[en_"+item.code+"_tooltip].content", item.tooltip);
	});
	
	$.each(data.hotspot_stargate, function(index, item) {
		krpano.set("data[en_"+item.code+"_tooltip].content", item.title);
	});
	
	$.each(data.hotspot_text, function(index, item) {
		krpano.set("data[en_"+item.code+"_tooltip].content", item.tooltip);
	});

	$.each(data.hotspot_gallery, function(index, item) {
		krpano.set("data[en_"+item.code+"_tooltip].content", item.tooltip);
	});
	
	$.each(data.hotspot_internodo, function(index, item) {
        krpano.set("data[en_"+item.hotspot_code+"_tooltip].content", item.tooltip);
    });
    
    $.each(data.video_hotspot, function(index, item) {
        krpano.set("data[en_"+item.hotspot_code+"_tooltip].content", item.tooltip);
    });
	
//	$.each(data.interface_element, function(index, item) {
//		krpano.set("data[en_"+item.code+"tooltip].content", item.tooltip);
//	});
	
	var tooltip_name;
	$.each(data.participant, function(index, item) {
		tooltip_name = 'tooltip_'+item.code;
		krpano.call("set(layer["+tooltip_name+"].html,"+item.name+");");
	});
	
	$.each(data.hotspot_internodo, function(index, item) {
        tooltip_name = 'tooltip_'+item.hotspot_code;
        krpano.call("set(layer["+tooltip_name+"].html,"+item.tooltip+");");
    });
	
	// Change interface elements tooltips
	switch (language) {
		case "IT":
			krpano.set("data[en_button1tooltip].content", "Mappa");
			krpano.set("data[en_button2tooltip].content", "Selezione scena");
			krpano.set("data[en_button6tooltip].content", "Condividi tour");
			krpano.set("data[en_togglebutton2firsttooltip].content", "Autorotazione ON");
			krpano.set("data[en_togglebutton2secondtooltip].content", "Autorotazione OFF");
			break;
		case "FR":
		default:
			krpano.set("data[en_button1tooltip].content", "Map");
			krpano.set("data[en_button2tooltip].content", "Scene selection");
			krpano.set("data[en_button6tooltip].content", "Share tour");
			krpano.set("data[en_togglebutton2firsttooltip].content", "Autorotation ON");
			krpano.set("data[en_togglebutton2secondtooltip].content", "Autorotation OFF");
			break;
	}
	
	refreshAmbassador();
	setAmbassadorTexts();
}

// KRPANO FUNCTIONS ---------------------------------------------------------------------------------------------------

function onRemovePanoFunction() {
	// console.log(arguments.callee.name);
	hideAll();
	showExtraLoader();
	removeDescriptions();
}

function onLoadCompleteFunction() {
	// console.log(arguments.callee.name);
	
	// FRA
	if (krpano.get("xml.scene") != mappa) {
        krpano.set("view.vlookatmin", -75);
        krpano.set("view.vlookatmax", 75);
	}
	
	// setCurrentPano();
    changeExpoPanoIcon();
	initScena();
	hideSplashScreen();
	changeTooltipsLanguage();
	hideExtraLoader();
	
	if (krpano.get("xml.scene") == mappa) {
        map_participants_visible = false;
        initMap();
	}
    else {
        map_participants_visible = false;
    	krpano.set("layer[button7].visible", "true");
        setTimeout(function(){ krpano.set("layer[button7].visible", "false"); }, 4000);
    }
	
	ga('send', 'event', language, '3DS Logo', "View");
}

function onResizeFunction () {
//	// console.log(arguments.callee.name);
	setInterfaceElementsPositions();
	
}

function onPreviewCompleteFunction() {
	
	// console.log(arguments.callee.name);
	
	setCurrentPano();
	
	if (krpano.get("xml.scene") != mappa) {
        krpano.call("setViewArchitectural();");
        showAmbassadorContainer();
        showInterfaceMenu();
	}
   else {
        krpano.set("view.fisheye",0.35);
        krpano.set("view.architectural",0);
        krpano.set("view.limitview","auto");
        krpano.set("update","view");
        
        hideAmbassadorContainer();
        hideInterfaceMenu();
    }
}

function changeScenaFromURL () {
	

	GET_scena = GetURLParameter("go");
	GET_hotspot = GetURLParameter("hotspot_code");
	GET_participant = GetURLParameter("p");
	
//	GET_hlookat = GetURLParameter("view_hlookat");
//	GET_vlookat = GetURLParameter("view_vlookat");
//	GET_fov = GetURLParameter("view_fov");
	
	if (typeof GET_participant != 'undefined')
        showParticipant(GET_participant);
	
	if (typeof GET_scena != 'undefined')
		loadScenaFromURL();
	
//	var change_view = false;
	
//	if (typeof GET_hlookat != 'undefined') {
//		hlookat = GET_hlookat;
//		change_view = true;
//	}
//	
//	if (typeof GET_vlookat != 'undefined') {
//		vlookat = GET_vlookat;
//		change_view = true;
//	}
//	
//	if (typeof GET_fov != 'undefined') {
//		fov = GET_fov;
//		change_view = true;
//	}
//	if (change_view)
//		lookAtSpecificView ();	
	
	if (typeof GET_hotspot != 'undefined') {
		
		var hotspot_code;
		
		$.each(data.participant, function(index, item) {
			
			if (GET_hotspot == item.value)
				hotspot_code = item.id_hotspot;
		});
		
		lookToHotspot(hotspot_code);
	}
}

function showParticipant (participant_shortcode) {
    
    $.each(data.search_list, function(index, item) {
        if (participant_shortcode == item.permalink)
            changeSceneAndLookToHotspot(item.scene_code, item.code);
    });
}

function loadScenaFromURL () {
	
	// console.log(arguments.callee.name);
	
	var scene_code;
	
	$.each(data.scene, function(index, item) {
		if (GET_scena == item.url_code)
			scene_code = item.code;
	});
	
	if (scene_code != current_pano)
		changeScene(scene_code);
}

function changeScene(scene_code) {

//	showSplashScreen ();

	if (current_pano != scene_code) {
		hideAll();
		hidePanoramaMenu();
		krpano.call("loadscene("+scene_code+")");
	}
}

function changeSceneAndLookToHotspot(scene_code, hotspot_code) {
	
	changeScene(scene_code);
	
	lookToHotspot(hotspot_code);
}

function lookToHotspot (hotspot_code) {
	krpano.call("looktohotspot("+hotspot_code+", 70)");
}

function setHotspotImage (hotspot_code, image_path) {
	krpano.call("set(hotspot["+hotspot_code+"].url,"+image_path+")");
}

/* FRA -- */
function setHotspotTooltip (hotspot_code, tooltip_text, type) {
	var tooltip_name = 'tooltip_'+hotspot_code;
	krpano.call("addlayer("+tooltip_name+");");
	krpano.call("set(layer["+tooltip_name+"].url,%FIRSTXML%/graphics/textfield.swf);");
	krpano.call("set(layer["+tooltip_name+"].align,bottom);");
	krpano.call("set(layer["+tooltip_name+"].edge,top);");
	krpano.call("set(layer["+tooltip_name+"].parent,hotspot["+hotspot_code+"]);");
	krpano.call("set(layer["+tooltip_name+"].html,"+tooltip_text+");");
	krpano.call("set(layer["+tooltip_name+"].visible,true);");
	krpano.call("set(layer["+tooltip_name+"].background,false);");
	krpano.call("set(layer["+tooltip_name+"].border,false);");
	krpano.call("set(layer["+tooltip_name+"].textshadow,1);"); 
	krpano.call("set(layer["+tooltip_name+"].textshadowrange,4.0);"); 
	krpano.call("set(layer["+tooltip_name+"].textshadowangle,45);");
	krpano.call("set(layer["+tooltip_name+"].textshadowcolor,0x000000);"); 
	krpano.call("set(layer["+tooltip_name+"].textshadowalpha,1);");
	switch (type) {
		case "participant":
			krpano.call("set(layer["+tooltip_name+"].css,color:#ffffff;font-family:Arial;font-weight:bold;font-size:20px;text-align:center;);");
			break;
		case "internodo":
			krpano.call("set(layer["+tooltip_name+"].css,color:#ffffff;font-family:Arial;font-weight:bold;font-size:18px;text-align:center;);");
			break;
	}
	if (krpano.get("xml.scene") != mappa)
	   krpano.call("set(layer["+tooltip_name+"].width,200);");
    // else
        // krpano.call("set(layer["+tooltip_name+"].width,400);");
	krpano.call("set(layer["+tooltip_name+"].height,20);");
	krpano.call("set(layer["+tooltip_name+"].autoheight,true);");
	krpano.call("set(layer["+tooltip_name+"].selectable,false);");
}
/* -- FRA */

function getCurrentView () {
	hlookat = Number( krpano.get("view.hlookat") );
	vlookat = Number( krpano.get("view.vlookat") );
	fov     = Number( krpano.get("view.fov") );
}

function getCurrentViewURLParameters () {
	
	getCurrentView ();
	
	var url_code;
	
	$.each(data.scene, function(index, item) {
		if (current_pano == item.code)
			url_code = item.url_code;
	});
	
	return "?scena="+url_code+"&view_hlookat=" + hlookat.toFixed(2) + "&view_vlookat=" + vlookat.toFixed(2) + "&view_fov=" + fov.toFixed(2);
}

function lookAtSpecificView () {
	
	krpano.call("lookat("+hlookat+", "+vlookat+", "+fov+")");
}

function loadIScroll (element_class) {
	myScroll = new IScroll(element_class, {
		scrollbars: true,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: false,
		click: true
	});
}

function hideHotspot(hotspot_id) {
	var alpha = krpano.get("hotspot["+hotspot_id+"].alpha");
	if (alpha == 1) {
		var varHideHotspot = setInterval(function () {
			alpha = alpha - 0.01;
			krpano.set("hotspot["+hotspot_id+"].alpha", alpha);
			if (alpha < 0) {
				clearInterval(varHideHotspot);
				krpano.set("hotspot["+hotspot_id+"].alpha", "0");
				krpano.set("hotspot["+hotspot_id+"].visible", false);
			}
		}, 1);
	}
}

function showHotspot(hotspot_id) {
	var alpha = krpano.get("hotspot["+hotspot_id+"].alpha");
	if (alpha == 0) {
		var varHideHotspot = setInterval(function () {
			alpha = alpha + 0.01;
			krpano.set("hotspot["+hotspot_id+"].alpha", alpha);
			if (alpha > 1) {
				clearInterval(varHideHotspot);
				krpano.set("hotspot["+hotspot_id+"].alpha", "1");
				krpano.set("hotspot["+hotspot_id+"].visible", true);
			}
		}, 1);
	}
	krpano.set("hotspot["+hotspot_id+"].visible", "true");
}

function showHideHotspot(hotspot_id) {
	if (krpano.get("hotspot["+hotspot_id+"].visible") == true) {
		hideHotspot(hotspot_id);
	}
	else
		showHotspot(hotspot_id);
}

function setCurrentPano () {
    
    if (krpano.get("xml.scene") != mappa)
	   current_pano = krpano.get("xml.scene");
}

function topAlign (element) {
	element.css("top", $(".header").height() + 5 +"px");
}

function middleAlign (container, element) {
	element.css("top", (container.height()-element.height()) / 2 +"px");
}

function hideSplashScreen() {
	if ($('.splash-container').is(":visible")) {
		$('.splash-container').hide();
		// showPanoramaMenu();
	}
	
	$('.ui-effects-wrapper').remove();
	
	if ($(".cookie-info-container").length)
	   $(".cookie-info-container").remove();
	   
    if (Cookies.get("cookie-expoVT") === undefined) {
        
        var cookie_link, cookie_text, cookie_button;
        
        switch (language) {
            case "IT": 
                cookie_button = "CONTINUA";
                cookie_link = "http://www.expo2015.org/it/informazioni-utili/cookie";
                cookie_text = 'Questo sito web utilizza cookie tecnici per assicurare una migliore esperienza di navigazione; oltre ai cookie di natura tecnica sono utilizzati anche cookie di terze parti. Per saperne di più e conoscere i cookie utilizzati accedi alla pagina <a href="'+cookie_link+'" target="_bank">Cookie</a>.<br>Se prosegui nella navigazione di questo sito acconsenti all’utilizzo dei cookie.';
                break;
            case "FR":
                cookie_button = "CONTINUEZ";
                cookie_link = "http://www.expo2015.org/fr/cookie";
                cookie_text = 'Ce site internet utilise les cookies pour assurer une meilleure expérience de navigation; outre les cookies de nature technique, les cookies de tiers sont également utilisés. Pour plus de détails et pour connaître les cookies utilisés, accédez à la page <a href="'+cookie_link+'" target="_bank">Cookies</a>.<br>Si vous continuez à naviguer dans ce site, vous acceptez l’utilisation des cookies.';
                break;
            default:
                cookie_button = "CONTINUE";
                cookie_link = "http://www.expo2015.org/en/useful-information/cookies";
                cookie_text = 'This website uses cookies to ensure a better browsing experience; in addition to technical cookies, third-party cookies are also used. To learn more and become familiar with the cookies used, please visit the <a href="'+cookie_link+'" target="_bank">Cookies page</a>.<br>By continuing to browse this site, you automatically consent to the use of cookies.';
                break;
        }

        var html = '<div class="cookie-info-container">';
            html += '<div class="cookie-text">'+cookie_text+'</div>';
            html += '<div class="cookie-button-container"><div class="cookie-button">'+cookie_button+'</div></div>';
        html += '</div>';

        $("body").append(html);
        
        $('.cookie-button').click(function () {
            $(".cookie-info-container").remove();
            
            Cookies.set('cookie-expoVT', '7', { expires: 7 });
        });
    }
}

function showSplashScreen () {
	ga('send', 'event', language, '3DS Logo', "Splash view");
	if (!$('.splash-container').is(":visible"))
		$('.splash-container').show();
}

function showExtraLoader(){
	if (!$('.extra-loader').is(':visible'))
		$('.extra-loader').show();
}

function hideExtraLoader(){
	if ($('.extra-loader').is(':visible'))
		$('.extra-loader').hide();
}