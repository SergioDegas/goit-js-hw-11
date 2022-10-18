import './scss/styles.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import fetchApi from './js/HTTP';
import { renderGallery } from './hbs/createCards.js';

const fetch = new fetchApi();
let cardsGallery = document.querySelector('.gallery ');
const onSearchForm = document.querySelector('#search-form');
onSearchForm.addEventListener('submit', onSearch);
const ellipse = document.querySelector('.loader-ellips');

ellipse.classList.add('is-hidden');
clearList();
async function onSearch(e) {
  e.preventDefault();
  fetch.searchQuery = e.currentTarget.elements.searchQuery.value;
  fetch.resetPage();
  clearList();

  try {
    if (fetch.searchQuery === '') {
      ellipse.classList.add('is-hidden');

      // clearList();
      Notify.failure('Please enter your search data.');
    } else {
      const response = await fetch.makesRequest();
      const {
        data: { hits, total, totalHits },
      } = response;

      // let totalPages = totalHits / fetch.perPage;

      // // console.log(totalPages);
      // if (fetch.thisPage > totalPages) {
      //   ellipse.classList.add('is-hidden');
      // }

      if (hits.length === 0) {
        window.removeEventListener('scroll', createCards);

        // ellipse.classList.add('is-hidden');
        setTimeout(
          Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          ),
          0
        );
        ellipse.classList.add('is-hidden');
      } else {
        ellipse.classList.remove('is-hidden');
        Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGallery(hits);

        window.addEventListener('scroll', createCards);
        fetch.incrementPage();

        // createCards();        // window.addEventListener('scroll', createCards);
      }
      if (total < 40 && fetch.page >= fetch.thisPage) {
        window.removeEventListener('scroll', createCards);
        ellipse.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }

      // const allCards = totalHits / hits.length;
      // console.log(hits.length);
      // console.log(totalHits)
      // ellipse.classList.remove('is-hidden');
    }


    
  } catch (error) {
      console.loh(fetch.page);

    window.removeEventListener('scroll', createCards);
    setTimeout(
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      ),
      10
    );

    // console.log(error.message);
    ellipse.classList.add('is-hidden');
  }
}

async function createCards() {
  ellipse.classList.remove('is-hidden');
  // clearList();

  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight > scrollHeight - 5) {
    infiniteScroll();
  }

  // scroll()
}

function clearList() {
  cardsGallery.innerHTML = '';
}

function simpleLightbox() {
  // e.preventDefault()
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
    enableKeyboard: true,
    doubleTapZoom: 5,
  });
  // console.log(lightbox);
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

async function infiniteScroll(e) {
  // e.preventDefault();
  // fetch.resetPage();
  // clearList();

  try {
    // clearList();

    ellipse.classList.remove('is-hidden');
    const response = await fetch.makesRequest();
    const {
      data: { hits, total, totalHits },
    } = response;

    renderGallery(hits);

    simpleLightbox();
  } catch (error) {
    window.removeEventListener('scroll', createCards);
    setTimeout(
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      ),
      10
    );

    // console.log(error.message);
    ellipse.classList.add('is-hidden');
  }
}
