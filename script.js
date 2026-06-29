const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('active'));

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('active'));
  });
}



const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');
const closeBtn = document.getElementById('close');
const gallery = document.getElementById('gallery');
const imgTxt = document.getElementById('img-txt');
let imageCount = 0;
let seriesData = [];

// Load gallery from series JSON files
async function loadGallery() {
  try {
    const jsonFiles = [];
    let fileIndex = 1;
    let loadMore = true;

    // Try to load series files until we hit a missing file
    while (loadMore) {
      const fileName = `series-${String(fileIndex).padStart(3, '0')}.json`;
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

    seriesData = jsonFiles;
    renderGallery();
  } catch (error) {
    console.error('Fehler beim Laden der Galerie:', error);
  }
}

// Render gallery from loaded series data
function renderGallery() {
  gallery.innerHTML = ''; // Clear existing content

  seriesData.forEach((series, seriesIndex) => {
    // Create series container
    const seriesContainer = document.createElement('div');
    seriesContainer.className = 'series-container';
    
    // Series header with info
    const seriesHeader = document.createElement('div');
    seriesHeader.className = 'series-header';
    
    const seriesTitle = document.createElement('h3');
    seriesTitle.textContent = series['series-name'];
    seriesHeader.appendChild(seriesTitle);
    
    const artistName = document.createElement('h4');
    artistName.textContent = series['artist-name'];
    seriesHeader.appendChild(artistName);
    
    const seriesDesc = document.createElement('p');
    seriesDesc.className = 'series-description';
    seriesDesc.textContent = series['series-description'];
    seriesHeader.appendChild(seriesDesc);
    
    if (series['film-type']) {
      const filmType = document.createElement('p');
      filmType.className = 'film-type';
      filmType.textContent = `Film: ${series['film-type']}`;
      seriesHeader.appendChild(filmType);
    }
    
    seriesContainer.appendChild(seriesHeader);
    
    // Create photos grid for this series
    const photosGrid = document.createElement('div');
    photosGrid.className = 'series-photos-grid';
    
    const photosFolder = series['photos-folder'];
    const photoFiles = series['photo-files'] || [];
    
    photoFiles.forEach((photoData, photoIndex) => {
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumb';
      
      const img = document.createElement('img');
      const fileName = typeof photoData === 'string' ? photoData : photoData.filename;
      img.src = `${photosFolder}/${fileName}`;
      img.alt = `${series['series-name']} - Bild ${photoIndex + 1}`;
      img.dataset.seriesIndex = seriesIndex;
      img.dataset.photoIndex = photoIndex;
      
      img.addEventListener('click', () => openOverlay(seriesIndex, photoIndex));
      
      thumbDiv.appendChild(img);
      photosGrid.appendChild(thumbDiv);
    });
    
    seriesContainer.appendChild(photosGrid);
    gallery.appendChild(seriesContainer);
  });

  countImages();
}

// Open overlay with series and image details
function openOverlay(seriesIndex, photoIndex) {
  const series = seriesData[seriesIndex];
  const photosFolder = series['photos-folder'];
  const photoData = series['photo-files'][photoIndex];
  const fileName = typeof photoData === 'string' ? photoData : photoData.filename;
  const photoComment = typeof photoData === 'object' ? photoData.comment : '';
  
  overlayImg.src = `${photosFolder}/${fileName}`;
  overlayImg.alt = `${series['series-name']} - Bild ${photoIndex + 1}`;
  
  // Update overlay content
  const titleElement = document.querySelector('.photo-info-container h1');
  const artistElement = document.querySelector('.photo-info-container h2');
  const descriptionElement = document.querySelector('.photo-info-container p');
  
  if (titleElement) titleElement.textContent = series['series-name'];
  if (artistElement) artistElement.textContent = series['artist-name'];
  if (descriptionElement) descriptionElement.textContent = series['series-description'];
  
  // Add photo comment if exists
  let photoCommentContainer = document.querySelector('.photo-comment-container');
  if (!photoCommentContainer) {
    photoCommentContainer = document.createElement('div');
    photoCommentContainer.className = 'photo-comment-container';
    document.querySelector('.photo-info-container').appendChild(photoCommentContainer);
  }
  
  if (photoComment) {
    photoCommentContainer.innerHTML = `<strong>Bild-Kommentar:</strong><br>${photoComment}`;
    photoCommentContainer.style.display = 'block';
  } else {
    photoCommentContainer.style.display = 'none';
  }
  
  // Add film type info if container exists
  let filmTypeContainer = document.querySelector('.film-type-container');
  if (!filmTypeContainer) {
    filmTypeContainer = document.createElement('div');
    filmTypeContainer.className = 'film-type-container';
    document.querySelector('.photo-info-container').appendChild(filmTypeContainer);
  }
  
  if (series['film-type']) {
    filmTypeContainer.innerHTML = `<strong>Film:</strong> ${series['film-type']}`;
  } else {
    filmTypeContainer.innerHTML = '';
  }
  
  if (overlay) {
    overlay.classList.add('active');
  }
}

// Add event listeners only if elements exist
if (closeBtn) {
  closeBtn.addEventListener("click", function (e) {
    close();
  });
}

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay) close();
});

