document.addEventListener('DOMContentLoaded', function () {
  // ============================================================
  // MOBILE NAVIGATION CONFIGURATION
  // ============================================================
  const mobileMainCollapses = {
    participantMobile: [
      'createParticipantMobile',
      'updateParticipantMobile',
      'detailsParticipantMobile',
    ],
    trainingMobile: [
      'createTrainingMobile',
      'updateTrainingMobile',
      'detailsTrainingMobile',
    ],
    evaluationMobile: [
      'createEvaluationMobile',
      'encodeEvaluationMobile',
      'updateEvaluationMobile',
      'detailsEvaluationMobile',
    ],
    administrationMobile: [
      'createAdministrationMobile',
      'updateAdministrationMobile',
      'detailsAdministrationMobile',
    ],
  };

  // ============================================================
  // DESKTOP HEADER NAVIGATION CONFIGURATION
  // ============================================================
  const headerMainCollapses = {
    participantHeaderCollapse: [
      'createParticipantHeaderCollapse',
      'updateParticipantHeaderCollapse',
      'detailsParticipantHeaderCollapse',
    ],
    trainingHeaderCollapse: [
      'createTrainingHeaderCollapse',
      'updateTrainingHeaderCollapse',
      'detailsTrainingHeaderCollapse',
    ],
    evaluationHeaderCollapse: [
      'createEvaluationHeaderCollapse',
      'encodeEvaluationHeaderCollapse',
      'updateEvaluationHeaderCollapse',
      'detailsEvaluationHeaderCollapse',
    ],
    administrationHeaderCollapse: [
      'createAdministrationHeaderCollapse',
      'updateAdministrationHeaderCollapse',
      'detailsAdministrationHeaderCollapse',
    ],
  };

  // ============================================================
  // TOTAL TRAININGS CHART DATA
  // Change the values below when connecting the chart to the database.
  // Each array follows the month order from January through December.
  // ============================================================
  const trainingMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const trainingByMunicipality = {
    Tingloy: {
      2026: [3, 4, 2, 5, 4, 6, 5, 7, 6, 8, 7, 9],
      2025: [2, 3, 3, 4, 3, 5, 4, 5, 5, 6, 6, 7],
    },
    Pakil: {
      2026: [4, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10],
      2025: [3, 4, 3, 5, 4, 6, 5, 6, 6, 7, 7, 8],
    },
    'Rizal (Laguna)': {
      2026: [2, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9],
      2025: [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7],
    },
    Alabat: {
      2026: [5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10, 9],
      2025: [4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 8, 8],
    },
    Perez: {
      2026: [3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7],
      2025: [2, 2, 3, 2, 4, 3, 5, 4, 6, 5, 6, 6],
    },
    'Quezon (Quezon)': {
      2026: [6, 7, 5, 8, 7, 9, 8, 10, 9, 11, 10, 12],
      2025: [5, 6, 4, 7, 6, 8, 7, 8, 8, 9, 9, 10],
    },
    Patnanungan: {
      2026: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8],
      2025: [1, 2, 2, 3, 2, 4, 3, 4, 4, 5, 5, 6],
    },
    Jomalig: {
      2026: [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7],
      2025: [1, 1, 1, 2, 2, 3, 2, 4, 3, 5, 4, 5],
    },
  };

  // Municipality names are used to calculate totals and build the tooltip.
  const municipalityNames = Object.keys(trainingByMunicipality);

  // Chart mount element from dashboardv2.html.
  const totalTrainingChart = document.querySelector('#totalTrainingChart');

  if (totalTrainingChart && typeof ApexCharts !== 'undefined') {
    // Add all municipality values together to create one total per month.
    const yearlyTotals = [2026, 2025].map((year) =>
      trainingMonths.map((month, monthIndex) =>
        municipalityNames.reduce(
          (total, municipality) =>
            total + trainingByMunicipality[municipality][year][monthIndex],
          0,
        ),
      ),
    );

    // ============================================================
    // APEXCHARTS CONFIGURATION: TOTAL TRAININGS
    // ============================================================
    const chart = new ApexCharts(totalTrainingChart, {
      chart: {
        // Area chart with smooth lines and responsive parent resizing.
        type: 'area',
        height: 270,
        width: '100%',
        toolbar: { show: false },
        zoom: { enabled: false },
        parentHeightOffset: 0,
        redrawOnParentResize: true,
        fontFamily: 'Inter, sans-serif',
      },
      series: [
        // These are the two lines shown in the chart legend.
        { name: '2026', data: yearlyTotals[0] },
        { name: '2025', data: yearlyTotals[1] },
      ],
      // Green represents the current year; blue represents the previous year.
      colors: ['#2e7D32', '#1976D2'],
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
      markers: { size: 3, strokeWidth: 0, hover: { size: 5 } },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
        padding: { top: 4, right: 8, bottom: 0, left: 8 },
      },
      xaxis: {
        // Month labels shown along the bottom of the chart.
        categories: trainingMonths,
        labels: {
          style: { colors: '#607068', fontSize: '11px' },
          trim: false,
        },
        axisBorder: { color: '#e0e0e0' },
        axisTicks: { color: '#e0e0e0' },
      },
      yaxis: {
        // Training session totals shown on the left side of the chart.
        min: 0,
        forceNiceScale: true,
        labels: {
          style: { colors: '#607068', fontSize: '11px' },
          formatter: (value) => Math.round(value),
        },
        title: {
          text: 'Sessions',
          style: { color: '#607068', fontSize: '11px', fontWeight: 500 },
        },
      },
      legend: {
        // Year labels shown above the chart.
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#263238' },
        markers: { width: 8, height: 8, radius: 8 },
        itemMargin: { horizontal: 8 },
      },
      tooltip: {
        // Track the nearest month without requiring an exact point intersection.
        shared: false,
        intersect: false,
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const year = Number(w.config.series[seriesIndex].name);
          const seriesColor = w.globals.colors[seriesIndex];
          const totalTrainings = municipalityNames.reduce(
            (total, municipality) =>
              total + trainingByMunicipality[municipality][year][dataPointIndex],
            0,
          );
          const municipalityRows = municipalityNames
            .map(
              (municipality) =>
                `<div class="apexcharts-tooltip-row"><span>${municipality}</span><strong>${trainingByMunicipality[municipality][year][dataPointIndex]}</strong></div>`,
            )
            .join('');

          return `<div class="apexcharts-tooltip-custom" style="--tooltip-series-color: ${seriesColor};"><div class="apexcharts-tooltip-heading"><strong>${trainingMonths[dataPointIndex]} ${year}</strong></div><div class="apexcharts-tooltip-total"><span>Total trainings</span><strong>${totalTrainings}</strong></div><div class="apexcharts-tooltip-section-title">Municipality details</div>${municipalityRows}</div>`;
        },
      },
      responsive: [
        {
          // Smaller chart layout for Bootstrap/mobile viewport sizes.
          breakpoint: 576,
          options: {
            chart: { height: 220 },
            legend: { position: 'bottom' },
                  xaxis: {
                    labels: { rotate: -45, style: { fontSize: '10px' } },
                  },
                  yaxis: {
                    labels: { show: false },
                    title: { text: undefined },
                  },
          },
        },
      ],
    });

    // Render the chart inside #totalTrainingChart.
    chart.render();
  }

  // ============================================================
  // SHARED NAVIGATION COLLAPSE HELPER
  // ============================================================
  // Closes nested menu items when another menu is opened.
  function closeAllNestedCollapses(nestedIds) {
    nestedIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(element, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    });
  }

  // ============================================================
  // MOBILE NAVIGATION EVENTS
  // ============================================================
  Object.entries(mobileMainCollapses).forEach(([mainId, nestedIds]) => {
    const mainElement = document.getElementById(mainId);
    if (mainElement) {
      mainElement.addEventListener('show.bs.collapse', function () {
        // Close all other main collapses and their nested items
        Object.entries(mobileMainCollapses).forEach(
          ([otherId, otherNestedIds]) => {
            if (otherId !== mainId) {
              const otherElement = document.getElementById(otherId);
              if (otherElement && otherElement.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(otherElement, {
                  toggle: false,
                });
                bsCollapse.hide();
              }
              closeAllNestedCollapses(otherNestedIds);
            }
          },
        );
      });
    }

    // Close sibling mobile submenu items when one submenu opens.
    nestedIds.forEach((nestedId) => {
      const nestedElement = document.getElementById(nestedId);
      if (nestedElement) {
        nestedElement.addEventListener('show.bs.collapse', function () {
          // Close all sibling nested collapses
          nestedIds.forEach((otherId) => {
            if (otherId !== nestedId) {
              const otherElement = document.getElementById(otherId);
              if (otherElement && otherElement.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(otherElement, {
                  toggle: false,
                });
                bsCollapse.hide();
              }
            }
          });
        });
      }
    });
  });

  // ============================================================
  // DESKTOP HEADER NAVIGATION EVENTS
  // ============================================================
  Object.entries(headerMainCollapses).forEach(([mainId, nestedIds]) => {
    const mainElement = document.getElementById(mainId);
    if (mainElement) {
      mainElement.addEventListener('show.bs.collapse', function () {
        // Close all other main collapses and their nested items
        Object.entries(headerMainCollapses).forEach(
          ([otherId, otherNestedIds]) => {
            if (otherId !== mainId) {
              const otherElement = document.getElementById(otherId);
              if (otherElement && otherElement.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(otherElement, {
                  toggle: false,
                });
                bsCollapse.hide();
              }
              closeAllNestedCollapses(otherNestedIds);
            }
          },
        );
      });
    }

    // Close sibling header submenu items when one submenu opens.
    nestedIds.forEach((nestedId) => {
      const nestedElement = document.getElementById(nestedId);
      if (nestedElement) {
        nestedElement.addEventListener('show.bs.collapse', function () {
          // Close all sibling nested collapses
          nestedIds.forEach((otherId) => {
            if (otherId !== nestedId) {
              const otherElement = document.getElementById(otherId);
              if (otherElement && otherElement.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(otherElement, {
                  toggle: false,
                });
                bsCollapse.hide();
              }
            }
          });
        });
      }
    });
  });
});
