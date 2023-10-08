const ASSUMED_TIME_PER_LOCATION_MINUTES = 30;

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  start: string,
  end: string,
  waypoints: string[],
  timeInMinutes: number
) {
  const waypointCount = waypoints.length;

  if (waypointCount < 2) {
    window.alert("Please enter at least two waypoints.");
    return;
  }

  const request: google.maps.DirectionsRequest = {
    origin: start,
    destination: end,
    waypoints: waypoints.map(waypoint => ({ location: waypoint, stopover: true })),
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (response, status) => {
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

function initMap(): void {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 6,
      center: { lat: 41.85, lng: -87.65 },
    }
  );

  directionsRenderer.setMap(map);

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    async () => {
      const start = (document.getElementById("start") as HTMLInputElement).value;
      const end = (document.getElementById("end") as HTMLInputElement).value;
      const noLocation = 10;
      const prefrence = (document.getElementById("prefrence") as HTMLInputElement).value;
      
      // const locationsInput = "Boston Tea Party Ships & Museum, Boston; USS Constitution Museum, Boston; Massachusetts State House, Boston; MIT Museum, Cambridge; The Esplanade, Boston; Charles River, Boston; Boston Public Library, Boston; John F. Kennedy Presidential Library and Museum, Boston";
      const GPTPrompt = `List ${noLocation} ${prefrence} locations between ${start} and ${end}, separated by semicolons (not in bullets). For example: Harvard University, Cambridge; Freedom Trail, Boston; ...`;
      console.log(GPTPrompt);

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

        const locationsInput = result.text;
      
      const waypointsArray = locationsInput.split(';').map(waypoint => waypoint.trim());
      const timeInput = document.getElementById("time") as HTMLInputElement;
      const timeInMinutes = parseInt(timeInput.value, 10);

      if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        window.alert("Please enter a valid positive number for time.");
        return;
      }
      const allWaypoints = [start, ...waypointsArray, end];
      console.log(allWaypoints)
      calculateAndDisplayRoute(directionsService, directionsRenderer, start, end, allWaypoints, timeInMinutes);
    }
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;