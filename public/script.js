function sendCookie() {
  const cookie = document.getElementById("cookieInput").value;
  const output = document.getElementById("output");

  fetch("/api/bypass", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cookie })
  })
  .then(res => res.json())
  .then(data => {
    output.textContent = data.message || data.refreshedCookie || "Done";
  })
  .catch(err => {
    output.textContent = "Error: " + err;
  });
}
