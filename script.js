let originalPackagesData = []; // Variable to store the original data
let filteredPackagesData = []; // Variable to store the filtered data
let currentFilters = {}; // Object to store current filters

async function fetchDataFromAPI() {
  try {
    const response = await fetch(
      "https://mock-api-pribadi-malik.vercel.app/api/mosleme-travel/packages"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    originalPackagesData = data.cards; // Store the original data
    filteredPackagesData = originalPackagesData.slice(); // Copy original data to filtered data
    displayPackages(filteredPackagesData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayPackages(packages) {
  const packagesContainer = document.getElementById("packages");
  packagesContainer.innerHTML = ""; // Clear previous content

  packages.forEach((pkg) => {
    const packageElement = createPackageElement(pkg);
    packagesContainer.appendChild(packageElement);
  });
}

function createPackageElement(pkg) {
  const packageContainer = document.createElement("div");
  packageContainer.classList.add("package");

  const image = document.createElement("img");
  image.src = pkg.image_thumbnail;
  packageContainer.appendChild(image);

  const title = document.createElement("h2");
  title.textContent = pkg.judul_paket;
  packageContainer.appendChild(title);

  const departure = document.createElement("p");
  departure.textContent = `Jadwal Keberangkatan: ${pkg.jadwal_keberangkatan}`;
  packageContainer.appendChild(departure);

  const landing = document.createElement("p");
  landing.textContent = `Mendarat di: ${pkg.mendarat_di}`;
  packageContainer.appendChild(landing);

  const price = document.createElement("p");
  price.textContent = `${formatToRupiah(pkg.price_quad_basic)}`;
  packageContainer.appendChild(price);

  const maskapai = document.createElement("p");
  maskapai.textContent = `Maskapai: ${pkg.maskapaiName}`;
  packageContainer.appendChild(maskapai);

  return packageContainer;
}

function formatToRupiah(angka) {
  var rupiah = "";
  var angkarev = angka.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++)
    if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
  return (
    "Rp. " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
}

// Function to filter packages by jadwal_keberangkatan
function filterByjadwal_keberangkatan(jadwal_keberangkatan) {
  currentFilters.jadwal_keberangkatan = jadwal_keberangkatan;
  applyFilters();
}

// Function to filter packages by price range
function filterByPriceRange(minPrice, maxPrice) {
  currentFilters.minPrice = minPrice;
  currentFilters.maxPrice = maxPrice;
  applyFilters();
}

// Function to filter packages by judul_paket
function filterByCategory(judul_paket) {
  currentFilters.judul_paket = judul_paket;
  applyFilters();
}

// Function to apply filters
function applyFilters() {
  let result = originalPackagesData.slice(); // Copy original data

  // Apply filters
  if (currentFilters.jadwal_keberangkatan) {
    result = result.filter((pkg) =>
      pkg.jadwal_keberangkatan
        .toLowerCase()
        .includes(currentFilters.jadwal_keberangkatan.toLowerCase())
    );
  }
  if (currentFilters.minPrice && currentFilters.maxPrice) {
    result = result.filter(
      (pkg) =>
        pkg.price_quad_basic >= currentFilters.minPrice &&
        pkg.price_quad_basic <= currentFilters.maxPrice
    );
  }
  if (currentFilters.judul_paket) {
    result = result.filter((pkg) =>
      pkg.judul_paket
        .toLowerCase()
        .includes(currentFilters.judul_paket.toLowerCase())
    );
  }

  // Display filtered packages
  displayPackages(result);
}

// Function to reset all filters
function resetFilters() {
  currentFilters = {}; // Reset filters object
  applyFilters(); // Apply filters (show all packages)
}

document.addEventListener("DOMContentLoaded", () => {
  fetchDataFromAPI();
});
