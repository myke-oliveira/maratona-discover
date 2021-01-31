(function () {

  const Utils = {
    toBRLFormat(amount) {
      return (amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

      if (!$description.checkValidity()) {
        alert('asdf');
        return;
      }
      
      if (!$amount.checkValidity()) {
        alert('asdfasdf');
        return;
      }

      const description = $description.value;
      const amount = Math.round($amount.value * 100);
      const date = new Date(document.querySelector('#date').value);

      const transaction = {
        id: Utils.uuid(),
        description,
        amount,
        date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      };

      transactions.push(transaction);

      DOM.addTransaction(transaction);

      Modal.close();
    },
    validate($self, $errorElement, $submitButton) {
      if ($self.checkValidity()) {
        $errorElement.classList.remove('visible-error');
        $submitButton.disabled = false;
      } else {
        $errorElement.classList.add('visible-error');
        const $inputs = document.querySelectorAll('form input');
        if (Array.prototype.every.call($inputs, function ($input) {
          return $input.checkValidity();
        })) {
          $submitButton.disabled = true;
        }
      }
    }
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
    }
  }

  const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
      const tr = document.createElement('tr');
      tr.setAttribute('key', transaction.id);
      tr.innerHTML = this.innerHTMLTransaction(transaction);
      this.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction({ description, amount, date}) {
      const formatedAmount = Utils.toBRLFormat(amount);
      const CSSClass = amount < 0 ? 'expense' : 'income'
      const html = `
        <td class="description">${description}</td>
        <td class="${CSSClass}">${formatedAmount}</td>
        <td class="date">${date}</td>
        <td>
          <img src="./assets/minus.svg" alt="Remover Transação">
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
      transactions.forEach((transaction, index) => {
        DOM.addTransaction(transaction, index);
      });
      DOM.updateHeader();
    }
  }

  const transactions = [
    {
      id: 1,
      description: "Luz",
      amount: -50000,
      date: '23/01/2020'
    },
    {
      id: 2,
      description: "Criação Website",
      amount: 400000,
      date: '23/01/2020'
    },
    {
      id: 3,
      description: "Internet",
      amount: -20000,
      date: '23/01/2020'
    },
  ]

  DOM.load();

  document.querySelector('#btn-new-transaction').addEventListener('click', Modal.open);
  document.querySelector('#btn-cancel').addEventListener('click', Modal.close);
  document.querySelector('#btn-save').addEventListener('click', Modal.save);
  document.querySelector('form input').addEventListener('change', function () {
    Modal.validate(
      this,
      document.querySelector(`#${this.dataset.errorElement}`),
      document.querySelector('#btn-save')
    )
  });
  document.querySelector('')

})();
