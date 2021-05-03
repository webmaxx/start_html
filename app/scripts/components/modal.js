import Animate from './animate';

/**
 * Modal
 *
 * Methods:
 * - open(node|selector, [modalAnimate], [backdropAnimate])
 * - close(node|selector, [modalAnimate], [backdropAnimate])
 * - toggle(node|selector, [modalAnimateOpen], [backdropAnimateOpen], [modalAnimateClose], [backdropAnimateClose])
 *
 * Events:
 * - 'R.modal.opening' - before modal open
 * - 'R.modal.opened' - after modal opened
 * - 'R.modal.closing' - before modal close
 * - 'R.modal.closed' - after modal closed
 *
 * Buttons:
 * - [data-modal-open="modalSelector"]
 * - [data-modal-close="modalSelector"]
 * - [data-modal-toggle="modalSelector"]
 */
class Modal {
    constructor(className = 'modal--open', htmlStatusClassName = 'modal-opened') {
        this.htmlStatusClassName = htmlStatusClassName;
        this.className = className;
        this.totalOpened = 0;
        this.Animate = new Animate;
    }

    init() {
        this.enableButtons();
    }

    enableButtons()
    {
        document.addEventListener('click', this.buttonsEventListener);
    }

    disableButtons()
    {
        document.removeEventListener('click', this.buttonsEventListener);
    }

    buttonsEventListener(e) {
        const el = e.target;

        // [data-modal-open="selector"]
        if (el.dataset.modalOpen != undefined) {
            R.Modal.open(el.dataset.modalOpen);
            e.preventDefault();
        }

        // [data-modal-close="selector"]
        if (el.dataset.modalClose != undefined) {
            R.Modal.close(el.dataset.modalClose);
            e.preventDefault();
        }

        // [data-modal-toggle="selector"]
        if (el.dataset.modalToggle != undefined) {
            R.Modal.toggle(el.dataset.modalToggle);
            e.preventDefault();
        }

        // [data-modal-btn="close"]
        if (el.dataset.modalBtn == 'close') {
            R.Modal.close(el.closest('.modal'));
            e.preventDefault();
        }

        // .modal
        if (el.classList.contains('modal')) {
            R.Modal.close(el);
            e.preventDefault();
        }
    }

    open(modal, modalAnimate = 'fadeInDown', backdropAnimate = 'fadeIn') {
        modal = this.getModal(modal);

        if (modal != null) {
            this.trigger(modal, 'R.modal.opening');
            modal.classList.add(this.className);
            this.Animate.run(modal, backdropAnimate);
            this.Animate.run(modal.querySelector('.modal__content'), modalAnimate)
                .then(() => this.trigger(modal, 'R.modal.opened'));
            this.totalOpenedIncrement();

            if (this.totalOpened == 1) {
                document.querySelector('html').classList.add(this.htmlStatusClassName);
            }
        }
    }

    close(modal, modalAnimate = 'fadeOutUp', backdropAnimate = 'fadeOut') {
        modal = this.getModal(modal);

        if (modal != null) {
            this.trigger(modal, 'R.modal.closing');
            this.Animate.run(modal, backdropAnimate)
                .then(() => modal.classList.remove(this.className));
            this.Animate.run(modal.querySelector('.modal__content'), modalAnimate)
                .then(() => this.trigger(modal, 'R.modal.closed'));
            this.totalOpenedDecrement();

            if (this.totalOpened == 0) {
                document.querySelector('html').classList.remove(this.htmlStatusClassName);
            }
        }
    }

    toggle(modal, modalAnimateOpen = 'fadeInDown', backdropAnimateOpen = 'fadeIn', modalAnimateClose = 'fadeOutUp', backdropAnimateClose = 'fadeOut') {
        modal = this.getModal(modal);

        if (modal != null) {
            if (modal.classList.contains(this.className)) {
                this.close(modal, modalAnimateClose, backdropAnimateClose);
            } else {
                this.open(modal, modalAnimateOpen, backdropAnimateOpen);
            }
        }
    }

    getModal(modal) {
        return typeof modal == 'string' ? document.querySelector(modal) : modal;
    }

    trigger(modal, name) {
        modal.dispatchEvent(new Event(name, {
            bubbles: true,
            cancelable: false
        }));
    }

    totalOpenedIncrement()
    {
        this.totalOpened++;
    }

    totalOpenedDecrement()
    {
        this.totalOpened--;
    }
}

export default Modal;
