(function () {

  const Utils = {
    toBRLFormat(amount) {
      return (amount / 100).toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
    },

    uuid() {
      return Math.floor(Math.random() * 1e6);
    }
  }

  const Modal = {
    open() {
      document.querySelector('.modal-overlay').classList.add('active');
    },

    close() {
      document.querySelector('.modal-overlay').classList.remove('active');
    },

    save(event) {
      event.preventDefault();

      const $description = document.querySelector('#description');
      const $amount = document.querySelector('#amount');
      const $descriptionError = document.querySelector('#description-error');
      const $amountError = document.querySelector('#value-error');

      if (!$description.checkValidity()) {
        alert($descriptionError.textContent);
        return;
      }
      
      if (!$amount.checkValidity()) {
        alert($amountError.textContent);
        return;
      }

      const description = $description.value;
      const amount = Math.round($amount.value * 100);
      const date = new Date(document.querySelector('#date').value);

      const transaction = {
        id: Utils.uuid(),
        description,
        amount,
        date: date.toLocaleDateString(),
      };

      transactions.push(transaction);
      Storage.set(transactions);
      DOM.addTransaction(transaction);
      DOM.updateHeader();
      Modal.close();

      $description.value = '';
      $amount.value = '';
      date.value = null;
    },

    validate($self, $errorElement, $submitButton) {
      if ($self.checkValidity()) {
        $errorElement.classList.remove('visible-error');
        $submitButton.disabled = false;
        return;
      }
      $errorElement.classList.add('visible-error');
      const $inputs = document.querySelectorAll('form input');
      if (Array.prototype.every.call($inputs, function ($input) {
        return $input.checkValidity();
      })) {
        $submitButton.disabled = true;
      }
    },
  }

  const Transaction = {
    incomes() {
      return transactions.reduce((partialIncome, { amount }) => {
        return amount > 0 ? partialIncome + amount : partialIncome
      }, 0);
    },

    expenses() {
      return -transactions.reduce((partialOutcome, { amount }) => {
        return amount < 0 ? partialOutcome + amount : partialOutcome
      }, 0);
    },

    total() {
      return transactions.reduce((partialTotal, { amount }) => {
        return partialTotal + amount;
      }, 0);
    },
  }

  const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction) {
      const tr = document.createElement('tr');
      tr.setAttribute('key', transaction.id);
      tr.innerHTML = this.innerHTMLTransaction(transaction);
      this.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction({ id, description, amount, date }) {
      const formatedAmount = Utils.toBRLFormat(amount);
      const CSSClass = amount < 0 ? 'expense' : 'income'
      const html = `
        <td class="description">${description}</td>
        <td class="${CSSClass}">${formatedAmount}</td>
        <td class="date">${date}</td>
        <td>
          <img
            src="./assets/minus.svg"
            alt="Remover Transação"
            class="btn-remove-transaction"
            data-transaction_id="${id}"
          >
        </td>
      `;

      return html;
    },
    updateHeader() {
      const $pIncome = document.querySelector('#p-income');
      const $pExpense = document.querySelector('#p-expense');
      const $pTotal = document.querySelector('#p-total');
      $pIncome.textContent = Utils.toBRLFormat(Transaction.incomes());
      $pExpense.textContent = Utils.toBRLFormat(Transaction.expenses());
      $pTotal.textContent = Utils.toBRLFormat(Transaction.total());
    },
    load() {
      DOM.transactionsContainer.innerHTML = '';
      transactions.forEach((transaction, index) => {
        DOM.addTransaction(transaction, index);
      });
      DOM.updateHeader();
      document.querySelectorAll('.btn-remove-transaction').forEach($btn => {
        $btn.addEventListener('click', () => {
          console.log($btn);
          remove($btn.dataset.transaction_id);
          App.reload();
        });
      });
    }
  }

  const Storage = {
    get() {
      return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
    },
    set(transactions) {
      localStorage.setItem(
        'dev.finances:transactions',
        JSON.stringify(transactions)
      )
    },
  };

  const App = {
    init() {
      transactions = Storage.get();
      DOM.load();
      document.querySelector('#btn-new-transaction').addEventListener('click', Modal.open);
      document.querySelector('#btn-cancel').addEventListener('click', Modal.close);
      document.querySelector('#btn-save').addEventListener('click', Modal.save);
      document.querySelector('form input').addEventListener('change', function () {
        Modal.validate(
          this,
          document.querySelector(`#${this.dataset.errorElement}`),
          document.querySelector('#btn-save')
        );
      });
    },
    reload() {
      DOM.updateHeader();
      DOM.load();
    }
  }

  const remove = (transaction_id) => {
    transactions = transactions.filter(transaction => transaction.id != transaction_id);
    Storage.set(transactions);
  }

  App.init();

})();
