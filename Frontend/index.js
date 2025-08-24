let isEdit = false;
let editId = null;
const isLoggedIn = localStorage.getItem("expense_token");
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
      expense_obj,
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
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
      expense_obj,
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
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
  const ul = document.querySelector("ol");
  ul.innerHTML = "";
  const result = await axios.get("http://localhost:3000/expense", {
    headers: {
      authorization: `Bearer ${isLoggedIn}`,
    },
  });
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
    li.style.listStyle = "none";
    li.style.marginBottom = "10px";

    const div = document.createElement("div");
    div.style.border = "3px solid green";
    div.style.borderRadius = "30px";
    div.style.padding = "10px";
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.gap = "50px";
    div.style.backgroundColor = "lightgreen";
    div.style.width = "1200px";

    const p1 = document.createElement("p");
    p1.innerHTML = `<b>Expense Amount: </b>${currentExpense.amount}`;

    const p2 = document.createElement("p");
    p2.innerHTML = `<b>Description: </b>${currentExpense.description}`;

    const p3 = document.createElement("p");
    p3.innerHTML = `<b>Category: </b>${currentExpense.category}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-warning";
    deleteBtn.textContent = "Delete Expense";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-warning";
    editBtn.textContent = "Edit Expense";

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(deleteBtn);
    div.appendChild(editBtn);
    li.appendChild(div);
    ul.appendChild(li);
    deleteBtn.addEventListener("click", function (event) {
      event.preventDefault();
      delete_expense(currentExpense.id, li);
    });
    editBtn.addEventListener("click", function (event) {
      event.preventDefault();
      edit_expense(currentExpense);
    });
  }
}

async function delete_expense(id, li) {
  const result = await axios.delete(`http://localhost:3000/expense/${id}`, {
    headers: {
      authorization: `Bearer ${isLoggedIn}`,
    },
  });
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
