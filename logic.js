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

// ================== MAIN PROCESSES ==================

	// Initialize Firebase
	firebase.initializeApp(config);

	// Create a reference to the path "/trains" in the database
	databaseRef = firebase.database().ref("/trains");

	$("#submit-btn").click(addTrain);
});