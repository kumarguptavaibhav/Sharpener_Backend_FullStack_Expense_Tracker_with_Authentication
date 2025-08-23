async function handleSignUp(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;
  const req_obj = {
    name: name,
    email: email,
    password: password,
  };
  const create_response = await axios.post(
    "http://localhost:3000/users",
    req_obj
  );
  const create_data = create_response.data;
  if (create_data.error) {
    // console.log("Error: ", create_data.data);
    const div = document.querySelector("#container");
    const para = document.createElement("p");
    para.style.color = "red";
    para.textContent = `Error: ${create_data.data}`;
    div.appendChild = para;
    return;
  }
  window.location.href = "signin.html";
}
