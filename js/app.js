class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //költségvetést elküldő metódus
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === '' || value < 0) {
      this.budgetFeedback.classList.add("showItem"); //main.css-ben így van elnevezeve 
      this.budgetFeedback.innerHTML = '<p> az érték nem lehet üres vagy negatív </p>';

      const self = this;
      //console.log(this);
      setTimeout(function () {
        self.budgetFeedback.classList.remove("showItem"); // 5 másodperc után eltünteti az üzenetet, self-el globális hatókörrel hivatkozunk
      }, 5000)
    }
    else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  //az egyenleget mutatja
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {                                             // ha igaz a feltétel
      this.balance.classList.remove("showGreen", "showBlack"); // akkor ezeket a színeket eltávolítja
      this.balance.classList.add("showRed");                  // ezt pedig megjeleníti
    }
    else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    }
    else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  //a kiadásokat elküldő metódus
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = '<p> az érték nem lehet üres vagy negatív (mindkét mezőt kötelező kitölteni) </p>';

      const self = this;
      setTimeout(function () {
        self.expenseFeedback.classList.remove('showItem');
      }, 5000)
    }
    else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";

      let expense = {       //objektum
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      this.itemID++;
      this.itemList.push(expense); //hozzáadjuk a költégeket 
      this.addExpense(expense);
      //egyenleg mutatás
      this.showBalance();
    }
  }

  //kiadás típusának a hozzáadása
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    //visszafelé aposztrójellel működik csak
    div.innerHTML = `            
    <div class="expense-item d-flex justify-content-between align-items-baseline">

            <h6 class="expense-title mb-0 text-uppercase list-item">-${expense.title}</h6>
            <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

            <div class="expense-icons list-item">

            <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
            <i class="fas fa-edit"></i>
            </a>
            <a href="#" class="delete-icon" data-id="${expense.id}">
            <i class="fas fa-trash"></i>
            </a>
            </div>
            </div>
    `;
    this.expenseList.appendChild(div);
  }

  //összes kiadás metódus
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      //console.log(this.itemList);
      total = this.itemList.reduce(function(acc,curr){  //accumulator,current
        //console.log(`Total is ${acc} and the current value is ${curr.amount}`);
        acc += curr.amount;
        return acc;
      },0);
    }

    this.expenseAmount.textContent = total;

    return total;
  }

  //kiadás szerkesztése ikonnak a metódusa
  editExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement; //4-et ugrunk vissza a szülő elemre

    //eltávolítás a DOM-ból
    this.expenseList.removeChild(parent);

    //eltávolítás a listából
    let expense = this.itemList.filter(function(item){
      return item.id === id;
    })

    //érték mutatása
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    //eltávolítás a listából
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })

    this.itemList = tempList;
    this.showBalance();

  }

  //kiadás törlése ikonnak a metódusa
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement; //4-et ugrunk vissza a szülő elemre

    //eltávolítás a DOM-ból
    this.expenseList.removeChild(parent);

    //eltávolítás a listából
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })

    this.itemList = tempList;
    this.showBalance();

  }

}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  //új példánya a UI osztálynak
  const ui = new UI();

  //budget űrlap adatainak benyújtása(submit)
  budgetForm.addEventListener("submit", function () {
    event.preventDefault();  //megelőzi, hogy újraküldjünk adatokat
    ui.submitBudgetForm();
  })

  //expense űrlap adatainak benyújtása(submit)
  expenseForm.addEventListener("submit", function () {
    event.preventDefault();
    ui.submitExpenseForm();
  })


  //expense klikk
  expenseList.addEventListener("click", function () {
    //console.log(event.target);
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement);
    }
    else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);
    }
  });

}

document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
})