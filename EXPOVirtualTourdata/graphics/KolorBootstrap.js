//krpano instance
var krpano = null;
//trace
var debug = false;
//is krpano loaded
var krpanoLoaded = false;
//is tour started
var isTourStarted = false;
//fullscreen object
var kolorFullscreen = null;
//browser detection
var kolorBrowserDetect = null;
//start z-index value
var kolorStartIndex = 4000;
//target url for cross domains application
var crossDomainTargetUrl = "";

if ( debug ) {
	if ( typeof(console) == 'undefined' ) {
		console = {log : function (text) {} };
	}
}

/* ======== FULLSCREEN STUFF ========================================== */

/**
 * @description Register Fullscreen on DOM ready.
 */
jQuery(document).ready(function() {
	//add browser detection
	kolorBrowserDetect = new ktools.BrowserDetect();
	kolorBrowserDetect.init();
	//kolorBrowserDetect.browser : Browser string
	//kolorBrowserDetect.version : Browser version
	//kolorBrowserDetect.OS : Platform OS
	
	//add fullscreen
	kolorFullscreen = new ktools.Fullscreen(document.getElementById("tourDIV"));
	kolorFullscreen.supportsFullscreen();
	//activate krpano fallback and update methods
	kolorFullscreen.setExternal({
		'enter': krPanoFullscreenEnter,
		'exit': krPanoFullscreenExit,
		'change': krpanoFullscreenChange,
		'resize': krPanoFullscreenResize
	});
});

/**
 * @function
 * @description Enter fullscreen fallback method for krpano.
 * @return {void}
 */
function krPanoFullscreenEnter() {
	getKrPanoInstance().call("enterFullScreenFallback");
}

/**
 * @function
 * @description Exit fullscreen fallback method for krpano.
 * @return {void}
 */
function krPanoFullscreenExit() {
	getKrPanoInstance().call("exitFullScreenFallback");
}

/**
 * @function
 * @description Launch method for krpano on fullscreen change event.
 * @param {Boolean} state If true enter fullscreen event, else exit fullscreen event.
 * @return {void}
 */
function krpanoFullscreenChange(state) {
	if(state){
		getKrPanoInstance().call("enterFullScreenChangeEvent");
	}else{
		getKrPanoInstance().call("exitFullScreenChangeEvent");
	}
}

/**
 * @function
 * @description Launch resize method for krpano correct resize.
 * @return {void}
 */
function krPanoFullscreenResize() {
	getKrPanoInstance().call("resizeFullScreenEvent");
}

/**
 * @function
 * @description Set fullscreen mode.
 * @param {String|Boolean} value The fullscreen status: 'true' for open or 'false' for close.
 * @return {void}
 */
function setFullscreen(value) {
	var state;
	if(typeof value == "string")
		state = (value.toLowerCase() == "true");
	else
		state = Boolean(value);

	if (kolorFullscreen) {
		if(state){
			kolorFullscreen.request();
		}else{
			kolorFullscreen.exit();
		}
	}
}

/* ========== DIALOG BETWEEN KRPANO/JS STUFF ================================= */

/**
 * @function
 * @description Get krpano instance.
 * @return {Object} krpano instance.
 */

function getKrPanoInstance() {
	if ( krpano == null ) {
		krpano = document.getElementById('krpanoSWFObject');
	}
	return krpano;

}

/**
 * @function
 * @description Call krpano function.
 * @param {String} fnName The krpano action name.
 * @param {*} Following parameters are passed to the krPano function
 * @return {void}
 */
function invokeKrFunction(fnName) {
	var args = [].slice.call(arguments, 1);
	var callString = fnName+'(';
	for(var i=0, ii=args.length; i<ii; i++)
	{
		callString += args[i];
		if(i != ii-1) { callString += ', '; }
	}
	callString += ');';
	getKrPanoInstance().call(callString);
}

/**
 * @function
 * @description Get krpano identifier value.
 * @param {String} identifier The qualifier.
 * @param {String} type The converting type. Can be: 'int', 'float', 'string', 'boolean', 'object'.
 * @return {Object}
 */
