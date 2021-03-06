$(document).ready(function() {

// ================== GLOBAL VARIABLES ==================

// Configuration for Firebase
	var config = {
		apiKey: "AIzaSyCa1lcOJMrdYEoXumlkbsOL6WUaFg1LYKU",
		authDomain: "click-button-4f522.firebaseapp.com",
		databaseURL: "https://click-button-4f522.firebaseio.com",
		projectId: "click-button-4f522",
		storageBucket: "click-button-4f522.appspot.com",
		messagingSenderId: "794333455197"
	};

	var databaseRef;

// ================== FUNCTIONS ==================

	// Grab new train information and store it in database
	function addTrain() {
		event.preventDefault();
		
		var newTrain = {
			name: $("#name-input").val().trim(),
			destination: $("#destination-input").val().trim(),
			firstTime: $("#first-time-input").val().trim(),
			frequency: $("#frequency-input").val().trim(),
		};

		$("#name-input").val("");
		$("#destination-input").val("");
		$("#first-time-input").val("");
		$("#frequency-input").val("");

		databaseRef.push(newTrain);

	}

	// Displays train list
	function displayTrains(trains) {
		$("#table-body").empty();

		// Make an array of the object's keys
		var trainsArr = Object.keys(trains);

		// Loop through the array
		trainsArr.forEach(function(trainItem) {
			// Store current train
			var train = trains[trainItem];

			// Grab the minutes left for the next arrival
			var minutesAway = determineMinutesAway(train.firstTime, train.frequency);

			// Grab the next arrival time
			var nextTime = determineNextArrival(minutesAway);

			// Create a table row
			var tr = $("<tr>");
			tr.attr("id", train.name);
			tr.attr("value", trainItem);

			// Set td cells
			var nameVal = $("<th>").text(train.name);
			nameVal.attr("scope", "row"); // to make cell text bold

			var destVal = $("<td>").text(train.destination);
			var freqVal = $("<td>").text(train.frequency);
			var nextVal = $("<td>").text(nextTime);
			var awayVal = $("<td>").text(minutesAway);

			var deleteBtn = $("<button>");
			deleteBtn.addClass("btn btn-danger btn-sm delete-btn");
			deleteBtn.attr("value", trainItem);
			deleteBtn.text("X");

			// Append cells to rows
			tr.append(nameVal)
				.append(destVal)
				.append(freqVal)
				.append(nextVal)
				.append(awayVal)
				.append(deleteBtn);

			// append table row to table body
			$("#table-body").append(tr);

		});

	}

	// Determine next arrival time by...
	function determineMinutesAway(trainStart, trainFreq) {
		// Store the train's first arrival
		// Subtract one year to first arrival time so that we are always 
		// calculating minutes away from a past time
		var initialTime = moment(trainStart, "HH:mm").subtract(1, "years");

		// Calculate the minutes lapsed from first arrival
		var timeLapsed = moment().diff(initialTime, "minutes");
		// console.log(timeLapsed); 

		// Calculate minutes passed from last arrival
		var minsPassed = timeLapsed % parseFloat(trainFreq);
		// console.log(minsPassed);

		// calculate minutes away for next arrival
		var minsAway = parseFloat(trainFreq) - minsPassed;
		
		return minsAway;
	}

	// Calculate next arrival time
	function determineNextArrival(minsLeft) {

		// Calculate next arrival time by adding minutes left for next arrival to present time
		// then format for readability
		return moment().add(minsLeft, "m").format("HH:mm A");
	}

	// When you edit a train...
	function editTrain() {
		event.preventDefault();

		// Store the name of the train
		var trainName = $("#name-edit").val().trim();

		// Find the element with whose id is equal to the name of the train
		var trainKey = $("#" + trainName).attr("value");

		// Grab new train information
		var newTrainInfo = {
			name: trainName,
			destination: $("#destination-edit").val().trim(),
			firstTime: $("#first-time-edit").val().trim(),
			frequency: $("#frequency-edit").val().trim(),
		};

		// Empty the form
		$("#name-edit").val("");
		$("#destination-edit").val("");
		$("#first-time-edit").val("");
		$("#frequency-edit").val("");

		// Set the new information to the specific train
		// We do this by finding the object's path in the database that has the trains information
		firebase.database().ref("/trains/" + trainKey).set(newTrainInfo);
	}

	// Delete the train by...
	function deleteTrain() {
		// Grab the train's key in database which was stored as value in the button element
		var deleteKey = $(this).attr("value");

		// Remove the specific train
		// the remove() method deletes the database at the ref() location specified
		firebase.database().ref("/trains/" + deleteKey).remove();
	}

// ================== MAIN PROCESSES ==================

	// Initialize Firebase
	firebase.initializeApp(config);

	// Create a reference to the path "/trains" in the database
	databaseRef = firebase.database().ref("/trains");

	$("#submit-btn").click(addTrain);

	// The callback function is triggered everytime the databaseRef values change and initial load
	databaseRef.on("value", function(trainsSnapshot) {
		
		// Display trains during initial load OR display the new train
		displayTrains(trainsSnapshot.val());
	});

	// When you click the button in the edit form, update the train's information
	$("#edit-btn").click(editTrain);

	// When user click's a delete-btn, delete the train
	$("#table-body").on("click", ".delete-btn", deleteTrain);

});