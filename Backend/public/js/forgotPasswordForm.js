async function handlePasswordForgot(event) {
  event.preventDefault();
  try {
    const form = document.querySelector("form");
    const new_password = event.target.newPassword.value;
    const req_obj = { new_password: new_password };
    const path = window.location.pathname;
    const path_arr = path.split("/");
    const requestId = path_arr[path_arr.length - 1];
    const response = await axios.post(
      `http://localhost:3000/password/update/${requestId}`,
      req_obj
    );
    form.reset();
    alert("Password Successfully updated");
  } catch (error) {
    alert("Error: " + error.response.data.data);
  }
}
