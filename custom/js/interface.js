var image;
var description;
var product_detail;
var title;
var ambassador;
var participant_slider;
var checkZoomStatus;
var owl;

var showSurveyTimeout = 180000;

var info_title = "";
var active_hotspot_code = 0;
var active_stargate = '';
var active_zoom = "";
var look_to = "";

var images_path = "custom/images/";
var timeline_galleries_path = "custom/images/gallery/timeline/";
var generic_galleries_path = "custom/images/gallery/generic_gallery/";
var testimonial_galleries_path = "custom/images/gallery/testimonial/";
var art_galleries_path = "custom/images/gallery/art/";
var object_galleries_path = "custom/images/gallery/3Dobject/";
var flags_icons_path = "custom/images/participant/icon/";
var participant_images_path = "custom/images/participant/img/";
var ambassadors_picture_path = "custom/images/ambassador/";
var foody_img = "custom/images/foody.png";

var flags_path = "custom/images/participant/flag/";
var map_flags_icons_path = "custom/images/map_flag/";
var icons_path = "custom/images/icons/";
var scene_tiles_path = "custom/images/scene/logo/";

var pano_thumbs_path = "custom/images/scene/thumb/";

var site_url = "https://www.virtual.expo2015.org";

var you_are_here_hotspots=jQuery.parseJSON('{"hotspots": [{"scene": "Future food","scene_code": "pano27776","hotspot_code": "spotpoint33188"},{"scene": "Open air theater","scene_code": "pano5818","hotspot_code": "spotpoint33187"},{"scene": "Cereali","scene_code": "pano1340","hotspot_code": "spotpoint33189"},{"scene": "Biodiversità","scene_code": "pano28653","hotspot_code": "spotpoint33186"}, {"scene": "Zone aride","scene_code": "pano1168","hotspot_code": "spotpoint33185"},{"scene": "Isole","scene_code": "pano9","hotspot_code": "spotpoint33184"},{"scene": "Biomediterraneo","scene_code": "pano516","hotspot_code": "spotpoint33183"},{"scene": "Lake arena","scene_code": "pano5212","hotspot_code": "spotpoint33182"},{"scene": "Palazzo italia","scene_code": "pano861","hotspot_code": "spotpoint33181"},{"scene": "Spezie","scene_code": "pano226","hotspot_code": "spotpoint33180"},{"scene": "Frutta e legumi","scene_code": "pano1308","hotspot_code": "spotpoint33179"},{"scene": "Caffe","scene_code": "pano2355","hotspot_code": "spotpoint33175"},{"scene": "Cacao","scene_code": "pano1323","hotspot_code": "spotpoint33176"},{"scene": "Children park","scene_code": "pano28651","hotspot_code": "spotpoint33174"},{"scene": "cascina triulza","scene_code": "pano28655","hotspot_code": "spotpoint33173"},{"scene": "Riso","scene_code": "pano2374","hotspot_code": "spotpoint33177"},{"scene": "Padiglione zero","scene_code": "pano12823","hotspot_code": "spotpoint33178"},{"scene": "Padiglione zero - animali","scene_code": "pano12828","hotspot_code": "spotpoint33178"},{"scene": "Padiglione zero - valle","scene_code": "pano12830","hotspot_code": "spotpoint33178"},{"scene": "Corporate","scene_code": "pano21913","hotspot_code": "spotpoint33190"}]}');

// 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on. 8 per disabilitare il gioco
var foody_day_of_the_week = [3,4,5,6,0];

// INIT FUNCTIONS
// ----------------------------------------------------------------------------------------------

function initMenu() {

	// console.log(arguments.callee.name);

	if ($('#panorama-menu').length) {
		$('#panorama-menu').remove();
		$('body').append('<div id="panorama-menu" class="owl-carousel owl-theme"></div>');
	}

	owl = $("#panorama-menu");
	var html = "";

	$.each(data.scene, function(index, item) {
		if (item.thumb != "") {
			html += '<div class="item" code="' + item.code + '">';
			html += '<img src="' + pano_thumbs_path + item.thumb + '" />';
			html += '<div class="scene-menu-title" code="">' + item.name
					+ '</div>';
			html += '</div>';
		}
	});
	$("#panorama-menu").html(html);

	owl.owlCarousel({
		itemsScaleUp : true,
		itemsCustom : [ [ 0, 2 ], [ 400, 2 ], [ 500, 3 ], [ 600, 4 ],
				[ 700, 5 ], [ 1000, 6 ], [ 1200, 8 ], [ 1600, 14 ] ],
		navigation : true,
		navigationText : [ "", "" ],
		pagination : false,
		// mouseDrag : true,
        // touchDrag : true,
	});
    
    // $('#panorama-menu').append('<div class="owl-prev"></div><div class="owl-next"></div>');
    
    $('.owl-prev').click(function () {$("#owl-carousel").trigger('owl.prev');} );
    $('.owl-next').click(function () {$("#owl-carousel").trigger('owl.next');} );
    
	hidePanoramaMenu();

	$("#panorama-menu .item").each(function(index) {
		$(this).click(function() {
			changeScene($(this).attr("code"));
		});
	});

	initSearch();
}

function initSearch() {

	$(".search-icon").unbind();

	$(".search-icon").click(function() {
		showHideSearchBox();
	});

	var participant_data = data.search_list;

	$(".search").each(
		function(index) {
			$(this).autocomplete(
				{
					minLength : 0,
					source : participant_data,
					focus : function(event, ui) {
						$(".search").val(ui.item.name);
						return false;
					},
					select : function(event, ui) {
						$(".search").val(ui.item.name);
						ga('send', 'event', language, 'Search',
								ui.item.name);
						$(".search").blur();
						changeSceneAndLookToHotspot(ui.item.scene_code,
								ui.item.code);
						$(".search").val('');
						hideSearchBox();
						return false;
					}
				}).autocomplete("instance")._renderItem = function(ul,
				item) {
				return $("<li>").append(
						"<a>" + item.name + "<br><span>" + item.theme
								+ "</span></a>").appendTo(ul);
		};
	});
}

function initLanguageSelector() {

	$(".language-box").click(function() {
		showHideLanguageSelector();
	});

	$(".language-it").each(function() {
		$(this).click(function() {
			language = "IT";
			setLanguage();
			ga('send', 'event', language, 'Language switch', language);
		});
	});
	$(".language-en").each(function() {
		$(this).click(function() {
			language = "EN";
			setLanguage();
			ga('send', 'event', language, 'Language switch', language);
		});
	});
	$(".language-fr").each(function() {
		$(this).click(function() {
			language = "FR";
			setLanguage();
			ga('send', 'event', language, 'Language switch', language);
		});
	});

}

