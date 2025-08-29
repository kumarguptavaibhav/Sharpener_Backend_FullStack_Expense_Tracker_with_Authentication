async function handleForgotPassword(event) {
  event.preventDefault();
  try {
    const form = document.querySelector("form");
    const email = event.target.email.value;
    const req_obj = {
      email: email,
    };
    const frontend_base_url = window.location.origin;
    const response = await axios.post(
      `http://localhost:3000/password/forgot-password?frontend_base_url=${frontend_base_url}`,
      req_obj
    );
    form.reset();
    alert("Email sent successfully for forgot password");
  } catch (error) {
    alert("Error: " + error.response.data.data);
  }
}
