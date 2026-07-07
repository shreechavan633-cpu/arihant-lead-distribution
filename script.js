document.getElementById("leadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const lead = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        product: document.getElementById("product").value
    };

    const response = await fetch("http://localhost:3000/lead", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(lead)
    });

    const data = await response.json();

    const message =
`New Customer Enquiry

Name: ${lead.name}
Phone: ${lead.phone}
City: ${lead.city}
Product: ${lead.product}`;

    const url =
`https://wa.me/${data.salesmanPhone}?text=${encodeURIComponent(message)}`;

    window.location.href = url;
});