import Animate from './animate';

class Modal {
    constructor(className = 'modal--open', htmlStatusClassName = 'modal-opened') {
        this.htmlStatusClassName = htmlStatusClassName;
        this.className = className;
        this.Animate = new Animate;
    }

    open(modal) {
        modal = this.getModal(modal);

        if (modal != null) {
            modal.classList.add(this.className);
            this.Animate.run(modal, 'fadeIn');
            this.Animate.run(modal.querySelector('.modal__content'), 'fadeInDown');
            document.querySelector('html').classList.add(this.htmlStatusClassName);
        }
    }

    close(modal) {
        modal = this.getModal(modal);

        if (modal != null) {
            this.Animate.run(modal, 'fadeOut')
                .then(() => modal.classList.remove(this.className));
            this.Animate.run(modal.querySelector('.modal__content'), 'fadeOutUp');
            document.querySelector('html').classList.remove(this.htmlStatusClassName);
        }
    }

    toggle(modal) {
        modal = this.getModal(modal);

        if (modal != null) {
            if (modal.classList.contains(this.className)) {
                this.close(modal);
            } else {
                this.open(modal);
            }
        }
    }

    getModal(modal) {
        return typeof modal == 'string' ? document.querySelector(modal) : modal;
    }
}

export default Modal;
