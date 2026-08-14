// ==========================================================================
// Cyber Jagruti — Intelligence Dashboard Engine & Interactive Logic
// Architecture: Precision Data Pipeline & ISRO Bhuvan Spatial Risk Engine
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  let dashboardData = null;
  let chartTrend = null;
  let chartPie = null;
  let mapInstance = null;
  let geoJsonLayer = null;
  let pinMarkersGroup = null;
  let currentSort = "loss";

  // Executive Theme Engine (Default: Light Mode)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  const savedTheme = localStorage.getItem("india_cyber_theme");
  if (savedTheme === "dark") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
      if (dashboardData) {
        renderTrendChart(dashboardData.yearly_trends);
        renderFraudPieChart(dashboardData.fraud_breakdown);
      }
    });
  }

  function enableDarkMode() {
    document.body.classList.add("dark-mode");
    localStorage.setItem("india_cyber_theme", "dark");
    if (themeIcon) themeIcon.className = "fa-solid fa-sun text-zinc-300 text-xs";
    if (themeText) themeText.innerText = "Light";
  }

  function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("india_cyber_theme", "light");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon text-zinc-600 text-xs";
    if (themeText) themeText.innerText = "Dark";
  }

  // Segmented Navigation & GSAP Layout Transitions
  const switchTab = (target) => {
    const segBtns = document.querySelectorAll(".segmented-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    segBtns.forEach(b => {
      if (b.getAttribute("data-tab") === target) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    tabPanels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(`tab-${target}`);
    if (activePanel) {
      activePanel.classList.add("active");

      // GSAP Purposeful Reveal Transition
      if (window.gsap) {
        gsap.fromTo(
          activePanel,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
        );
      }

      if (target === "map" && mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 150);
      }
      if (target === "overview") {
        animateCounters();
      }
    }
  };

  document.querySelectorAll(".segmented-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchTab(target);
    });
  });

  document.querySelectorAll("[data-target-tab], .nav-footer-link").forEach(elem => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const target = elem.getAttribute("data-target-tab") || elem.getAttribute("data-tab");
      if (target) {
        switchTab(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll("#print-ceo-report-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.print();
    });
  });

  // Fetch JSON Payload
  fetch("intelligence_dashboard_data.json")
    .then(res => res.json())
    .then(data => {
      dashboardData = data;
      initDashboard(data);
    })
    .catch(err => {
      console.error("Failed to load intelligence_dashboard_data.json:", err);
    });

  function initDashboard(data) {
    animateCounters();
    renderTrendChart(data.yearly_trends);
    renderFraudPieChart(data.fraud_breakdown);
    initBhuvanISROMapOnly(data.states);
    renderSectorCards();
    renderLandmarkIncidents(data.incidents);
    renderFraudTaxonomy(data.fraud_breakdown);
    renderTimelineMilestones(data.timeline);
    renderMitreMatrix(data.mitre);
    renderRepositoryGrid(data.incidents);
    setupSearchAndFilters();
    setupStateSorting(data.states);
  }

  // Precision Metric Counters (GSAP)
  function animateCounters() {
    if (!window.gsap) return;
    document.querySelectorAll(".count-up").forEach(elem => {
      const targetVal = parseFloat(elem.getAttribute("data-target") || "0");
      gsap.to(elem, {
        innerText: targetVal,
        duration: 1.2,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          elem.innerText = Math.floor(elem.innerText).toLocaleString();
        }
      });
    });
  }

  // Analytical Dual-Axis Trend Chart (Chart.js)
  function renderTrendChart(trends) {
    const ctx = document.getElementById("trendChart")?.getContext("2d");
    if (!ctx || !trends || trends.length === 0) return;

    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#FAFAFA" : "#09090B";
    const mutedColor = isDark ? "#A1A1AA" : "#71717A";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    const labels = trends.map(t => t.year === 2026 ? "2026 YTD" : t.year);
    const complaints = trends.map(t => t.ncrp / 100000);
    const losses = trends.map(t => t.loss_cr);

    if (chartTrend) chartTrend.destroy();

    chartTrend = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Reported Loss (INR Cr)",
            data: losses,
            backgroundColor: isDark ? "#3B82F6" : "#18181B",
            borderRadius: 4,
            barThickness: 20,
            yAxisID: "yLoss"
          },
          {
            label: "NCRP Complaints (Lakhs)",
            data: complaints,
            type: "line",
            borderColor: "#DC2626",
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: "#DC2626",
            fill: true,
            tension: 0.2,
            yAxisID: "yComplaints"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: { color: textColor, font: { family: "Geist", size: 11, weight: "500" }, usePointStyle: true, boxWidth: 6 }
          },
          tooltip: {
            backgroundColor: isDark ? "#18181B" : "#FFFFFF",
            titleColor: isDark ? "#FAFAFA" : "#09090B",
            bodyColor: isDark ? "#D4D4D8" : "#52525B",
            borderColor: isDark ? "#27272A" : "#E4E4E7",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            bodyFont: { family: "Geist Mono", size: 11 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: mutedColor, font: { family: "Geist Mono", size: 11 } }
          },
          yLoss: {
            type: "linear",
            position: "left",
            grid: { color: gridColor },
            title: { display: true, text: "Loss (INR Cr)", color: mutedColor, font: { family: "Geist", size: 11, weight: "500" } },
            ticks: { color: mutedColor, font: { family: "Geist Mono", size: 11 }, callback: v => `₹${v}` }
          },
          yComplaints: {
            type: "linear",
            position: "right",
            grid: { display: false },
            title: { display: true, text: "Complaints (Lakhs)", color: mutedColor, font: { family: "Geist", size: 11, weight: "500" } },
            ticks: { color: mutedColor, font: { family: "Geist Mono", size: 11 }, callback: v => `${v}L` }
          }
        }
      }
    });
  }

  // Fraud Distribution Doughnut Chart
  function renderFraudPieChart(fraudData) {
    const ctx = document.getElementById("fraudPieChart")?.getContext("2d");
    if (!ctx || !fraudData || fraudData.length === 0) return;

    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#FAFAFA" : "#09090B";

    const labels = fraudData.map(f => f.category);
    const losses = fraudData.map(f => f.loss_cr);

    if (chartPie) chartPie.destroy();

    chartPie = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: losses,
          backgroundColor: ["#2563EB", "#DC2626", "#D97706", "#059669", "#7C3AED", "#0891B2", "#475569"],
          borderWidth: 1.5,
          borderColor: isDark ? "#18181B" : "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { family: "Geist", size: 10, weight: "500" }, boxWidth: 8, padding: 6 }
          },
          tooltip: {
            backgroundColor: isDark ? "#18181B" : "#FFFFFF",
            titleColor: isDark ? "#FAFAFA" : "#09090B",
            bodyColor: isDark ? "#D4D4D8" : "#52525B",
            borderColor: isDark ? "#27272A" : "#E4E4E7",
            borderWidth: 1,
            padding: 8,
            cornerRadius: 6,
            bodyFont: { family: "Geist Mono", size: 11 },
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ₹${context.raw.toLocaleString()} Cr`;
              }
            }
          }
        },
        cutout: "68%"
      }
    });
  }

  // ISRO Bhuvan Spatial Risk Engine
  function initBhuvanISROMapOnly(states) {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const indiaBounds = L.latLngBounds(L.latLng(6.0, 68.0), L.latLng(37.5, 97.5));

    if (!mapInstance) {
      mapInstance = L.map("map", {
        center: [22.5937, 78.9629],
        zoom: 5,
        minZoom: 5,
        maxZoom: 8,
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: 'ISRO Bhuvan Geo-Spatial Reference',
        bounds: indiaBounds,
        maxZoom: 8,
        minZoom: 5
      }).addTo(mapInstance);
    }

    renderBhuvanStateChoropleth(states);
    renderPinpointLocations();
  }

  function renderPinpointLocations() {
    if (pinMarkersGroup && mapInstance) {
      mapInstance.removeLayer(pinMarkersGroup);
    }

    pinMarkersGroup = L.layerGroup().addTo(mapInstance);

    const pinpointHubs = [
      { name: "Mumbai (Financial Hub)", coords: [19.0760, 72.8777], type: "Critical Extortion & Banking Target", loss: "₹10,450 Cr", threat: "Digital Arrest & Corporate Ransomware", icon: "fa-building-columns" },
      { name: "Hyderabad (Cyberabad)", coords: [17.3850, 78.4867], type: "Investment Fraud & Crypto Hub", loss: "₹7,800 Cr", threat: "Task Scams & High-Return Investment Fraud", icon: "fa-microchip" },
      { name: "Bengaluru (Tech Hub)", coords: [12.9716, 77.5946], type: "AI Deepfake & Cloud Breach Hub", loss: "₹7,200 Cr", threat: "AI Deepfake Voice Cloning & Active Directory Leaks", icon: "fa-robot" },
      { name: "New Delhi (National Capital)", coords: [28.6139, 77.2090], type: "Govt & Critical Health Target", loss: "₹6,100 Cr", threat: "AIIMS Ransomware & Ministry Phishing", icon: "fa-landmark" },
      { name: "Mewat / Nuh Syndicate Hub", coords: [28.1000, 77.0000], type: "QR Spoofing & Sextortion Ring", loss: "₹3,400 Cr", threat: "Mewat QR Code & OLX Fraud Ring", icon: "fa-crosshairs" },
      { name: "Jamtara Origin Hub", coords: [23.9622, 86.8021], type: "Vishing & Banking OTP Origin Hub", loss: "₹1,850 Cr", threat: "Phishing & Fake Customer Helpline", icon: "fa-phone-slash" },
      { name: "Nawada Fake Loan Ring", coords: [24.8872, 85.5441], type: "Biometric & Loan App Ring", loss: "₹1,150 Cr", threat: "AEPS Biometric Stencil Fraud", icon: "fa-fingerprint" }
    ];

    pinpointHubs.forEach(hub => {
      const pinHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-5 h-5 rounded bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold border border-white shadow-sm hover:scale-110 transition">
            <i class="fa-solid ${hub.icon}"></i>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-pinpoint-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(hub.coords, { icon: customIcon }).addTo(pinMarkersGroup);

      marker.bindPopup(`
        <div class="p-3 space-y-1.5 font-sans">
          <div class="text-[10px] font-mono font-bold text-zinc-500 uppercase">ISRO Bhuvan Spatial Node</div>
          <div class="font-bold text-xs text-zinc-900">${hub.name}</div>
          <div class="text-xs text-zinc-600">Category: <strong>${hub.type}</strong></div>
          <div class="text-xs text-blue-600 font-mono font-bold">Reported Loss: ${hub.loss}</div>
          <div class="text-[11px] text-zinc-500 italic">Threat: ${hub.threat}</div>
        </div>
      `);
    });
  }

  function updateSelectedStateCard(stData) {
    if (!stData) return;
    const nameElem = document.getElementById("selected-state-name");
    const threatElem = document.getElementById("selected-state-threat");
    const compElem = document.getElementById("selected-state-complaints");
    const lossElem = document.getElementById("selected-state-loss");
    const savedElem = document.getElementById("selected-state-saved");
    const vulnElem = document.getElementById("selected-state-vuln");

    if (nameElem) nameElem.innerText = stData.name;
    if (threatElem) threatElem.innerText = `Primary Threat: ${stData.threat || "Cyber Phishing & Vishing"}`;
    if (compElem) compElem.innerText = (stData.complaints || 0).toLocaleString();
    if (lossElem) lossElem.innerText = `₹${(stData.loss_cr || 0).toLocaleString()} Cr`;
    if (savedElem) savedElem.innerText = `₹${(stData.saved_cr || 0).toLocaleString()} Cr`;
    if (vulnElem) vulnElem.innerText = `${stData.vulnerability_idx || 50} / 100`;
  }

  function renderBhuvanStateChoropleth(states) {
    if (geoJsonLayer && mapInstance) {
      mapInstance.removeLayer(geoJsonLayer);
    }

    if (currentSort === "loss") {
      states.sort((a, b) => b.loss_cr - a.loss_cr);
    } else if (currentSort === "complaints") {
      states.sort((a, b) => b.complaints - a.complaints);
    } else if (currentSort === "vulnerability") {
      states.sort((a, b) => b.vulnerability_idx - a.vulnerability_idx);
    }

    const stateMap = {};
    states.forEach(st => stateMap[st.name] = st);

    if (states.length > 0) {
      updateSelectedStateCard(states[0]);
    }

    if (window.indiaGeoJSON) {
      geoJsonLayer = L.geoJSON(window.indiaGeoJSON, {
        style: function(feature) {
          const stName = feature.properties.name;
          const stData = stateMap[stName] || feature.properties;
          const vuln = stData.vulnerability_idx || 55;

          const fillColor = vuln >= 88 ? '#991B1B' :
                          vuln >= 80 ? '#DC2626' :
                          vuln >= 70 ? '#EA580C' :
                          vuln >= 60 ? '#D97706' : '#059669';

          return {
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            color: '#FFFFFF',
            fillOpacity: 0.6
          };
        },
        onEachFeature: function(feature, layer) {
          const stName = feature.properties.name;
          const stData = stateMap[stName] || feature.properties;

          layer.bindTooltip(`
            <div class="font-sans text-xs">
              <div class="font-bold text-zinc-900">${stName}</div>
              <div class="font-mono text-zinc-600 mt-0.5">Complaints: ${(stData.complaints || 45000).toLocaleString()}</div>
              <div class="font-mono text-zinc-900 font-semibold">Loss: ₹${(stData.loss_cr || 280.0).toLocaleString()} Cr</div>
            </div>
          `, { sticky: true });

          layer.on({
            mouseover: function(e) {
              const l = e.target;
              l.setStyle({ weight: 2, color: '#09090B', fillOpacity: 0.85 });
              l.bringToFront();
              updateSelectedStateCard(stData);
            },
            mouseout: function(e) {
              geoJsonLayer.resetStyle(e.target);
            },
            click: function() {
              mapInstance.fitBounds(layer.getBounds(), { padding: [20, 20] });
              updateSelectedStateCard(stData);
            }
          });
        }
      }).addTo(mapInstance);
    }

    renderStateRankingsSidebar(states);
  }

  function renderStateRankingsSidebar(states) {
    const rankingContainer = document.getElementById("state-leaderboard-list");
    if (!rankingContainer) return;
    rankingContainer.innerHTML = "";

    states.forEach((st, idx) => {
      const item = document.createElement("div");
      item.className = "precision-card-subtle p-2.5 rounded-md hover:border-zinc-400 transition cursor-pointer flex items-center justify-between text-xs";
      item.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono font-bold text-[10px] flex items-center justify-center">${idx + 1}</span>
          <div>
            <div class="font-semibold text-zinc-900 dark:text-zinc-100">${st.name}</div>
            <div class="text-[10px] font-mono text-zinc-500">${st.complaints.toLocaleString()} cases</div>
          </div>
        </div>
        <div class="text-right font-mono">
          <div class="font-bold text-zinc-900 dark:text-zinc-100">₹${st.loss_cr.toLocaleString()} Cr</div>
          <div class="text-[10px] text-zinc-500">Idx: ${st.vulnerability_idx}</div>
        </div>
      `;

      item.addEventListener("click", () => {
        updateSelectedStateCard(st);
        if (geoJsonLayer) {
          geoJsonLayer.eachLayer(l => {
            if (l.feature && l.feature.properties.name === st.name) {
              mapInstance.fitBounds(l.getBounds(), { padding: [20, 20] });
              l.openTooltip();
            }
          });
        }
      });

      rankingContainer.appendChild(item);
    });
  }

  function setupStateSorting(states) {
    const sortSelect = document.getElementById("state-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderBhuvanStateChoropleth(states);
      });
    }
  }

  // Sector Intelligence Cards
  function renderSectorCards() {
    const container = document.getElementById("sectors-grid");
    if (!container) return;

    const sectors = [
      { name: "BFSI & Capital Markets", risk: "Critical", icon: "fa-building-columns", threat: "IMPS Glitches, LockBit 3.0, Digital Arrest", loss: "₹24,500+ Cr", details: "Unpatched ADFS servers, exposed APIs, SWIFT log mismatches." },
      { name: "Healthcare & Pharma", risk: "Critical", icon: "fa-hospital", threat: "BlackCat Ransomware, Darknet PII Leaks", loss: "₹4,200+ Cr", details: "Legacy e-Hospital systems, unencrypted databases (AIIMS & ICMR breaches)." },
      { name: "Critical Power & Energy", risk: "Critical", icon: "fa-bolt", threat: "RedEcho ShadowPad, SCADA Firmware Exploits", loss: "High Disruption", details: "POSOCO grid recon, Kudankulam NPCIL contractor data leaks." },
      { name: "Government & Defense", risk: "Critical", icon: "fa-shield-halved", threat: "SideCopy Spear Phishing, World Leaks", loss: "Espionage", details: "Targeting MEA, Defense personnel with malicious RTF macros." },
      { name: "IT & Cloud Infrastructure", risk: "High", icon: "fa-cloud", threat: "Supply Chain Hacks, AWS Bucket Exposure, DDoS", loss: "₹3,600 Cr", details: "Air India SITA cloud vendor breach, Karnataka Data Centre DDoS." },
      { name: "Telecom & ISPs", risk: "High", icon: "fa-tower-cell", threat: "SIM Swap Fraud, BGP Hijacking", loss: "Infrastructure", details: "15 Lakh+ malicious SIMs/IMEIs blocked by MHA I4C." }
    ];

    container.innerHTML = "";
    sectors.forEach(s => {
      const card = document.createElement("div");
      card.className = "precision-card p-4 space-y-2.5";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center text-xs">
              <i class="fa-solid ${s.icon}"></i>
            </div>
            <h3 class="font-bold text-xs text-zinc-900 dark:text-zinc-100">${s.name}</h3>
          </div>
          <span class="status-badge ${s.risk === 'Critical' ? 'accent' : ''}">${s.risk}</span>
        </div>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">${s.details}</p>
        <div class="text-xs pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-zinc-500 font-mono text-[11px]">
          <span>Threat: <strong class="text-zinc-700 dark:text-zinc-300 font-sans">${s.threat}</strong></span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Landmark Incidents Grid
  function renderLandmarkIncidents(incidents) {
    const container = document.getElementById("landmark-incidents-grid");
    if (!container || !incidents) return;

    const landmarkIDs = ["INC-2022-003", "INC-2022-004", "INC-2023-002", "INC-2023-003", "INC-2026-001", "INC-2026-002"];
    const landmarks = incidents.filter(i => landmarkIDs.includes(i.id));

    container.innerHTML = "";
    landmarks.forEach(inc => {
      const card = document.createElement("div");
      card.className = "precision-card-subtle p-3.5 flex flex-col justify-between space-y-2 cursor-pointer hover:border-zinc-400 transition group";
      card.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded">${inc.id}</span>
            <span class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">₹${inc.loss_cr.toFixed(2)} Cr</span>
          </div>
          <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${inc.target}</h4>
          <p class="text-[11px] text-zinc-500 leading-tight font-sans">${inc.category} (${inc.threat_actor})</p>
        </div>
        <div class="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
          <span>Inspect Case</span>
          <i class="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
        </div>
      `;

      card.addEventListener("click", () => {
        openModal(inc.id);
      });

      container.appendChild(card);
    });
  }

  // Fraud Taxonomy Grid
  function renderFraudTaxonomy(fraudList) {
    const container = document.getElementById("fraud-taxonomy-grid");
    if (!container || !fraudList) return;

    container.innerHTML = "";

    fraudList.forEach(f => {
      const card = document.createElement("div");
      card.className = "precision-card p-4 space-y-2.5";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-xs text-zinc-900 dark:text-zinc-100">${f.category}</h3>
          <span class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">₹${f.loss_cr.toLocaleString()} Cr</span>
        </div>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 font-sans"><strong class="font-semibold text-zinc-900 dark:text-zinc-100">Vector:</strong> ${f.vector}</p>
        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500">
          <div>Cases: <strong class="text-zinc-700 dark:text-zinc-300">${f.cases.toLocaleString()}</strong></div>
          <div>Avg Loss: <strong class="text-zinc-700 dark:text-zinc-300">₹${Math.round(f.avg_loss_inr).toLocaleString()}</strong></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Chronological Timeline Milestones
  function renderTimelineMilestones(timelineData) {
    const container = document.getElementById("timeline-container");
    if (!container || !timelineData) return;

    container.innerHTML = "";
    timelineData.forEach(t => {
      const item = document.createElement("div");
      item.className = "relative group";
      item.innerHTML = `
        <div class="absolute -left-[31px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 border-2 border-white dark:border-zinc-900"></div>
        <div class="precision-card p-3.5 space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold font-mono text-zinc-900 dark:text-zinc-100">${t.date}</span>
            <span class="status-badge">${t.type}</span>
          </div>
          <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100">${t.title}</h4>
          <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">${t.impact}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // MITRE ATT&CK Matrix Table
  function renderMitreMatrix(mitreData) {
    const container = document.getElementById("mitre-table-body");
    if (!container || !mitreData) return;

    container.innerHTML = "";
    mitreData.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-bold font-mono text-xs">${m.tactic_name} <span class="text-zinc-500">(${m.tactic_id})</span></td>
        <td class="font-semibold text-xs">${m.technique_name} <span class="text-zinc-500 font-mono text-[11px]">(${m.technique_id})</span></td>
        <td class="text-center font-bold font-mono text-xs"><span class="status-badge">${m.frequency}</span></td>
        <td class="text-xs text-zinc-600 dark:text-zinc-400 font-sans">${m.vectors}</td>
      `;
      container.appendChild(tr);
    });
  }

  // Master Repository Grid
  function renderRepositoryGrid(incidents) {
    const tbody = document.getElementById("incidents-table-body");
    if (!tbody || !incidents) return;
    tbody.innerHTML = "";

    incidents.forEach(inc => {
      const tr = document.createElement("tr");
      const badgeClass = inc.severity === "Critical" ? "accent" : "";

      tr.innerHTML = `
        <td class="font-mono font-bold text-xs">${inc.id}</td>
        <td class="whitespace-nowrap font-mono text-xs text-zinc-500">${inc.date}</td>
        <td class="text-xs">${inc.state}</td>
        <td class="font-bold text-xs">${inc.target}</td>
        <td class="text-xs text-zinc-600 dark:text-zinc-400">${inc.sector}</td>
        <td class="text-xs">${inc.category}</td>
        <td class="text-xs text-zinc-500 font-mono">${inc.threat_actor}</td>
        <td class="text-right font-mono font-bold text-xs">₹${inc.loss_cr.toFixed(2)}</td>
        <td class="text-center"><span class="status-badge ${badgeClass}">${inc.severity}</span></td>
        <td class="text-center">
          <button class="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded font-medium text-[11px] transition view-detail-btn font-mono" data-id="${inc.id}">View</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    document.querySelectorAll(".view-detail-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        openModal(id);
      });
    });
  }

  // Forensic Modal Drawer
  function openModal(id) {
    if (!dashboardData) return;
    const inc = dashboardData.incidents.find(i => i.id === id);
    if (!inc) return;

    document.getElementById("modal-inc-id").innerText = inc.id;
    document.getElementById("modal-title").innerText = inc.target;
    document.getElementById("modal-date").innerText = inc.date;
    document.getElementById("modal-state").innerText = `${inc.state} (${inc.district})`;
    document.getElementById("modal-target").innerText = `${inc.target} (${inc.sector})`;
    document.getElementById("modal-actor").innerText = `${inc.threat_actor} (${inc.malware})`;
    document.getElementById("modal-cve").innerText = inc.cve || "N/A";
    document.getElementById("modal-loss").innerText = `₹${inc.loss_cr.toFixed(2)} Crore`;
    document.getElementById("modal-summary").innerText = `Attack Category: ${inc.category} | MITRE Technique: ${inc.mitre_technique} | Records Compromised: ${inc.records_comp.toLocaleString()} | Downtime: ${inc.downtime_hrs} hours. Primary source reference: ${inc.reference}`;
    document.getElementById("modal-ref").innerText = inc.reference;

    const modal = document.getElementById("incident-modal");
    modal.classList.remove("hidden");

    if (window.gsap) {
      gsap.fromTo(modal.querySelector(".precision-card"), 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }

  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      document.getElementById("incident-modal").classList.add("hidden");
    });
  }

  // Search & Filter Listeners
  function setupSearchAndFilters() {
    const repoSearch = document.getElementById("grid-search-input");
    const stateFilter = document.getElementById("grid-state-filter");
    const sectorFilter = document.getElementById("grid-sector-filter");

    function applyFilters() {
      if (!dashboardData) return;
      const query = (repoSearch ? repoSearch.value : "").toLowerCase();
      const stVal = stateFilter ? stateFilter.value : "ALL";
      const secVal = sectorFilter ? sectorFilter.value : "ALL";

      const filtered = dashboardData.incidents.filter(inc => {
        const matchQuery = !query || 
          inc.id.toLowerCase().includes(query) ||
          inc.state.toLowerCase().includes(query) ||
          inc.target.toLowerCase().includes(query) ||
          inc.category.toLowerCase().includes(query) ||
          inc.threat_actor.toLowerCase().includes(query);

        const matchSt = stVal === "ALL" || inc.state === stVal;
        const matchSec = secVal === "ALL" || inc.sector === secVal;

        return matchQuery && matchSt && matchSec;
      });

      renderRepositoryGrid(filtered);
      const countDisplay = document.getElementById("record-count-display");
      if (countDisplay) {
        countDisplay.innerText = `Showing ${filtered.length} of ${dashboardData.incidents.length} verified intelligence records`;
      }
    }

    if (repoSearch) repoSearch.addEventListener("input", applyFilters);
    if (stateFilter) stateFilter.addEventListener("change", applyFilters);
    if (sectorFilter) sectorFilter.addEventListener("change", applyFilters);

    const exportExcel = document.getElementById("export-excel-btn");
    if (exportExcel) {
      exportExcel.addEventListener("click", () => {
        window.location.href = "master_cybercrime_intelligence_india_2020_2026.xlsx";
      });
    }

    const exportJson = document.getElementById("export-json-btn");
    if (exportJson) {
      exportJson.addEventListener("click", () => {
        window.location.href = "intelligence_dashboard_data.json";
      });
    }
  }
});
