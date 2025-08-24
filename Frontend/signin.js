async function handleSignIn(event) {
  event.preventDefault();
  try {
    const email = event.target.email.value;
    const password = event.target.password.value;
    const req_obj = {
      email: email,
      password: password,
    };
    const login_response = await axios.post(
      "http://localhost:3000/users/signin",
      req_obj
    );
    window.location.href = "index.html";
  } catch (error) {
    const div = document.querySelector("#container");
    const para = document.createElement("p");
    para.style.color = "red";
    if (error.response) {
      para.textContent = `Error: ${
        error.response.data.data || "Something went wrong"
      }`;
    } else {
      para.textContent = "Error: Unable to connect to server. Try again later.";
    }
    div.appendChild(para);
  }
}
