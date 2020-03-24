/*Developed By Yash Bhardwaj*/

var $segs;
var angle = 0;
var segments = 36;
var rings = 4;
var max_lives = 3;
var cnt;
var i;
var error_snd;
var lives;
var angle = Array(rings);
var angleSpeed = Array(rings);
var done = false;
var timeout = false;

function setupSegments() {
    var wrap = document.getElementById("wrap");
    var scale = 1.3;
    var opac = 0.5;
    angleSpeed[0] = 3.0;
    angleSpeed[1] = -3.0;
    angleSpeed[2] = 2.5;
    angleSpeed[3] = -2.5;
    for (var r = 0; r < rings; r++) {
        angle[r] = 0;
        var ring = document.createElement("div");
        ring.className = "ring";
        var hide = false;
        for (var s = 0; s < segments; s++) {
            var segment = document.createElement("div");
            var cn = "seg";
            var change_p = hide ? 0.5 : 0.3;
            if (Math.random(1.0) < change_p) hide = !hide;
            if (hide) cn += " hide";
            if (Math.random(1.0) < 0.1) cn += " long";
            segment.className = cn;
            segment.title = ring;
            ring.insertBefore(segment, null);
        }
        $(ring).css("transform", "scale(" + scale + ")");
        ring.style.opacity = opac;
        opac += 0.15;
        scale *= 0.7;
        wrap.insertBefore(ring, null);
    }
}

function rep_ex() {
    for (var j = 0; j < rings; j++) {
        angle[j] += angleSpeed[j];
        if (angle[j] >= 360) angle[j] -= 360;
    }
    cnt = 0;
    $('.seg').each(function () {
        var index = Math.floor(cnt / segments);
        var a = angle[index] + (360 / segments) * cnt;
        $(this).css("transform", "rotate(" + a + "deg)");
        cnt++;
    });
    var a = (Math.PI * angle[0]) / 45.0;
    a = Math.sin(a) / 4 + 0.8;
    $('#win').css("transform", "scale(" + a + ")");
}

function init() {
    $('#wrap').html("");
    $("#reset").text("Start");
    $('#reset').css("display", "none");
    $('#win').mouseenter(function () {
        fail(false);
    });
    setupSegments();
    $('.seg').each(function () {
        $(this).css("transform-origin", "50% 200px");
        $(this).mouseenter(function () {
            fail(true)
        });
    });
    i = setInterval(rep_ex, 30);
    if(lives<=0 || lives>max_lives)
        lives=1;
    done = false;
    $("#lives").text("Incercari: "+lives+"/"+max_lives);
}

function fail(play) {
    if (done) return;
    window.clearInterval(i);
    if (play) {
        $("#reset").text("Reseteaza");
        if(lives>=max_lives) {
            $.post('http://fn_atm_rob/lose', JSON.stringify());
            menuToggle(false);
        } 
    } else {
        $.post('http://fn_atm_rob/win', JSON.stringify());
        menuToggle(false);
    }
    $('#reset').css("display", "block");
    done = true;
}

// $(document).ready(init);

function menuToggle(state) {
    if(state && !timeout) {
        lives=0;
        $("#main").show();
        init();
        timeout = true;
        setInterval(function(){timeout=false;},100)
    } else {
        $("#main").hide();
        window.clearTimeout(i);
    }
}
$(function(){
    menuToggle(false);
    lives=0;
    $("#lives").text("Attempt: "+lives+"/"+max_lives);
    window.addEventListener('message', function(event){
        if(event.data.type=="togglemenu") {
            menuToggle(event.data.state);
        }
    });
    $("#reset").focus(function(){
        $(this).blur(); // would be a nice bug if not done
    });
    $("#reset").click(function(){
        console.log(lives++);
        $("#lives").text("Attempt: "+lives+"/"+max_lives);
    });
    document.onkeyup = function (data) {
        if (data.which == 27) {
            $.post('http://fn_atm_rob/hide', JSON.stringify());
            menuToggle(false);
        }
    };
});