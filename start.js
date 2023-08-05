const ipFound = document.querySelector(".ip-found");

async function getUserIp() {
  try {
    const response = await fetch("https://api.ipify.org");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const ip = await response.text();
    return ip;
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let ip = await getUserIp();
  ipFound.innerHTML = ip;
  localStorage.setItem("userIp", ip);
});