window.addEventListener("load", (event) => {
  // Check if we're on gallery page
  if (gallery) {
    loadGallery();
  }
  
  // Check if we're on home page with slideshow
  const slideshowImg = document.getElementById('hero-slideshow-img');
  if (slideshowImg) {
    initSlideshow();
  }
});

function close() {
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function countImages(){
  imageCount = document.querySelectorAll('.grid .thumb').length;
  const seriesCount = seriesData.length;
  if (imgTxt) {
    imgTxt.innerHTML = "<strong>" + seriesCount + "</strong><span>Serien</span> • <strong>" + imageCount + "</strong><span>Bilder</span>";
  }
  console.log("Anzahl Serien:", seriesCount, "Anzahl Bilder:", imageCount);
}

// ========== HOME PAGE SLIDESHOW ==========
let allPhotos = [];
let currentSlideIndex = 0;

async function initSlideshow() {
  try {
    // Load all series
    const jsonFiles = [];
    let fileIndex = 1;
    let loadMore = true;

    while (loadMore) {
      const fileName = `gallery-data/series-${String(fileIndex).padStart(3, '0')}.json`;
      try {
        const response = await fetch(fileName);
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

    // Flatten all photos from all series into one array
    jsonFiles.forEach(series => {
      const photosFolder = series['photos-folder'];
      const photoFiles = series['photo-files'] || [];
      
      photoFiles.forEach(photoData => {
        const fileName = typeof photoData === 'string' ? photoData : photoData.filename;
        allPhotos.push({
          src: `${photosFolder}/${fileName}`,
          seriesName: series['series-name'],
          artistName: series['artist-name']
        });
      });
    });

    // Shuffle photos
    allPhotos = shuffleArray(allPhotos);

    // Start slideshow
    if (allPhotos.length > 0) {
      showSlide(0);
      setInterval(nextSlide, 10000); // Change every 10 seconds
    }
  } catch (error) {
    console.error('Fehler beim Laden der Slideshow:', error);
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function showSlide(index) {
  if (allPhotos.length === 0) return;
  
  const photo = allPhotos[index];
  const img = document.getElementById('hero-slideshow-img');
  const seriesNameEl = document.getElementById('slideshow-series-name');
  const artistEl = document.getElementById('slideshow-artist');
  
  if (img) {
    // Fade out
    img.style.opacity = '0';
    
    setTimeout(() => {
      img.src = photo.src;
      if (seriesNameEl) seriesNameEl.textContent = photo.seriesName;
      if (artistEl) artistEl.textContent = photo.artistName;
      
      // Fade in
      img.style.opacity = '1';
    }, 500);
  }
  
  currentSlideIndex = index;
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % allPhotos.length;
  showSlide(currentSlideIndex);
}