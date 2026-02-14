document.addEventListener('DOMContentLoaded', () => {

    const stationNameEl = document.getElementById('station-name');
    const chartCanvas = document.getElementById('weather-chart');
    const customTooltip = document.getElementById('custom-tooltip');
    const dx70SummaryEl = document.getElementById('dx70-trend-summary');
    const dx90SummaryEl = document.getElementById('dx90-trend-summary');
    const stationMapImage = document.getElementById('station-map-image'); // For the map!

    // --- Helper function to calculate the trend line and return the slope ---
    function calculateTrendLine(dataPoints) {
        if (dataPoints.length < 2) return { slope: 0, trendPoints: [] };
        const n = dataPoints.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        dataPoints.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x; });
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const startX = dataPoints[0].x, endX = dataPoints[dataPoints.length - 1].x;
        const trendPoints = [{ x: startX, y: slope * startX + intercept }, { x: endX, y: slope * endX + intercept }];
        return { slope, trendPoints };
    }

    // --- Function to display the full sentence summary ---
    function displayTrendSummary(element, slope, tempThreshold) {
        if (Math.abs(slope) < 0.01) {
            element.textContent = `On average, the number of days with temperature above ${tempThreshold}° has remained stable.`;
            return;
        }
        const direction = slope > 0 ? "increases" : "decreases";
        const cssClass = slope > 0 ? "increase" : "decrease";
        const value = Math.abs(slope).toFixed(2);
        const sentence = `Every year, the number of days with temperature above ${tempThreshold}° ${direction} by ${value} days on average.`;
        element.innerHTML = `<span class="${cssClass}">${sentence}</span>`;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const dataFile = urlParams.get('data_file');
    const stationIdSuffix = dataFile ? dataFile.replace('GHCND_', '').replace('.json', '') : null;

    if (!dataFile) {
        stationNameEl.textContent = 'Error: No data file specified.';
        return;
    }
    
    fetch(dataFile)
        .then(response => response.ok ? response.json() : Promise.reject(`File not found: ${dataFile}`))
        .then(data => {
            if (data.length === 0) { stationNameEl.textContent = 'No data found in file.'; return; }
            
            fetch('data_summary.json').then(res => res.json()).then(summary => {
                const stationInfo = summary.find(s => s.id.split(':')[1] === stationIdSuffix);
                stationNameEl.textContent = stationInfo ? stationInfo.name : 'Unknown Station';

                // --- This is the new part to show the map! ---
                if (stationInfo && stationInfo.map_file) {
                    stationMapImage.src = `maps/${stationInfo.map_file}`;
                } else {
                    stationMapImage.alt = "Map image not found for this station."
                }
            });

            const dx70Points = [], dx90Points = [], yearDataMap = {};
            data.forEach(r => {
                const year = parseInt(r.date.substring(0, 4));
                if (!yearDataMap[year]) yearDataMap[year] = {};
                yearDataMap[year][r.datatype] = r.value;
            });
            Object.keys(yearDataMap).sort().forEach(yearStr => {
                const year = parseInt(yearStr);
                if (yearDataMap[year]['DX70'] != null) dx70Points.push({ x: year, y: yearDataMap[year]['DX70'] });
                if (yearDataMap[year]['DX90'] != null) dx90Points.push({ x: year, y: yearDataMap[year]['DX90'] });
            });
            
            const { slope: dx70Slope, trendPoints: dx70Trend } = calculateTrendLine(dx70Points);
            const { slope: dx90Slope, trendPoints: dx90Trend } = calculateTrendLine(dx90Points);
            
            displayTrendSummary(dx70SummaryEl, dx70Slope, 70);
            displayTrendSummary(dx90SummaryEl, dx90Slope, 90);
            
            new Chart(chartCanvas, {
                type: 'scatter', 
                data: { datasets: [
                    { label: 'Days with Max Temp > 70°F (DX70)', data: dx70Points, backgroundColor: 'rgba(255, 159, 64, 0.6)' },
                    { type: 'line', label: 'DX70 Trend', data: dx70Trend, borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 2, pointRadius: 0, fill: false },
                    { label: 'Days with Max Temp > 90°F (DX90)', data: dx90Points, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
                    { type: 'line', label: 'DX90 Trend', data: dx90Trend, borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 2, pointRadius: 0, fill: false }
                ]},
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Number of Days' } },
                        x: { 
                            type: 'linear', 
                            position: 'bottom', 
                            title: { display: true, text: 'Year' },
                            ticks: {
                                callback: function(value, index, ticks) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: { tooltip: { enabled: false, external: context => {
                        const { chart, tooltip } = context;
                        if (tooltip.opacity === 0) { customTooltip.style.opacity = 0; return; }
                        const point = tooltip.dataPoints[0];
                        if (point.dataset.label.includes('Trend')) { customTooltip.style.opacity = 0; return; }
                        const year = point.raw.x;
                        const value = point.raw.y;
                        const datasetLabel = point.dataset.label;
                        customTooltip.innerHTML = `<strong>${year}</strong><br>${datasetLabel.split('(')[0].trim()}: ${value} days`;
                        const { offsetLeft: chartLeft, offsetTop: chartTop } = chart.canvas;
                        customTooltip.style.opacity = 1;
                        customTooltip.style.left = `${chartLeft + tooltip.caretX}px`;
                        customTooltip.style.top = `${chartTop + tooltip.caretY}px`;
                    }}}
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            stationNameEl.textContent = `Error: ${error.message}`;
        });
});
