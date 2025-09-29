document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.getElementById('station-table-body');
    const headers = document.querySelectorAll('.sortable-header');
    const dataSummaryFile = 'data_summary.json';

    let stationData = []; // We'll store the station data here so we can re-sort it without fetching again
    let sortKey = 'name';
    let sortDirection = 'asc';

    // Function to render the table with the current data
    function renderTable() {
        tableBody.innerHTML = ''; // Clear the table first

        // Update header styles to show current sort
        headers.forEach(header => {
            const key = header.getAttribute('data-sort-by');
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (key === sortKey) {
                header.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
            }
        });

        if (stationData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5">No station data found. Please run the data download and summary generation scripts.</td>`;
            tableBody.appendChild(row);
            return;
        }

        stationData.forEach(station => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                window.location.href = `station.html?data_file=${station.data_file}`;
            });

            row.innerHTML = `
                <td>${station.name}</td>
                <td>${station.id}</td>
                <td>${station.start_year}</td>
                <td>${station.end_year}</td>
                <td>${station.num_years}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // This is our main sorting logic!
    function sortData(newSortKey) {
        if (sortKey === newSortKey) {
            // If it's the same column, just flip the direction
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // If it's a new column, set it and default to ascending
            sortKey = newSortKey;
            sortDirection = 'asc';
        }

        stationData.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            // This handles both numbers and strings!
            let comparison = 0;
            if (valA > valB) {
                comparison = 1;
            } else if (valA < valB) {
                comparison = -1;
            }

            return sortDirection === 'asc' ? comparison : comparison * -1; // Reverse for descending
        });

        renderTable(); // Re-draw the table with the sorted data
    }

    // Add click listeners to all the headers
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.getAttribute('data-sort-by');
            sortData(key);
        });
    });

    // Initial fetch to get the data
    fetch(dataSummaryFile)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            stationData = data;
            sortData(sortKey); // Do an initial sort by name
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            tableBody.innerHTML = `<tr><td colspan="5" style="color: red;">Error loading data: ${error.message}.</td></tr>`;
        });
});