function initMap () {
    
    look_to = "";
    
    $.each(data.participant, function(index, item) {
        if (item.map_code != "") {
            if (item.map_code.split("_").length > 1) {
                var _var = item.map_code.split("_");
                krpano.set("hotspot[" + _var[0] + "].edge", "righttop");
            }
            else 
                krpano.set("hotspot[" + item.map_code + "].edge", "leftbottom");
        }
    });
    
    showHideParticipantsOnMap();
    
    $.each(you_are_here_hotspots.hotspots, function(index, item) {
        if (item.scene_code != current_pano)
            krpano.set("hotspot["+item.hotspot_code+"].visible", false);
        else {
            look_to = item.hotspot_code;
            krpano.set("hotspot["+item.hotspot_code+"].visible", true);
        }
    });
    
    $.each(data.hotspot_internodotooltip, function(index, item) {
        if (item.scene_code == mappa) {
            setHotspotTooltip(item.hotspot_code, item.tooltip, "internodo");
        }
    });
    
    $.each(data.hotspot_internodo, function(index, item) {
        if (item.scene_code == mappa) {
            if (item.scene_code_destination == current_pano) {
                setHotspotImage (item.hotspot_code, "custom/images/icons/segnaposto_singolo.png");
                look_to = item.hotspot_code;
            }
            else
                setHotspotImage (item.hotspot_code, "custom/images/icons/segnaposto.png");
        }
    });
    
    // if (look_to != "") {
        // krpano.call("looktohotspot("+look_to+", 1)");
    // }
    
    $('.logo-cluster').attr("src", "custom/images/ico_map.png");
    $('.logo-cluster').show();
    $('.cluster-title').html("Map");
}

function showMapParticipant() {
    $.each(data.participant, function(index, item) {
        if (item.map_code != "") {
            if (item.map_code.split("_").length > 1) {
                var _var = item.map_code.split("_");
                setHotspotImage(_var[0], map_flags_icons_path + item.iso_code + ".png");
            }
            else
                setHotspotImage(item.map_code, map_flags_icons_path + item.iso_code + ".png");
        }
    });
}

function hideMapParticipant() {
    $.each(data.participant, function(index, item) {
        if (item.map_code != "") {
            if (item.map_code.split("_").length > 1) {
                var _var = item.map_code.split("_");
                setHotspotImage(_var[0], map_flags_icons_path + "transparent_1x1.png");
            }
            else
                setHotspotImage(item.map_code, map_flags_icons_path + "transparent_1x1.png");
        }
    });
}

function showParticipantShortInfo(hotspot_id) {
    
    if ($('.map-participant-container').length)
       $('.map-participant-container').remove();
    
    $.each(data.participant, function(index, item) {
        if (item.map_code.indexOf(hotspot_id) >= 0 && item.search == 1) {
            
            var html = '<div class="map-participant-container">';
                html += '<div class="map-participant-header">';
                    html += '<div class="map-participant-close-container">';
                        html += '<img class="map-participant-close" src="custom/images/icons/chiudi.png" />';
                    html += '</div>';
                    html += '<div class="map-participant-flag"><img src="'+flags_path+item.flag_filename+'" /></div>';
                    html += '<div class="map-participant-title">'+item.name+'</div>';
                    html += '<div class="map-participant-button-container"><a class="map-participant-button">Go to pavilion</a></div>';
                    html += '<div class="clear"></div>';
                html += '</div>';
                var extra_text;
                if (item.extra_text != null)    
                    extra_text = item.extra_text;
                else
                    extra_text = "No infos avaiable";
                if (item.map_image_filename != "" && item.map_image_filename != null)
                    html += '<div class="map-participant-content"><div class="participant-content-scroller">'+extra_text+'<br><img src="'+participant_images_path+item.map_image_filename.trim()+'" /></div></div>';
                else
                    html += '<div class="map-participant-content"><div class="participant-content-scroller">'+extra_text+'</div></div>';
            html += '</div>';
            
            $('body').append(html);
            
            $('.map-participant-close').click(function () {hideParticipantShortInfo();});
            $('.map-participant-button').click(function () {hideParticipantShortInfo(); changeSceneAndLookToHotspot(item.scene_code, item.code);});
            
            $('.map-participant-container').show("slide", {
                direction : "right"
            }, 1000, function () {
                $('.map-participant-content').css('height', ($('.map-participant-container').innerHeight() - $('.map-participant-actions').height() - $('.map-participant-header').height() - 20) + "px");
                if ($(".map-participant-content img").length) {
                    $(".map-participant-content img").load(function() {
                        if(!ios)
                             loadIScroll('.map-participant-content');
                        else
                             $('.map-participant-content').addClass('scroll-ios');
                    });
                }
                else {
                    if(!ios)
                         loadIScroll('.map-participant-content');
                    else
                         $('.map-participant-content').addClass('scroll-ios');
                }
            });
        }
    });
}

function hideParticipantShortInfo () {
    if ($('.map-participant-container').length)
       $('.map-participant-container').remove();
}

function initInterface() {
	initLanguageSelector();
	initAmbassadorBox();
	setLanguage();
	initMenu();
	
	//MOSTRA QUESTIONARIO DOPO showSurveyTimeout MINUTI DI NAVIGAZIONE
	setTimeout(function(){ showSurvey(); }, showSurveyTimeout);
}

function checkFoody() {
    var now = new Date();
    var week_code = Math.floor(Date.parse(now.toUTCString())/(1000*60*60*24*7));

    if (jQuery.inArray(now.getUTCDay(), foody_day_of_the_week) >= 0) {
        $.each(foody_spots.spots, function(index, item) {
        
            if (item.week == week_code) {
                activate_foody(item.code);
            }
        });
        
    }
}

function showFoody(hotspot_id) {
    // console.log(hotspot_id);
}

function activate_foody (hotspot_code) {
    krpano.call("set(hotspot["+hotspot_code+"].url,"+foody_img+")");
    krpano.call("set(hotspot["+hotspot_code+"].width,\"80\")");
    krpano.call("set(hotspot["+hotspot_code+"].height,\"80\")");
}

function initScena() {

	initAmbassadorBox();

	$.each(data.participant, function(index, item) {
		if (item.scene_code == current_pano) {
			setHotspotImage(item.code, flags_icons_path + item.hotspot_icon);
			setHotspotTooltip(item.code, item.name, "participant");
		}
	});

	$.each(data.hotspot_internodo, function(index, item) {
		if (item.scene_code == current_pano) {
			setHotspotTooltip(item.hotspot_code, item.tooltip, "internodo");
		}
	});

	// Nasconde tutti gli stargate

	$.each(data.hotspot_stargate, function(index, item) {
		if (item.scene_code == current_pano) {
			if (item.image_code != "") {
				hideHotspot(item.image_code);
				setStargateZOrder(item.image_code);
			}
		}
	});

	var scene_name;

	$.each(data.scene, function(index, item) {
		if (item.code == current_pano) {
			scene_name = item.name;
		    
		    if (item.zoom == 1) {
                krpano.set("view.fovmin", 50);
                krpano.set("view.fovmax", 70);
		    }
		    else {
                krpano.set("view.fovmin", 70);
                krpano.set("view.fovmax", 90);
		    }
		    
		}
	});
	
	checkFoody();
    
	ga('send', 'event', language, 'Scena', scene_name);
}

// GENERIC FUNCTIONS
// ---------------------------------------------------------------------------------------------------

function showOverlay() {
	$('.overlay').show();
}

function hideOverlay() {
	$('.overlay').hide();
}

function changeExpoPanoIcon() {

	$.each(data.scene, function(index, item) {
		if (item.code == current_pano) {
			if (item.logo != "")
				$(".logo-cluster").attr("src", scene_tiles_path + item.logo);
			else
				$(".logo-cluster").attr("src", images_path + "blank_logo.png");

			$(".logo-cluster").show();

			$('.cluster-title').html(item.name);
		}
	});

}

