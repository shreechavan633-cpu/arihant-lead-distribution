document.getElementById("leadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const lead = {
    name: document.getElementById("businessName").value,
    phone: document.getElementById("phone").value
};

    const response = await fetch("/lead", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(lead)
    });

    const data = await response.json();

    console.log(data);
    
    const message =
`${String.fromCodePoint(0x1F4E2)} *New Customer Inquiry*

${String.fromCodePoint(0x1F3E2)} Business Name: ${lead.name}

${String.fromCodePoint(0x1F4DE)} Contact Number: ${lead.phone}`;

const url = `https://api.whatsapp.com/send?phone=${data.salesmanPhone}&text=${encodeURIComponent(message)}`;
window.location.href = url;
});