function getKrValue(identifier, type) {
	if ( typeof identifier == "undefined" ){
		return identifier;
	}
	
	if(getKrPanoInstance().get(identifier) == null) {
		return null;
	}

	switch ( type ) {
		case "int":
			return parseInt(getKrPanoInstance().get(identifier));
		case "float":
			return parseFloat(getKrPanoInstance().get(identifier));
		case "string":
			return String(getKrPanoInstance().get(identifier));
		case "bool":
			return Boolean(getKrPanoInstance().get(identifier) === 'true' || parseInt(getKrPanoInstance().get(identifier)) === 1 || getKrPanoInstance().get(identifier) === 'yes' || getKrPanoInstance().get(identifier) === 'on');
		default:
			return getKrPanoInstance().get(identifier);
	}
}

/**
 * @function
 * @description Invoke a function of a plugin engine.
 * @param {String} pluginName The name/id of the plugin.
 * @param {String} functionName The name of the function to invoke.
 * @param {Object[]} arguments Additional arguments will be passed to the invoked function as an array.
 * @return {Object}
 */
function invokePluginFunction(pluginName, functionName) {
	if ( debug ) {
		console.log("invokePluginFunction("+pluginName+", "+functionName+")");
	}
	
	var plugin = ktools.KolorPluginList.getInstance().getPlugin(pluginName);
	if (plugin == null) {
		if ( debug ) { console.log("invokePluginFunction: plugin instance doesn't exist"); }
		return false;
	}
	var engine = plugin.getRegistered();
	if (engine == null) {
		if ( debug ) { console.log("invokePluginFunction: plugin isn't registered"); }
		return false;
	}
	var restArgs = [].slice.call(arguments, 2);
	return engine[functionName](restArgs);
}

/**
 * @function
 * @description This function is called when krpano is ready.
 * The ready state of krpano is told by its event onready (in fact it's not fully ready, included XML are not necessarily loaded) 
 * @return {void}
 */
function eventKrpanoLoaded () {
	if ( debug ) {
		console.log('krpano is loaded');
	}
	
	if (krpanoLoaded) { return false; }
	
	ktools.I18N.getInstance().initLanguage('en', crossDomainTargetUrl+'EXPOVirtualTourdata/EXPOVirtualTour_messages_','.xml');
	krpanoLoaded = true;
	
	

	addKolorBox('socialShare');

addKolorArea('floorPlanArea');
addKolorBox('webVideoViewer1');

}

/**
 * @function
 * @description This function is called when tour is started.
 * @return {void}
 */
function eventTourStarted () {
	if ( debug ) {
		console.log('tour is started');
	}
	
	isTourStarted = true;
}


/* ========= KOLOR PLUGINS SCRIPTS ============================== */


/**
 * @function
 * @description Add an instance of kolorBox JS Engine, loads JS and CSS files then init and populate related plugin that's based on it.
 * @param {String} pPlugID The name of the plugin you want to give to the kolorBox instance. 
 * @return {void} 
 */
function addKolorBox(pPlugID)
{
	
	if(typeof ktools.KolorPluginList.getInstance().getPlugin(pPlugID) == "undefined")
	{
		var kolorBoxCSS = new ktools.CssStyle("KolorBoxCSS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorBox/kolorBox.css");
		var kolorBoxJS = new ktools.Script("KolorBoxJS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorBox/KolorBox.min.js", [], true);
		var kolorBoxPlugin = new ktools.KolorPlugin(pPlugID);
		kolorBoxPlugin.addScript(kolorBoxJS);
		kolorBoxPlugin.addCss(kolorBoxCSS);
		ktools.KolorPluginList.getInstance().addPlugin(kolorBoxPlugin.getPluginName(), kolorBoxPlugin, true);
		showKolorBox(pPlugID, 0, true);
	}
}

/**
 * @function
 * @description Init, populate and show the kolorBox. You can init only.
 * @param {String} pPlugID The name of the plugin you want to init and/or show.
 * @param {Number} pIndex The index you want to open, supposing your kolorBox is populated by a list of items (gallery case).
 * @param {Boolean} pInitOnly If this param is true, just populate the kolorBox engine with the XML data without opening it.
 * @return {void} 
 */
