const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => nav.classList.toggle('active'));

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('active'));
});



const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');
const closeBtn = document.getElementById('close');
const gallery = document.getElementById('gallery');
const imgTxt = document.getElementById('img-txt');
let imageCount = 0;



// Open on thumbnail click
document.querySelectorAll('.thumb img').forEach(img => {
  img.addEventListener('click', () => {
    overlayImg.src = img.src.replace('/600/600', '/1400/1000');
    overlay.classList.add('active');
  });
});



closeBtn.addEventListener("click", function (e) {
  close();
});

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') close();
});

window.addEventListener("load", (event) => {
  countImages();
});

function close() {
  overlay.classList.remove('active');
}


function countImages(){
  imageCount = document.querySelectorAll('.grid .thumb').length
  imgTxt.innerHTML = "<strong>" + imageCount + "</strong><span>Bilder</span>";
  console.log("Anhahl meiner Bilder", imageCount);
}