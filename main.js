// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAepgsRgEBiGtuJCi6LSBoyPHFjGW1beC8",
    authDomain: "lorry-fly-9a2aa.firebaseapp.com",
    databaseURL: "https://lorry-fly-9a2aa.firebaseio.com",
    projectId: "lorry-fly-9a2aa",
    storageBucket: "lorry-fly-9a2aa.appspot.com",
    messagingSenderId: "830200358518",
    appId: "1:830200358518:web:f851e4a916b190582a6157",
    measurementId: "G-ZDBYTBHHYP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Reference messages collection
var messagesRef = firebase.database().ref('messages');

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var email = getInputVal('email');
  var phone = getInputVal('phone');
  var message = getInputVal('message');

  // Save message
  saveMessage(name, email, phone, message);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('contactForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, email, phone, message){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    name: name,
    email:email,
    phone:phone,
    message:message
  });
}

// Toggle Collapse
$('.faq li .question').click(function () {
	$(this).find('.plus-minus-toggle').toggleClass('collapsed');
	$(this).parent().toggleClass('active');
  });
  
  





//script.js//

