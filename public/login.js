function loadLoginButton(){
  document.getElementById('login_button').addEventListener("click", function(){
    var email = document.getElementById('l_email_id').value;
    var password = document.getElementById('l_password_id').value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      window.location = 'index.html';
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  });
}

function loadRegisterButton(){
  document.getElementById('register_button').addEventListener("click", function(){
    var email = document.getElementById('r_email_id').value;
    var password = document.getElementById('r_password_id').value;
    if (password === document.getElementById('r_rep_password_id').value) {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        window.location = 'index.html';
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    } else {
      alert("passwords doesn't match");
    }
  });
}

window.onload = function() {
   loadLoginButton();
   loadRegisterButton();
 }
