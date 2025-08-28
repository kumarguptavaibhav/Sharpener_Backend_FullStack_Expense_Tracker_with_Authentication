async function handleForgotPassword(event) {
  event.preventDefault();
  try {
    const form = document.querySelector("form");
    const email = event.target.email.value;
    const req_obj = {
      email: email,
    };
    const response = await axios.post(
      "http://localhost:3000/password/forgot-password",
      req_obj
    );
    form.reset();
    alert("Email sent successfully for forgot password");
  } catch (error) {
    alert("Error: " + error.response.data.data);
  }
}
