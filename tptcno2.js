let animaciones = []; 
let animacionActiva = -1; 
let frameAnim = 0;        // indice del frame actual dentro de la animación activa
let imagenesMostradas = []; 

let tiempoCambio = 100; // milisegundos
let ultimoCambio = 0;




let monitor =true;
let AMP_MIN = 0.01; // umbral de ruido de fondo
let AMP_MAX = 0.20; // umbral superior, amplitud máxima del sonido de entrada
let FREC_MIN = 40; // frecuencia más baja que se va a cantar
let FREC_MAX = 70; // frecuencia más alta

let amortguacion = 0.9; 

//------variables de sonido
let mic; // variable para cargar la entrada de audio

let ampCruda;
let amp;

let frecCruda;
let frec; 

let pitch; // objeto de ML que carga y procesa todos los datos de frecuencia
let audioContext;
const pichModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/'; 

let gestorAmp; 
let gestorFrec;
let tonoBlack;
let haySonido = false; // ESTADO
let haySonidoAntes = false;

let tiempoSinSonido = 0;
let audioIniciado = false;

let rio1;
let rio2;


// let animRio1 = [];
// let animRio2 = [];

// let frameRio1 = 0;
// let frameRio2 = 0;

// let tiempoUltimoRio1 = 0;
// let tiempoUltimoRio2 = 0;

// let tiempoCambioRio1 = 120; 
// let tiempoCambioRio2 = 120; 


