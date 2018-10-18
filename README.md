XMP-MAP directive
=================
The **xmp-map** directive allows to display a Google map on the page. 
The directive can display a pin or a route according to options you provide to it.

Prerequisites
-------------
You will need a Google API key to use this directive.
The API is used to convert the address to coordinates the map can display.

Default usage:
```javascript
<div xmp-map center='xmp.r.Address' geocoding-api-key='api-key-provided-by-google'/>
```

Full usage showing some attributes in code form that you can cut & paste into your HTML:
```javascript
<div xmp-map 
		geocoding_api_key="api-key-provided-by-google"
        center="xmp.r.CenteredAddressString"
        route-origin="xmp.r.OriginAddressString"
        route-destination="xmp.r.DestinationAddressString"
        zoom="8"
        width="450px"
        height="400px" >
</div>
```

Attributes:

| **Attribute** | **Description** |
| ------------- | ------------- |
| **geocoding-api-key** | A Google Geocoding API key.  To generate a key follow instructions [here](https://developers.google.com/maps/documentation/javascript/tutorial). |
| **center** | An address to act as the center of the map. This is a single ADOR or a concatenation of multiple ADORs. For best results, create a new ADOR in your plan that combines all of the typical address information that you would normally use when finding your address in Google Maps. |
| **pin** | An address to place a pin on the map. This is a single ADOR or a concatenation of multiple ADORs. For best results, create a new ADOR in your plan that combines all of the typical address information that you would normally use when finding your address in Google Maps. |
| **route-origin** | An address for the start of the route. This is a single ADOR or a concatenation of multiple ADORs. For best results, create a new ADOR in your plan that combines all of the typical address information that you would normally use when finding your address in Google Maps. |
| **route-destination** | An address for the end of the route. This is a single ADOR or a concatenation of multiple ADORs. For best results, create a new ADOR in your plan that combines all of the typical address information that you would normally use when finding your address in Google Maps. |
| **zoom** | The zoom factor the map should be initialised with. The default value is 8. Lower values mean you are zoomed out more. Higher values mean you are zoomed in close to the address. Zoom level 1 would show the world view, Zoom level 5 shows continents, Zoom level 10 shows a city view. If you zoom all the way down to level 20, it shows individual buildings. |
| **width** | Width of the map. This field accepts CSS values such is '600px', '50%'. If not specified the default value is 100%. |
| **height** | Height of the map. This field accepts CSS values as the width. If not specified the default value is 300px. |
| **map-styles** | Styles to customize the map's theme. You can find detailed information from Google Maps [here](https://developers.google.com/maps/documentation/javascript/styling?hl=en). |
| **options** | These are the options values which allow you to override all option and control map styling. Code example is below. |

```javascript
{
	center: {
		address:'set address here'
	},
	zoom:8,
	width:'500px',
	height:'400px',
	route:{
		color: '#FF00FF', // color of the route line
		origin:{ address : 'set address here'},
		destination: { address: 'set address here'}
	},
	routeIcons: {
		start: {
			url : 'url of image',
			size: { width: 30, height: 30},
			origin: {x:0, y:0},
			anchor: {x:0, y:0}
		},
		end: {
			url : 'url of image',
			size: { width: 30, height: 30},
			origin: {x:0, y:0},
			anchor: {x:0, y:0}
		}
	},
	pin: {
		address: 'set address here',
		icon: {
			url : 'url of image',
			size: { width: 30, height: 30},
			origin: {x:0, y:0},
			anchor: {x:0, y:0}
		}
	},
	mapStyles: [
      {
        featureType: '',
        elementType: '',
        stylers: [
          {hue: ''},
          {saturation: ''},
          {lightness: ''},
          // etc...
        ]
      },
      {
        featureType: '',
        // etc...
      }
    ]
	geocoding_api_key: 'google-api-key here.'
}
```

 
Obtaining an API Key
--------------------

To get started using JavaScript API, you need to create or select a project in the Google Developers Console and enable the API. Click this [link](https://console.developers.google.com/flows/enableapi?apiid=maps_backend&keyType=CLIENT_SIDE&reusekey=true), which guides you through the process and activates the JavaScript API automatically.

Alternatively, you can activate the JavaScript API yourself in the Developers Console by doing the following:

Go to [Google Developers Console](https://console.developers.google.com/project).
Select a project, or create a new one.
In the sidebar on the left, expand APIs & auth. Next, click APIs. Select the Enabled APIs link in the API section to see a list of all your enabled APIs. Make sure that the Google Maps JavaScript API is on the list of enabled APIs. If you have not enabled it, select the API from the list of APIs, then select the Enable API button for the API.
In the sidebar on the left, select Credentials.
In either case, you end up on the Credentials page where you can access your project's credentials.

If your project doesn't already have a Browser API key, create one now by selecting Add credentials > API key > Browser key.

Map styling
-----------
Map features are the geographic elements that can be targeted on the map. These include roads, parks, bodies of water, and more, as well as their labels.
Stylers are color and visibility properties that can be applied to map features. They define the display color through a combination of hue, color, and lightness/gamma values.
Map features and stylers are combined into a style array, which is passed to the default map's MapOptions object
There are a few tools for setting the maps styles on the internet, two examples
- [Mapstylr]
- [Snazzy Maps](https://snazzymaps.com/)

