async function handlePasswordForgot(event) {
  event.preventDefault();
  try {
    const form = document.querySelector("form");
    const new_password = event.target.newPassword.value;
    const req_obj = { new_password: new_password };
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get("requestId");
    const response = await axios.post(
      `http://localhost:3000/password/update/${requestId}`,
      req_obj
    );
    form.reset();
    alert("Password Successfully updated");
    window.location.href = "signin.html";
  } catch (error) {
    alert("Error: " + error.response.data.data);
  }
}