function hideAll() {
	hideMap();
	hideAmbassador();
	hideGalleryContainer();
	hideInfoContainer();
	hideParticipantInfoContainer();
	hidePanoDescription();
	hidePanoramaMenu();
	hideAmbassador();
}

function hideAllButPanoramaMenu() {
	hideMap();
	hideAmbassador();
	hideAmbassador();
	hideGalleryContainer();
	hideInfoContainer();
	hideParticipantInfoContainer();
	hidePanoDescription();
}

function hideAllButMap() {
	hideAmbassador();
	hideInfoContainer();
	hideGalleryContainer();
	hideParticipantInfoContainer();
	hidePanoDescription();
	hidePanoramaMenu();
	
	initMap();
}

function changeFloorPlanText () {
	
//	$('.floorplanDropDownControl').hide();
}

function setInterfaceElementsPositions() {
	$(".country-info-container").css("top", $(".header").height() + 5 + "px");

//	$('.gallery-container').css("max-height",
//			($(window).height() - $('.header').height() - 80) + "px");

	if ($('.header').is(':hidden')) {
		$(".info-div").css("top", $(".mobile-header").height() + 5 + "px");
		//$('.gallery-container').css("top",
		//		$('.mobile-header').height() + 5 + "px");
	} else {
		$(".info-div").css("top", $(".header").height() + 10 + "px");
		//$('.gallery-container').css("top", $('.header').height() + 10 + "px");
	}
	
	
	// PORTRAIT
	if ($(window).width() < $(window).height()) {
		if ($('.header').is(':hidden')) {
			$('.country-info-container').height(
					$(window).height() - $('.mobile-header').height() - 10);
			$('.country-info-container').css("top",
					($('.mobile-header').height() + 5) + "px");
			//$('.gallery-container').css("top",
			//		($('.mobile-header').height() + 20) + "px");
		} else {
			$('.country-info-container').height(
					$(window).height() - $('.header').height() - 20);
			$('.country-info-container').css("top",
					($('.header').height() + 10) + "px");
			//$('.gallery-container').css("top",
			//		($('.mobile-header').height() + 20) + "px");
		}

		$('.country-info-container .bx-wrapper').height(
				$('.country-info-container').innerHeight()
						- $('.country-info-header').outerHeight(true) - 10);
		$('.country-info-container .bx-viewport').height(
				$('.country-info-container .bx-wrapper').innerHeight());
		$('.country-info-wrapper').height(
				$('.bx-wrapper').innerHeight()
						- $('.country-info-theme').outerHeight(true));

	}
	// LANSCAPE
	else {
		if ($(window).height() < 400) {
			$('.country-info-container').height($(window).height());
			$('.country-info-container').css("top", "0px");
		} else {
			if ($('.header').is(':hidden')) {
				$('.country-info-container').height(
						$(window).height() - $('.mobile-header').height() - 10);
				$('.country-info-container').css("top",
						($('.header').height() + 5) + "px");
			} else {
				$('.country-info-container').height(
						$(window).height() - $('.header').height() - 25);
				$('.country-info-container').css("top",
						($('.header').height() + 10) + "px");
			}

		}
		$('.country-info-container .bx-wrapper').height(
				$('.country-info-container').innerHeight()
						- $('.country-info-header').outerHeight(true) - 10);
		$('.country-info-container .bx-viewport').height(
				$('.country-info-container .bx-wrapper').innerHeight());
		$('.country-info-wrapper').height(
				$('.country-info-container .bx-wrapper').innerHeight()
						- $('.country-info-theme').outerHeight(true));
	}
	
}

// INFO TEXT FUNCTIONS
// ----------------------------------------------------------------------------------

// function showText(hotspot_id) {
// 	
	// // console.log(hotspot_id);
// 
	// hideAll();
// 
	// if (active_hotspot_info == hotspot_id)
		// hideInfoContainer();
	// else {
		// var text_hotspot;
// 
		// active_hotspot_info = hotspot_id;
// 
		// $.each(data.hotspot_text, function(index, item) {
			// if (item.code == hotspot_id)
				// text_hotspot = item;
		// });
// 
		// if (typeof text_hotspot != 'undefined') {
			// showInfo(text_hotspot.title, text_hotspot.text);
// 
			// ga('send', 'event', language, 'Text', text_hotspot.title);
		// }
	// }
// }

function showText(hotspot_code) {
    
    clearInterval(checkZoomStatus);
    hideHotspot(active_stargate);
    hideZoomHotspotImage(active_zoom);
    
    if (active_hotspot_info != hotspot_code) {
        hideAll();
        var text_hotspot;

        active_hotspot_info = hotspot_code;

        $.each(data.hotspot_text, function(index, item) {
            if (item.code == hotspot_code)
                text_hotspot = item;
        });

        if (typeof text_hotspot != 'undefined') {
            showInfo(text_hotspot.title, text_hotspot.text);

            ga('send', 'event', language, 'Text', text_hotspot.title);
        }
    }
    else {
        hideInfoContainer();
    }
}

function showInfo(title, text) {

	hidePanoramaMenu();
	
	if ($('.info-div').length)
       $('.info-div').remove();

    var html = '<div class="info-div">';
    html += '<div class="info-title">' + title + '</div>';
    html += '<div class="info-description"><div class="info-description-scroller">' + text.replace('expo2015.illy.com', '<a target="_blank" href="http://expo2015.illy.com">expo2015.illy.com</a>'); + '</div></div>';
    html += '</div>';
    $('body').append(html);

	setInterfaceElementsPositions();
	
	// if ($('.info-div').is(":hidden"))
		// $('.info-div').show("slide", {
			// direction : "left"
		// }, 1000, function () {
			// info_title = title;
			// if(!ios){
				 // loadIScroll('.info-description');
			// }
			// else
				 // $('.info-description').addClass('scroll-ios');
		// });
	// else {
		// if (info_title != title) {
			// $('.info-title').html(title);
			// $('.info-description-scroller').html(text);
			// if(!ios){
				// myScroll.refresh();
			// }
		// }
		// else
			// hideInfoContainer();
	// }
	
	$('.info-div').show("slide", {
        direction : "left"
    }, 1000, function () {
        info_title = title;
        if(!ios){
             loadIScroll('.info-description');
        }
        else
             $('.info-description').addClass('scroll-ios');
    });

}

function hideInfoContainer() {
    active_hotspot_info = 0;
    
    if ($('.info-div').length )
       $('.info-div').remove();
}

// STARGATE FUNCTIONS
// --------------------------------------------------------------------------------------

function showStargate(hotspot_code) {
    
    clearInterval(checkZoomStatus);
    hideZoomHotspotImage(active_zoom);
    
    if (active_hotspot_info != hotspot_code) {
    	var title = "", text = "";
    	
    	active_hotspot_info = hotspot_code;
    
    	$.each(data.hotspot_stargate, function(index, item) {
    		if (item.code == hotspot_code) {
    			if (item.image_code != "") {
                    
                    if (active_stargate != "" && active_stargate != item.image_code)
                        hideHotspot(active_stargate);
    				
    				active_stargate = item.image_code;
    				showHideHotspot(item.image_code);
    			}
    
    			title = item.title;
    			text = item.text;
    
    			if (krpano.get("hotspot[" + item.image_code	+ "].alpha") == 0) {
    				showInfo(title, text);
    				ga('send', 'event', language, 'Stargate', title);
    			}
    			else
    				hideInfoContainer();
    		}
    	});
    } else {
        hideHotspot(active_stargate);
        hideInfoContainer();
    }
    
}

