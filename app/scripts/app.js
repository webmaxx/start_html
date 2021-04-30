import Animate from './components/animate';
import Modal from './components/modal';

const R = {};
window.R = R;

// -----------------------------------------------------------------------------
// AnimateCSS
// -----------------------------------------------------------------------------

R.Animate = new Animate;


// -----------------------------------------------------------------------------
// Modals
// -----------------------------------------------------------------------------

R.Modal = new Modal;

document.addEventListener('click', function(e) {
    const el = e.target;

    if (el.dataset.modalOpen != undefined) {
        R.Modal.open(el.dataset.modalOpen);
        e.preventDefault();
    }

    if (el.dataset.modalClose != undefined) {
        R.Modal.close(el.dataset.modalClose);
        e.preventDefault();
    }

    if (el.dataset.modalToggle != undefined) {
        R.Modal.toggle(el.dataset.modalToggle);
        e.preventDefault();
    }

    if (el.dataset.modalBtn == 'close') {
        R.Modal.close(el.closest('.modal'));
        e.preventDefault();
    }

    if (el.classList.contains('modal')) {
        R.Modal.close(el);
        e.preventDefault();
    }
});
