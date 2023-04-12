import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const refs = {
  inputEl: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.submit-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.inputEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);

let pageNumber = 1;
let totalPages = null;
refs.loadMoreBtn.style.display = 'none';

async function onFormSubmit(evt) {
  evt.preventDefault();
  clearPage();
  const inputValue = evt.target.elements.searchQuery.value.trim();
  if (inputValue !== '') {
    try {
      const dataFound = await fetchImages(inputValue, pageNumber);
      totalPages = Math.floor(dataFound.totalHits / 40);

      if (dataFound.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImagesGallery(dataFound.hits);
        Notify.success(`Hooray! We found ${dataFound.totalHits} images.`);
        refs.loadMoreBtn.style.display = 'block';
        lightbox.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function onLoadMoreButtonClick(evt) {
  pageNumber += 1;
  let clickBtnValue = evt.target.value;
  try {
    const dataFound = await fetchImages(clickBtnValue, pageNumber);
    renderImagesGallery(dataFound.hits);
    lightbox.refresh();
    if (pageNumber === totalPages) {
      refs.loadMoreBtn.style.display = 'none';
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notify.failure('Oops, something went wrong. Please try again later.');
  }
}

function renderImagesGallery(images) {
  const markupGallery = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <div class="img-container">
  <a href="${largeImageURL}" class="galery-link">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
       </div>
  <div class="info">
    <p class="info-item"><b>Likes</b> ${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markupGallery);
}

function clearPage() {
  refs.gallery.innerHTML = '';
  pageNumber = 1;
  refs.loadMoreBtn.style.display = 'none';
}

// function onFormSubmit(evt) {
//   evt.preventDefault();
//   clearPage();
//   //   console.log(evt.target.elements);
//   const inputValue = evt.target.elements.searchQuery.value.trim();
//   //   console.log(inputValue);
//   if (inputValue !== '') {
//     fetchImages(inputValue, pageNumber)
//       .then(dataFound => {
//         if (dataFound.hits.length === 0) {
//           Notify.failure(
//             'Sorry, there are no images matching your search query. Please try again.'
//           );
//         } else {
//           renderImagesGallery(dataFound.hits);
//           Notify.success(`Hooray! We found ${dataFound.totalHits} images.`);
//           refs.loadMoreBtn.style.display = 'block';
//           lightbox.refresh();
//         }
//       })
//       .catch(error => console.log(error));
//   }
// }

// function onLoadMoreButtonClick(evt) {
//   pageNumber += 1;
//   let clickBtnValue = evt.target.value;
//   fetchImages(clickBtnValue, pageNumber)
//     .then(dataFound => {
//       renderImagesGallery(dataFound.hits);
//       lightbox.refresh();
//       let totalHits = parseInt(dataFound.totalHits);
//       let currentHits = page * 40;
//       if (currentHits >= totalHits) {
//         refs.loadMoreBtn.style.display = 'none';
//         Notify.warning(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     })
//     .catch(error => {
//       Notify.failure('Oops, something went wrong. Please try again later.');
//     });
// }
