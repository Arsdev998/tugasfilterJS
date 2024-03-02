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
    applyFilters(); // Apply filters initially
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayPackages(packages) {
  const packagesContainer = document.getElementById("packages");
  packagesContainer.innerHTML = ""; // Clear previous content

  if (packages.length === 0) {
    const noResultsMessage = document.createElement("span");
    noResultsMessage.textContent = "Tidak ada hasil yang ditemukan.";
    packagesContainer.appendChild(noResultsMessage);
  } else {
    packages.forEach((pkg) => {
      const packageElement = createPackageElement(pkg);
      packagesContainer.appendChild(packageElement);
    });
  }
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
  departure.textContent = `${String.fromCodePoint(0x1f4c5)} ${
    pkg.jadwal_keberangkatan
  }`;
  packageContainer.appendChild(departure);

  const maskapai = document.createElement("p");
  maskapai.textContent = `${String.fromCodePoint(0x1f6eb)} ${pkg.maskapaiName}`; // Menambahkan emoji pesawat
  packageContainer.appendChild(maskapai);

  const landing = document.createElement("p");
  landing.textContent = `${String.fromCodePoint(0x1f6ec)} ${pkg.mendarat_di}`;
  packageContainer.appendChild(landing);

  const bintang = document.createElement("p");
  bintang.textContent = "⭐".repeat(pkg.hotel_star);
  packageContainer.appendChild(bintang);

  const price = document.createElement("p");
  price.textContent = `Rp${formatToRupiah(pkg.price_quad_basic)}`;
  packageContainer.appendChild(price);

  return packageContainer;
}

function formatToRupiah(angka) {
  return angka.toLocaleString("id-ID");
}

// Function to filter packages by bulan
function filterByBulan(bulan) {
  currentFilters.jadwal_keberangkatan = bulan;
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

// Function to reset all filters
// Function to reset all filters
// Function to reset all filters
function resetFilters() {
  // Reset select elements
  document.querySelector('select[name="bulan"]').value = "all";

  // Reset radio buttons
  const categoryRadios = document.querySelectorAll('input[name="category"]');
  categoryRadios.forEach((radio) => {
    radio.checked = false;
  });

  const priceRadios = document.querySelectorAll('input[name="price"]');
  priceRadios.forEach((radio) => {
    radio.checked = false;
  });

  // Reset currentFilters
  currentFilters = {};

  // Apply filters (show all packages)
  applyFilters();
}

// Function to apply filters
function applyFilters() {
  let result = originalPackagesData.slice(); // Copy original data

  // Apply filters
  if (
    currentFilters.jadwal_keberangkatan &&
    currentFilters.jadwal_keberangkatan !== "all"
  ) {
    result = result.filter((pkg) => {
      const departureDate = new Date(pkg.jadwal_keberangkatan);
      const filterMonth = parseInt(currentFilters.jadwal_keberangkatan);

      // Mengambil bulan dari tanggal keberangkatan
      const departureMonth = departureDate.getMonth() + 1; // Ingat bahwa bulan dimulai dari 0, maka tambahkan 1

      return departureMonth === filterMonth;
    });
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

document.addEventListener("DOMContentLoaded", () => {
  fetchDataFromAPI();

  // Add event listener to reset button
  document
    .getElementById("resetButton")
    .addEventListener("click", resetFilters);
});
