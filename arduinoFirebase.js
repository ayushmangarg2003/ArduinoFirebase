const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const firebase = require('firebase-admin');

// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaozhEcpC86dUuq7du74WbCqJtxd5t6eo",
    authDomain: "abhiyantran-1.firebaseapp.com",
    databaseURL: "https://abhiyantran-1-default-rtdb.firebaseio.com",
    projectId: "abhiyantran-1",
    storageBucket: "abhiyantran-1.appspot.com",
    messagingSenderId: "237276575064",
    appId: "1:237276575064:web:be660a7d00564917c8612d",
};

firebase.initializeApp(firebaseConfig);

// Reference to your Firebase Realtime Database
const dbRef = firebase.database().ref();

// Create a SerialPort instance and specify the port and baud rate
const port = new SerialPort.SerialPort({path:'COM3', baudRate: 9600 }); // Adjust the port name as needed
const parser = new Readline.ReadlineParser();

port.pipe(parser);

// Listen for data from the Arduino
parser.on('data', (data) => {
    // Data received from Arduino, send it to Firebase
    sendDataToFirebase(data);
});

// Function to send data to Firebase
function sendDataToFirebase(data) {
    // Define the Firebase database path where you want to store the data
    const firebasePath = 'arduinoData';

    // Push the data to Firebase with a timestamp
    dbRef.child(firebasePath).push({
        value: data.trim(), // Trim any extra whitespace
        timestamp: firebase.database.ServerValue.TIMESTAMP, // Add a server timestamp
    });

    console.log(`Data sent to Firebase: ${data}`);
}