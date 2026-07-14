async function loadLeads() {
    const response = await fetch("/admin/leads");
    const leads = await response.json();

    // Newest leads first
    leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const searchText = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filteredLeads = leads.filter(lead =>
        String(lead.name || "").toLowerCase().includes(searchText) ||
        String(lead.phone || "").includes(searchText)
    );

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    let todayCount = 0;
    let yesterdayCount = 0;
    let monthCount = 0;
    let pendingCount = 0;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Calculate stats using ALL leads
    leads.forEach(lead => {
        const leadDate = new Date(lead.created_at);

        if (leadDate.toDateString() === today.toDateString()) {
            todayCount++;
        }

        if (leadDate.toDateString() === yesterday.toDateString()) {
            yesterdayCount++;
        }

        if (
            leadDate.getMonth() === today.getMonth() &&
            leadDate.getFullYear() === today.getFullYear()
        ) {
            monthCount++;
        }

        if (!lead.assigned_to) {
            pendingCount++;
        }
    });

    // Show only filtered leads
    filteredLeads.forEach(lead => {
        const row = `
        <tr>
            <td>${lead.name || "-"}</td>
            <td>${lead.phone || "-"}</td>
            <td>${lead.assigned_to || "-"}</td>
            <td>${new Date(lead.created_at).toLocaleString()}</td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });

    document.getElementById("todayCount").innerText = todayCount;
    document.getElementById("yesterdayCount").innerText = yesterdayCount;
    document.getElementById("monthCount").innerText = monthCount;
    document.getElementById("totalCount").innerText = leads.length;
    document.getElementById("pendingCount").innerText = pendingCount;
}

loadLeads();

document
    .getElementById("searchInput")
    .addEventListener("input", loadLeads);

document
    .getElementById("refreshBtn")
    .addEventListener("click", loadLeads);

setInterval(loadLeads, 5000);