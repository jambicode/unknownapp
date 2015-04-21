/* --------------------------------------------------------------------------------------------------- 
 * BuildTool - WebView
 * 
 * @author	Robin Bonnes <http://robinbonnes.nl/>
 * @version	1.0
 *
 * Copyright (C) 2013 Robin Bonnes. All rights reserved.
 * 
 * Description:
 * 
 * Webview that will load a webpage. When you don't have an internet connection it will show a dialog message.
 *
 * -------------------------------------------------------------------------------------------------- */

/*
 * Default Settings
 */

// Settings
var debug = false;
var busy = false;
var hasinternet = false;
var config = "bt_config.xml";

// Options
var url = '';
	
// Get from config
if(debug)
{
	config = "config.xml";
}

/* --------------------------------------------------------------------------------------------------- */

/*
 * Initialize
 */

// Device Ready
document.addEventListener("deviceready", function deviceReady()
{
	$.get(config, function(data)
	{
		if(data)
		{
			// Get settings
			url = $(data).find('option[name=webview_url]').attr('value');
			
			// Offline Listener
			document.addEventListener("offline", onOffline, false);
			
			// Get Webpage or show offline message
			getWebpage();
		}
		else
		{
			alert("Wrong config file. Are you sure this package contains bt_config.xml?");
		}
	});
});

/* --------------------------------------------------------------------------------------------------- */

// Get Webpage or show offline message
function getWebpage()
{
	$.get(url, function(data)
	{
		if(data.length > 0)
		{
			$('<iframe id="iframe" src="' + url + '" onload="iframeReady();" style="border: 0; width: 100%; height: 100%">').appendTo('body');
		}
		else
		{
			onOffline();
		}
	}).fail(onOffline);
}

// When phone does not have an internet connection
function onOffline()
{
	// Prevents going off twice
	if(!busy)
	{
		busy = true;
		
		// Show message
		navigator.notification.confirm(
			'You\'re not connected to internet. Please enable a network connection and try again.',
			function(buttonIndex)
			{
				if(buttonIndex == 1)
				{
					// Check status again
					busy = false;
					getWebpage();
				}
				else
				{
					navigator.app.exitApp();
				}
			},
			'Offline',
			['Try Again','Close App']
		);
		navigator.notification.vibrate(100);
	}
}

// When iframe is ready
function iframeReady()
{
	setTimeout(function()
	{
        navigator.splashscreen.hide();
    }, 2000);
}