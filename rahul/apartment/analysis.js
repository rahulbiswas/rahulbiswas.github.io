const listings = [
    { label: "3BHK · 1050 sqft · Floor 4/4", area: 1050, price: 78 },
    { label: "3BHK · 800 sqft · Floor 4/4", area: 800, price: 76 },
    { label: "3BHK · 1450 sqft · Floor 3/4", area: 1450, price: 100 },
    { label: "2BHK · 560 sqft · Ground floor", area: 560, price: 32 },
    { label: "3BHK · 1250 sqft · Floor 4/4", area: 1250, price: 85 },
    { label: "3BHK · 1000 sqft · Floor 1/4", area: 1000, price: 71 },
    { label: "2BHK · 510 sqft · Floor 4/4", area: 510, price: 35 },
    { label: "2BHK · 600 sqft · Ground floor", area: 600, price: 33 },
    { label: "2BHK · 555 sqft · Floor 3/3", area: 555, price: 30 },
    { label: "3BHK · 1000 sqft · Floor 1/4", area: 1000, price: 75 }
];

const YOUR_AREA = 1560;
const USD_RATE = 0.012;

function linearRegression(data) {
    const n = data.length;
    const sumX = data.reduce((acc, d) => acc + d.area, 0);
    const sumY = data.reduce((acc, d) => acc + d.price, 0);
    const sumXY = data.reduce((acc, d) => acc + d.area * d.price, 0);
    const sumXX = data.reduce((acc, d) => acc + d.area * d.area, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}

const { slope, intercept } = linearRegression(listings);

const predictedPrice = slope * YOUR_AREA + intercept;
const discountedLow = predictedPrice * 0.80;
const discountedHigh = predictedPrice * 0.85;

document.getElementById("predicted-price").textContent =
    `₹${predictedPrice.toFixed(1)} lac (~₹${(predictedPrice / 100).toFixed(2)} crore)`;

document.getElementById("predicted-usd").textContent =
    `~$${(predictedPrice * 100000 * USD_RATE / 1000).toFixed(0)}K USD`;

document.getElementById("discounted-price").textContent =
    `₹${discountedLow.toFixed(1)}–${discountedHigh.toFixed(1)} lac (~$${(discountedLow * 100000 * USD_RATE / 1000).toFixed(0)}K–$${(discountedHigh * 100000 * USD_RATE / 1000).toFixed(0)}K USD)`;

const minArea = Math.min(...listings.map(d => d.area));
const maxArea = Math.max(...listings.map(d => d.area));

const regressionPoints = [
    { x: minArea, y: slope * minArea + intercept },
    { x: maxArea, y: slope * maxArea + intercept },
    { x: YOUR_AREA, y: predictedPrice }
];

const ctx = document.getElementById("myChart").getContext("2d");

new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [
            {
                label: "Active Listings",
                data: listings.map(d => ({ x: d.area, y: d.price, label: d.label })),
                backgroundColor: "rgba(99, 132, 255, 0.7)",
                pointRadius: 7,
                pointHoverRadius: 9
            },
            {
                label: "Regression Line",
                data: [
                    { x: regressionPoints[0].x, y: regressionPoints[0].y },
                    { x: regressionPoints[1].x, y: regressionPoints[1].y }
                ],
                type: "line",
                borderColor: "rgba(99, 132, 255, 0.4)",
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0
            },
            {
                label: "Your Apartment (1560 sqft)",
                data: [{ x: YOUR_AREA, y: predictedPrice }],
                backgroundColor: "rgba(230, 57, 70, 0.9)",
                pointRadius: 12,
                pointHoverRadius: 14,
                pointStyle: "star"
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 0) {
                            const raw = context.raw;
                            const listing = listings.find(d => d.area === raw.x && d.price === raw.y);
                            return listing
                                ? [`${listing.label}`, `₹${raw.y} lac`]
                                : `₹${raw.y} lac`;
                        }
                        if (context.datasetIndex === 2) {
                            return `Predicted: ₹${predictedPrice.toFixed(1)} lac`;
                        }
                        return null;
                    }
                }
            },
            legend: {
                position: "top"
            },
            title: {
                display: true,
                text: "Price (₹ lac) vs Area (sqft) — Calcutta Greens Listings",
                font: { size: 15 }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Area (sqft)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Price (₹ lac)"
                }
            }
        }
    }
});
