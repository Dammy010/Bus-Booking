// Mock Nigerian states (alphabetically ordered)
// Purpose: Defines an array of Nigerian states for use in dropdowns and price calculation
const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
    "Zamfara", "Abuja"
];

// Populate dropdowns with Nigerian states
// Purpose: Fills the "Recent Location" and "Destination" dropdowns with state options
function populateDropdowns() {
    const recentLocation = document.getElementById('recentLocation'); // Get the "Recent Location" select element
    const destination = document.getElementById('destination');       // Get the "Destination" select element

    nigerianStates.forEach(state => { // Loop through each state in the array
        const option1 = document.createElement('option'); // Create an option for "Recent Location"
        option1.value = state;                            // Set the value to the state name
        option1.textContent = state;                      // Set the display text to the state name
        recentLocation.appendChild(option1);              // Append the option to "Recent Location"

        const option2 = document.createElement('option'); // Create an option for "Destination"
        option2.value = state;                            // Set the value to the state name
        option2.textContent = state;                      // Set the display text to the state name
        destination.appendChild(option2);                 // Append the option to "Destination"
    });
}

// Calculate price based on "distance" (alphabetical difference)
// Purpose: Determines the price per seat based on the alphabetical distance between two states
function calculatePrice(recentLocation, destination) {
    const basePrice = 4000;                         // Base price per seat in Naira
    const priceIncrement = 2000;                    // Price increase per "distance" unit in Naira
    const startIndex = nigerianStates.indexOf(recentLocation); // Get index of starting state
    const endIndex = nigerianStates.indexOf(destination);      // Get index of destination state
    const distance = Math.abs(endIndex - startIndex);          // Calculate absolute distance
    return basePrice + (distance * priceIncrement);            // Return total price per seat
}

// Event listener for switching from landing page to booking system
// Purpose: Transitions from the landing page to the booking container with a fade effect
document.getElementById('startBooking').addEventListener('click', function() {
    const landingPage = document.getElementById('landingPage');         // Get the landing page element
    const bookingContainer = document.getElementById('bookingContainer'); // Get the booking container element

    landingPage.style.opacity = '0'; // Fade out the landing page
    setTimeout(() => {               // Wait for fade-out to complete
        landingPage.style.display = 'none';        // Hide the landing page
        bookingContainer.style.display = 'block';  // Show the booking container
        bookingContainer.style.opacity = '0';      // Start with opacity 0
        setTimeout(() => {                         // Small delay for smooth fade-in
            bookingContainer.style.opacity = '1';  // Fade in the booking container
        }, 50);                                    // Delay for fade-in effect
    }, 500);                                       // Delay matches fade-out duration
});

// Initialize dropdowns on page load
// Purpose: Runs the populateDropdowns function when the page loads
window.onload = function() {
    populateDropdowns(); // Call the function to fill state dropdowns
};

// Function to update price preview
// Purpose: Displays the price per seat and total price as the user selects options
function updatePricePreview() {
    const recentLocation = document.getElementById('recentLocation').value; // Get selected starting state
    const destination = document.getElementById('destination').value;       // Get selected destination state
    const seats = document.getElementById('seats').value || 0;              // Get number of seats (default to 0 if empty)
    const pricePerSeatElement = document.getElementById('pricePerSeat');    // Get price per seat display element
    const totalPriceElement = document.getElementById('totalPricePreview'); // Get total price display element

    if (recentLocation && destination && seats > 0 && recentLocation !== destination) { // Check if all inputs are valid
        const pricePerSeat = calculatePrice(recentLocation, destination); // Calculate price per seat
        const totalPrice = seats * pricePerSeat;                          // Calculate total price
        pricePerSeatElement.textContent = `₦${pricePerSeat.toLocaleString()}`; // Update price per seat display
        totalPriceElement.textContent = `₦${totalPrice.toLocaleString()}`;     // Update total price display
    } else {
        pricePerSeatElement.textContent = '₦0'; // Reset to ₦0 if inputs are invalid
        totalPriceElement.textContent = '₦0';   // Reset to ₦0 if inputs are invalid
    }
}

