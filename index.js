(function () {

  const Modal = {
    open() {
      document.querySelector('.modal-overlay').classList.add('active');
    },
    close() {
      document.querySelector('.modal-overlay').classList.remove('active');
    },
    save() {
      console.log(document.querySelector('#amount').value);
      alert('Desculpe, nossos desenvolvedores ainda não implementaram essa funcionalidade');
    }
  }

  document.querySelector('#btn-new-transaction').addEventListener('click', Modal.open);
  document.querySelector('#btn-cancel').addEventListener('click', Modal.close);
  document.querySelector('#btn-save').addEventListener('click', Modal.save);

})();