function setStargateZOrder(hotspot_code) {
	krpano.set("hotspot[" + hotspot_code + "].zorder", "0");
}

// ZOOM FUNCTIONS
// --------------------------------------------------------------------------------------

function showZoomHotspot(hotspot_code) {
    
    clearInterval(checkZoomStatus);
    hideHotspot(active_stargate);

	if (active_hotspot_info != hotspot_code) {
	
    	var title = "", text = "";
    	
    	active_hotspot_info = hotspot_code;
    
    	$.each(data.hotspot_zoom, function(index, item) {
    		if (item.code == hotspot_code) {
                
                if (active_zoom != "" && active_zoom != item.image_code)
                    krpano.call("spotflyback" + active_zoom);
                
    			openZoomHotspot(item.image_code);
                active_zoom = item.image_code;
                
    			title = item.title;
    			text = item.text;
    
    			showInfo(title, text);
    			ga('send', 'event', language, 'Zoom', title);
    
    			checkZoomStatus = setInterval(
    				function() {
    					if (krpano.get("hotspot[" + item.image_code
    							+ "].flying") == 0) {
    						hideInfoContainer();
    						clearInterval(checkZoomStatus);
    					}
    				}, 200);
    		}
    	});
	} else {
	    hideZoomHotspotImage(active_zoom);
	    hideInfoContainer();
	}
}

function showZoomHotspotImage(hotspot_code) {
	$.each(data.hotspot_zoom, function(index, item) {

		if (item.image_hotspot_code == hotspot_code)
			showZoomHotspot(item.code);

	});
}

function hideZoomHotspotImage (hotspot_code) {
    krpano.call("spotflyback" + hotspot_code);
}

function openZoomHotspot(hotspot_code) {
	krpano.call("onclick" + hotspot_code);
}

function closeAllOpenZoomAndStargate() {

	if (!$('.info-div').is(":hidden"))
		hideInfoContainer();

	$.each(data.hotspot_zoom, function(index, item) {
		if (item.scene_code == current_pano) {
			if (krpano.get("hotspot[" + item.image_code + "].flying") != 0)
				krpano.set("hotspot[" + item.image_code + "].flying", "0");
		}
	});
}

// PANO DESCRIPTION FUNCTIONS
// --------------------------------------------------------------------------

function showPanoDescription(pano_id) {

	hideAll();

	if (!$('.description-container').is(":hidden"))
		$('.description-container').hide("slide", {
			direction : "down"
		}, 1000);
	else {
		var title = '', description = '';

		$.each(data.scene, function(index, item) {
			if (item.code == pano_id) {
				title = item.title;
				description = item.text;
			}
		});

		if (title != "") {
			var html = '';
			html += '<div class="description-title">' + title + '</div>';
			html += '<div class="description-text">' + description + '</div>';

			$('.description-container').html(html);
			$('.description-container').show("slide", {
				direction : "down"
			}, 1000);

			ga('send', 'event', language, 'Scene description', title);
		}
	}
}

function hidePanoDescription() {
	if (!$('.description-container').is(":hidden"))
		$('.description-container').hide("slide", {
			direction : "down"
		}, 1000);
}

// GALLERY FUNCTIONS
// -----------------------------------------------------------------------

function getGalleryFromHotspot(hotspot_id) {

	var gallery_hotspot;

	$.each(data.hotspot_gallery, function(index, item) {
		if (item.code == hotspot_id)
			gallery_hotspot = item;
	});

	return gallery_hotspot;
}

function getGalleryImages(gallery_id) {
	var images = [];

	$.each(data.gallery_image, function(index, item) {
		if (item.gallery_id == gallery_id)
			images.push(item);
	});

	return images;
}

function showGallery(hotspot_id) {

	// console.log(arguments.callee.name + "-" + hotspot_id);

	hideAll();
	
	clearInterval(checkZoomStatus);
    hideHotspot(active_stargate);
    hideZoomHotspotImage(active_zoom);

	var gallery = getGalleryFromHotspot(hotspot_id);
	var gallery_images = getGalleryImages(gallery.id);

	ga('send', 'event', language, 'Gallery', gallery.title);

	switch (gallery.gallery_type) {
	case "timeline":
		showGallery_roundedStyle(gallery, timeline_galleries_path,
				gallery_images);
		break;
	case "testimonial":
		showGallery_roundedStyle(gallery, testimonial_galleries_path,
				gallery_images);
		break;
	case "generic_gallery":
		showGallery_roundedStyle(gallery, generic_galleries_path,
				gallery_images);
		break;
	case "3Dobject":
		showGallery_roundedStyle(gallery, object_galleries_path, gallery_images);
		break;
	case "art":
		showGallery_4_3(gallery, art_galleries_path, gallery_images);
		break;
	default:
		// console.log("gallery_type not found");
		break;
	}
	
}

function showGallery_roundedStyle(gallery, images_path, gallery_images) {

	// console.log(arguments.callee.name);

	hideGalleryContainer();

	var html = '', index;
	html += '<div class="gallery-inner-container">';
	html += '<div class="images-container">';
	$.each(gallery_images, function(index, item) {
		var filename;
		if (item.img_filename != "")
			filename = item.img_filename;
		else
			filename = item.img_filename_no;
		html += '<img class="gallery-image" style="display: none" src="'
				+ images_path + filename + '" />';
	});
	html += '</div>';
	// html += '<div class="option-info">i</div>';
	// html += '<div class="option-image"><img class="camera"
	// src="'+icons_path+'camera_white.png" /></div>';
	html += '<div class="option-close"><!--<img src="' + icons_path
			+ 'close.png" />--></div>';
	switch (gallery.gallery_type) {
	case "testimonial":
	case "timeline":
	case "generic_gallery":
		html += '<div class="option-left"><!--<img class="arrow-left" src="'
				+ icons_path + 'left.png" />--></div>';
		html += '<div class="option-right"><!--<img class="arrow-right" src="'
				+ icons_path + 'right.png" />--></div>';
		break;
	case "3Dobject":
		html += '<div class="option-left"><img class="arrow-left" src="'
				+ icons_path + 'left.png" /></div>';
		html += '<div class="option-right"><img class="arrow-right" src="'
				+ icons_path + 'right.png" /></div>';
		html += '<img class="circles-left" src="' + icons_path
				+ 'circles-left.png" />';
		html += '<img class="circles-right" src="' + icons_path
				+ 'circles-right.png" />';
		break;
	default:
		break;
	}
	html += '</div>';
	html += '<div class="gallery-description">';
		html += '<div class="gallery-title">' + gallery.title + '</div>';
		html += '<div class="gallery-text"><div class="gallery-text-scroller">' + gallery.text.replace('expo2015.illy.com', '<a target="_blank" href="http://expo2015.illy.com">expo2015.illy.com</a>'); + '</div></div>';
	html += '</div>';

	$('.gallery-container').html(html);

	 if(!ios){
		 loadIScroll('.gallery-text');
	 }
	 else
		 $('.gallery-description').addClass('gallery-description-ios');

	$('.gallery-image').first().addClass('active-image');

	if ($('.gallery-container').hasClass('square-container'))
		$('.gallery-container').removeClass('square-container');

	setInterfaceElementsPositions();

	$('.gallery-container').show("slide", {
		direction : "left"
	}, 1000, function () {
        setGalleryDescriptionHeight();
        loadIScroll('.gallery-text');
    });

	$(".option-left").click(
			function() {
				var actual_image = $('.images-container img').index(
						$('.active-image'));
				if (actual_image > 0)
					$('.active-image').prev().addClass('active-image');
				else
					$('.gallery-image').last().addClass('active-image');
				$('.gallery-image').eq(actual_image)
						.removeClass('active-image');
			});

	$(".option-right").click(
			function() {
				var tot_images = $('.gallery-image').length;
				var actual_image = $('.images-container img').index(
						$('.active-image'));
				if (actual_image < tot_images - 1)
					$('.active-image').next().addClass('active-image');
				else
					$('.gallery-image').first().addClass('active-image');
				$('.gallery-image').eq(actual_image)
						.removeClass('active-image');
			});

	$(".option-close").click(function() {
		hideGalleryContainer();
	});
}