// Event listener for "Recent Location" dropdown change
// Purpose: Updates price preview when the user changes the starting location
document.getElementById('recentLocation').addEventListener('change', updatePricePreview);

// Event listener for "Destination" dropdown change
// Purpose: Updates price preview when the user changes the destination
document.getElementById('destination').addEventListener('change', updatePricePreview);

// Event listener for "Number of Seats" input
// Purpose: Updates price preview as the user types or changes the seat count
document.getElementById('seats').addEventListener('input', updatePricePreview);

// Event listener for form submission
// Purpose: Handles the booking process when the user submits the form
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const recentLocation = document.getElementById('recentLocation').value; // Get starting state
    const destination = document.getElementById('destination').value;       // Get destination state
    const date = document.getElementById('date').value;                     // Get travel date
    const time = document.getElementById('time').value;                     // Get travel time
    const seats = document.getElementById('seats').value;                   // Get number of seats

    if (!recentLocation || !destination || !date || !time || !seats || recentLocation === destination) { // Validate inputs
        alert('Please fill in all fields correctly. Recent Location and Destination must differ.');
        return; // Exit if validation fails
    }

    const pricePerSeat = calculatePrice(recentLocation, destination); // Calculate price per seat
    const totalPrice = seats * pricePerSeat;                          // Calculate total price

    const travelDate = new Date(date).toLocaleDateString('en-US', {   // Format date nicely
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const travelTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { // Format time as HH:MM AM/PM
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const confirmation = document.getElementById('confirmation'); // Get confirmation display element
    confirmation.innerHTML = `                                    // Display booking details
        <strong>Booking Confirmed!</strong><br>
        Route: ${recentLocation} - ${destination}<br>
        Date: ${travelDate}<br>
        Time: ${travelTime}<br>
        Seats: ${seats}<br>
        Price per Seat: ₦${pricePerSeat.toLocaleString()}<br>
        Total Price: ₦${totalPrice.toLocaleString()}
    `;

    document.getElementById('addressModal').style.display = 'flex'; // Show address input modal
    this.reset();          // Reset the form fields
    updatePricePreview();  // Reset price preview
});

// Event listener for confirming the address
// Purpose: Finalizes the booking by adding the pickup address and showing download/restart options
document.getElementById('confirmAddress').addEventListener('click', function() {
    const address = document.getElementById('addressInput').value.trim(); // Get and trim address input

    if (address === '') { // Validate address is not empty
        alert('Please enter your pickup address.');
        return;           // Exit if validation fails
    }

    document.getElementById('addressDisplay').textContent = `Pickup Address: ${address}`; // Display address
    document.getElementById('addressModal').style.display = 'none';      // Hide modal
    document.getElementById('downloadTicket').style.display = 'block';   // Show download button
    document.getElementById('restartButton').style.display = 'block';    // Show restart button
    document.getElementById('addressInput').value = '';                  // Clear address input
});

// Event listener for downloading the ticket
// Purpose: Generates and downloads a PDF ticket with booking details
document.getElementById('downloadTicket').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;                        // Access jsPDF library
    const doc = new jsPDF();                               // Create a new PDF document

    const confirmation = document.getElementById('confirmation').innerText; // Get confirmation text
    const address = document.getElementById('addressDisplay').innerText;    // Get address text
    doc.setFontSize(16);                                   // Set title font size
    doc.text("Bus Booking Ticket", 20, 20);                // Add title to PDF
    doc.setFontSize(12);                                   // Set content font size
    doc.text(confirmation + '\n' + address, 20, 30, { maxWidth: 170 }); // Add details to PDF
    doc.save('bus_ticket.pdf');                            // Save PDF as "bus_ticket.pdf"
});

// Event listener for the "Restart" button
// Purpose: Resets the booking details without navigating away
document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('confirmation').innerHTML = '';         // Clear confirmation text
    document.getElementById('addressDisplay').innerHTML = '';       // Clear address text
    document.getElementById('downloadTicket').style.display = 'none'; // Hide download button
    this.style.display = 'none';                                    // Hide restart button
    updatePricePreview();                                           // Reset price preview
});