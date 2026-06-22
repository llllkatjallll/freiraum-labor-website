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
let galleryData = [];

// Shuffle array randomly (Fisher-Yates algorithm)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Load gallery from JSON files
async function loadGallery() {
  try {
    // Load all JSON files from gallery-data folder
    // You can adjust the number of files or use a directory listing endpoint
    const jsonFiles = [];
    let fileIndex = 1;
    let loadMore = true;

    // Try to load files until we hit a missing file
    while (loadMore) {
      const fileName = `image-${String(fileIndex).padStart(3, '0')}.json`;
      try {
        const response = await fetch(`gallery-data/${fileName}`);
        if (response.ok) {
          const data = await response.json();
          jsonFiles.push(data);
          fileIndex++;
        } else {
          loadMore = false;
        }
      } catch (error) {
        loadMore = false;
      }
    }

    galleryData = shuffleArray(jsonFiles);
    renderGallery();
  } catch (error) {
    console.error('Fehler beim Laden der Galerie:', error);
  }
}

// Render gallery from loaded data
function renderGallery() {
  gallery.innerHTML = ''; // Clear existing content

  galleryData.forEach((item, index) => {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'thumb';
    
    const img = document.createElement('img');
    img.src = item['image-path'];
    img.alt = item['image-title'];
    img.dataset.index = index;
    
    img.addEventListener('click', () => openOverlay(index));
    
    thumbDiv.appendChild(img);
    gallery.appendChild(thumbDiv);
  });

  countImages();
}

// Open overlay with image details
function openOverlay(index) {
  const item = galleryData[index];
  
  overlayImg.src = item['image-path'];
  overlayImg.alt = item['image-title'];
  
  // Update overlay content
  const titleElement = document.querySelector('.photo-info-container h1');
  const artistElement = document.querySelector('.photo-info-container h2');
  const descriptionElement = document.querySelector('.photo-info-container p');
  
  if (titleElement) titleElement.textContent = item['image-title'];
  if (artistElement) artistElement.textContent = item['artist-name'];
  if (descriptionElement) descriptionElement.textContent = item['text-description'];
  
  // Add hashtags if container exists
  let hashtagContainer = document.querySelector('.hashtag-container');
  if (!hashtagContainer) {
    hashtagContainer = document.createElement('div');
    hashtagContainer.className = 'hashtag-container';
    document.querySelector('.photo-info-container').appendChild(hashtagContainer);
  }
  
  hashtagContainer.innerHTML = item.hashtags
    .map(tag => `<span class="hashtag">#${tag}</span>`)
    .join(' ');
  
  overlay.classList.add('active');
}

closeBtn.addEventListener("click", function (e) {
  close();
});

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') close();
});

window.addEventListener("load", (event) => {
  loadGallery();
});

function close() {
  overlay.classList.remove('active');
}

function countImages(){
  imageCount = document.querySelectorAll('.grid .thumb').length;
  if (imgTxt) {
    imgTxt.innerHTML = "<strong>" + imageCount + "</strong><span>Bilder</span>";
  }
  console.log("Anzahl meiner Bilder", imageCount);
}