function setGalleryDescriptionHeight () {
    $('.gallery-text').css("height", ($('.gallery-description').innerHeight()-$('.gallery-title').outerHeight() - 10)+"px");
}

function showGallery_4_3(gallery, images_path, gallery_images) {

	// console.log(arguments.callee.name);

	hideGalleryContainer();

	$('.gallery-container').addClass('square-container');

	var html = '', index;
	html += '<div class="gallery-inner-container">';
	html += '<div class="images-container">';
	$.each(gallery_images, function(index, item) {
		var filename;
		if (item.img_filename != "")
			filename = item.img_filename;
		else
			filename = item.img_filename_no;
		html += '<img class="gallery-image" style="display: none" src="'
				+ images_path + filename + '" />';
	});
	html += '</div>';
	// html += '<div class="option-info">i</div>';
	html += '<div class="option-close art-option-close"><!--<img src="'
			+ icons_path + 'close.png" />--></div>';
	html += '<div class="option-image"><img class="camera" src="' + icons_path
			+ 'camera_white.png" /></div>';
	html += '<div class="option-left"><!--<img class="arrow-left" src="'
			+ icons_path + 'left.png" />--></div>';
	html += '<div class="option-right"><!--<img class="arrow-right" src="'
			+ icons_path + 'right.png" />--></div>';
	html += '</div>';
	html += '<div class="gallery-description">';
		html += '<div class="gallery-title">' + gallery.title + '</div>';
		html += '<div class="gallery-text"><div class="gallery-text-scroller">' + gallery.text + '</div></div>';
	html += '</div>';

	$('.gallery-container').html(html);

	$('.gallery-image').first().addClass('active-image');

	setInterfaceElementsPositions();

	$('.gallery-container').show("slide", {
		direction : "left"
	}, 1000);

	$(".option-left").click(
			function() {
				var actual_image = $('.images-container img').index(
						$('.active-image'));
				if (actual_image > 0)
					$('.active-image').prev().addClass('active-image');
				else
					$('.gallery-image').last().addClass('active-image');
				$('.gallery-image').eq(actual_image)
						.removeClass('active-image');
			});

	$(".option-right").click(
			function() {
				var tot_images = $('.gallery-image').length;
				var actual_image = $('.images-container img').index(
						$('.active-image'));
				if (actual_image < tot_images - 1)
					$('.active-image').next().addClass('active-image');
				else
					$('.gallery-image').first().addClass('active-image');
				$('.gallery-image').eq(actual_image)
						.removeClass('active-image');
			});

	$(".option-close").click(function() {
		hideGalleryContainer();
	});
}

function hideGalleryContainer() {
	if ($('.gallery-container').is(":visible"))
		$('.gallery-container').hide("slide", {
			direction : "left"
		}, 1000);
}

// PARTICIPANT FUNCTIONS
// -------------------------------------------------------------------------------------

function getParticipantFromHotspot(hotspot_id) {

	var participant;

	$.each(data.participant, function(index, item) {
		if (item.code == hotspot_id)
			participant = item;
	});

	return participant;
}

function showParticipantInfo(hotspot_id) {

	hideAll();

	console.log(hotspot_id);

	if ($('.country-info-container').length == 0)
		$('.country-info-container').remove();

	var participant = getParticipantFromHotspot(hotspot_id);

	buildParticipantInfo(participant);
}

function buildParticipantInfo(participant) {

	ga('send', 'event', language, 'Participant', participant.name);

	var html = "";
	html += '<div class="country-info-header">';
	html += '<img class="country-info-flag" src="' + flags_path
			+ participant.flag_filename + '" \>';
	html += '<span class="country-info-name">' + participant.name + '</span>';
	html += '</div>';
	html += '<img class="country-info-container-close" src="' + icons_path
			+ 'chiudi.png" />';
	html += '<ul class="bxslider">';
	html += '<li>';
	html += '<div class="country-info-theme">' + participant.theme + '</div>';
	html += '<div class="country-info-wrapper">';
	html += '<div class="country-info-scroller">';
	html += '<div class="country-info-concept">' + participant.text + '</div>';
	if (participant.country_currency != "") {
    	html += '<div class="country-info-other">';
    	html += '<div class="country-info-item"><span>'
    			+ data.interface.total_population + ':</span><br>'
    			+ participant.country_population + '</div>';
    	html += '<div class="country-info-item"><span>' + data.interface.currency
    			+ ':</span><br>' + participant.country_currency + '</div>';
    	html += '<div class="country-info-item country-info-item-last"><span>'
    			+ data.interface.total_area + ':</span><br>'
    			+ participant.country_area + '</div>';
    	html += "</div>";
	}
	html += "</div>";
	html += '</div>';
	html += '</li>';

	if (participant.hasOwnProperty('additional_content')) {

		$.each(participant.additional_content, function(index, item) {
			html += '<li>';

			if (item.type == "image") {
				html += '<img src="' + participant_images_path + item.filename
						+ '" />';
			}

			if (item.type == "video")
				html += '<iframe src="//www.youtube.com/embed/'
						+ item.video_code
						+ '" frameborder="0" allowfullscreen></iframe>';

			html += '</li>';
		});

	}
	html += '</ul>';
	html += "</div>";

	$('.country-info-container').html(html);

	$.each($('.country-info-concept p'), function() {
		if ($(this).html() == "" || $(this).html() == "&nbsp;")
			$(this).remove();
	});

	$('.country-info-concept br').remove();

	if (!ios) {
		loadIScroll('.country-info-wrapper');
	}
	else
		$('.country-info-wrapper').addClass('scroll-ios');

	setInterfaceElementsPositions();

	showParticipantInfoContainer();

	$(".country-info-container-close").click(function() {
		hideParticipantInfoContainer();
	});
}

