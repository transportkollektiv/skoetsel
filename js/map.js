map = null;
initMap()
loadData()

function initMap() {
	map = L.map('map').setView([48.3925, 9.9938], 13);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		maxZoom: 18
	}).addTo(map);
}

async function loadData() {
	let res = await fetch('http://localhost:8000/api/maintenance/mapdata')
	let data = await res.json()
	console.log(data)
	data.forEach(bike => {
		if (!bike.lat || !bike.lng) {
			bike.trackers.forEach(tracker => {
				if (tracker.lat && tracker.lng) {
					bike.lat = tracker.lat
					bike.lng = tracker.lng
					bike.hasNoPublicLocation = true
				}
			})
		}
		if (bike.lat && bike.lng){
			var marker = L.marker([bike.lat, bike.lng], {
				icon: L.BeautifyIcon.icon({
					icon: 'bicycle',
					iconShape: 'marker',
					popupAnchor: [1,-39]
				})
			})
			marker.addTo(map);
			marker.bindPopup(generateBikePopUpContent(bike), {
				autoClose: false,
				closeOnClick: false
			})

			let trackerlayer = L.layerGroup()
			bike.trackers.forEach(tracker => {
				line = turf.lineString([[bike.lng, bike.lat], [tracker.lng, tracker.lat]])
				if (turf.length(line, {units: 'kilometers'}) > 0.8) {
					L.geoJSON(line, { 
						style: {color: "red"}
					}).addTo(map)
				}
				L.geoJSON(line).addTo(trackerlayer)
				let trackerMarker = L.marker([tracker.lat, tracker.lng], {
					icon: L.BeautifyIcon.icon({
						icon: tracker.internal ? 'lock' : '',
						iconStyle: "font-size: 9px;",
						innerIconAnchor: [0,-10],
						iconSize: [16,16],
						iconAnchor: [8,8],
						textColor: "gray",
						borderColor: "black",
						popupAnchor: [0,-10]
						//borderWidth: 5,
						//iconShape: 'circle-dot'
					}),
				})
				trackerMarker.addTo(trackerlayer)
				trackerMarker.bindPopup(generateTrackerPopUpContent(tracker))
			})

			marker.on("popupopen", ()=>{
				trackerlayer.addTo(map)
			})
			marker.on("popupclose", ()=>{
				//trackerlayer.addTo(map)
				map.removeLayer(trackerlayer)
			})
		}
	});
}

function generateBikePopUpContent(bike) {
	let text = `
		<table>
			<tr><td>Bike</td><td><b>${bike.bike_number}</b></td></tr>
			<tr><td>Availablility</td><td>${bike_availability_states[bike.availability_status]}</td></tr>
			<tr><td>Status</td><td>${bike_states[bike.state]}</td></tr>
			${generateLockInfo(bike)}
		</table>
	`
	return text
}

function generateLockInfo(bike) {
	if (bike.lock) {
		return `
			<tr><td>Lock ID</td><td>${bike.lock.lock_id}</td></tr>
			<tr><td>Unlock key</td><td>${bike.lock.unlock_key}</td></tr>
		`
	}
	return ""
}

function generateTrackerPopUpContent(tracker) {
	return `
	<table>
		<tr><td>Tracker ID</td><td><b>${tracker.device_id}</b></td></tr>
		<tr><td>Internal</td><td>${tracker.internal}</td></tr>
		<tr><td>Battery voltage</td><td>${tracker.battery_voltage} V</td></tr>
		<tr><td>Tracker Type</td><td>${tracker.tracker_type}</td></tr>
	</table>
	`
}

bike_states = {
	US: "Usable",
    BR: "Broken",
    IR: "In Repair",
    MI: "Missing"
}

bike_availability_states = {
	DI: "Disabled",
    IU: "In Use",
    AV: "Available"
}