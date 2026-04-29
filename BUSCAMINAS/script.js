let SIZE, MINES;
let board=[];
let firstClick=true;
let gameOver=false;

let clicks=0, flags=0, wins=0, losses=0;

const game=document.getElementById("game");
const levelSelect=document.getElementById("level");

const minesText=document.getElementById("mines");
const clicksText=document.getElementById("clicks");
const flagsText=document.getElementById("flags");
const winsText=document.getElementById("wins");
const lossesText=document.getElementById("losses");

const bgMusic=document.getElementById("bgMusic");
const boomSound=document.getElementById("boomSound");
const musicBtn=document.getElementById("musicBtn");

let musicOn=false;

/* música */
function startMusic(){
if(!musicOn){
bgMusic.volume=0.5;
bgMusic.play().catch(()=>{});
musicOn=true;
musicBtn.textContent="🔊 Música";
}
}

musicBtn.onclick=()=>{
musicOn?bgMusic.pause():bgMusic.play();
musicOn=!musicOn;
musicBtn.textContent=musicOn?"🔊 Música":"🔇 Música";
};

/* niveles */
function setLevel(){
let l=levelSelect.value;

if(l==="easy"){SIZE=10;MINES=15;game.className="small";}
if(l==="normal"){SIZE=15;MINES=30;game.className="medium";}
if(l==="hard"){SIZE=20;MINES=70;game.className="large";}

minesText.textContent=MINES;
}

levelSelect.onchange=init;

/* init */
function init(){
setLevel();

game.innerHTML="";
board=[];
firstClick=true;
gameOver=false;

clicks=0;
flags=0;

clicksText.textContent=0;
flagsText.textContent=0;

game.style.gridTemplateColumns=`repeat(${SIZE},auto)`;

for(let r=0;r<SIZE;r++){
board[r]=[];
for(let c=0;c<SIZE;c++){
let el=document.createElement("div");
el.className="cell";
el.dataset.r=r;
el.dataset.c=c;

el.onclick=clickCell;
el.oncontextmenu=(e)=>{
e.preventDefault();
toggleFlag(r,c);
};

game.appendChild(el);
board[r][c]={bomb:false,el,number:0,flag:false};
}
}
}

/* minas */
function placeMines(r0,c0){
let p=0;
while(p<MINES){
let r=Math.random()*SIZE|0;
let c=Math.random()*SIZE|0;
if(!board[r][c].bomb && !(r===r0 && c===c0)){
board[r][c].bomb=true;p++;
}
}

/* números */
for(let r=0;r<SIZE;r++){
for(let c=0;c<SIZE;c++){
if(board[r][c].bomb) continue;
let count=0;
for(let dr=-1;dr<=1;dr++){
for(let dc=-1;dc<=1;dc++){
if(board[r+dr]?.[c+dc]?.bomb) count++;
}
}
board[r][c].number=count;
}
}
}

/* banderas */
function toggleFlag(r,c){
if(gameOver) return;
let cell=board[r][c];
if(cell.el.classList.contains("revealed")) return;

cell.flag=!cell.flag;

if(cell.flag){
cell.el.textContent="🚩";
flags++;
}else{
cell.el.textContent="";
flags--;
}

flagsText.textContent=flags;
}

/* revelar */
function reveal(r,c){
let cell=board[r][c];
if(cell.el.classList.contains("revealed")||cell.flag) return;

cell.el.classList.add("revealed");

if(cell.number>0){
cell.el.textContent=cell.number;
return;
}

for(let dr=-1;dr<=1;dr++){
for(let dc=-1;dc<=1;dc++){
if(board[r+dr]?.[c+dc]) reveal(r+dr,c+dc);
}
}
}

/* 💣 REVELAR TODAS LAS BOMBAS */
function revealAllBombs(){
board.flat().forEach(cell=>{
if(cell.bomb){
cell.el.textContent="💀";
cell.el.classList.add("bomb");
}
});
}

/* click */
function clickCell(e){

startMusic();

if(gameOver) return;

clicks++;
clicksText.textContent=clicks;

let r=+e.target.dataset.r;
let c=+e.target.dataset.c;

if(firstClick){
placeMines(r,c);
firstClick=false;
}

let cell=board[r][c];

if(cell.bomb){

boomSound.currentTime=0;
boomSound.play();

/* 🔥 AQUÍ ESTÁ LA MEJORA */
revealAllBombs();

losses++;
lossesText.textContent=losses;

gameOver=true;
showGameOver();
return;
}

reveal(r,c);
checkWin();
}

/* win */
function checkWin(){
let safe=SIZE*SIZE-MINES;
let revealed=0;

board.flat().forEach(c=>{
if(c.el.classList.contains("revealed")) revealed++;
});

if(revealed===safe){
wins++;
winsText.textContent=wins;
gameOver=true;
alert("GANASTE 😈");
}
}

/* overlay */
function showGameOver(){
const overlay=document.getElementById("overlay");
const phrase=document.getElementById("gengarPhrase");

const frases=[
"Las sombras siempre ganan...",
"No debiste entrar aquí...",
"Ahora eres mío...",
"Te estaba esperando..."
];

phrase.textContent=frases[Math.random()*frases.length|0];

overlay.classList.remove("hidden");
}

document.getElementById("playAgain").onclick=()=>{
overlay.classList.add("hidden");
init();
};

document.getElementById("restart").onclick=init;

init();