function showParticipantInfoContainer() {

	if ($('.country-info-container').is(":hidden"))
		$('.country-info-container').show("slide", {
			direction : "left"
		}, 1000, function() {
			participant_slider = $('.bxslider').bxSlider({
				video : true,
				infiniteLoop : false,
				hideControlOnEnd : true,
				pager : false,
				slideMargin : 2,
				touchEnabled : false,
				onSliderLoad : function() {
					setInterfaceElementsPositions();
					if (!ios) {
						myScroll.refresh();
					}
				},
			});
		});
}

function hideParticipantInfoContainer() {
	if ($('.country-info-container').is(":visible"))
		$('.country-info-container').hide("slide", {
			direction : "left"
		}, 1000);
}

// PANORAMA MENU FUNCTIONS
// -----------------------------------------------------------------------------------

function hidePanoramaMenu() {
	
	if ($(".owl-carousel").is(':visible')) {
		$(".owl-carousel").hide();
		setInterfaceMenuBottomOffset (50);
		$('.ambassador-container').css('bottom', "85px");
	}
}

function showPanoramaMenu() {

	hideAllButPanoramaMenu();
	
	if ($(".owl-carousel").is(':visible')) {
		
//		var offset = 150;
//		var varSlideUpInterface = setInterval(function () {
//			
//			setInterfaceMenuBottomOffset (offset);
//			
//			if (offset == 50) {
//				clearInterval(varSlideUpInterface);
//			}
//			
//			offset = offset - 2;
//		}, 1);
		
//		$(".owl-carousel").hide("slide", {direction : "down"}, 300);
		
		$(".owl-carousel").hide();
		setInterfaceMenuBottomOffset (50);
		$('.ambassador-container').css('bottom', "85px");
	}
	else {
		hideAll();
		ga('send', 'event', language, 'Scene menu');
		
//		var offset = 50;
//		var varSlideUpInterface = setInterval(function () {
//			
//			setInterfaceMenuBottomOffset (offset);
//			
//			if (offset == 150) {
//				clearInterval(varSlideUpInterface);
//			}
//			
//			offset = offset +2;
//		}, 1);
		
//		$(".owl-carousel").show("slide", {direction : "down", easing: "linear"}, 300);
		$(".owl-carousel").show();
		var offset = 10 + $(".owl-carousel").height();
		if(window.devicePixelRatio > 1)
            offset = offset * 2;
		setInterfaceMenuBottomOffset (offset);
		$('.ambassador-container').css('bottom', (85+$(".owl-carousel").height())+"px");
	}
}

function setInterfaceMenuBottomOffset (offset) {
    if (krpano) {
    	krpano.call("set(layer[button1].y,"+offset+");");
    	krpano.call("set(layer[button2].y,"+offset+");");
    	krpano.call("set(layer[button6].y,"+offset+");");
    	krpano.call("set(layer[button9].y,"+(offset+80)+");");
    	krpano.call("set(layer[button10].y,"+offset+");");
    	krpano.call("set(layer[togglebutton1].y,"+offset+");");
    	krpano.call("set(layer[togglebutton2].y,"+offset+");");
    	krpano.call("set(layer[togglebutton3].y,"+(offset+170)+");");
    }
}

function hideInterfaceMenu() {
    krpano.call("set(layer[button1].visible, false);");
    krpano.call("set(layer[button2].visible, false);");
    krpano.call("set(layer[button6].visible, false);");
    krpano.call("set(layer[togglebutton1].visible, false);");
    krpano.call("set(layer[togglebutton2].visible, false);");
    
    krpano.call("set(layer[button9].visible, true);");
    krpano.call("set(layer[button10].visible, true);");
    krpano.call("set(layer[togglebutton3].visible, true);");
}

function showInterfaceMenu() {
    krpano.call("set(layer[button1].visible, true);");
    krpano.call("set(layer[button2].visible, true);");
    krpano.call("set(layer[button6].visible, true);");
    krpano.call("set(layer[togglebutton1].visible, true);");
    krpano.call("set(layer[togglebutton2].visible, true);");
    
    krpano.call("set(layer[button9].visible, false);");
    krpano.call("set(layer[button10].visible, false);");
    krpano.call("set(layer[togglebutton3].visible, false);");
}

// SEARCH FUNCTIONS
// -----------------------------------------------------------------------------------

function showHideSearchBox() {
	
	hideLanguageSelector();

	if ($(".search-box").hasClass("search-box-active")) {
		$(".search-box").removeClass("search-box-active", 500);
		$(".search").removeClass("search-active", 500);
	} else {
		$(".search-box").addClass("search-box-active", 500);
		$(".search").addClass("search-active", 500);
	}
}

function hideSearchBox() {
	if ($(".search-box").hasClass("search-box-active")) {
		$(".search-box").removeClass("search-box-active", 500);
		$(".search").removeClass("search-active", 500);
	}
}

// LANGUAGE SELECTOR FUNCTIONS
// -----------------------------------------------------------------------------------

function showHideLanguageSelector() {

	hideAll();

	hideSearchBox();

	if ($(".language-selector").hasClass("language-selector-active")) {
		$(".language-selector").removeClass("language-selector-active", 500);
	} else {
		$(".language-selector").addClass("language-selector-active", 500);
	}
}

function hideLanguageSelector() {
	$(".language-selector").removeClass("language-selector-active", 500);
}

function setLanguage() {

	$('.language-selected').removeClass('language-selected');

	loadJSONData();

	changeLanguageSelector();

	hideLanguageSelector();
	
}

function changeLanguageSelector() {
	if (krpano != null)
		krpano.set("tour_language_website", language);
	
	switch (language) {
		case "IT":
			$('.language-it').addClass('language-selected');
			break;
		case "FR":
			$('.language-fr').addClass('language-selected');
			break;
		default:
			$('.language-en').addClass('language-selected');
			break;
	}
	
	if (krpano != null)

	$('.language-box').html(language);
}

// MAP FUNCTIONS
// -----------------------------------------------------------------------------------

function showHideMap() {

	hidePanoramaMenu();

	if ($(".mappa-container").is(':visible'))
		$(".mappa-container").hide();
	else {
		ga('send', 'event', language, 'EXPO map');
		$(".mappa-container").show();
	}
}

function hideMap() {
	krpano.call("if(tour_displayfloorplan,hideFloorplan(););");
}

function openMapHotspot(hotspot_code) {
    
    // console.log(hotspot_code);
    
    var scene_id;
    
    if ($(".info-map-container"))
        $(".info-map-container").empty();
    else
        $('body').append('<div class="info-map-container"></div>');
    
}

// AMBASSADORS FUNCTIONS
// ----------------------------------------------------------------------------

function getRandomAmbassador() {

	var ambassador_index = Math.floor(Math.random() * data.ambassadors.length), ambassador;

	$.each(data.ambassadors, function(index, item) {
		if (ambassador_index == index) {
			ambassador = item;
		}
	});

	return ambassador;
}