function showKolorBox(pPlugID, pIndex, pInitOnly)
{
	if(debug) { console.log("showKolorBox " + pPlugID); }
	
	//Check if the KolorBox is loaded
	if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized() || typeof KolorBox === "undefined")
	{
		err = "KolorBox JS or XML is not loaded !";
		if(debug){ console.log(err); }
		//If not loaded, retry in 100 ms
		setTimeout(function() { showKolorBox(pPlugID, pIndex, pInitOnly); }, 100);
		return;
	}
	
	//Check if the KolorBox is instantiate and registered with the ktools.Plugin Object
	//If not, instantiate the KolorBox and register it.
	if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered() === null)
	{
		ktools.KolorPluginList.getInstance().getPlugin(pPlugID).register(new KolorBox(pPlugID, "panoDIV"));
	}
	
	//Get the registered instance of KolorBox
	var kolorBox = ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();

	//If kolorBox is not ready, populate datas
	if(!kolorBox.isReady())
	{
		var kolorBoxOptions = [];
		var optionName = '';
		var optionValue = '';
		
		//Build the Options data for the KolorBox
		var optionLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].settings[0].option.count"));
	
		for(var j = 0; j < optionLength; j++)
		{
			optionName = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].name","string");
			if (optionName == 'zorder') {
				optionValue = kolorStartIndex + getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].value", getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].type", "string"));
			} else {
				optionValue = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].value", getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].type", "string"));
			}
			kolorBoxOptions[optionName] = optionValue;
		}

		kolorBox.setKolorBoxOptions(kolorBoxOptions);
		
		if(kolorBoxOptions['starts_opened']) {
			pInitOnly = false;
		}
		
		//Build the Items data for the KolorBox
		var kbItem = null;
		var itemLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].internaldata[0].item.count"));
		for(var k = 0; k < itemLength; k++)
		{
			//Build a new item
			kbItem = new KolorBoxObject();
			kbItem.setName(getKrValue("ptplugin["+pPlugID+"].internaldata[0].item["+k+"].name","string"));
			kbItem.setTitle(getKrValue("ptplugin["+pPlugID+"].internaldata[0].item["+k+"].title","string"));
			kbItem.setCaption(getKrValue("ptplugin["+pPlugID+"].internaldata[0].item["+k+"].caption","string"));
			kbItem.setValue(getKrValue("ptplugin["+pPlugID+"].internaldata[0].item["+k+"].value","string"));
			
			//If external data get n' set
			if(kbItem.getValue() === "externalData")
				kbItem.setData(getKrValue('data['+getKrValue("ptplugin["+pPlugID+"].internaldata[0].item["+k+"].dataName","string")+'].content', 'string'));
			
			//Add the item
			kolorBox.addKolorBoxItem(kbItem);

			kbItem.init();
		}

		//Kolorbox is now ready !
		kolorBox.setReady(true);
		//call ready statement for krpano script
		invokeKrFunction("kolorBoxJsReady-"+pPlugID);
	}
	
	//If id is defined, show this kolorBox
	if(typeof pPlugID !== "undefined" && (typeof pInitOnly === "undefined" || pInitOnly === false))
	{
		//If no index specified, set 0 as default index
		if(typeof pIndex === "undefined") { pIndex = 0; }
		kolorBox.openKolorBox(pIndex);
	}	
}


/**
 * @function
 * @description Add an instance of kolorFloorPlan JS Engine, loads JS and CSS files then init and populate related plugin that's based on it.
 * @param {String} pPlugID The name of the plugin you want to give to the kolorFloorPlan instance.
 * @param {String} pContent The content you want to inject into the kolorFloorPlan. I could be HTML string or any other string.
 * @return {void} 
 */
function addKolorFloorPlan(pPlugID, pContent)
{
	if(typeof ktools.KolorPluginList.getInstance().getPlugin(pPlugID) == "undefined")
	{
		var kolorFloorPlanCSS = new ktools.CssStyle("KolorFloorPlanCSS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorFloorPlan/kolorFloorPlan.css");
		var kolorFloorPlanJS = new ktools.Script("KolorFloorPlanJS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorFloorPlan/KolorFloorPlan.min.js", [], true);
		var kolorFloorPlanPlugin = new ktools.KolorPlugin(pPlugID);
		kolorFloorPlanPlugin.addScript(kolorFloorPlanJS);
		kolorFloorPlanPlugin.addCss(kolorFloorPlanCSS);
		ktools.KolorPluginList.getInstance().addPlugin(kolorFloorPlanPlugin.getPluginName(), kolorFloorPlanPlugin, true);
	}
	
	showKolorFloorPlan(pPlugID, pContent);
}

