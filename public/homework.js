const studentColl = "students";
const homeworkColl = "homeworks";

const textVar = "text";

var id;
var db;
var currentUser;

function onFinished() {
  var id = window.location.href;
  id = id.substring(id.lastIndexOf('=') + 1);

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }

  db = firebase.firestore();
  db.collection(String(studentColl)).doc(firebase.auth().currentUser.email).collection(String(homeworkColl)).doc("lol").set({sas: id}, {merge: true});

  db.collection(String(studentColl)).doc(firebase.auth().currentUser.email).collection(String(homeworkColl)).doc(String(id)).get()
  .then(function(doc) {
    console.log(doc.id, " => ", doc.data());
    setContent(doc);
  });
}

function setContent(doc) {
  var task = document.getElementById('task');
  if (doc.data().type == String(textVar)) {
    task.appendChild(document.createTextNode(String(doc.data().task)));
  }

  var list = document.getElementById('answers');
  for (var i = 0; i < doc.data().answer.length; i++) {
    var entry = document.createElement('li');
    var inp = document.createElement('input');
    inp.type = "text";
    inp.id = "answer" + i;
    inp.placeholder = String("Answer for question " + i);
    entry.appendChild(inp);
    list.appendChild(entry);
  }

  var confirm = document.getElementById('confirm_button');
  confirm.addEventListener("click", function(){
    var newid = window.location.href;
    newid = newid.substring(newid.lastIndexOf('=') + 1);

    var answersAct = new Array();
    var newMark = 5;

    for (var i = 0; i < document.getElementById('answers').childElementCount; i++) {
      answersAct.push(document.getElementById('answer' + i).value);
      if ((answersAct[i] != doc.data().answer[i]) && (newMark > 1)) {
        newMark--;
      }
    }

    var ref = db.collection(String(studentColl)).doc(firebase.auth().currentUser.email).collection(String(homeworkColl)).doc(String(newid))
    .set({mark: newMark, answers_act: answersAct}, {merge: true});

    window.location = 'index.html';
  });
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location = 'login.html';
    } else {
      currentUser = user;
      onFinished();
    }
  });
}