function preload() {

  
  // for (let i = 0; i <= 4; i++) {
  //   animRio1.push(loadImage("data/fotogramaRio" + nf(i, 2) + ".png"));
  // }

  
  // for (let i = 0; i <= 5; i++) {
  //   animRio2.push(loadImage("data/fotogramaRiodos" + nf(i, 2) + ".png"));
  // }
  
  let anim0 = [];
  for (let i = 0; i <= 28; i++) {
    anim0.push(loadImage("data/anima" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim0);

  let anim1 = [];
  for (let i = 0; i <= 55; i++) {
    anim1.push(loadImage("data/tercera" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim1);

  let anim2 = [];
  for (let i = 0; i <= 21; i++) {
    anim2.push(loadImage("data/cuarta" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim2);

  let anim3 = [];
  for (let i = 0; i <= 26; i++) {
    anim3.push(loadImage("data/segunda" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim3);

  let anim4 = [];
  for (let i = 0; i <= 24; i++) {
    anim4.push(loadImage("data/Animacion" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim4);
  
let anim5 = [];
  for (let i = 0; i <= 24; i++) {
    anim5.push(loadImage("data/animar" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim5);

  let anim6 = [];
  for (let i = 0; i <= 19; i++) {
    anim6.push(loadImage("data/quinta" + nf(i, 2) + ".png"));
  }
  animaciones.push(anim6);

  rio1 = loadImage("data/fondoarriba.png");
  rio2 = loadImage("data/fondoabajo.png");



  
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  colorMode(HSB);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  userStartAudio();

  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorAmp.f = amortguacion;
  gestorFrec = new GestorSenial(FREC_MIN, FREC_MAX);
  gestorFrec.f = amortguacion;
}

function mousePressed() {
  if (!audioIniciado) {
    userStartAudio().then(() => {
      mic = new p5.AudioIn();
      mic.start(() => {
        startPitch();
      });
      audioIniciado = true;
    });
  }
}

function draw() {
  background(45, 20, 95); 

  
  
  // Fondo
  // --- Actualizar y mostrar animación de río 1
// if (millis() - tiempoUltimoRio1 > tiempoCambioRio1) {
//   frameRio1 = (frameRio1 + 1) % animRio1.length;
//   tiempoUltimoRio1 = millis();
// }
// image(animRio1[frameRio1], width / 2, height / 2); // o ajustar posición

// --- Actualizar y mostrar animación de río 2
// if (millis() - tiempoUltimoRio2 > tiempoCambioRio2) {
//   frameRio2 = (frameRio2 + 1) % animRio2.length;
//   tiempoUltimoRio2 = millis();
// }
// tint(210, 255, 255);  // para rio1
// image(animRio1[frameRio1], width / 2, height / 2);

// tint(240, 100, 1);    // para rio2
// image(animRio2[frameRio2], width / 2, height / 2);


  if (mic && mic.enabled) {
    ampCruda = mic.getLevel();
  } else {
    ampCruda = 0;
  }

  gestorAmp.actualizar(ampCruda);
  amp = gestorAmp.filtrada;
  haySonido = amp > 0.04;

  

  if (haySonido && !haySonidoAntes) {
  if (animacionActiva === -1 || imagenesMostradas.length === 0) {
    animacionActiva = floor(random(animaciones.length));
    frameAnim = 0;
    imagenesMostradas = [];
  }
}


  haySonidoAntes = haySonido;

 if (animacionActiva !== -1) {
  if (millis() - ultimoCambio > tiempoCambio) {
    if (haySonido) {
      frameAnim = imagenesMostradas.length;

      if (frameAnim < animaciones[animacionActiva].length) {
        imagenesMostradas.push(animaciones[animacionActiva][frameAnim]);
      }
    } else {
      if (imagenesMostradas.length > 0) {
        imagenesMostradas.pop();
      } else {
        animacionActiva = -1;
      }
    }
    ultimoCambio = millis();
  }
}


  push();
imageMode(CENTER);

// color de cambio
let brillo = map(amp, 0.10, 0.20, 255, 0);
brillo = constrain(brillo, 0, 255);
tint(210, 255, brillo);

for (let img of imagenesMostradas) {
  image(img, width / 2, height / 2);
}
pop();

  // if(monitor){
  //   gestorAmp.dibujar(100,100);
  //  gestorFrec.dibujar(100,300);

  // }

  tint(color(210,255,255));
  image(rio1,width/2,500);
  tint(color(240,100,1));
  image(rio2,width/2,500);
}

// --- Modelo para detectar el pitch (frecuencia) de la librería ML5 (versión 0.12.2)
function startPitch() {
  pitch = ml5.pitchDetection(pichModel, audioContext, mic.stream, modelLoaded); // inicializa el modelo entrenado
}

function modelLoaded() {
  getPitch();
   console.log("HOLA");
}

function getPitch() {

  pitch.getPitch(function(err, frequency) {
    if (frequency) {
   
      frecCruda = frequency;
      let nota = freqToMidi(frecCruda)
      gestorFrec.actualizar(nota); // proceso la señal directa de frecuencia por el gestor
       }
    getPitch();
  });
}

let altoGestor = 100;
let anchoGestor = 400;

class GestorSenial {
  constructor(minimo_, maximo_) {
    this.minimo = minimo_;
    this.maximo = maximo_;

    this.puntero = 0;
    this.cargado = 0;
    this.mapeada = [];
    this.filtrada = 0;
    this.anterior = 0;
    this.derivada = 0;
    this.histFiltrada = [];
    this.histDerivada = [];
    this.amplificadorDerivada = 15.0;
    this.dibujarDerivada = false;

    this.f = 0.80;
  }

  actualizar(entrada_) {
    this.mapeada[this.puntero] = map(entrada_, this.minimo, this.maximo, 0.0, 1.0);
    this.mapeada[this.puntero] = constrain(this.mapeada[this.puntero], 0.0, 1.0);

    this.filtrada = this.filtrada * this.f + this.mapeada[this.puntero] * (1 - this.f);
    this.histFiltrada[this.puntero] = this.filtrada;

    this.derivada = (this.filtrada - this.anterior) * this.amplificadorDerivada;
    this.histDerivada[this.puntero] = this.derivada;

    this.anterior = this.filtrada;

    this.puntero++;
    if (this.puntero >= anchoGestor) {
      this.puntero = 0;
    }
    this.cargado = max(this.cargado, this.puntero);
  }

  dibujar(x_, y_) {
    push();
    fill(0);
    stroke(255);
    rect(x_, y_, anchoGestor, altoGestor);

    for (let i = 1; i < this.cargado; i++) {
      let altura1 = map(this.mapeada[i - 1], 0.0, 1.0, y_ + altoGestor, y_);
      let altura2 = map(this.mapeada[i], 0.0, 1.0, y_ + altoGestor, y_);

      stroke(255);
      line(x_ + i - 1, altura1, x_ + i, altura2);

      altura1 = map(this.histFiltrada[i - 1], 0.0, 1.0, y_ + altoGestor, y_);
      altura2 = map(this.histFiltrada[i], 0.0, 1.0, y_ + altoGestor, y_);

      stroke(0, 255, 0);
      line(x_ + i - 1, altura1, x_ + i, altura2);

      if (this.dibujarDerivada) {
        altura1 = map(this.histDerivada[i - 1], -1.0, 1.0, y_ + altoGestor, y_);
        altura2 = map(this.histDerivada[i], -1.0, 1.0, y_ + altoGestor, y_);

        stroke(255, 255, 0);
        line(x_ + i - 1, altura1, x_ + i, altura2);
      }
    }
    stroke(255, 0, 0);
    line(x_ + this.puntero, y_, x_ + this.puntero, y_ + altoGestor);
    pop();
  }
}
