const trainingRecords = {
  'modern-rice-production': {
    title: 'Modern Rice Production',
    type: 'Crop Production',
    date: 'May 22–24, 2025',
    location: 'Los Baños, Laguna',
    status: 'Completed',
    preTest: '68.00%',
    postTest: '86.00%',
    rating: '4.50 / 5',
  },
  'organic-vegetable-production': {
    title: 'Organic Vegetable Production',
    type: 'Organic Agriculture',
    date: 'May 27–29, 2025',
    location: 'Benguet State Univ.',
    status: 'Completed',
    preTest: '72.00%',
    postTest: '88.00%',
    rating: '4.20 / 5',
  },
  'farm-business-management': {
    title: 'Farm Business Management',
    type: 'Agribusiness',
    date: 'June 3–5, 2025',
    location: 'DA RFO VI, Iloilo',
    status: 'Completed',
    preTest: '60.00%',
    postTest: '82.00%',
    rating: '4.00 / 5',
  },
  'farm-moe-production': {
    title: 'Farm MOE Production',
    type: 'Organic Agriculture',
    date: 'May 22–24, 2025',
    location: 'Los Baños, Laguna',
    status: 'Completed',
    preTest: '60.00%',
    postTest: '85.00%',
    rating: '4.60 / 5',
  },
  'farm-business-production': {
    title: 'Farm Business Production',
    type: 'Crop Production',
    date: 'June 10–12, 2025',
    location: 'DA RFO VI, Iloilo',
    status: 'Completed',
    preTest: '68.00%',
    postTest: '85.00%',
    rating: '4.50 / 5',
  },
  'modern-rice-production-climate': {
    title: 'Modern Rice Production',
    type: 'Climate Smart',
    date: 'May 9–12, 2025',
    location: 'Isabela State Univ.',
    status: 'Completed',
    preTest: '70.00%',
    postTest: '85.00%',
    rating: '4.80 / 5',
  },
  'climate-smart-agriculture': {
    title: 'Climate Smart Agriculture',
    type: 'Climate Smart Agriculture',
    date: 'June 10–12, 2025',
    location: 'Isabela State Univ.',
    status: 'Ongoing',
    preTest: '—',
    postTest: '—',
    rating: '—',
  },
  'soil-health-nutrient-management': {
    title: 'Soil Health and Nutrient Management',
    type: 'Crop Production',
    date: 'June 18–20, 2025',
    location: 'Quezon Province',
    status: 'Completed',
    preTest: '75.00%',
    postTest: '90.00%',
    rating: '4.60 / 5',
  },
  'efficient-water-management': {
    title: 'Efficient Water Management',
    type: 'Farm Technology',
    date: 'July 2–4, 2025',
    location: 'Lucban, Quezon',
    status: 'Completed',
    preTest: '70.00%',
    postTest: '84.00%',
    rating: '4.30 / 5',
  },
  'agricultural-financial-literacy': {
    title: 'Agricultural Financial Literacy',
    type: 'Agribusiness',
    date: 'July 15–17, 2025',
    location: 'Sariaya, Quezon',
    status: 'Completed',
    preTest: '66.00%',
    postTest: '85.00%',
    rating: '4.10 / 5',
  },
  'postharvest-handling-storage': {
    title: 'Postharvest Handling and Storage',
    type: 'Postharvest',
    date: 'August 5–7, 2025',
    location: 'Quezon City',
    status: 'Completed',
    preTest: '71.00%',
    postTest: '89.00%',
    rating: '4.50 / 5',
  },
  'integrated-pest-management': {
    title: 'Integrated Pest Management',
    type: 'Crop Production',
    date: 'August 20–22, 2025',
    location: 'Alabat, Quezon',
    status: 'Completed',
    preTest: '74.00%',
    postTest: '91.00%',
    rating: '4.70 / 5',
  },
  'farmers-market-linkage': {
    title: "Farmers' Market Linkage Workshop",
    type: 'Market Development',
    date: 'September 2–4, 2025',
    location: 'Lucena City',
    status: 'Completed',
    preTest: '69.00%',
    postTest: '87.00%',
    rating: '4.40 / 5',
  },
};

const trainingId = new URLSearchParams(window.location.search).get('trainingId');
const training = trainingId ? trainingRecords[trainingId] : null;
const details = document.getElementById('trainingDetails');
const notFound = document.getElementById('trainingNotFound');

if (!training) {
  notFound.hidden = false;
} else {
  document.title = `${training.title} | DA-TMIS`;
  document.getElementById('trainingTitle').textContent = training.title;
  document.getElementById('trainingType').textContent = training.type;
  document.getElementById('trainingStatus').textContent = training.status;
  document.getElementById('trainingDate').textContent = training.date;
  document.getElementById('trainingLocation').textContent = training.location;
  document.getElementById('trainingRecordStatus').textContent = training.status;
  document.getElementById('trainingPreTest').textContent = training.preTest;
  document.getElementById('trainingPostTest').textContent = training.postTest;
  document.getElementById('trainingRating').textContent = training.rating;
  details.hidden = false;
}
