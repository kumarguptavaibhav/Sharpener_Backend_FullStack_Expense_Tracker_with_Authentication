const cashfree = Cashfree({
  mode: "sandbox",
});
let isEdit = false;
let editId = null;
let isPremiumUser = false;
const isLoggedIn = localStorage.getItem("expense_token");
if (!isLoggedIn) {
  window.location.href = "signup.html";
}

window.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  console.log("Trigger index.js");
  checkPremiumStatus();
  display();
});

async function checkPremiumStatus() {
  try {
    console.log("Token sent", isLoggedIn);
    const result = await axios.get(
      "http://localhost:3000/payments/premium-status",
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
    );
    if (result.data.error) {
      alert("Payment status fetching error.");
      return;
    }
    if (result.data.data.isPremium) {
      isPremiumUser = true;
      updateUIForPremium();
    }
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Payment status check failed. Please try again.");
    }
  }
}

function updateUIForPremium() {
  const paymentButton = document.getElementById("pay-btn");
  if (isPremiumUser) {
    paymentButton.textContent = "✓ Premium Active";
    paymentButton.className = "btn btn-success mt-3";
    paymentButton.disabled = true;

    addPremiumFeatures();
  }
}

function addPremiumFeatures() {
  const container = document.querySelector(".container");
  const premiumDiv = document.createElement("div");
  premiumDiv.className = "text-center mt-3";
  premiumDiv.innerHTML = `
    <div class="premium-features">
      <h4 class="text-success">Premium Features</h4>
      <button class="btn btn-outline-primary me-2">
        Download Expenses
      </button>
      <button class="btn btn-outline-info">
        View Leaderboard
      </button>
    </div>
  `;
  const expenseHeader = document.querySelector("h3");
  container.insertBefore(premiumDiv, expenseHeader);
}

async function addExpense(event) {
  event.preventDefault();
  try {
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
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Add/Update expense failed. Please try again.");
    }
  }
}

async function display() {
  try {
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
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Fetching expense failed. Please try again.");
    }
  }
}

async function delete_expense(id, li) {
  try {
    const result = await axios.delete(`http://localhost:3000/expense/${id}`, {
      headers: {
        authorization: `Bearer ${isLoggedIn}`,
      },
    });
    const data = result.data;
    if (data.error) {
      alert("Deletion Error");
      return;
    } else {
      display();
    }
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Fetching expense failed. Please try again.");
    }
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

async function onPaymentButton(event) {
  event.preventDefault();
  if (isPremiumUser) {
    alert("You already have premium access!");
    return;
  }
  const frontend_base_url = window.location.origin;
  try {
    const response = await axios.post(
      "http://localhost:3000/payments/pay",
      { frontend_base_url },
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
    );
    const paymentSessionId = response.data.data;

    if (!paymentSessionId) {
      throw new Error("Payment session ID not received");
    }
    const checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Payment initiation failed. Please try again.");
    }
  }
}
