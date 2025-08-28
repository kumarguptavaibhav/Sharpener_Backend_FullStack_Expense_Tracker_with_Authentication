const cashfree = Cashfree({
  mode: "sandbox",
});
let isEdit = false;
let editId = null;
let isPremiumUser = false;
let isLeaderButtonClick = false;
const isLoggedIn = localStorage.getItem("expense_token");
if (!isLoggedIn) {
  window.location.href = "signup.html";
}

window.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  checkPremiumStatus();
  display();
  const limitSelect = document.getElementById("limit-select");
  if (limitSelect) {
    limitSelect.addEventListener("change", () => {
      display();
    });
  }
});

async function checkPremiumStatus() {
  try {
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
  premiumDiv.className = "premium-features text-center mt-3";

  const heading = document.createElement("h4");
  heading.className = "text-success";
  heading.textContent = "Premium Features";
  premiumDiv.appendChild(heading);

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "btn btn-outline-primary me-2";
  downloadBtn.textContent = "Download Expenses";
  premiumDiv.appendChild(downloadBtn);

  const leaderboardBtn = document.createElement("button");
  leaderboardBtn.className = "btn btn-outline-info";
  leaderboardBtn.textContent = "View Leaderboard";
  premiumDiv.appendChild(leaderboardBtn);

  const expenseHeader = document.querySelector("h3");
  container.insertBefore(premiumDiv, expenseHeader);

  leaderboardBtn.addEventListener("click", function (event) {
    event.preventDefault();
    isLeaderButtonClick = true;
    onLeaderButtonClick();
  });

  downloadBtn.addEventListener("click", function (event) {
    event.preventDefault();
    onDownloadButtonClick();
  });
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
    if (isLeaderButtonClick && isPremiumUser) {
      onLeaderButtonClick();
    }
    event.target.reset();
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Add/Update expense failed. Please try again.");
    }
  }
}

async function display(page = 1) {
  try {
    const limit = document.getElementById("limit-select").value;
    const ul = document.querySelector("ol");
    ul.innerHTML = "";
    const result = await axios.get(
      `http://localhost:3000/expense/expense?page=${page}&limit=${limit}`,
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
    );
    const data = result.data;
    const expenseData = data.data;
    const {
      expenses,
      current_page,
      has_next_page,
      has_previous_page,
      last_page,
      next_page,
      previous_page,
    } = expenseData;
    if (!expenses || expenses.length === 0) {
      const li = document.createElement("li");
      li.style.listStyle = "none";
      li.style.marginBottom = "10px";

      const div = document.createElement("div");
      div.style.border = "3px solid green";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
      div.style.display = "flex";
      div.style.flexDirection = "row";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";
      div.style.backgroundColor = "lightgreen";

      const p1 = document.createElement("p");
      p1.innerHTML = `<b>No Expense has been found! </b>`;

      div.appendChild(p1);
      li.appendChild(div);
      ul.appendChild(li);
      return;
    }
    for (let i = 0; i < expenses.length; i++) {
      const currentExpense = expenses[i];
      const create_date = new Date(currentExpense.createdAt);
      const update_date = new Date(currentExpense.updatedAt);
      const li = document.createElement("li");
      li.style.listStyle = "none";
      li.style.marginBottom = "10px";

      const div = document.createElement("div");
      div.style.border = "3px solid green";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
      div.style.display = "flex";
      div.style.flexDirection = "row";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";
      div.style.backgroundColor = "lightgreen";

      const p1 = document.createElement("p");
      p1.innerHTML = `<b>Expense Amount: </b>${currentExpense.amount}`;

      const p2 = document.createElement("p");
      p2.innerHTML = `<b>Description: </b>${currentExpense.description}`;

      const p3 = document.createElement("p");
      p3.innerHTML = `<b>Category: </b>${currentExpense.category}`;

      const p4 = document.createElement("p");
      p4.innerHTML = `<b>Created At: </b>${create_date.toLocaleString()}`;

      const p5 = document.createElement("p");
      p5.innerHTML = `<b>Updated At: </b>${update_date.toLocaleString()}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-warning";
      deleteBtn.textContent = "Delete";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-warning";
      editBtn.textContent = "Edit";

      div.appendChild(p1);
      div.appendChild(p2);
      div.appendChild(p3);
      div.appendChild(p4);
      div.appendChild(p5);
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
    if (document.getElementById("pagination-div")) {
      document.getElementById("pagination-div").remove();
    }
    const pagination_div = document.createElement("div");
    pagination_div.className = "text-center";
    pagination_div.style.display = "flex";
    pagination_div.style.justifyContent = "center";
    pagination_div.style.gap = "10px";
    pagination_div.id = "pagination-div";

    const left_button = document.createElement("button");
    left_button.textContent = "<";
    left_button.disabled = !has_previous_page;
    left_button.addEventListener("click", () => display(previous_page));

    const p = document.createElement("p");
    p.innerHTML = `<b>${current_page}</b>`;

    const right_button = document.createElement("button");
    right_button.textContent = ">";
    right_button.disabled = !has_next_page;
    right_button.addEventListener("click", () => display(next_page));

    pagination_div.appendChild(left_button);
    pagination_div.appendChild(p);
    pagination_div.appendChild(right_button);
    ul.insertAdjacentElement("afterend", pagination_div);
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.data);
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
      if (isLeaderButtonClick && isPremiumUser) {
        onLeaderButtonClick();
      }
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

async function onLeaderButtonClick() {
  try {
    const result = await axios.get(
      "http://localhost:3000/premium/leaderboard",
      {
        headers: {
          authorization: `Bearer ${isLoggedIn}`,
        },
      }
    );
    const data = result.data;
    if (data.error) {
      alert("Leaderboard Fetching Error");
      return;
    }

    const container = document.getElementById("leader-div");
    container.textContent = "";

    const h3 = document.createElement("h3");
    h3.className = "text-center mt-3";
    h3.textContent = "Leader Board Details";

    const leader_div = document.createElement("div");
    leader_div.classList = "text-center mt-3";

    const table = document.createElement("table");
    table.style.borderRadius = "10px";
    table.style.overflow = "hidder";
    table.style.border = "2px solid red";
    table.style.borderStyle = "seperate";
    table.style.borderSpacing = "0";
    table.className = "table";

    //thead
    const thead = document.createElement("thead");
    const theadr = document.createElement("tr");
    theadr.className = "table-danger";

    const th_name = document.createElement("th");
    th_name.textContent = "Name";

    const th_total_amount = document.createElement("th");
    th_total_amount.textContent = "Expense Total Amount";

    theadr.appendChild(th_name);
    theadr.appendChild(th_total_amount);
    thead.appendChild(theadr);

    //tbody
    const tbody = document.createElement("tbody");
    for (let i = 0; i < data.data.length; i++) {
      const curr_data = data.data[i];
      const tbodyr = document.createElement("tr");
      tbodyr.className = "table-warning";

      const td_name = document.createElement("td");
      td_name.textContent = curr_data.name;

      const td_total_amount = document.createElement("td");
      td_total_amount.textContent = curr_data.total_amount;

      tbodyr.appendChild(td_name);
      tbodyr.appendChild(td_total_amount);
      tbody.appendChild(tbodyr);
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    leader_div.appendChild(table);

    container.appendChild(h3);
    container.appendChild(leader_div);
  } catch (error) {
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Fetching expense failed. Please try again.");
    }
  }
}

async function onDownloadButtonClick() {
  try {
    const response = await axios.get("http://localhost:3000/expense/download", {
      headers: {
        authorization: `Bearer ${isLoggedIn}`,
      },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert("Error: " + error.response.statusText);
  }
}