function showHideAmbassador() {

	hideSocialShareContainer();

	$('.ambassador-video').unbind();

	if ($('.ambassador-container').hasClass("ambassador-container-active")) {
		$('.ambassador-container').removeClass("ambassador-container-active",
				1000);
		$('.ambassador-picture').removeClass("ambassador-picture-active", 1000);
		$('.ambassador-text').removeClass("ambassador-text-active", 1000);
		$('.ambassador-name').removeClass("ambassador-name-active", 200);
		$('.ambassador-video').removeClass("ambassador-video-active", 1000);
	} else {
		$('.ambassador-container')
				.addClass("ambassador-container-active", 1000);
		$('.ambassador-picture').addClass("ambassador-picture-active", 1000);
		$('.ambassador-text').addClass(
				"ambassador-text-active",
				1000,
				function() {
					$('.ambassador-name').addClass("ambassador-name-active",
							500);
				});
		$('.ambassador-video').addClass("ambassador-video-active", 1000,
				function() {
					$('.ambassador-video-active').click(function() {
						showAmbassadorVideo();
					});
				});

		ga('send', 'event', language, 'Ambassador', ambassador.name);
	}
}

function showAmbassadorVideo() {

	krpano
			.set(
					"data[en_button3webVideoViewer1|webVideoViewer|displaywebvideovideo_url].content",
					"https://www.youtube.com/watch?v=" + ambassador.video_code);
	krpano
			.set(
					"data[en_button3webVideoViewer1|webVideoViewer|displaywebvideovideo_title].content",
					ambassador.title);

	krpano.call('button3OnClick');
}

function hideAmbassador() {
	if ($('.ambassador-container').hasClass("ambassador-container-active")) {
		$('.ambassador-container').removeClass("ambassador-container-active", 1000);
		$('.ambassador-picture').removeClass("ambassador-picture-active", 1000);
		$('.ambassador-text').removeClass("ambassador-text-active", 1000);
		$('.ambassador-name').removeClass("ambassador-name-active", 200);
		$('.ambassador-video').removeClass("ambassador-video-active", 1000);
	}
}

function hideAmbassadorContainer() {$('.ambassador-container').hide();}
function showAmbassadorContainer() {$('.ambassador-container').show();}

function initAmbassadorBox() {
	ambassador = getRandomAmbassador();

	setAmbassadorTexts();
	
	$('.ambassador-picture img').attr("src",
			ambassadors_picture_path + ambassador.img_filename);

	$('.ambassador-picture').click(function() {
		showHideAmbassador();
	});

	$('.ambassador-text').addClass("ambassador-container-active", 1000);
}

function setAmbassadorTexts() {
	$('.ambassador-text').html("\"" + ambassador.text + "\"");
	$('.ambassador-name').html(ambassador.name + " - " + ambassador.title);
}

function refreshAmbassador() {
	$.each(data.ambassadors, function(index, item) {
		if (ambassador.ambassador_id == item.ambassador_id) {
			ambassador = item;
		}
	});
}

function showVideo(hotspot_code) {

	// console.log(hotspot_code);
	
	var title, video_code;

	$.each(data.video_hotspot, function(index, item) {
		if (hotspot_code == item.hotspot_code) {
			title = item.title;
			video_code = item.video_code;
			// console.log(video_code);
		}
	});

	krpano.set("data[en_button3webVideoViewer1|webVideoViewer|displaywebvideovideo_url].content","https://www.youtube.com/watch?v=" + video_code);
	krpano.set("data[en_button3webVideoViewer1|webVideoViewer|displaywebvideovideo_title].content",	title);

	krpano.call('button3OnClick');

	ga('send', 'event', language, 'Video', title);
}

function clickOnDSLogo() {
	ga('send', 'event', language, '3DS Logo', "Click");
}

function showHotspotName(hotspot_code) {
	console.log("Hotspot code: " + hotspot_code);
}

/* SHARE FUNCTIONS */

function updateShareLink(link) {
	
	getCurrentView ();
	
	var params = {
		"language": language,
		"scena": current_pano,
		"view_hlookat": hlookat.toFixed(2),
		"view_vlookat": vlookat.toFixed(2),
		"view_fov": fov.toFixed(2)
	};
	
	switch (link) {
	case "current_view":
		krpano.set("data[en_socialSharespecific_url].content", site_url + "?"
				+ jQuery.param(params));
		break;
	}
}

function toggleSocialShareContainer() {
	if ($('#socialShare .kolorBox').is(":visible"))
		hideSocialShareContainer();
	else
		showSocialShareContainer();
}

function showSocialShareContainer() {

	updateShareLink("current_view");
	
	// krpano.call("startOpenSocialShare-socialShare");
	krpano.call("showSocialShare-socialShare");

//	if (!$('#socialShare .kolorBox').is(":visible"))
//		$('#socialShare .kolorBox').show("slide", {
//			direction : "up"
//		}, 700);
    var offset = 0;
    if ($(".mobile-header").is(':visible'))
        offset = $(".mobile-header").heigth();
    if(window.devicePixelRatio > 1)
        offset = offset * 2;
    $('#socialShare').css("top", offset);
    
    ga('send', 'event', language, 'Social share', "Click");
}

function hideSocialShareContainer() {

//	if ($('#socialShare .kolorBox').is(":visible"))
//		$('#socialShare .kolorBox').hide("slide", {
//			direction : "up"
//		}, 700);
	krpano.call("closeKolorBox-socialShare");
}

