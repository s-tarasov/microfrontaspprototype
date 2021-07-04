function getTime() {
  var d = new Date();
  var h = (d.getHours()).toString();
  var m = (d.getMinutes()).toString();
  var s = (d.getSeconds()).toString();
  var h2 = ("0" + h).slice(-2);
  var m2 = ("0" + m).slice(-2);
  var s2 = ("0" + s).slice(-2);
  return h2 + ":" + m2 + ":" + s2;
}

function displayTime() {  
  var y = document.getElementById("a"); 
  y.innerHTML = getTime();
}
setInterval(displayTime, 1000);