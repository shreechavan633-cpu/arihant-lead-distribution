async function loadLeads() {

    const response = await fetch("/admin/leads");

    const leads = await response.json();

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    leads.forEach((lead) => {

        const row = `
            <tr>
                <td>${lead.name}</td>
                <td>${lead.phone}</td>
                <td>${new Date(lead.created_at).toLocaleString()}</td>
            </tr>
        `;

        tableBody.innerHTML += row;

    });

}

loadLeads();