if (!localStorage.hasOwnProperty("userIp")) {
  window.location.href = "../index.html";
}

const ip = localStorage.getItem("userIp");

const ipFound = document.querySelector(".ip-found");

document.addEventListener("DOMContentLoaded", async () => {
  ipFound.innerText = ip;
});
