// India Cybercrime Intelligence Dashboard - ISRO Bhuvan Map Engine (2020–2026 YTD)
document.addEventListener("DOMContentLoaded", () => {
  let dashboardData = null;
  let chartTrend = null;
  let chartPie = null;
  let mapInstance = null;
  let geoJsonLayer = null;
  let pinMarkersGroup = null;
  let currentSort = "loss";

  // Executive Dark/Light Theme Switcher Setup
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  const savedTheme = localStorage.getItem("india_cyber_theme");
  if (savedTheme === "dark") {
    enableDarkMode();
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
    if (themeIcon) themeIcon.className = "fa-solid fa-sun text-amber-400";
    if (themeText) themeText.innerText = "Light Mode";
  }

  function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("india_cyber_theme", "light");
    if (themeIcon) themeIcon.className = "fa-solid fa-moon text-amber-500";
    if (themeText) themeText.innerText = "Executive Dark";
  }

  // Segmented Navigation Tabs & Target Tab Triggers
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

      if (target === "map" && mapInstance) {
        setTimeout(() => mapInstance.invalidateSize(), 100);
      }
      if (target === "landing" || target === "overview") {
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

  document.querySelectorAll(".hero-pdf-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.print();
    });
  });

  // Fetch JSON payload
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

  function animateCounters() {
    document.querySelectorAll(".count-up").forEach(elem => {
      const targetVal = parseFloat(elem.getAttribute("data-target") || "0");
      gsap.to(elem, {
        innerText: targetVal,
        duration: 1.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          elem.innerText = Math.floor(elem.innerText).toLocaleString();
        }
      });
    });
  }

  function renderTrendChart(trends) {
    const ctx = document.getElementById("trendChart")?.getContext("2d");
    if (!ctx || !trends || trends.length === 0) return;

    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#F8FAFC" : "#0F172A";

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
            backgroundColor: isDark ? "#38BDF8" : "#0F172A",
            borderRadius: 6,
            barThickness: 24,
            yAxisID: "yLoss"
          },
          {
            label: "NCRP Complaints (Lakhs)",
            data: complaints,
            type: "line",
            borderColor: "#EF4444",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: "#EF4444",
            fill: true,
            tension: 0.3,
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
            labels: { color: textColor, font: { family: "Inter", size: 12, weight: "bold" }, usePointStyle: true }
          },
          tooltip: {
            backgroundColor: isDark ? "#1E293B" : "#0F172A",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: "Inter", size: 11, weight: "bold" } }
          },
          yLoss: {
            type: "linear",
            position: "left",
            title: { display: true, text: "Loss (INR Cr)", color: textColor, font: { family: "Inter", size: 12, weight: "bold" } },
            ticks: { color: textColor, font: { family: "Inter", size: 11, weight: "bold" }, callback: v => `₹${v}` }
          },
          yComplaints: {
            type: "linear",
            position: "right",
            grid: { display: false },
            title: { display: true, text: "Complaints (Lakhs)", color: textColor, font: { family: "Inter", size: 12, weight: "bold" } },
            ticks: { color: textColor, font: { family: "Inter", size: 11, weight: "bold" }, callback: v => `${v}L` }
          }
        }
      }
    });
  }

  function renderFraudPieChart(fraudData) {
    const ctx = document.getElementById("fraudPieChart")?.getContext("2d");
    if (!ctx || !fraudData || fraudData.length === 0) return;

    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#F8FAFC" : "#0F172A";

    const labels = fraudData.map(f => f.category);
    const losses = fraudData.map(f => f.loss_cr);

    if (chartPie) chartPie.destroy();

    chartPie = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: losses,
          backgroundColor: ["#EF4444", "#F97316", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6"],
          borderWidth: 2,
          borderColor: isDark ? "#334155" : "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { family: "Inter", size: 10, weight: "bold" }, boxWidth: 10, padding: 8 }
          }
        },
        cutout: "60%"
      }
    });
  }

  // Exclusive India Bounds & Bhuvan Map Engine
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
      { name: "Mumbai (Financial Hub)", coords: [19.0760, 72.8777], type: "Critical Cyber Extortion & Banking Hub", loss: "₹10,450 Cr", threat: "Digital Arrest & Corporate Ransomware", icon: "fa-building-columns" },
      { name: "Hyderabad (Cyberabad)", coords: [17.3850, 78.4867], type: "Investment Fraud & Crypto Hub", loss: "₹7,800 Cr", threat: "Part-time Job & Crypto Fraud", icon: "fa-microchip" },
      { name: "Bengaluru (Tech Capital)", coords: [12.9716, 77.5946], type: "AI Deepfake & Cloud Breach Hub", loss: "₹7,200 Cr", threat: "AI Deepfake Voice Cloning & AD Breach", icon: "fa-robot" },
      { name: "New Delhi (National Capital)", coords: [28.6139, 77.2090], type: "Government & AIIMS Cyber Target", loss: "₹6,100 Cr", threat: "AIIMS Ransomware & Ministry Espionage", icon: "fa-landmark" },
      { name: "Mewat / Nuh Syndicate Hub", coords: [28.1000, 77.0000], type: "Sextortion & QR Spoofing Syndicate", loss: "₹3,400 Cr", threat: "Mewat QR Code & OLX Fraud Ring", icon: "fa-crosshairs" },
      { name: "Jamtara Cyber Hub", coords: [23.9622, 86.8021], type: "Vishing & Banking OTP Origin Hub", loss: "₹1,850 Cr", threat: "Phishing & Fake Customer Helpline", icon: "fa-phone-slash" },
      { name: "Nawada Fake Loan Hub", coords: [24.8872, 85.5441], type: "Biometric & Loan App Syndicate", loss: "₹1,150 Cr", threat: "AEPS Biometric Stencil Fraud", icon: "fa-fingerprint" },
      { name: "Gurugram Cyber Cell", coords: [28.4595, 77.0266], type: "Digital Arrest Target Zone", loss: "₹3,400 Cr", threat: "WhatsApp Video Extortion", icon: "fa-video" },
      { name: "Kolkata Cyber Cell", coords: [22.5726, 88.3639], type: "IMPS Glitch & Tech Support Hub", loss: "₹2,800 Cr", threat: "UCO Bank IMPS Glitch Theft", icon: "fa-headset" }
    ];

    pinpointHubs.forEach(hub => {
      const pinHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-10 hover:scale-125 transition transform">
            <i class="fa-solid ${hub.icon} text-[10px]"></i>
          </div>
          <div class="absolute w-10 h-10 bg-rose-500/40 rounded-full animate-ping pointer-events-none"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-pinpoint-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(hub.coords, { icon: customIcon }).addTo(pinMarkersGroup);

      marker.bindPopup(`
        <div class="p-2 space-y-1 font-sans">
          <div class="text-xs font-mono font-bold text-rose-600 uppercase">ISRO Bhuvan Pinpoint Intelligence</div>
          <h4 class="font-outfit font-extrabold text-sm text-slate-950">${hub.name}</h4>
          <p class="text-xs text-slate-700">Category: <strong>${hub.type}</strong></p>
          <p class="text-xs text-rose-700 font-extrabold">Reported Damage: ${hub.loss}</p>
          <p class="text-[11px] text-slate-600 italic">Primary Threat: ${hub.threat}</p>
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
    } else if (currentSort === "volume") {
      states.sort((a, b) => b.complaints - a.complaints);
    } else if (currentSort === "vulnerability" || currentSort === "vuln") {
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

          const fillColor = vuln >= 88 ? '#B91C1C' :
                          vuln >= 80 ? '#DC2626' :
                          vuln >= 70 ? '#EA580C' :
                          vuln >= 60 ? '#D97706' : '#059669';

          return {
            fillColor: fillColor,
            weight: 1.5,
            opacity: 1,
            color: '#FFFFFF',
            fillOpacity: 0.65
          };
        },
        onEachFeature: function(feature, layer) {
          const stName = feature.properties.name;
          const stData = stateMap[stName] || feature.properties;

          layer.bindTooltip(`
            <div class="p-1 font-sans">
              <div class="font-outfit font-extrabold text-sm text-slate-950">${stName}</div>
              <div class="text-xs text-slate-700 mt-0.5">Complaints: <strong>${(stData.complaints || 45000).toLocaleString()}</strong></div>
              <div class="text-xs text-rose-700 font-extrabold">Loss: ₹${(stData.loss_cr || 280.0).toLocaleString()} Cr</div>
              <div class="text-xs text-emerald-700 font-bold">1930 Saved: ₹${(stData.saved_cr || 55.0).toLocaleString()} Cr</div>
              <div class="text-[11px] text-slate-500 italic mt-1">${stData.threat || "Cyber Fraud"}</div>
            </div>
          `, { sticky: true });

          layer.on({
            mouseover: function(e) {
              const l = e.target;
              l.setStyle({ weight: 3, color: '#0F172A', fillOpacity: 0.85 });
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
      item.className = "theme-card p-3 rounded-xl border border-slate-300 hover:border-slate-500 transition cursor-pointer flex items-center justify-between text-xs shadow-sm";
      item.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">${idx + 1}</span>
          <div>
            <div class="font-bold text-xs">${st.name}</div>
            <div class="text-[11px] font-semibold opacity-75">${st.complaints.toLocaleString()} complaints</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-rose-600">₹${st.loss_cr.toLocaleString()} Cr</div>
          <div class="text-[10px] font-semibold opacity-75">Vuln Index: ${st.vulnerability_idx}/100</div>
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
      card.className = "theme-card p-5 rounded-xl border border-slate-300 space-y-3 shadow-sm";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">
              <i class="fa-solid ${s.icon}"></i>
            </div>
            <h3 class="font-bold text-sm font-outfit">${s.name}</h3>
          </div>
          <span class="px-2.5 py-0.5 text-xs font-bold rounded-full ${s.risk === 'Critical' ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800' : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'}">${s.risk}</span>
        </div>
        <p class="text-xs font-medium leading-relaxed opacity-90">${s.details}</p>
        <div class="text-xs pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between opacity-75">
          <span>Primary Threat: <strong>${s.threat}</strong></span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderLandmarkIncidents(incidents) {
    const container = document.getElementById("landmark-incidents-grid");
    if (!container || !incidents) return;

    const landmarkIDs = ["INC-2022-003", "INC-2022-004", "INC-2023-002", "INC-2023-003", "INC-2026-001", "INC-2026-002"];
    const landmarks = incidents.filter(i => landmarkIDs.includes(i.id));

    container.innerHTML = "";
    landmarks.forEach(inc => {
      const card = document.createElement("div");
      card.className = "theme-subtle p-4 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col justify-between space-y-3 shadow-xs hover:border-blue-500 transition cursor-pointer group";
      card.innerHTML = `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">${inc.id}</span>
            <span class="text-xs font-bold text-rose-600 dark:text-rose-400">₹${inc.loss_cr.toFixed(2)} Cr</span>
          </div>
          <h4 class="font-bold text-sm font-outfit group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${inc.target}</h4>
          <p class="text-xs font-medium opacity-85 leading-tight">${inc.category} (${inc.threat_actor})</p>
        </div>
        <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
          <span>Inspect Case File</span>
          <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </div>
      `;

      card.addEventListener("click", () => {
        openModal(inc.id);
      });

      container.appendChild(card);
    });
  }

  function renderFraudTaxonomy(fraudList) {
    const container = document.getElementById("fraud-taxonomy-grid");
    if (!container || !fraudList) return;

    container.innerHTML = "";

    fraudList.forEach(f => {
      const card = document.createElement("div");
      card.className = "theme-card p-5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm space-y-3";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm font-outfit">${f.category}</h3>
          <span class="text-xs font-extrabold text-rose-600 dark:text-rose-400">₹${f.loss_cr.toLocaleString()} Cr</span>
        </div>
        <p class="text-xs font-medium opacity-90"><strong class="font-bold opacity-100">Vector:</strong> ${f.vector}</p>
        <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700 font-medium opacity-85">
          <div>Reported Cases: <strong>${f.cases.toLocaleString()}</strong></div>
          <div>Avg Loss: <strong>₹${Math.round(f.avg_loss_inr).toLocaleString()}</strong></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderTimelineMilestones(timelineData) {
    const container = document.getElementById("timeline-container");
    if (!container || !timelineData) return;

    container.innerHTML = "";
    timelineData.forEach(t => {
      const item = document.createElement("div");
      item.className = "relative group";
      item.innerHTML = `
        <div class="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-amber-400 border-2 border-white dark:border-slate-900"></div>
        <div class="theme-card p-4 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold font-mono text-purple-600 dark:text-purple-400">${t.date}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">${t.type}</span>
          </div>
          <h4 class="font-bold text-sm font-outfit">${t.title}</h4>
          <p class="text-xs font-medium leading-relaxed opacity-90">${t.impact}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  function renderMitreMatrix(mitreData) {
    const container = document.getElementById("mitre-table-body");
    if (!container || !mitreData) return;

    container.innerHTML = "";
    mitreData.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-bold font-mono">${m.tactic_name} (${m.tactic_id})</td>
        <td class="font-semibold">${m.technique_name} (${m.technique_id})</td>
        <td class="text-center font-bold"><span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs">${m.frequency}</span></td>
        <td class="font-medium opacity-90">${m.vectors}</td>
      `;
      container.appendChild(tr);
    });
  }

  function renderRepositoryGrid(incidents) {
    const tbody = document.getElementById("incidents-table-body");
    if (!tbody || !incidents) return;
    tbody.innerHTML = "";

    incidents.forEach(inc => {
      const tr = document.createElement("tr");
      
      const badgeClass = inc.severity === "Critical" ? "bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800" : (inc.severity === "High" ? "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800");

      tr.innerHTML = `
        <td class="font-mono font-bold">${inc.id}</td>
        <td class="whitespace-nowrap font-medium">${inc.date}</td>
        <td class="font-medium">${inc.state}</td>
        <td class="font-bold">${inc.target}</td>
        <td class="font-medium">${inc.sector}</td>
        <td class="font-medium">${inc.category}</td>
        <td class="font-medium opacity-75">${inc.threat_actor}</td>
        <td class="text-right font-extrabold text-rose-600 dark:text-rose-400">₹${inc.loss_cr.toFixed(2)}</td>
        <td class="text-center"><span class="px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeClass}">${inc.severity}</span></td>
        <td class="text-center">
          <button class="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition view-detail-btn" data-id="${inc.id}">View</button>
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

    document.getElementById("incident-modal").classList.remove("hidden");
  }

  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      document.getElementById("incident-modal").classList.add("hidden");
    });
  }

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

    const printBtn = document.getElementById("print-ceo-report-btn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }
});
