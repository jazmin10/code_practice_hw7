$(document).ready(function() {

// ========== GLOBAL VARIABLES ==========
// Firebase Config
  var config = {
    apiKey: "AIzaSyCa1lcOJMrdYEoXumlkbsOL6WUaFg1LYKU",
    authDomain: "click-button-4f522.firebaseapp.com",
    databaseURL: "https://click-button-4f522.firebaseio.com",
    projectId: "click-button-4f522",
    storageBucket: "click-button-4f522.appspot.com",
    messagingSenderId: "794333455197"
  };

  var databaseConnectionsRef;
  var connectedRef;

	var playerOneKey = "";
	var playerTwoKey = "";
	var playerOneTurn = false;
	var playerTwoTurn = false;
	var canPlay = false;
	var options = ["r", "p", "s"];

	// var playersKey = "";

// ========== FUNCTIONS ==========

	// When there are no players, display the following...
	function displayNoPlayers() {
		$("#player-one-div").html($("<h2>").text("Waiting for player"));
		$("#player-two-div").html($("<h2>").text("Waiting for player"));
		$("#results-div").html($("<h2>").text("Waiting..."));
	}

	// When a player wants to join
	function addPlayer() {
		event.preventDefault();

		var newPlayerName = $("#name-input").val().trim();
		$("#name-input").val("");

		connectedRef.on("value", function(connectionSnap) {
			var viewer = connectionSnap.val();

			var con = databaseConnectionsRef.push({
				name: newPlayerName,
				pick: ""
			});

			con.onDisconnect().remove();
		});
	}

	// Sets the players
	function setPlayers(playersInfo) {

		// Grab the keys of the connections object saved in firebase
		var players = Object.keys(playersInfo);

		// If there is only one player...
		if (players.length === 1) {

			// Store player one key value
			playerOneKey = players[0];


			// Display player's one name
			displayPlayer(playersInfo[playerOneKey].name, "#player-one-div");

			$("#results-div").html($("<h2>").text("Waiting..."));
			$("#player-two-div").html($("<h2>").text("Waiting for player"));
		}
		// If there is more than one player...
		else {
			// Store player one key value and display name
			playerOneKey = players[0];
			displayPlayer(playersInfo[playerOneKey].name, "#player-one-div");


			// Set and display player two and display name
			playerTwoKey = players[1];
			displayPlayer(playersInfo[playerTwoKey].name, "#player-two-div");

			// Start the game
			startGame();
		}
	}

	// Displays player's names in the appropriate section
	function displayPlayer(name, section) {
		var p = $("<p>").text("Player's name: " + name);
		$(section).html(p);
	}

	// Start the game by...
	function startGame() {
		// hiding the add new player form
		$("#form-div").hide();

		// Initial game instructions
		$("#results-div").html("<p>Let's play! Player one goes first...</p>");

		canPlay = true;
		playerOneTurn = true;
	}

	// When a key is pressed...
	function play() {

		// Check if we can play
		if (canPlay) {

			// Continue if r, p, or s where pressed
			if (event.key === "r" || event.key === "p" || event.key === "s") {

				// If it's player's one turn, then store their pick
				if (playerOneTurn) {
					playerOneTurn = false;
					playerTwoTurn = true;
					$("#results-div").html("<p>Player's two turn...</p>");

				}
				// If it's player's two turn, then store their pick
				else if (playerTwoTurn) {
					console.log("store player two pick");
					playerTwoTurn = false;
				}
			}
		}
	}

// ========== MAIN PROCESSES ==========

	// Initialize Firebase
	firebase.initializeApp(config);

	// Create database reference to connections
	databaseConnectionsRef = firebase.database().ref("/connections");

	// Store user connection status
	connectedRef = firebase.database().ref(".info/connected");

	// When database connections change...
	databaseConnectionsRef.on("value", function(connections) {

		// If there are no connections, then display no users information
		if (connections.numChildren() === 0) {
			displayNoPlayers();
		}
		// If we have at least one player, then set player one
		else {
			setPlayers(connections.val());
		}
	});

	// When a user wants to join, set the player
	$("#name-btn").click(addPlayer);

	// When a user presses a key...
	document.onkeyup = play;
	
});
