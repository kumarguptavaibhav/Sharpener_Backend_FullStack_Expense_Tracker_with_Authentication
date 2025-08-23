let isEdit = false;
let editId = null;
const isLoggedIn = localStorage.getItem("user");
if (!isLoggedIn) {
  window.location.href = "signup.html";
}
window.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  display();
});

async function addExpense(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const expense_obj = {
    amount: amount,
    description: description,
    category: category,
  };
  if (isEdit) {
    const result = await axios.put(
      `http://localhost:3000/expense/${editId}`,
      expense_obj
    );
    const data = result.data;
    if (data.error) {
      alert("Updation Error");
      return;
    }
    editId = null;
    isEdit = false;
  } else {
    const result = await axios.post(
      "http://localhost:3000/expense",
      expense_obj
    );
    const data = result.data;
    if (data.error) {
      alert("Creation Error");
      return;
    }
  }
  display();
  event.target.reset();
}

async function display() {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";
  const result = await axios.get("http://localhost:3000/expense");
  const data = result.data;
  if (data.error) {
    alert("Fetching Error");
    return;
  }
  const expenseList = data.data;
  if (!expenseList || expenseList.length === 0) {
    return;
  }
  for (let i = 0; i < expenseList.length; i++) {
    const currentExpense = expenseList[i];
    const li = document.createElement("li");
    li.textContent = `Amount: - ${currentExpense.amount}, Description: - ${currentExpense.description}, Category: - ${currentExpense.category}`;

    const delete_btn = document.createElement("button");
    delete_btn.textContent = "Delete Expense";
    delete_btn.addEventListener("click", function (event) {
      event.preventDefault();
      delete_expense(currentExpense.id, li);
    });

    const edit_btn = document.createElement("button");
    edit_btn.textContent = "Edit Expense";
    edit_btn.addEventListener("click", function (event) {
      event.preventDefault();
      edit_expense(currentExpense);
    });

    li.appendChild(delete_btn);
    li.appendChild(edit_btn);
    ul.appendChild(li);
  }
}

async function delete_expense(id, li) {
  const result = await axios.delete(`http://localhost:3000/expense/${id}`);
  const data = result.data;
  if (data.error) {
    alert("Deletion Error");
  } else {
    display();
  }
}

function edit_expense(data) {
  if (data) {
    document.getElementById("amount").value = data.amount;
    document.getElementById("description").value = data.description;
    document.getElementById("category").value = data.category;
    editId = data.id;
    isEdit = true;
  }
}

module.exports = addExpense;
