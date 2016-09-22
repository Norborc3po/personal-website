var pad = function pad(num){
   return ('0' + num).slice(-2);
}

document.addEventListener("DOMContentLoaded", function(event) { 
    window.setInterval(function(){
        var date = new Date();
        var hours = pad(date.getHours());
        var minutes = pad(date.getMinutes());
        var seconds = pad(date.getSeconds());
        var time = hours + ':' + minutes + ':' + seconds;
        document.querySelector('#terminal .time').innerHTML = time;
    }, 200);
});

