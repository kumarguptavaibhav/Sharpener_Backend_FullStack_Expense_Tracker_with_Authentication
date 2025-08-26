window.addEventListener("DOMContentLoaded", async (event) => {
  event.preventDefault();
  console.log("Success Trigger");
  try {
    const existing_token = localStorage.getItem("expense_token");
    const response_result = await axios.post(
      "http://localhost:3000/token/update",
      {},
      {
        headers: {
          authorization: `Bearer ${existing_token}`,
        },
      }
    );
    const result_data = response_result.data;
    if (result_data.error) {
      alert("Token Updation Error");
      return;
    }
    localStorage.setItem("expense_token", result_data.data);
  } catch (error) {
    console.log("Payment Error: ", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Payment initiation failed. Please try again.");
    }
  }
});
