function Testexxx() {
  console.log('xxasdf');
}

function addZero(x, n) {
  while (x.toString().length < n) { x = "0" + x; }
  return x;
}

function formatTime (timestamp) { 
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var hoursText = hours < 10 ? `0${hours}` : hours;
  var minutesText = minutes < 10 ? `0${minutes}` : minutes;
  return `${hoursText}:${minutesText}`;
};

function DataCompletaInvertida (timestamp) { 
  var date = new Date(timestamp);
  var ano = date.getFullYear();
  var mes = date.getMonth()+1;
  var dia = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = addZero(date.getMilliseconds(), 3);
  var hoursText = hours < 10 ? `0${hours}` : hours;
  var minutesText = minutes < 10 ? `0${minutes}` : minutes;
  var secondsText = seconds < 10 ? `0${seconds}` : seconds;
  var mesText = mes < 10 ? `0${mes}` : mes;
  var diaText = dia < 10 ? `0${dia}` : dia;
  return `${ano}${mesText}${diaText}${hoursText}${minutesText}${secondsText}${milliseconds}`;
};

function DataHoraFormatada (timestamp) {
  var date = new Date(timestamp);
  var ano = date.getFullYear();
  var mes = date.getMonth()+1;
  var dia = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = addZero(date.getMilliseconds(), 3);
  var hoursText = hours < 10 ? `0${hours}` : hours;
  var minutesText = minutes < 10 ? `0${minutes}` : minutes;
  var secondsText = seconds < 10 ? `0${seconds}` : seconds;
  var mesText = mes < 10 ? `0${mes}` : mes;
  var diaText = dia < 10 ? `0${dia}` : dia;
  return `${diaText}/${mesText}/${ano} - ${hoursText}:${minutesText}:${secondsText}`;
};

module.exports = {
  Testexxx,
  addZero,
  formatTime,
  DataCompletaInvertida,
  DataHoraFormatada
};