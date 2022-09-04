import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const API_KEY = '29711203-05eaaaab908cc3e1419fc45fb';
const perPage = 40;
let page = 1;
const lightbox = new simpleLightbox('.gallery a');

const fetchPhotos = async (search, pagenr) => {
  const response = await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&pretty=true&per_page=${perPage}&page=${pagenr}`
  );
  const photos = await response.json();
  return photos;
};

const renderGallery = dataArray => {
  let markup = dataArray
    .map(data => {
      return `<div class="photo-card">
  <a href="${data.largeImageURL}"><img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" title="" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="span-item">${data.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="span-item">${data.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="span-item">${data.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="span-item">${data.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.innerHTML = markup;
};

const renderNextPhotos = dataArray => {
  let markup2 = dataArray
    .map(data => {
      return `<div class="photo-card">
  <a href="${data.largeImageURL}"><img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" title="" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="span-item">${data.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="span-item">${data.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="span-item">${data.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="span-item">${data.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup2);
};

form.addEventListener('submit', async event => {
  try {
    event.preventDefault();
    const { searchBtn, searchQuery } = event.currentTarget;
    page = 1;
    let trimInput = searchQuery.value.trim();
    if (trimInput === '') {
      return;
    }
    localStorage.setItem('inputValue', `${trimInput}`);
    gallery.innerHTML = '';
    const varPhotos = await fetchPhotos(trimInput, page);
    const photosArr = varPhotos.hits;
    const total = varPhotos.totalHits;
    if (total > 0) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
    if (photosArr.length === 0) {
      throw new Error();
    }
    renderGallery(photosArr);
    lightbox.refresh();
  } catch (error) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

window.addEventListener(
  'scroll',
  debounce(async event => {
    try {
      if (window.innerHeight === document.documentElement.scrollHeight) {
        return;
      }
      if (
        window.scrollY + 0.5 + window.innerHeight >=
        document.documentElement.scrollHeight
      ) {
        page += 1;
        let trimInput = localStorage.getItem('inputValue');
        const varPhotos = await fetchPhotos(trimInput, page);
        const photosArr = varPhotos.hits;

        renderNextPhotos(photosArr);
        lightbox.refresh();
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 1.5,
          behavior: 'smooth',
        });
      }
    } catch (error) {}
  }, 100)
);
