console.log('AFINN sentiment script starting...');
alert('External script is running!'); // Temporary test

// Check if already initialized
if (window.afinnInitialized) {
  console.log('Already initialized, skipping...');
} else {
  window.afinnInitialized = true;

  // Sample data for demonstration
  const sampleData = [
    {
      id: "sample1",
      url: "#",
      title: "Sample Post: Hong Kong News Discussion",
      positive: 15,
      negative: 8,
      neutral: 12
    },
    {
      id: "sample2", 
      url: "#",
      title: "Sample Post: Community Discussion",
      positive: 22,
      negative: 5,
      neutral: 18
    }
  ];

  function showSampleData() {
    console.log('Showing sample data...');
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
      loadingDiv.innerHTML = '<p><em>Note: Using sample data due to CORS restrictions. In a real implementation, this would show live Reddit data.</em></p>';
    }
    sampleData.forEach(item => showResult(item));
  }

  function showResult(jsonResult) {
    console.log('Showing result for:', jsonResult.title);
    
    let output = "<strong>" + jsonResult["title"] + "</strong>";    
    let out = output + "<p><a id=" + jsonResult["id"] + "_link> Click here</a> to view post in context.</p>";

    $(".result").append("<div class='shadow'>" + out + "<div id='" + jsonResult["id"] + "'></div></div>");
    $("#" + jsonResult["id"] + "_link").prop("href", jsonResult["url"]);
    $(".result").append("<p></p>");

    let id = jsonResult["id"];
    
    const data = {
      labels: ["Positive","Negative","Neutral"],
      datasets: [{
        name: "data",
        charType: "percentage",
        values: [
          jsonResult["positive"],
          jsonResult["negative"],
          jsonResult["neutral"]
        ]
      }]
    };

    try {
      const pos = document.getElementById(id);
      if (pos && typeof frappe !== 'undefined') {
        const chart = new frappe.Chart(pos, {
          data: data,
          type: 'percentage',
          colors: ['#33691e', '#b71c1c','#e8eaf6']
        });
        console.log('Chart created for:', id);
      } else {
        console.error('Chart container not found or frappe not loaded:', id);
      }
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  function initSentimentAnalysis() {
    console.log('Initializing sentiment analysis...');
    
    // Check if we have the required elements
    const loadingDiv = document.getElementById('loading');
    if (!loadingDiv) {
      console.error('Loading div not found');
      return;
    }
    
    // Check libraries
    if (typeof $ === 'undefined') {
      console.error('jQuery not loaded');
      loadingDiv.innerHTML = 'Error: jQuery not loaded';
      return;
    }
    
    if (typeof frappe === 'undefined') {
      console.error('Frappe Charts not loaded');
      loadingDiv.innerHTML = 'Error: Frappe Charts not loaded';
      return;
    }
    
    if (typeof afinn === 'undefined') {
      console.error('AFINN lexicon not loaded');
      loadingDiv.innerHTML = 'Error: AFINN lexicon not loaded';
      return;
    }
    
    console.log('All libraries loaded successfully');
    
    // Show sample data immediately
    showSampleData();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSentimentAnalysis);
  } else {
    initSentimentAnalysis();
  }

  // Also try after a short delay
  setTimeout(initSentimentAnalysis, 1000);
} 