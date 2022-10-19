import './scss/styles.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import fetchApi from './js/HTTP';
import { renderGallery } from './hbs/createCards.js';
import LoadMoreButton from './js/loadMoreBtn';
// const btn = new LoadMoreButton()
const fetch = new fetchApi();

let cardsGallery = document.querySelector('.gallery ');
const onSearchForm = document.querySelector('#search-form');
onSearchForm.addEventListener('submit', onSearch);
const button = document.querySelector('[data-action="load-more"]');
const ButtonLoad = new LoadMoreButton({
  selector: '[data-action="load-more"]',
  hidden: true,
});
button.addEventListener('click', onLoadMore);

clearList();
console.log(button);
async function onSearch(e) {
  e.preventDefault();

  if (!button.classList.contains('is-hidden')) {
    button.classList.add('is-hidden');
  }

  fetch.searchQuery = e.currentTarget.elements.searchQuery.value;
  fetch.resetPage();
  // clearList();

  try {
    if (fetch.searchQuery === '') {
      clearList();
      Notify.failure('Please enter your search data.');
    } else {
      const response = await fetch.makesRequest();
      const {
        data: { hits, total, totalHits },
      } = response;

      if (hits.length === 0) {
        button.classList.add('is-hidden');

        setTimeout(
          Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          ),
          0
        );
      } else {
        // ButtonLoad.disable();
        clearList();
        ButtonLoad.disable();

        Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGallery(hits);
        ButtonLoad.enable();

        ButtonLoad.show();
        button.classList.remove('is-hidden');
    simpleLightbox();

      }
    
    }
    // ButtonLoad.show();
  } catch (error) {
        ButtonLoad.enable();
 Notify.failure("We're sorry, but you've reached the end of search results.");
        button.classList.add('is-hidden');

  }
}

function clearList() {
  cardsGallery.innerHTML = '';
}

function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
    enableKeyboard: true,
    doubleTapZoom: 5,
  });
  lightbox.refresh();
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')

    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
async function onLoadMore() {

const response = await fetch.makesRequest();
const {
  data: { hits },
} = response;

  if (hits.length === 0) {
        button.classList.add('is-hidden');
  
Notify.failure("We're sorry, but you've reached the end of search results.");
  } else
    simpleLightbox()
  fetch.incrementPage
  renderGallery(hits);
};