function showSurvey(){
	showOverlay();
	
	var surveyTitle = 'Survey';
	
	/* DOMANDA 1 */ 
	var survey_question1 = 'Do you like <b>EXPO Milano 2015 Virtual Tour</b>?';
	var survey_answer1_1 = 'Yes';
	var survey_answer1_2 = 'No';
	
	/* DOMANDA 2
	var survey_question2 = 'You think <b>Virtual tour</b> is:';
	var survey_answer2_1 = 'Useful to prepare the visit';
	var survey_answer2_2 = 'Useful to understand contents and themes';
	var survey_answer2_3 = 'Unnecessary';
	*/
	
	/* DOMANDA 3
	var survey_question3 = 'What do you like most about <b>EXPO Milano 2015 Virtual Tour</b>?';
	*/
	
	/* DOMANDA 4 */
	var survey_question4 = 'The <strong>Virtual Tour</strong> will remain online at the conclusion of EXPO Milano 2015. <br> You think it could be useful:';
	var survey_answer4_1 = 'For those who haven\'t visited EXPO';
	var survey_answer4_2 = 'To see unvisited pavilions';
	var survey_answer4_3 = 'To explore the themes of the Universal Exhibition in future';
	var survey_answer4_4 = 'It\'ll be useless';
	
	/* DOMANDA 5 */
	var survey_question5 = 'What would you like to see in the <strong>Virtual Tour</strong>, after Expo 2015?';
	
	var survey_close = 'Close';
	var survey_send = 'Send';
	var survey_confirm_message = 'Your survey has been sent, thank you!<br>Keep on visiting <b>EXPO Milano 2015</b> with the <b>Virtual Tour</b>!';
	
	switch(language){
		
		case 'IT':	surveyTitle = 'Questionario';
					/* DOMANDA 1 */
					survey_question1 = 'Ti è piaciuto il <b>Virtual Tour</b> di <b>EXPO Milano 2015</b>?';
					survey_answer1_1 = 'Si';
					survey_answer1_2 = 'No';
					
					/* DOMANDA 2
					survey_question2 = 'Pensi che il <b>Virtual tour</b> sia:';
					survey_answer2_1 = 'Utile per preparare la visita';
					survey_answer2_2 = 'Utile per capire il tema e i contenuti';
					survey_answer2_3 = 'Inutile';
					*/
					
					/* DOMANDA 3
					survey_question3 = 'Cosa ti piace di più nel <b>Virtual Tour</b>?';
					*/
					
					/* DOMANDA 4 */
					survey_question4 = 'Alla conclusione di EXPO Milano 2015 il <strong>Virtual Tour</strong> resterà on line.<br>Secondo te potrebbe servire:';
					survey_answer4_1 = 'Per chi non ha visitato EXPO';
					survey_answer4_2 = 'Per visitare alcuni padiglioni non raggiunti durante la visita reale';
					survey_answer4_3 = 'Per approfondire i temi dell\'Esposizione Universale anche in futuro';
					survey_answer4_4 = 'Sarà inutile';
					
					/* DOMANDA 5 */
					survey_question5 = 'Cosa ti piacerebbe visitare nel <strong>Virtual Tour</strong>, dopo che Expo 2015 sarà finito?';
					
					survey_close = 'Chiudi';
					survey_send = 'Rispondi';
					survey_confirm_message = 'Grazie! Il tuo questionario è stato registrato con successo.<br>Prosegui la tua visita a <b>EXPO Milano 2015</b> attraverso il <b>Virtual Tour</b>!';
					break;
		case 'FR':	
					break;
		default:	break;
	}
	
	var modalHtml='<div class="modal" id="survey" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
  			modalHtml+='<div class="modal-dialog" role="document">';
    			modalHtml+='<div class="modal-content">';
      				modalHtml+='<div class="modal-header">';
        				modalHtml+='<button type="button" class="close close-survey" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        				modalHtml+='<h4 class="modal-title" id="myModalLabel">'+surveyTitle+'</h4>';
      				modalHtml+='</div>';
      				modalHtml+='<div class="modal-body">';
      					modalHtml+='<div id="survey0" class="survey_message">'+survey_confirm_message+'</div>';
						
						/* DOMANDA 1 */
						modalHtml+='<div id="survey1" class="survey_row">';
        				modalHtml+='<p><strong>'+survey_question1+'</strong></p>';
						modalHtml+='<p><input type="radio" name="survey_q1" value="y">&nbsp;'+survey_answer1_1+'<br>';
						modalHtml+='<input type="radio" name="survey_q1" value="n">&nbsp;'+survey_answer1_2+'<br></p>';
						modalHtml+='</div>';
						
						/* DOMANDA 2
						modalHtml+='<div id="survey2" class="survey_row">';
        				modalHtml+='<p><strong>'+survey_question2+'</strong></p>';
						modalHtml+='<p><input type="radio" name="survey_q2" value="preparevisit">&nbsp;'+survey_answer2_1+'<br>';
						modalHtml+='<input type="radio" name="survey_q2" value="themes">&nbsp;'+survey_answer2_2+'<br>';
						modalHtml+='<input type="radio" name="survey_q2" value="useless">&nbsp;'+survey_answer2_3+'<br></p>';
						modalHtml+='</div>';
						*/
						
						/* DOMANDA 3
						modalHtml+='<div id="survey3" class="survey_row">';
        				modalHtml+='<p><strong>'+survey_question3+'</strong></p>';
						modalHtml+='<textarea id="survey_q3" class="form-control"></textarea>';
						modalHtml+='</div>';
						*/
						
						/* DOMANDA 4 */
						modalHtml+='<div id="survey4" class="survey_row">';
        				modalHtml+='<p><strong>'+survey_question4+'</strong></p>';
						modalHtml+='<p><input type="radio" name="survey_q4" value="expo">&nbsp;'+survey_answer4_1+'<br>';
						modalHtml+='<input type="radio" name="survey_q4" value="pavilions">&nbsp;'+survey_answer4_2+'<br>';
						modalHtml+='<input type="radio" name="survey_q4" value="themes">&nbsp;'+survey_answer4_3+'<br>';
						modalHtml+='<input type="radio" name="survey_q4" value="useless">&nbsp;'+survey_answer4_4+'<br></p>';
						modalHtml+='</div>';
						
						/* DOMANDA 5 */
						modalHtml+='<div id="survey5" class="survey_row">';
        				modalHtml+='<p><strong>'+survey_question5+'</strong></p>';
						modalHtml+='<textarea id="survey_q5" class="form-control"></textarea>';
						modalHtml+='</div>';
						
      				modalHtml+='</div>';
      				modalHtml+='<div class="modal-footer">';
       		 			modalHtml+='<button id="close-survey-button" type="button" class="btn btn-default" data-dismiss="modal">'+survey_close+'</button>';
        				modalHtml+='<button type="button" class="btn btn-primary send-survey">'+survey_send+'</button>';
      				modalHtml+='</div>';
    			modalHtml+='</div>';
  			modalHtml+='</div>';
		modalHtml+='</div>';
		
	$('body').append(modalHtml);
	bindSurveyEvents();
	
	$('#survey').show();
	
	ga('send', 'event', language, 'Survey', "Show");
}

function hideSurvey(){
	$('#survey').fadeOut();
	hideOverlay();	
}

function bindSurveyEvents(){
	$('.close-survey').click(function() {
	    ga('send', 'event', language, 'Survey', "Close");
		hideSurvey();
	});
	$('#close-survey-button').click(function() {
        hideSurvey();
    }); 
	$('.send-survey').click(function() {
		/* DOMANDA 1 */
		var answer_1 = $('input[name=survey_q1]:checked').val();
		
		/* DOMANDA 2
		var answer_2 = $('input[name=survey_q2]:checked').val();
		*/
		
		/* DOMANDA 3
		var answer_3 = $('#survey_q3').val();
		*/
		
		/* DOMANDA 4 */
		var answer_4 = $('input[name=survey_q4]:checked').val();
		
		/* DOMANDA 5 */
		var answer_5 = $('#survey_q5').val();
		
		var dataObject = {};
		
		var survey_link = 'http://tdlab.telecomdesign.it/marco/exposurvey.php';
		
		/* DOMANDA 1 */
		if (typeof answer_1 != 'undefined')
			dataObject['a1'] = answer_1;
		
		/* DOMANDA 2
		if (typeof answer_2 != 'undefined')
			dataObject['a2'] = answer_2;
		*/
		
		/* DOMANDA 3
		if (answer_3 != '')
			dataObject['a3'] = answer_3;
        */
		
		/* DOMANDA 4 */
		if (typeof answer_4 != 'undefined')
			dataObject['a4'] = answer_4;
			
		/* DOMANDA 5 */
		if (answer_5 != '')
			dataObject['a5'] = answer_5;
		
        // $.getJSON(survey_link + "?callback=?", dataObject, function(data) {
            // console.log(data);
        // });
        
		$.ajax({
			url : survey_link,
			dataType : 'jsonp',
			data: dataObject,
			jsonpCallback: 'surveyCallback'
		}).always(function(data) {
			$('.survey_row').hide();
			$('.survey_message').show();
			$('#close-survey-button').show();
			$('.send-survey').hide();
			
			ga('send', 'event', language, 'Survey', "Complete");
		});
	});	
}