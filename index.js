var snare = NoiseMaker(0.9, 18);

var snare2 = NoiseMaker(0.999, 20);

var hihat = NoiseMaker(0.1, 20);

var crash = NoiseMaker(0.1, 4);

var kick = Pulse(20, 20, 8);
var kickit = function(v){kick.hit(v,55*3/2)};

//measure length
var m = 1;
function at(t1,t2){return (t1 >= t2 && t1 <= t2+2/sampleRate);}

export function dsp(t){
  
  var measure = Math.floor(t/m);
  
  if (at((t/m)%(1/8),0)) {snare2.hit(0.2*Math.random() + 0.2);}  
  if (at((t/m)%(1/4),0)) {hihat.hit(1);}
  
  if((t/m)%8 <= 6){
  
    if (at((t/m)%2,0)) {kickit(1);}
    if (at((t/m)%2,1/4)) {kickit(1);}
    
    if (at((t/m)%2,1/2)) {snare.hit(1);}
    
    if (at((t/m)%2,7/8)) {snare.hit(0.7);}
    if (at((t/m)%2,9/8)) {snare.hit(0.6);}
  
    if (at((t/m)%2,5/4)) {kickit(1);}
    if ((t/m)%8 <= 4) {
      if (at((t/m)%2,11/8)) {kickit(0.8);}
      if (at((t/m)%2,6/4)) {snare.hit(1);}
      if (at((t/m)%2,15/8)) {snare.hit(0.6);}
    } else {
      
      if (at((t/m)%2,7/4)) {snare.hit(0.9);}
      
    }
    
  } else {
    
    
    if (at((t/m)%2,1/8)) {snare.hit(0.7);}
  
    if (at((t/m)%2,1/4)) {kickit(1);}
    if (at((t/m)%2,3/8)) {kickit(0.7);}
    
    if (at((t/m)%2,1/2)) {snare.hit(1);}
    
    if (at((t/m)%2,7/8)) {snare.hit(0.7);}
    if (at((t/m)%2,9/8)) {snare.hit(0.6);}
  
    if (at((t/m)%2,5/4)) {kick.hit(1, 55*3/2);}
    if (at((t/m)%2,5/4)) {crash.hit(2);}
    
    if (at((t/m)%2,11/8)) {snare.hit(0.9);}
    if (at((t/m)%2,12/8)) {snare.hit(0.4);}
    if (at((t/m)%2,13/8)) {snare.hit(0.5);}
    if (at((t/m)%2,14/8)) {snare.hit(0.6);}
    if (at((t/m)%2,15/8)) {snare.hit(0.9);}
    
  }


  
  return compress(kick.play() * 0.15 + snare.play() * 0.2 + hihat.play() * 0.1 + crash.play() * 0.15 + snare2.play() * 0.05);
  
}

function compress(w){
  return Math.atan(w*Math.PI/2)/(Math.PI/2);
}

function NoiseMaker(color, decay){
  
  var w = 0;
  var v = 0;
  
  return{
    hit : function (vel) {v = vel;},
    set_color: function(c){color = c;},
    play : function(){
      v *= (1 - decay/sampleRate);
      
      w *= color;
      w += v * (2 * Math.random() - 1);
      return w;
    }
  };
  
}

function Pulse(decay, freq_decay, base_amp){
  
  var w = 0;
  var v = 0;
  var f = 0;
  
  return{
    set_decay : function (d){
      decay = d;
    },
    hit : function (vel, freq) {
      v = vel*(2*Math.PI*f)*base_amp;
      f = freq;
    },
    play : function(){
      v += -w/sampleRate*Math.pow(2*Math.PI*f,2);
      w += v/sampleRate;
      
      w *= (1 - decay/sampleRate);
      v *= (1 - decay/sampleRate);
      f *= (1 - freq_decay/sampleRate);
      return w;
    }
  };
}
