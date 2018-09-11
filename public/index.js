const studentColl = "students";
const homeworkColl = "homeworks";
const dateField = "date";
const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

var weekCounter = 0; //week movement modifier
var date; //date in the list
var db;
var currentUser;

function onLoaded() {
  // // The Firebase SDK is initialized and available here!
  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }

  db = firebase.firestore();

  /*var list = document.getElementById('hws');
	for(var i=1; i<=40; i++){
    var entry = document.createElement('li');
    entry.className = "item";
    entry.appendChild(document.createTextNode("firstname"));
    list.appendChild(entry);
  };*/

  document.getElementById('left_button').addEventListener("click", function(){
    weekCounter = weekCounter-1;
    prepareDays(); //move date to the previous week
  });
  document.getElementById('right_button').addEventListener("click", function(){
    weekCounter = weekCounter+1;
    prepareDays(); //move date to the next week
  });

  date = new Date();
  prepareDays();
}

function prepareDays() {
  var list = document.getElementById('hws');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  date.setDate(date.getDate() - date.getDay() + 1 + (weekCounter * 7));
  fillDaysIn(date);
}

function fillDaysIn(dt) {
  if (dt.getDay() > 0){
    var dateKey = 10000 * dt.getFullYear() + 100 * (dt.getMonth()+ 1) + dt.getDate(); //special field in the homework class
    console.log('searching: ' + dateKey);
    setDivider();
    db.collection(String(studentColl)).doc(firebase.auth().currentUser.email).collection(String(homeworkColl)).where(String(dateField), "==", String(dateKey))
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          setItem(doc);
      });
      dt.setDate(dt.getDate() + 1);
      fillDaysIn(dt);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  } else {
    console.log("end of search");
    date = new Date();
  }
}

function setItem(doc) {
  var list = document.getElementById('hws');
  var entry = document.createElement('li');
  entry.className = "item";
  entry.id = String(doc.id);
  entry.addEventListener("click", function(){
    if (doc.data().mark == 0) {
      var path = 'homework.html?id=';
      path += entry.id;
      window.location = String(path);
    } else {
      alert("already done");
    }
  });
  var table = document.createElement('table');
  table.className = "homework";
  var col1 = document.createElement('tr');
  var header = document.createElement('td');
  header.className = "item-header";
  header.appendChild(document.createTextNode(String(doc.data().subject)));
  var mark = document.createElement('td');
  mark.className = "item-mark";
  mark.rowspan = "2";
  mark.appendChild(document.createTextNode(String(doc.data().mark)));
  col1.appendChild(header);
  col1.appendChild(mark);
  var col2 = document.createElement('tr');
  var desc = document.createElement('td');
  desc.className = "item-body";
  desc.appendChild(document.createTextNode(String(doc.data().title)));
  col2.appendChild(desc);
  table.appendChild(col1);
  table.appendChild(col2);
  entry.appendChild(table);
  list.appendChild(entry);
}

function setDivider() {
  var list = document.getElementById('hws');
  var entry = document.createElement('li');
  entry.className = "divider";
  entry.appendChild(document.createTextNode(date.getDate() + " " + String(days[date.getDay()])));
  list.appendChild(entry);
}

window.onload = function() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location = 'login.html';
    } else {
      currentUser = user;
      onLoaded();
    }
  });
}
