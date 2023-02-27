// Method for when button is pressed a small pop up image is displayed
function showImage(path) {
    const imageUrl = '/images/' + path;
    const image = document.getElementById('popupImage');
    image.src = imageUrl;
    const popup = document.querySelector('.popup');
    popup.style.display = 'block';
};
  
// Filters the table
function filterTable(filter) {
    var rows = document.getElementsByClassName("data-row");
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var containsAnimal = row.cells[2].innerHTML;
        var labels = row.cells[3].innerHTML;
        if ((filter === "Invalid Labels" && labels == "false") ||
            (filter === "Most Common Animal" && animal === "true") ||
            (filter === "No Animal" && containsAnimal === "false")) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    }
};

// Generates the bar chart for most common animal
// function createChart(labels, data) {
//     const canvas = document.getElementById('mostCommonChart');
//     const ctx = canvas.getContext('2d');
//     const backgroundColour = [];
  
//     data.forEach((element) => {
//         const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//         gradient.addColorStop(0, `rgba(100, 223, 223)`);
//         gradient.addColorStop(1, `rgba(94, 96, 206)`);
//         backgroundColour.push(gradient);
//     });
  
//     try {
//         // Chart creation code
//         const chart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'label detections',
//                     data: data,
//                     borderWidth: 1,
//                     backgroundColor: backgroundColour
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
//     } catch (error) {
//         // Log any errors that occur
//         console.error('Error creating chart:', error);
//     }
// };
  