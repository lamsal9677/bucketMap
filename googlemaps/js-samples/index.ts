const ASSUMED_TIME_PER_LOCATION_MINUTES = 30;

async function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  start: string,
  end: string,
  waypoints: string[],
  timeInMinutes: number
) {
  const waypointCount = waypoints.length;
  console.log(waypointCount)


  if (waypointCount < 2) {
    window.alert("Please enter at least two waypoints.");
    return;
  }

  console.log("request before google")
  const request: google.maps.DirectionsRequest = {
    origin: start,
    destination: end,
    waypoints: waypoints.map(waypoint => ({ location: waypoint, stopover: true })),
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  console.log("request after google")

  await directionsService.route(request, (response, status) => {
    if (status === "OK") {
      const route = response.routes[0];
      const legDurations = calculateLegDurations(route, waypoints.length);
      const waypointsToShow = calculateWaypointsToShow(waypoints, legDurations, timeInMinutes);
      // console.log(waypointsToShow)
      const maxDestinationsElement = document.getElementById("max-destinations");
      if (maxDestinationsElement) {
        const numDestinations = waypointsToShow.length - 2;
        maxDestinationsElement.textContent = `${numDestinations}`;
      }

      // Display the total time excluding start and end waypoints
      const totalDurationMinutes = calculateTotalDuration(legDurations, waypointsToShow.length);
      const totalTimeElement = document.getElementById("total-time");
      if (totalTimeElement) {
        totalTimeElement.textContent = `${totalDurationMinutes.toFixed(2)} minutes`;
      }

      displayRoute(directionsRenderer, [start, ...waypointsToShow, end]);
    } else {
      console.error("Directions request failed:", status);
    console.error("Error response:", response);
    window.alert("Directions request failed due to " + status);
    }
  });
}

function calculateLegDurations(route: google.maps.DirectionsRoute, numWaypoints: number): number[] {
  const legDurations: number[] = [];
  for (let i = 0; i < numWaypoints + 1; i++) {
    const leg = route.legs[i];
    const durationWithAssumedTime = leg.duration?.value ? leg.duration.value + ASSUMED_TIME_PER_LOCATION_MINUTES * 60 : 0;
    legDurations.push(durationWithAssumedTime);
  }
  return legDurations;
}

function calculateTotalDuration(legDurations: number[], numWaypoints: number): number {
  let totalDurationMinutes = 0;
  // Exclude start and end waypoints from the total time calculation
  for (let i = 1; i < numWaypoints - 1; i++) {
    totalDurationMinutes += legDurations[i] / 60; // Convert seconds to minutes
  }
  return totalDurationMinutes;
}

function calculateWaypointsToShow(waypoints: string[], legDurations: number[], timeInMinutes: number): string[] {
  const waypointsToShow: string[] = [];
  let accumulatedDuration = 0;

  for (let i = 0; i < waypoints.length; i++) {
    accumulatedDuration += legDurations[i];

    // Include waypoints that can be visited within the specified time
    if (accumulatedDuration <= timeInMinutes * 60) {
      waypointsToShow.push(waypoints[i]);
    } else {
      break;  // Stop adding waypoints if time exceeds the constraint
    }
  }

  return waypointsToShow;
}

function displayRoute(directionsRenderer: google.maps.DirectionsRenderer, waypointsToShow: string[]) {
  // console.log(waypointsToShow)
  const request: google.maps.DirectionsRequest = {
    origin: waypointsToShow[0],
    destination: waypointsToShow[waypointsToShow.length - 1],
    waypoints: waypointsToShow.slice(1, waypointsToShow.length - 1).map(waypoint => ({ location: waypoint, stopover: true })),
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  const directionsService = new google.maps.DirectionsService();
  directionsService.route(request, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response);
    } else {
      window.alert("Directions request failed due to " + status);
    }
  });
}

async function initMap(): Promise<void> {
  const directionsService = new google.maps.DirectionsService();
  // const directionsRenderer = new google.maps.DirectionsRenderer();

  const customMarkerIcon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Replace with your custom icon URL
    scaledSize: new google.maps.Size(24, 24), // Adjust the size as needed
  };

  const directionsRenderer = new google.maps.DirectionsRenderer({
    markerOptions: {
      icon: customMarkerIcon,
    },
    polylineOptions: {
      strokeColor: '#d8ecf0'  // Change this to any color you desire
    }
  });

  const customMapStyle = [{
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#000002"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1f1d1d"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "weight": 0.5
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3fa0b5"
      },
      {
        "lightness": -50
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#080a0e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3fa0b5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }];

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 6,
      center: { lat: 41.85, lng: -87.65 },
      styles: customMapStyle,  // Apply the custom style to the map
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    }
  );

  await directionsRenderer.setMap(map);

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    async () => {
      const start = (document.getElementById("start") as HTMLInputElement).value;
      const end = (document.getElementById("end") as HTMLInputElement).value;
      const noLocation = 10;
      const prefrence = (document.getElementById("prefrence") as HTMLInputElement).value;
      
      // const locationsInput = "Boston Tea Party Ships & Museum, Boston; USS Constitution Museum, Boston; Massachusetts State House, Boston; MIT Museum, Cambridge; The Esplanade, Boston; Charles River, Boston; Boston Public Library, Boston; John F. Kennedy Presidential Library and Museum, Boston";
      const GPTPrompt = `List ${noLocation} ${prefrence} locations between ${start} and ${end}, separated by semicolons (not in bullets) and no other message. For example: Massachusetts Hall, Harvard Yard, Cambridge, MA 02138; Harvard Lampoon Building, 44 Bow St, Cambridge, MA 02138; ...`;
      
      
      // const GPTPrompt = `JUST JSON called locations and no other message. List ${noLocation} ${prefrence} locations between ${start} and ${end}. Need exact location. Example: 3025 S Glass Bowl Dr, Toledo, OH 43606; 2515 W Bancroft St, Ottawa, OH 45458`
      
      //const GPTPrompt = `JUST an array please and no other message. List ${noLocation} ${prefrence} locations between ${start} and ${end}. Need exact location. Example: ["3025 S Glass Bowl Dr, Toledo, OH 43606", "2515 W Bancroft St, Ottawa, OH 45458"]`



      console.log(GPTPrompt);
      console.log("Before Callllll");

        // Calling the server-side endpoint
        const response = await fetch('http://localhost:3000/ask-openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: GPTPrompt })
        });
        const result = await response.json();
       
        console.log(result.text);  // Note the ".text" to access the returned data

        //let parsedData = JSON.parse(result);
        //let waypointsArray = parsedData.addresses;
        

        // const waypointsArray = JSON.parse(result);

        //let matches = result.text.match(/\d{1,5} .+?(?= \d{1,2}\.)/g);
        //let waypointsArray = matches ? Array.from(matches) : [];

        //console.log(waypointsArray);

        // const waypointsArray = ["aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj"]

        const locationsInput = result.text;
        
        //const locationsInput = result.locations;
      
      const waypointsArray = locationsInput.split(';').map(waypoint => waypoint.trim());
      const timeInput = document.getElementById("time") as HTMLInputElement;
      const timeInMinutes = parseInt(timeInput.value, 10);

      if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        window.alert("Please enter a valid positive number for time.");
        return;
      }
      const allWaypoints = [start, ...waypointsArray, end];
      console.log(allWaypoints)
      await calculateAndDisplayRoute(directionsService, directionsRenderer, start, end, allWaypoints, timeInMinutes);
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;