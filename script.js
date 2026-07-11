document.getElementById("leadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const lead = {
    name: document.getElementById("businessName").value,
    phone: document.getElementById("phone").value
};

    const response = await fetch("https://arihant-lead-distribution.onrender.com/lead", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(lead)
    });

    const data = await response.json();

    const message = `📢 *New Customer Inquiry*

🏢 Business Name: ${lead.name}

📞 Contact Number: ${lead.phone}`;

    const url = `https://wa.me/${data.salesmanPhone}?text=${encodeURIComponent(message)}`;

    window.location.href = url;
});