import './sass/index.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './getImages';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

//eventListeners

searchForm.addEventListener('submit', searchImage);
loadMoreButton.addEventListener('click', moreImages);

// variables 

let query = '';
let page = 1;
const perPage = 40;
let lightbox = new SimpleLightbox('.gallery a');

//functions

function clearResults() {
  gallery.innerHTML = '';
}

function searchImage(event) {
  event.preventDefault();
  query = event.currentTarget.searchQuery.value.trim();
  loadMoreButton.classList.add('is-hidden');
  clearResults();
  if (!query) {
    Notiflix.Notify.info(
          "Hello Dear, You came here to find some image, don't you?:)."
        );
    return;
  }

  getImages(query, page, perPage)
    .then(({ data }) => {
      if (!data.totalHits) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      else {
        renderGallery(data.hits);
        lightbox.refresh();
      
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > perPage) {
          loadMoreButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function moreImages() {
  page += 1;
getImages(query, page, perPage)
  .then(({ data }) => {
    renderGallery(data.hits);
      lightbox.refresh();
    const allPages = Math.ceil(data.hits / perPage);
    
      if (page > allPages) {
        loadMoreButton.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}

//rendering
function renderGallery(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" title=""/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}</p>
    <p class="info-item">
      <b>Views</b>${views}</p>
    <p class="info-item">
      <b>Comments</b>${comments}</p>
    <p class="info-item">
      <b>Downloads</b>${downloads}</p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

//On scroll to TOP
let topBtn = document.querySelector(".top-btn");
topBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
window.onscroll = () => window.scrollY > 500 ? topBtn.style.opacity = 1 : topBtn.style.opacity = 0