/**
 * @function
 * @description Init, populate and show the kolorFloorPlan. 
 * @param {String} pPlugID The name of the plugin you want to init and show.
 * @param {String} pContent The content you want to inject into the kolorFloorPlan. I could be HTML string or any other string.
 * @return {void} 
 */
function showKolorFloorPlan(pPlugID, pContent)
{
	if(debug) { console.log("showKolorFloorPlan " + pPlugID); }
	
	//Check if the KolorFloorPlan is loaded
	if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized() || typeof KolorFloorPlan == "undefined")
	{
		var err = "KolorFloorPlan is not loaded";
		if(debug){ console.log(err); }
		//If not loaded, retry in 100 ms
		setTimeout(function() { showKolorFloorPlan(pPlugID, pContent); }, 100);
		return;
	}
	
	//If not, instantiate the KolorFloorPlan and register it.
	if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered() == null)
	{
		ktools.KolorPluginList.getInstance().getPlugin(pPlugID).register(new KolorFloorPlan(pPlugID, pContent));
	}
	
	//Get the registered instance of KolorFloorPlan
	var kolorFloorPlan = ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();
	
	//If kolorFloorPlan is not ready, populate datas
	if(!kolorFloorPlan.isReady())
	{
		var kolorFloorPlanOptions = [];
		var optionName = '';
		var optionValue = '';
		//Build the Options data for the KolorFloorPlan
		var optionLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].settings[0].option.count"));
		for(var j = 0; j < optionLength; j++)
		{
			optionName = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].name","string");
			optionValue = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].value", getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].type", "string"));
			kolorFloorPlanOptions[optionName] = optionValue;
		}
		kolorFloorPlan.setKolorFloorPlanOptions(kolorFloorPlanOptions);
		
		var kolorFloorPlanItems = [];
		var kolorFloorPlanSpots = [];
		var planName = '';
		var planValues = null;
		var planSpots = null;
		var planSpot = null;
		
		var kolorFloorPlanSelectedItem = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].selectedItem","string");
		var kolorFloorPlanSelectedSpot = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].selectedSpot","string");
		var kolorFloorPlanSelectedSpotOptions = [getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].selectedSpotScene","string"), getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].selectedSpotHeading","float"), getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].selectedSpotFov","float")];
		
		var floorplansLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem.count"));
		for(var j = 0; j < floorplansLength; j++)
		{
			planName = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].name","string");
			
			planValues = new Object();
			planValues.title = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].title","string");
			planValues.src = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].url","string");
			planValues.width = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].width","int");
			planValues.height = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].height","int");
			planValues.heading = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].heading","float");
			
			kolorFloorPlanItems[planName] = planValues;
			
			planSpots = [];
			var floorplansItemsLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot.count"));
			for(var k = 0; k < floorplansItemsLength; k++)
			{
				planSpot = new Object();
				planSpot.name = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].name","string");
				planSpot.posx = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].posX","float");
				planSpot.posy = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].posY","float");
				planSpot.heading = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].heading","float");
				planSpot.desc = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].desc","string");
				planSpot.desctype = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].descType","string");
				planSpot.scene = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].scene","string");
				planSpot.jsclick = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].jsClick","string");
				
				planSpot.icon = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].icon[0].url","string");
				planSpot.width = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].icon[0].iconWidth","int");
				planSpot.height = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].icon[0].iconHeight","int");
				planSpot.anchor = getKrValue("ptplugin["+pPlugID+"].floorplanItems[0].floorplanItem["+j+"].spot["+k+"].icon[0].iconAnchor","string");
				
				planSpots[planSpot.name] = planSpot;
			}
			kolorFloorPlanSpots[planName] = planSpots;
		}
		kolorFloorPlan.setKolorFloorPlanItems(kolorFloorPlanItems);
		kolorFloorPlan.setKolorFloorPlanSpots(kolorFloorPlanSpots);
		kolorFloorPlan.setKolorFloorPlanSelectedItem(kolorFloorPlanSelectedItem);
		kolorFloorPlan.setKolorFloorPlanSelectedSpot(kolorFloorPlanSelectedSpot);
		kolorFloorPlan.setKolorFloorPlanSelectedSpotOptions(kolorFloorPlanSelectedSpotOptions);
		
		kolorFloorPlan.setKrpanoEngine(getKrPanoInstance());
		
		//set url for images
		kolorFloorPlan.setGraphicsUrl(crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/"+pPlugID.toLowerCase()+"/");
		
		//KolorFloorPlan is now ready
		kolorFloorPlan.setReady(true);
		//call ready statement for krpano script
		invokeKrFunction("kolorFloorplanJsReady-"+pPlugID);
	}
	
	kolorFloorPlan.showKolorFloorPlan();
}


