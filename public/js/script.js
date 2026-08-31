// ===============================
// Bootstrap form validation
// ===============================

(() => {
    'use strict';

    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');

        }, false);
    });

})();


// ===============================
// Map functionality
// ===============================

const mapElement = document.getElementById("map");

if (mapElement && typeof listingLocation !== "undefined") {

    console.log("Listing location:", listingLocation);

    fetch(`/api/geocode?location=${encodeURIComponent(listingLocation)}`)
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                console.log(data.error);
                return;
            }

            console.log("Latitude:", data.lat);
            console.log("Longitude:", data.lon);

            const map = L.map("map").setView([data.lat, data.lon], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors"
            }).addTo(map);

            L.marker([data.lat, data.lon])
                .addTo(map)
                .bindPopup(`
                    <h5>${listingTitle}</h5>
                    <p>${listingLocation}</p>
                    <p>₹${listingPrice} / night</p>
                `)
                .openPopup();
        })
        .catch(error => {
            console.log("Geocoding error:", error);
        });
}


// ===============================
// Heart icon
// ===============================

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("heart-icon")) {

        event.target.classList.toggle("fa-regular");
        event.target.classList.toggle("fa-solid");

    }

});


// ===============================
// Dark Mode
// ===============================

const darkModeToggle = document.querySelector("#dark-mode-toggle");

// Check saved dark mode
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");

    if (darkModeToggle) {
        darkModeToggle.innerHTML = "☀️";
    }
}

// Toggle dark mode
if (darkModeToggle) {

    darkModeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = "☀️";

        } else {

            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = "🌙";

        }

    });
}

const bookingDate = document.querySelector("#booking-date");

if (bookingDate) {

    const isMobile = window.innerWidth <= 768;

    flatpickr("#booking-date", {
        mode: "range",
        minDate: "today",
        inline: true,
        showMonths: isMobile ? 1 : 2,
        dateFormat: "d-m-Y"
    });

}