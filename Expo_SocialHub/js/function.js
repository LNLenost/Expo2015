function adjustProjects() {
	var e = jQuery(window).width(),
		t = jQuery("#titleTextEng").outerHeight() + jQuery("#introTextEng").outerHeight(),
		o = jQuery("#titleTextIta").outerHeight() + jQuery("#introTextIta").outerHeight();
	t > o ? (jQuery("#backgroundPage").css("height", t), jQuery("#headerIta").css("height", t), jQuery("#headerEng").css("height", t)) : (jQuery("#backgroundPage").css("height", o), jQuery("#headerEng").css("height", o), jQuery("#headerIta").css("height", o)), e > 1024 ? jQuery("#backgroundPage").css("width", 819.2 + (e - 1024) / 2) : 850 > e && (jQuery(".one-fourth:eq(2)").css("border-right", "none"), jQuery(".one-fourth:eq(2)").css("margin-left", "0px"));
	var t = jQuery("#titleTextEng").outerHeight() + jQuery("#introTextEng").outerHeight(),
		o = jQuery("#titleTextIta").outerHeight() + jQuery("#introTextIta").outerHeight();
	t > o ? (jQuery("#backgroundPage").css("height", t), jQuery("#headerIta").css("height", t), jQuery("#headerEng").css("height", t)) : (jQuery("#backgroundPage").css("height", o), jQuery("#headerEng").css("height", o), jQuery("#headerIta").css("height", o)), jQuery("#postFooter .col-md-3.col-sm-4").prepend('<div class="biancone"></div>'), 801 > e && jQuery("#menu-secondary-menu a").click(function() {
		var e = $("#menu-secondary-menu"),
			t = e.height();
		 
		var o = $(this).parent().attr("id"),
			r = $(this).parent().html();
		$("#menu-secondary-menu").prepend("<li id='" + o + "' class='menu-item menu-item-type-post_type menu-item-object-page " + o + "'>" + r + "</li>"), $(this).parent().remove()
	})
}
jQuery(document).ready(adjustProjects), jQuery(window).resize(adjustProjects), jQuery(document).ready(function(e) {
	e(".group1").colorbox({
		rel: "group1"
	}), e(".group2").colorbox({
		rel: "group2",
		transition: "fade"
	}), e(".group3").colorbox({
		rel: "group3",
		transition: "none",
		width: "75%",
		height: "75%"
	}), e(".group4").colorbox({
		rel: "group4",
		slideshow: !0
	}), e(".ajax").colorbox(), e(".youtube").colorbox({
		iframe: !0,
		innerWidth: 640,
		innerHeight: 390
	}), e(".vimeo").colorbox({
		iframe: !0,
		innerWidth: 500,
		innerHeight: 409
	}), e(".iframe").colorbox({
		iframe: !0,
		width: "80%",
		height: "80%"
	}), e(".inline").colorbox({
		inline: !0,
		width: "50%"
	}), e(".callbacks").colorbox({
		onOpen: function() {
			alert("onOpen: colorbox is about to open")
		},
		onLoad: function() {
			alert("onLoad: colorbox has started to load the targeted content")
		},
		onComplete: function() {
			alert("onComplete: colorbox has displayed the loaded content")
		},
		onCleanup: function() {
			alert("onCleanup: colorbox has begun the close process")
		},
		onClosed: function() {
			alert("onClosed: colorbox has completely closed")
		}
	}), e(".non-retina").colorbox({
		rel: "group5",
		transition: "none"
	}), e(".retina").colorbox({
		rel: "group5",
		transition: "none",
		retinaImage: !0,
		retinaUrl: !0
	}), e("#click").click(function() {
		return e("#click").css({
			"background-color": "#f00",
			color: "#fff",
			cursor: "inherit"
		}).text("Open this window again and this message will still be here."), !1
	}), e("#menu-secondary-menu a").click(function(t) {
		var o = e(this).attr("data-id"),
			r = e("#socialStreamHome iframe").attr("src"),
			n = r.substring(20, r.indexOf("?")),
			i = r.replace(n, o),
			el = e('#site-navigation2'),
			curHeight = el.height();
			var autoHeight = el.css('height', 'auto').height(),
			
			a = e(this).css("backgroundColor");
		e("#site-navigation2").css("border-bottom-color", a), 
		e("#menu-secondary-menu li").removeClass("activetab"), 
		e(this).parent().addClass("activetab"), 
		e("#socialStreamHome iframe").attr("src", i), 
		e("#menu-secondary-menu a").removeClass("activeTab"), 
		e(this).addClass("activeTab"), t.preventDefault(),
		el.height(curHeight).animate({height: '64px'}, 500);
	})
});
jQuery(document).ready(function($){
	$('.menu-toggle2').click(function(){
		console.log("test");
		var el = $('#site-navigation2');
		var curHeight = el.height();
		var autoHeight = el.css('height', 'auto').height();
		el.height(curHeight).animate({height: autoHeight}, 500);
	});
})