/**
 * @function
 * @description Add an instance of kolorArea JS Engine, loads JS and CSS files then init and populate related plugin that's based on it.
 * @param {String} pPlugID The name of the plugin you want to give to the kolorArea instance. 
 * @return {void} 
 */
function addKolorArea(pPlugID)
{
	if(typeof ktools.KolorPluginList.getInstance().getPlugin(pPlugID) == "undefined")
	{
		var kolorAreaCSS = new ktools.CssStyle("KolorAreaCSS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorArea/kolorArea.css");
		var kolorAreaJS = new ktools.Script("KolorAreaJS", crossDomainTargetUrl+"EXPOVirtualTourdata/graphics/KolorArea/KolorArea.min.js", [], true);
		var kolorAreaPlugin = new ktools.KolorPlugin(pPlugID);
		kolorAreaPlugin.addScript(kolorAreaJS);
		kolorAreaPlugin.addCss(kolorAreaCSS);
		ktools.KolorPluginList.getInstance().addPlugin(kolorAreaPlugin.getPluginName(), kolorAreaPlugin, true);
	}
}

/**
 * @function
 * @description Init, populate and show the kolorArea. 
 * @param {String} pPlugID The name of the plugin you want to init and show.
 * @param {String} pContent The content you want to inject into the kolorArea. I could be HTML string or any other string.
 * @return {void} 
 */
function showKolorArea(pPlugID, pContent)
{
	if(debug) { console.log("showKolorArea " + pPlugID); }

	//Check if the KolorArea is loaded
	if(!ktools.KolorPluginList.getInstance().getPlugin(pPlugID).isInitialized() || typeof KolorArea == "undefined")
	{
		err = "KolorArea JS is not loaded !";
		if(debug){ console.log(err); }
		//If not loaded, retry in 100 ms
		setTimeout(function() { showKolorArea(pPlugID, pContent); }, 100);
		return;
	}
	
	//Check if the KolorArea is instantiate and registered with the ktools.Plugin Object
	//If not, instantiate the KolorArea and register it.
	if(ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered() == null)
	{
		ktools.KolorPluginList.getInstance().getPlugin(pPlugID).register(new KolorArea(pPlugID, "panoDIV"));
	}
	
	//Get the registered instance of KolorArea
	var kolorArea = ktools.KolorPluginList.getInstance().getPlugin(pPlugID).getRegistered();

	//If kolorArea is not ready, populate datas
	if(!kolorArea.isReady())
	{
		var kolorAreaOptions = [];
		var optionName = '';
		var optionValue = '';
		
		//Build the Options data for the KolorArea
		var optionLength = parseInt(getKrPanoInstance().get("ptplugin["+pPlugID+"].settings[0].option.count"));
		
		for(var j = 0; j < optionLength; j++)
		{
			optionName = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].name","string");
			if (optionName == 'zorder') {
				optionValue = kolorStartIndex + getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].value", getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].type", "string"));
			} else {
				optionValue = getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].value", getKrValue("ptplugin["+pPlugID+"].settings[0].option["+j+"].type", "string"));
			}
			kolorAreaOptions[optionName] = optionValue;
		}

		kolorArea.setKolorAreaOptions(kolorAreaOptions);

		//KolorArea is now ready !
		kolorArea.setReady(true);
		//call ready statement for krpano script
		invokeKrFunction("kolorAreaJsReady-"+pPlugID);
	}

	kolorArea.setKolorAreaContent(pContent);
	kolorArea.openKolorArea();
}
