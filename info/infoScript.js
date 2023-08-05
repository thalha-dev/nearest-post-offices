if (!localStorage.hasOwnProperty("userIp")) {
  window.location.href = "../index.html";
}

const ip = localStorage.getItem("userIp");

const ipFound = document.querySelector(".ip-found");
const latitude = document.querySelector(".lat p");
const longitude = document.querySelector(".long p");
const city = document.querySelector(".city p");
const region = document.querySelector(".region p");
const organisation = document.querySelector(".org p");
const hostName = document.querySelector(".hostname p");
const googlMap = document.querySelector(".map");
const timeZoneElement = document.querySelector(".timezone p");
const dateAndTime = document.querySelector(".datetime p");
const pincode = document.querySelector(".pincode p");
const message = document.querySelector(".message p");
const postOffices = document.querySelector(".post-offices");
const postalSearch = document.querySelector(".postal-search");

let ipBasedInfo;
let postalInfo;

async function getIpBasedInfo(ip) {
  try {
    const request = await fetch(`https://ipinfo.io/${ip}?token=78580d04278dce`);
    if (!request.ok) {
      throw new Error("Error occured while fetching info based on IP address");
    }
    ipBasedInfo = await request.json();
    console.log(ipBasedInfo);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getPostalInfo(pincode) {
  try {
    const request = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
    );
    if (!request.ok) {
      throw new Error("Error occured while fetching info based on Pincode");
    }
    postalInfo = await request.json();
    console.log(postalInfo);
  } catch (error) {
    console.error("Error:", error);
  }
}

function generatePostalElement(office) {
  let e = `
        <div class="post-office">
          <div class="info-field office-name">
            <h3>Name:</h3>
            <p>${office.Name}</p>
          </div>
          <div class="info-field office-type">
            <h3>Branch Type:</h3>
            <p>${office.BranchType}</p>
          </div>
          <div class="info-field office-delivery-status">
            <h3>Delivery Status:</h3>
            <p>${office.DeliveryStatus}</p>
          </div>
          <div class="info-field office-district">
            <h3>District:</h3>
            <p>${office.District}</p>
          </div>
          <div class="info-field office-division">
            <h3>Division:</h3>
            <p>${office.Division}</p>
          </div>
        </div>`;
  return e;
}

function renderPostOffices(postOfficesList) {
  postOffices.innerHTML = "";
  postOfficesList.forEach((office) => {
    let elem = generatePostalElement(office);
    postOffices.innerHTML += elem;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  ipFound.innerText = ip;
  await getIpBasedInfo(ip);

  city.innerHTML = ipBasedInfo.city;

  const lat = ipBasedInfo.loc.split(",")[0];
  const long = ipBasedInfo.loc.split(",")[1];

  latitude.innerHTML = lat;
  longitude.innerHTML = long;
  region.innerHTML = ipBasedInfo.region;
  organisation.innerHTML = ipBasedInfo.org;
  if (ipBasedInfo.hostname) {
    hostName.innerHTML = ipBasedInfo.hostname;
  }

  googlMap.src = `https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`;

  timeZoneElement.innerHTML = ipBasedInfo.timezone;

  let dateTimeStr = new Date().toLocaleString("en-US", {
    timeZone: ipBasedInfo.timezone,
  });
  dateAndTime.innerHTML = dateTimeStr;
  pincode.innerHTML = ipBasedInfo.postal;
  await getPostalInfo(ipBasedInfo.postal);
  message.innerHTML = postalInfo[0]["Message"];
  renderPostOffices(postalInfo[0]["PostOffice"]);
});

postalSearch.addEventListener("input", (e) => {
  setTimeout(() => {
    let postOfficesFiltered = postalInfo[0]["PostOffice"].filter((office) => {
      return office["Name"]
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    renderPostOffices(postOfficesFiltered);
  }, 1000);
});
