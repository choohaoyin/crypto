export class Modal {
    constructor() {
        const overlay = document.querySelector('.modal-overlay')
        overlay.addEventListener('click', this.toggleModal)

        var closemodal = document.querySelectorAll('.modal-close')
        for (var i = 0; i < closemodal.length; i++) {
            closemodal[i].addEventListener('click', this.toggleModal)
        }
    }

    toggleModal(data) {
        document.getElementById("modal-coin-name").innerHTML = data.name;
        document.getElementById("price").innerHTML = `${data.currency} ${data.price}`;
        document.getElementById("volume").innerHTML = `${data.currency} ${data.volume}`;

        const body = document.querySelector('body')
        const modal = document.querySelector('.modal')
        modal.classList.toggle('opacity-0')
        modal.classList.toggle('pointer-events-none')
        body.classList.toggle('modal-active')
    }
}