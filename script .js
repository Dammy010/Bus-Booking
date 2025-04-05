const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
    "Zamfara", "Abuja"
];


function populateDropdowns() {
    const recentLocation = document.getElementById('recentLocation');
    const destination = document.getElementById('destination');

    nigerianStates.forEach(state => {
        const option1 = document.createElement('option');
        option1.value = state;
        option1.textContent = state;
        recentLocation.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = state;
        option2.textContent = state;
        destination.appendChild(option2);
    });
}

function calculatePrice(recentLocation, destination) {
    const basePrice = 3000;
    const priceIncrement = 2000; 
    const startIndex = nigerianStates.indexOf(recentLocation);
    const endIndex = nigerianStates.indexOf(destination);
    const distance = Math.abs(endIndex - startIndex); 
    return basePrice + (distance * priceIncrement);
}


window.onload = populateDropdowns;

function updatePricePreview() {
    const recentLocation = document.getElementById('recentLocation').value;
    const destination = document.getElementById('destination').value;
    const seats = document.getElementById('seats').value || 0;
    const pricePerSeatElement = document.getElementById('pricePerSeat');
    const totalPriceElement = document.getElementById('totalPricePreview');

    if (recentLocation && destination && seats > 0 && recentLocation !== destination) {
        const pricePerSeat = calculatePrice(recentLocation, destination);
        const totalPrice = seats * pricePerSeat;
        pricePerSeatElement.textContent = `₦${pricePerSeat.toLocaleString()}`;
        totalPriceElement.textContent = `₦${totalPrice.toLocaleString()}`;
    } else {
        pricePerSeatElement.textContent = '₦0';
        totalPriceElement.textContent = '₦0';
    }
}

document.getElementById('recentLocation').addEventListener('change', updatePricePreview);
document.getElementById('destination').addEventListener('change', updatePricePreview);
document.getElementById('seats').addEventListener('input', updatePricePreview);

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const recentLocation = document.getElementById('recentLocation').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const seats = document.getElementById('seats').value;

    if (!recentLocation || !destination || !date || !time || !seats || recentLocation === destination) {
        alert('Please fill in all fields correctly. Recent Location and Destination must differ.');
        return;
    }

    const pricePerSeat = calculatePrice(recentLocation, destination);
    const totalPrice = seats * pricePerSeat;

    const travelDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const travelTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const confirmation = document.getElementById('confirmation');
    confirmation.innerHTML = `
        <strong>Booking Confirmed!</strong><br>
        Route: ${recentLocation} - ${destination}<br>
        Date: ${travelDate}<br>
        Time: ${travelTime}<br>
        Seats: ${seats}<br>
        Price per Seat: ₦${pricePerSeat.toLocaleString()}<br>
        Total Price: ₦${totalPrice.toLocaleString()}
    `;

    document.getElementById('downloadTicket').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block';

    this.reset();
    updatePricePreview(); 
});

document.getElementById('downloadTicket').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const confirmation = document.getElementById('confirmation').innerText;
    doc.setFontSize(16);
    doc.text("Bus Booking Ticket", 20, 20);
    doc.setFontSize(12);
    doc.text(confirmation, 20, 30, { maxWidth: 170 });

    doc.save('bus_ticket.pdf');
});

document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('confirmation').innerHTML = '';
    document.getElementById('downloadTicket').style.display = 'none';
    this.style.display = 'none';
    updatePricePreview(); 
});