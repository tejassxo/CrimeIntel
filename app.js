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
  let liveStreamInterval = null;
  let isStreamPaused = false;
  let currentScenarioIdx = 0;
  let solvedScenarios = new Set();

  // Executive Theme Engine (Default: Light Mode / Pure White Base)
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  const savedTheme = localStorage.getItem("india_cyber_theme");
  if (savedTheme === "dark") {
    enableDarkMode();
  } else {
    disableDarkMode(); // Default to White / Off-White
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
    const segBtns = document.querySelectorAll(".segmented-btn, .mobile-nav-link");
    const tabPanels = document.querySelectorAll(".tab-panel");

    segBtns.forEach(b => {
      if (b.getAttribute("data-tab") === target) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    tabPanels.forEach(p => {
      if (p.id === `tab-${target}`) {
        p.classList.add("active");
        if (window.gsap) {
          gsap.fromTo(p, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
        }
      } else {
        p.classList.remove("active");
      }
    });

    // Close mobile drawer if open
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    if (mobileDrawer && !mobileDrawer.classList.contains("hidden")) {
      mobileDrawer.classList.add("hidden");
    }

    // Invalidate Leaflet Map Size when switching to Spatial Map
    if (target === "map" && mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize(true);
        mapInstance.setView([22.5937, 78.9629], 5);
      }, 50);
      setTimeout(() => {
        mapInstance.invalidateSize(true);
      }, 250);
    }
  };

  document.querySelectorAll(".segmented-btn, .mobile-nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      if (target) switchTab(target);
    });
  });

  document.querySelectorAll("[data-target-tab], .nav-footer-link, [data-tab='overview']").forEach(elem => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const target = elem.getAttribute("data-target-tab") || elem.getAttribute("data-tab");
      if (target) {
        switchTab(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNavDrawer.classList.toggle("hidden");
    });
  }

  // Methodology Modal Controls
  const methodologyModal = document.getElementById("methodology-modal");
  const openMethBtn = document.getElementById("open-methodology-btn");
  const heroMethBtn = document.getElementById("hero-methodology-btn");
  const footerMethBtn = document.getElementById("footer-methodology-btn");
  const closeMethBtn = document.getElementById("close-methodology-btn");
  const dismissMethBtn = document.getElementById("dismiss-methodology-btn");

  function openMethodology() {
    if (methodologyModal) methodologyModal.classList.remove("hidden");
  }

  function closeMethodology() {
    if (methodologyModal) methodologyModal.classList.add("hidden");
  }

  if (openMethBtn) openMethBtn.addEventListener("click", openMethodology);
  if (heroMethBtn) heroMethBtn.addEventListener("click", openMethodology);
  if (footerMethBtn) footerMethBtn.addEventListener("click", (e) => { e.preventDefault(); openMethodology(); });
  if (closeMethBtn) closeMethBtn.addEventListener("click", closeMethodology);
  if (dismissMethBtn) dismissMethBtn.addEventListener("click", closeMethodology);

  if (methodologyModal) {
    methodologyModal.addEventListener("click", (e) => {
      if (e.target === methodologyModal) closeMethodology();
    });
  }

  document.querySelectorAll("#print-ceo-report-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.print();
    });
  });

  // Window Resize Listener for Responsive Leaflet Map
  window.addEventListener("resize", () => {
    if (mapInstance) {
      mapInstance.invalidateSize(true);
    }
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
    initRepublicReveal();
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

    // Interactive Suites
    initGoldenHourSimulator();
    initLiveThreatStream(data.incidents);
    initScamSimulator();
    initStateComparisonSandbox(data.states);
    initCommandPalette(data);
    initTiltCards();
  }

  // ==========================================================================
  // The Republic Reveal (GSAP Cinematic National Unveiling Sequence)
  // ==========================================================================
  function initRepublicReveal() {
    const curtain = document.getElementById("republic-reveal-curtain");
    const initLabel = document.getElementById("reveal-initiative-label");
    const flag = document.getElementById("reveal-flag");
    const tagline = document.getElementById("reveal-tagline");
    const skipBtn = document.getElementById("skip-reveal-btn");
    const replayBtn = document.getElementById("replay-reveal-btn");

    const heroTitle = document.getElementById("hero-title");
    const heroSubtitle = document.getElementById("hero-subtitle");
    const heroDesc = document.getElementById("hero-desc");
    const heroStats = document.getElementById("hero-stats");
    const heroCtaGroup = document.getElementById("hero-cta-group");
    const bgMap = document.querySelector(".sentinel-bg-map");

    if (!window.gsap || !curtain) {
      if (curtain) curtain.classList.add("revealed");
      animateCounters();
      return;
    }

    let tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    function playSequence() {
      tl.kill();
      tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      curtain.classList.remove("revealed");
      gsap.set(curtain, { display: "flex", y: 0, opacity: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
      gsap.set(initLabel, { opacity: 0, y: 12 });
      gsap.set(flag, { opacity: 0, y: 70, scale: 0.94 });
      gsap.set(tagline, { opacity: 0, y: 10 });

      if (heroTitle) gsap.set(heroTitle, { opacity: 0, y: 16 });
      if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 0, y: 12 });
      if (heroDesc) gsap.set(heroDesc, { opacity: 0, y: 10 });
      if (heroStats) gsap.set(heroStats.children, { opacity: 0, y: 14 });
      if (bgMap) gsap.set(bgMap, { opacity: 0, scale: 0.95 });
      if (heroCtaGroup) gsap.set(heroCtaGroup, { opacity: 0, y: 10 });

      tl.to(initLabel, { opacity: 1, y: 0, duration: 0.5 }, 0.40);
      tl.to(flag, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }, 0.80);
      tl.to(tagline, { opacity: 1, y: 0, duration: 0.5 }, 1.30);

      tl.to(flag, { scale: 1.05, opacity: 0, duration: 0.35, ease: "power2.in" }, 1.85);
      tl.to(initLabel, { opacity: 0, duration: 0.25 }, 1.85);
      tl.to(tagline, { opacity: 0, duration: 0.25 }, 1.85);

      tl.to(curtain, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => {
          curtain.classList.add("revealed");
        }
      }, 2.00);

      if (heroTitle) tl.to(heroTitle, { opacity: 1, y: 0, duration: 0.45 }, 2.40);
      if (heroSubtitle) tl.to(heroSubtitle, { opacity: 1, y: 0, duration: 0.35 }, 2.65);
      if (heroDesc) tl.to(heroDesc, { opacity: 1, y: 0, duration: 0.35 }, 2.75);
      if (heroStats) tl.to(heroStats.children, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45 }, 2.85);
      if (bgMap) tl.to(bgMap, { opacity: document.body.classList.contains("dark-mode") ? 0.06 : 0.12, scale: 1, duration: 0.7 }, 3.20);
      if (heroCtaGroup) tl.to(heroCtaGroup, { opacity: 1, y: 0, duration: 0.4 }, 3.80);

      tl.add(() => {
        animateCounters();
      }, 4.10);
    }

    function skipSequence() {
      tl.kill();
      curtain.classList.add("revealed");
      gsap.set(curtain, { display: "none" });
      if (heroTitle) gsap.set(heroTitle, { opacity: 1, y: 0 });
      if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 1, y: 0 });
      if (heroDesc) gsap.set(heroDesc, { opacity: 1, y: 0 });
      if (heroStats) gsap.set(heroStats.children, { opacity: 1, y: 0 });
      if (bgMap) gsap.set(bgMap, { opacity: document.body.classList.contains("dark-mode") ? 0.06 : 0.12, scale: 1 });
      if (heroCtaGroup) gsap.set(heroCtaGroup, { opacity: 1, y: 0 });
      animateCounters();
    }

    if (skipBtn) skipBtn.addEventListener("click", skipSequence);
    if (replayBtn) replayBtn.addEventListener("click", playSequence);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") skipSequence();
    });

    playSequence();
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
            backgroundColor: isDark ? "#3B82F6" : "#2563EB",
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
            labels: { color: textColor, font: { family: "Manrope", size: 11, weight: "600" }, usePointStyle: true, boxWidth: 6 }
          },
          tooltip: {
            backgroundColor: isDark ? "#0A0A0A" : "#FFFFFF",
            titleColor: isDark ? "#FFFFFF" : "#09090B",
            bodyColor: isDark ? "#E4E4E7" : "#27272A",
            borderColor: isDark ? "#27272A" : "#E4E4E7",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            bodyFont: { family: "Manrope", size: 11 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: mutedColor, font: { family: "IBM Plex Mono", size: 11 } }
          },
          yLoss: {
            type: "linear",
            position: "left",
            grid: { color: gridColor },
            title: { display: true, text: "Loss (INR Cr)", color: mutedColor, font: { family: "Manrope", size: 11, weight: "600" } },
            ticks: { color: mutedColor, font: { family: "IBM Plex Mono", size: 11 }, callback: v => `₹${v}` }
          },
          yComplaints: {
            type: "linear",
            position: "right",
            grid: { display: false },
            title: { display: true, text: "Complaints (Lakhs)", color: mutedColor, font: { family: "Manrope", size: 11, weight: "600" } },
            ticks: { color: mutedColor, font: { family: "IBM Plex Mono", size: 11 }, callback: v => `${v}L` }
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
    const textColor = isDark ? "#FFFFFF" : "#09090B";

    const labels = fraudData.map(f => f.category);
    const losses = fraudData.map(f => f.loss_cr);

    if (chartPie) chartPie.destroy();

    const vibrantPalette = [
      "#EF4444",
      "#F59E0B",
      "#8B5CF6",
      "#3B82F6",
      "#10B981",
      "#EC4899",
      "#06B6D4"
    ];

    chartPie = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: losses,
          backgroundColor: vibrantPalette,
          borderWidth: 1.5,
          borderColor: isDark ? "#0A0A0A" : "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { family: "Manrope", size: 11, weight: "600" }, boxWidth: 8, padding: 6 }
          },
          tooltip: {
            backgroundColor: isDark ? "#0A0A0A" : "#FFFFFF",
            titleColor: isDark ? "#FFFFFF" : "#09090B",
            bodyColor: isDark ? "#E4E4E7" : "#27272A",
            borderColor: isDark ? "#27272A" : "#E4E4E7",
            borderWidth: 1,
            padding: 8,
            cornerRadius: 6,
            bodyFont: { family: "Manrope", size: 11 },
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

  // ==========================================================================
  // Interactive Golden Hour 1930 Simulator
  // ==========================================================================
  function initGoldenHourSimulator() {
    const slider = document.getElementById("golden-hour-slider");
    const timeDisplay = document.getElementById("golden-time-display");
    const badge = document.getElementById("golden-recovery-badge");
    const lienStatus = document.getElementById("sim-lien-status");
    const lienDesc = document.getElementById("sim-lien-desc");
    const layerCount = document.getElementById("sim-layer-count");
    const layerDesc = document.getElementById("sim-layer-desc");
    const actionCode = document.getElementById("sim-action-code");

    if (!slider) return;

    slider.addEventListener("input", (e) => {
      const minutes = parseInt(e.target.value, 10);
      let timeText = `${minutes} Minutes`;
      if (minutes >= 60) {
        const hrs = (minutes / 60).toFixed(1);
        timeText = `${hrs} Hours`;
      }

      if (minutes <= 30) {
        timeDisplay.innerText = `${timeText} (Golden Recovery Window)`;
        timeDisplay.className = "font-bold text-emerald-600 dark:text-emerald-400 font-mono";
        badge.innerText = `${Math.round(96 - (minutes * 0.4))}% RECOVERY ESTIMATE`;
        badge.className = "px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800";
        lienStatus.innerText = "INSTANT APB LIEN FREEZE";
        lienStatus.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono";
        lienDesc.innerText = "Funds successfully held in recipient account before any ATM withdrawal or P2P transfer.";
        layerCount.innerText = "1 / 5 Mule Layers Active";
        layerDesc.innerText = "Money is directly quarantined inside domestic banking clearing gateway.";
        actionCode.innerText = "DIAL 1930 / AUTO-REVERSAL";
      } else if (minutes <= 120) {
        timeDisplay.innerText = `${timeText} (Layering Stage 1)`;
        timeDisplay.className = "font-bold text-amber-600 dark:text-amber-400 font-mono";
        badge.innerText = `${Math.round(80 - ((minutes - 30) * 0.4))}% RECOVERY ESTIMATE`;
        badge.className = "px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800";
        lienStatus.innerText = "INTER-BANK SECONDARY HOLD";
        lienStatus.className = "text-xs font-bold text-amber-600 dark:text-amber-400 font-mono";
        lienDesc.innerText = "Funds moved to Layer-2 mule accounts. Automated lien dispatched to partner private banks.";
        layerCount.innerText = "2-3 / 5 Mule Layers Active";
        layerDesc.innerText = "Siphoning syndicate actively dispersing money across micro UPI transactions.";
        actionCode.innerText = "NCRP 1930 + NODAL OFFICER LIAISON";
      } else if (minutes <= 480) {
        timeDisplay.innerText = `${timeText} (Multi-Layer Dispersion)`;
        timeDisplay.className = "font-bold text-rose-600 dark:text-rose-400 font-mono";
        badge.innerText = `${Math.round(42 - ((minutes - 120) * 0.05))}% RECOVERY ESTIMATE`;
        badge.className = "px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800";
        lienStatus.innerText = "PARTIAL RECOVERY & REQUISITION";
        lienStatus.className = "text-xs font-bold text-rose-600 dark:text-rose-400 font-mono";
        lienDesc.innerText = "Significant capital converted into merchant gift vouchers and cash-out points.";
        layerCount.innerText = "4 / 5 Mule Layers Active";
        layerDesc.innerText = "Syndicate runners attempting crypto on-ramp via unauthorized P2P platforms.";
        actionCode.innerText = "POLICE CYBER CELL FORMAL FIR";
      } else {
        timeDisplay.innerText = `${timeText} (Exfiltration Complete)`;
        timeDisplay.className = "font-bold text-zinc-500 font-mono";
        badge.innerText = "12% RECOVERY ESTIMATE";
        badge.className = "px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700";
        lienStatus.innerText = "OFFSHORE TRACE REQUIRED";
        lienStatus.className = "text-xs font-bold text-zinc-600 dark:text-zinc-400 font-mono";
        lienDesc.innerText = "Capital layered into USDT and wired to transnational compound accounts (SE Asia).";
        layerCount.innerText = "5 / 5 Mule Layers Active";
        layerDesc.innerText = "Funds completely bridged into offshore non-KYC crypto wallets.";
        actionCode.innerText = "FIU-IND & INTERPOL RED NOTICE";
      }
    });
  }

  // ==========================================================================
  // Live Threat Stream Ticker
  // ==========================================================================
  function initLiveThreatStream(incidents) {
    const ticker = document.getElementById("live-threat-ticker");
    const pauseBtn = document.getElementById("pause-stream-btn");
    if (!ticker || !incidents || incidents.length === 0) return;

    let idx = 0;
    const streamFeed = incidents.slice(0, 15);

    function addTickerItem() {
      if (isStreamPaused) return;
      const inc = streamFeed[idx % streamFeed.length];
      idx++;

      const item = document.createElement("div");
      item.className = "p-2.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between gap-2 text-xs font-sans";
      item.innerHTML = `
        <div class="space-y-0.5">
          <div class="flex items-center gap-1.5">
            <span class="text-[9px] font-mono px-1 py-0.2 bg-zinc-200 dark:bg-zinc-800 rounded font-bold">${inc.id}</span>
            <span class="font-semibold text-zinc-900 dark:text-zinc-100">${inc.target}</span>
          </div>
          <div class="text-[11px] text-zinc-500">${inc.category} • ${inc.state}</div>
        </div>
        <div class="text-right shrink-0">
          <div class="font-mono font-bold text-xs text-black dark:text-white">₹${inc.loss_cr.toFixed(1)} Cr</div>
          <span class="text-[9px] font-mono font-bold text-rose-500 uppercase">${inc.severity}</span>
        </div>
      `;

      ticker.prepend(item);
      if (ticker.children.length > 5) {
        ticker.removeChild(ticker.lastChild);
      }

      if (window.gsap) {
        gsap.fromTo(item, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    }

    for (let i = 0; i < 3; i++) {
      addTickerItem();
    }

    liveStreamInterval = setInterval(addTickerItem, 4500);

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isStreamPaused = !isStreamPaused;
        pauseBtn.innerHTML = isStreamPaused ? `<i class="fa-solid fa-play text-[10px]"></i> Resume` : `<i class="fa-solid fa-pause text-[10px]"></i> Pause`;
      });
    }
  }

  // ==========================================================================
  // Citizen Scam Defense & Interactive Simulator Lab
  // ==========================================================================
  function initScamSimulator() {
    const scenarios = [
      {
        id: "scenario-0",
        title: "Digital Arrest: 'CBI Narcotics & TRAI Disconnection Notice'",
        context: "You receive an automated IVR call claiming your mobile number was used in 23 illegal money laundering parcels seized at Mumbai Customs. The caller transfers you to a Skype video call where a person in authentic police uniform shows an arrest warrant with your Aadhaar number and orders you to stay in room isolation.",
        audioSimulation: "Simulating Incoming Trai IVR Call...",
        choices: [
          { text: "Transfer ₹4,50,000 into the designated 'RBI Supreme Court Verification Escrow' to clear your name.", correct: false, reason: "HIGH RISK COERCION: Law enforcement agencies or courts NEVER demand escrow funds over video calls or conduct virtual arrests." },
          { text: "Immediately disconnect the call, report the number on Chakshu (sancharsaathi.gov.in), and dial 1930.", correct: true, reason: "ACCURATE DEFENSE: Disconnecting breaks the psychological isolation loop. Dialing 1930 alerts I4C to freeze active syndicate accounts." },
          { text: "Ask them to send the arrest warrant on WhatsApp before paying the verification penalty.", correct: false, reason: "VULNERABILITY: Scammers forge official stamps, emblem logos, and FIR documents within minutes to intensify panic." }
        ],
        vector: "Authority Coercion & Psychological Isolation",
        mitreCode: "T1566.002 • Phishing: Spearphishing Link / Social Engineering"
      },
      {
        id: "scenario-1",
        title: "WhatsApp VIP Group: 'Institutional Pre-IPO 300% Returns'",
        context: "You are added to a WhatsApp group called 'HDFC Securities VIP Institutional Club'. Group members post screenshots of ₹50,000 turning into ₹2,50,000 in 3 days. The 'Professor' sends an APK download link for a private trading portal.",
        audioSimulation: "Live Group Sentiment Feed: 42 Bot Users Active...",
        choices: [
          { text: "Invest ₹25,000 as a small test to see if the custom trading portal allows withdrawal.", correct: false, reason: "HONEYPOT TRAP: The syndicate allows initial small ₹5,000 withdrawals to build trust before trapping multi-lakh sums." },
          { text: "Refuse the APK, report the group to WhatsApp and NCRP (cybercrime.gov.in), and block all administrators.", correct: true, reason: "ACCURATE DEFENSE: Genuine SEBI registered brokers NEVER distribute investment APKs on WhatsApp or guarantee returns." },
          { text: "Check SEBI registration number listed on their forged PDF certificate.", correct: false, reason: "DECEPTIVE PROOF: Fraudsters clone genuine SEBI registration numbers of legitimate institutional traders." }
        ],
        vector: "Greed Exploitation & Synthesized Social Proof",
        mitreCode: "T1204.002 • User Execution: Malicious File / Fake Trading Portal"
      },
      {
        id: "scenario-2",
        title: "Telegram Part-Time: 'Google Maps Rating & YouTube Like Job'",
        context: "You receive a message: 'Earn ₹3,000 to ₹8,000 daily by rating hotels and liking videos'. After completing 3 simple ratings, you receive ₹500 directly in UPI. Then, you are invited to 'Prepaid Merchant Tasks' where you deposit ₹10,000 to unlock ₹18,000.",
        audioSimulation: "Task Manager Telegram Bot: Task #04 Pending...",
        choices: [
          { text: "Pay ₹10,000 for the merchant task since they already gave you ₹500 real cash.", correct: false, reason: "CLASSIC TASK SCAM: The initial ₹500 is syndicate bait. The moment you pay ₹10,000, your balance is locked behind 'tax fees'." },
          { text: "Keep the ₹500, immediately report the UPI VPA on 1930 Helpline, and terminate communication.", correct: true, reason: "ACCURATE DEFENSE: Task scams account for ₹14,200 Cr in national losses. Reporting freezes their receiving mule account." },
          { text: "Ask customer care on Telegram why the money is locked.", correct: false, reason: "MANIPULATION: Telegram customer service bots are operated by the same extortion compound operators." }
        ],
        vector: "Micro-Reward Conditioning & Escalating Sunk Cost",
        mitreCode: "T1586.002 • Compromised Accounts / Virtual UPI Siphoning"
      },
      {
        id: "scenario-3",
        title: "Urgent SMS: 'Electricity Power Disconnection Tonight at 9:30 PM'",
        context: "An SMS arrives: 'Dear Customer, your electricity power will be disconnected at 9:30 PM tonight because your previous month bill was updated. Please contact electricity officer at 9876543210 immediately.'",
        audioSimulation: "Incoming Disconnection Notice...",
        choices: [
          { text: "Call the phone number in the SMS and follow their instructions to install QuickSupport APK.", correct: false, reason: "MALICIOUS REMOTE ACCESS: QuickSupport / AnyDesk allows scammers to take complete screen and OTP control of your banking apps." },
          { text: "Ignore the SMS number, open your state electricity board official app or portal directly to verify balance.", correct: true, reason: "ACCURATE DEFENSE: Power distribution companies never send disconnection notices from personal 10-digit mobile numbers." },
          { text: "Reply to the SMS with your consumer number to get an updated bill receipt.", correct: false, reason: "RISK: Replying confirms your active phone line to automated phishing syndicates." }
        ],
        vector: "Artificial Urgency & Screen Sharing Exploitation",
        mitreCode: "T1219 • Remote Access Software / Banking Trojan Injection"
      }
    ];

    const cardContainer = document.getElementById("active-scenario-card");
    const selectorButtons = document.querySelectorAll(".scenario-btn");
    const scoreBadge = document.getElementById("simulator-score-badge");

    function renderScenario(idx) {
      currentScenarioIdx = idx;
      const sc = scenarios[idx];
      if (!cardContainer || !sc) return;

      selectorButtons.forEach(btn => {
        const sIdx = parseInt(btn.getAttribute("data-scenario"), 10);
        if (sIdx === idx) {
          btn.className = "scenario-btn active p-2.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-left transition cursor-pointer";
        } else {
          btn.className = "scenario-btn p-2.5 rounded-md border border-transparent bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition text-zinc-500 cursor-pointer";
        }
      });

      cardContainer.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <span class="text-[10px] font-mono uppercase font-bold text-zinc-500">THREAT VECTOR: ${sc.vector}</span>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">${sc.title}</h3>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-semibold text-zinc-700 dark:text-zinc-300">${sc.mitreCode}</span>
        </div>

        <div class="p-3.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div class="flex items-center gap-2 text-xs font-mono text-rose-500 font-semibold">
            <div class="waveform-container">
              <span class="waveform-bar"></span>
              <span class="waveform-bar"></span>
              <span class="waveform-bar"></span>
              <span class="waveform-bar"></span>
              <span class="waveform-bar"></span>
            </div>
            <span>${sc.audioSimulation}</span>
          </div>
          <p class="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">${sc.context}</p>
        </div>

        <div class="space-y-2 pt-1">
          <div class="text-xs font-mono font-semibold text-zinc-500 uppercase">CHOOSE YOUR DEFENSIVE ACTION:</div>
          <div class="space-y-2" id="choices-wrapper">
            ${sc.choices.map((ch, cIdx) => `
              <button class="choice-btn w-full p-3 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-500 dark:hover:border-zinc-500 text-left transition cursor-pointer text-xs font-sans text-zinc-900 dark:text-zinc-100 flex items-start gap-2.5" data-choice="${cIdx}">
                <span class="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">${String.fromCharCode(65 + cIdx)}</span>
                <span class="leading-snug">${ch.text}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <div id="scenario-verdict-box" class="hidden p-3.5 rounded border text-xs space-y-1"></div>
      `;

      cardContainer.querySelectorAll(".choice-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const cIdx = parseInt(btn.getAttribute("data-choice"), 10);
          const selectedChoice = sc.choices[cIdx];
          const verdictBox = document.getElementById("scenario-verdict-box");

          if (selectedChoice.correct) {
            verdictBox.className = "p-3.5 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-xs space-y-1 block";
            verdictBox.innerHTML = `
              <div class="font-bold font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <i class="fa-solid fa-circle-check"></i> CORRECT DEFENSE DECISION
              </div>
              <p class="text-emerald-900 dark:text-emerald-200 font-sans leading-relaxed">${selectedChoice.reason}</p>
            `;
            solvedScenarios.add(idx);
            if (scoreBadge) scoreBadge.innerText = `${solvedScenarios.size} / 4`;
          } else {
            verdictBox.className = "p-3.5 rounded border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 text-xs space-y-1 block";
            verdictBox.innerHTML = `
              <div class="font-bold font-mono text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i> VULNERABILITY DETECTED
              </div>
              <p class="text-rose-900 dark:text-rose-200 font-sans leading-relaxed">${selectedChoice.reason}</p>
            `;
          }
        });
      });
    }

    selectorButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const sIdx = parseInt(btn.getAttribute("data-scenario"), 10);
        renderScenario(sIdx);
      });
    });

    renderScenario(0);
  }

  // ==========================================================================
  // State Comparison Sandbox Engine
  // ==========================================================================
  function initStateComparisonSandbox(states) {
    const selectA = document.getElementById("compare-state-a");
    const selectB = document.getElementById("compare-state-b");
    const outputGrid = document.getElementById("compare-output-grid");

    if (!selectA || !selectB || !states || states.length === 0) return;

    selectA.innerHTML = "";
    selectB.innerHTML = "";

    states.forEach((st) => {
      const optA = document.createElement("option");
      optA.value = st.name;
      optA.innerText = `${st.name} (₹${st.loss_cr.toLocaleString()} Cr)`;
      selectA.appendChild(optA);

      const optB = document.createElement("option");
      optB.value = st.name;
      optB.innerText = `${st.name} (₹${st.loss_cr.toLocaleString()} Cr)`;
      selectB.appendChild(optB);
    });

    selectA.value = states[0]?.name || "Maharashtra";
    selectB.value = states[1]?.name || "Telangana";

    function updateComparison() {
      const stateA = states.find(s => s.name === selectA.value) || states[0];
      const stateB = states.find(s => s.name === selectB.value) || states[1];

      function renderCard(st, other, label) {
        const lossDelta = st.loss_cr - other.loss_cr;
        const lossDeltaText = lossDelta >= 0 ? `+₹${lossDelta.toFixed(1)} Cr higher than ${other.name}` : `₹${Math.abs(lossDelta).toFixed(1)} Cr lower than ${other.name}`;
        const lossDeltaColor = lossDelta >= 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400";

        return `
          <div class="precision-card-subtle p-5 space-y-4 border border-zinc-300 dark:border-zinc-700">
            <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5">
              <div>
                <span class="text-[10px] font-mono uppercase font-bold text-zinc-500">${label}</span>
                <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 font-display">${st.name}</h3>
              </div>
              <span class="px-2 py-0.5 text-xs font-mono font-bold rounded ${st.vulnerability_idx >= 80 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}">
                Risk: ${st.vulnerability_idx || 65}/100
              </span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <div class="text-[11px] text-zinc-500 font-mono">Reported Financial Loss</div>
                <div class="text-lg font-bold font-mono text-black dark:text-white">₹${st.loss_cr.toLocaleString()} Cr</div>
                <div class="text-[10px] font-mono ${lossDeltaColor}">${lossDeltaText}</div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="p-2.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-0.5">
                  <div class="text-[10px] text-zinc-500 font-mono">Citizen Complaints</div>
                  <div class="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">${st.complaints.toLocaleString()}</div>
                </div>
                <div class="p-2.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-0.5">
                  <div class="text-[10px] text-zinc-500 font-mono">1930 Funds Saved</div>
                  <div class="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">₹${(st.saved_cr || 0).toLocaleString()} Cr</div>
                </div>
              </div>

              <div class="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                <div class="text-[11px] font-mono font-semibold text-zinc-500">PRIMARY THREAT PROFILE:</div>
                <p class="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">${st.dominant_threat || "Digital Arrest & Investment Fraud Syndicates"}</p>
              </div>
            </div>
          </div>
        `;
      }

      outputGrid.innerHTML = `
        ${renderCard(stateA, stateB, "JURISDICTION A (PRIMARY)")}
        ${renderCard(stateB, stateA, "JURISDICTION B (BENCHMARK)")}
      `;
    }

    selectA.addEventListener("change", updateComparison);
    selectB.addEventListener("change", updateComparison);
    updateComparison();
  }

  // ==========================================================================
  // Global Command Palette (Ctrl+K)
  // ==========================================================================
  function initCommandPalette(data) {
    const modal = document.getElementById("command-palette-modal");
    const openBtn = document.getElementById("open-command-palette-btn");
    const closeBtn = document.getElementById("close-palette-btn");
    const input = document.getElementById("palette-search-input");
    const results = document.getElementById("palette-results-container");

    if (!modal || !input || !results) return;

    function openPalette() {
      modal.classList.remove("hidden");
      input.value = "";
      renderResults("");
      input.focus();
    }

    function closePalette() {
      modal.classList.add("hidden");
    }

    if (openBtn) openBtn.addEventListener("click", openPalette);
    if (closeBtn) closeBtn.addEventListener("click", closePalette);

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (modal.classList.contains("hidden")) {
          openPalette();
        } else {
          closePalette();
        }
      }
      if (e.key === "Escape") {
        if (!modal.classList.contains("hidden")) {
          closePalette();
        }
        const incModal = document.getElementById("incident-modal");
        if (incModal && !incModal.classList.contains("hidden")) {
          incModal.classList.add("hidden");
        }
        const methModal = document.getElementById("methodology-modal");
        if (methModal && !methModal.classList.contains("hidden")) {
          methModal.classList.add("hidden");
        }
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePalette();
    });

    function renderResults(query) {
      const q = query.trim().toLowerCase();
      results.innerHTML = "";

      const matchedIncidents = data.incidents.filter(i => 
        !q || i.target.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.state.toLowerCase().includes(q) || i.threat_actor.toLowerCase().includes(q)
      ).slice(0, 6);

      const matchedStates = data.states.filter(s =>
        !q || s.name.toLowerCase().includes(q)
      ).slice(0, 3);

      if (matchedIncidents.length === 0 && matchedStates.length === 0) {
        results.innerHTML = `<div class="p-4 text-xs text-zinc-500 font-mono text-center">No intelligence records match "${query}"</div>`;
        return;
      }

      if (matchedStates.length > 0) {
        const stateHead = document.createElement("div");
        stateHead.className = "px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider";
        stateHead.innerText = "State Risk Nodes";
        results.appendChild(stateHead);

        matchedStates.forEach(st => {
          const item = document.createElement("div");
          item.className = "command-item";
          item.innerHTML = `
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-map-pin text-blue-500 text-xs"></i>
              <span class="font-bold">${st.name}</span>
              <span class="text-xs text-zinc-500">• ₹${st.loss_cr.toLocaleString()} Cr Loss</span>
            </div>
            <span class="text-[10px] font-mono text-zinc-400">Risk: ${st.vulnerability_idx || 65}/100</span>
          `;
          item.addEventListener("click", () => {
            closePalette();
            switchTab("map");
            updateSelectedStateCard(st);
          });
          results.appendChild(item);
        });
      }

      if (matchedIncidents.length > 0) {
        const incHead = document.createElement("div");
        incHead.className = "px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mt-2";
        incHead.innerText = "Verified OSINT Incident Records";
        results.appendChild(incHead);

        matchedIncidents.forEach(inc => {
          const item = document.createElement("div");
          item.className = "command-item";
          item.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">${inc.id}</span>
              <span class="font-semibold">${inc.target}</span>
              <span class="text-xs text-zinc-500">• ${inc.category}</span>
            </div>
            <span class="text-xs font-mono font-bold text-black dark:text-white">₹${inc.loss_cr.toFixed(1)} Cr</span>
          `;
          item.addEventListener("click", () => {
            closePalette();
            openModal(inc.id);
          });
          results.appendChild(item);
        });
      }
    }

    input.addEventListener("input", (e) => {
      renderResults(e.target.value);
    });
  }

  // ==========================================================================
  // 3D Card Hover Perspective Effect
  // ==========================================================================
  function initTiltCards() {
    document.querySelectorAll(".tilt-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / rect.height) * 3;
        const rotateY = (x / rect.width) * 3;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  // ==========================================================================
  // ISRO Bhuvan Spatial Risk Engine
  // ==========================================================================
  function initBhuvanISROMapOnly(states) {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    if (!mapInstance) {
      mapInstance = L.map("map", {
        center: [22.5937, 78.9629],
        zoom: 5,
        minZoom: 4,
        maxZoom: 9,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: 'ISRO Bhuvan Geo-Spatial Reference',
        maxZoom: 9,
        minZoom: 4
      }).addTo(mapInstance);
    }

    renderBhuvanStateChoropleth(states);
    renderPinpointLocations();

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);
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
        className: "custom-hub-pin",
        html: pinHtml,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(hub.coords, { icon: customIcon }).addTo(pinMarkersGroup);

      marker.bindPopup(`
        <div class="p-3 space-y-1.5 font-sans">
          <div class="text-[10px] font-mono font-bold text-zinc-500 uppercase">ISRO Bhuvan Spatial Node</div>
          <div class="font-bold text-xs text-zinc-900 font-display">${hub.name}</div>
          <div class="text-xs text-zinc-600">Category: <strong>${hub.type}</strong></div>
          <div class="text-xs text-zinc-900 font-mono font-bold">Reported Loss: ${hub.loss}</div>
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
    if (threatElem) threatElem.innerText = `Primary Threat: ${stData.dominant_threat || "Digital Arrest & Investment Extortion"}`;
    if (compElem) compElem.innerText = (stData.complaints || 0).toLocaleString();
    if (lossElem) lossElem.innerText = `₹${(stData.loss_cr || 0).toFixed(2)} Cr`;
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
              <div class="font-bold text-zinc-900 font-display">${stName}</div>
              <div class="text-zinc-600 font-mono text-[11px]">Loss: ₹${(stData.loss_cr || 0).toLocaleString()} Cr</div>
              <div class="text-zinc-500 font-mono text-[10px]">Vulnerability: ${stData.vulnerability_idx || 50}/100</div>
            </div>
          `, { sticky: true });

          layer.on({
            mouseover: function(e) {
              const l = e.target;
              l.setStyle({ weight: 2.5, color: "#09090B", fillOpacity: 0.85 });
              l.bringToFront();
            },
            mouseout: function(e) {
              geoJsonLayer.resetStyle(e.target);
            },
            click: function() {
              updateSelectedStateCard(stData);
            }
          });
        }
      }).addTo(mapInstance);
    }

    renderStateLeaderboard(states);
  }

  function renderStateLeaderboard(states) {
    const listContainer = document.getElementById("state-leaderboard-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    states.slice(0, 10).forEach((st, idx) => {
      const item = document.createElement("div");
      item.className = "flex items-center justify-between p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-400 transition cursor-pointer text-xs";
      
      item.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-mono font-bold text-[10px]">#${idx + 1}</span>
          <span class="font-semibold text-zinc-900 dark:text-zinc-100 font-sans">${st.name}</span>
        </div>
        <div class="text-right font-mono">
          <span class="font-bold text-black dark:text-white">₹${st.loss_cr.toLocaleString()} Cr</span>
          <span class="text-[10px] text-zinc-500 block">${st.complaints.toLocaleString()} cases</span>
        </div>
      `;

      item.addEventListener("click", () => {
        updateSelectedStateCard(st);
      });

      listContainer.appendChild(item);
    });
  }

  function setupStateSorting(states) {
    document.querySelectorAll(".sort-state-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sort-state-btn").forEach(b => {
          b.classList.remove("active", "bg-zinc-900", "text-white", "dark:bg-zinc-100", "dark:text-zinc-900");
          b.classList.add("bg-zinc-100", "dark:bg-zinc-800", "text-zinc-600", "dark:text-zinc-400");
        });

        btn.classList.add("active", "bg-zinc-900", "text-white", "dark:bg-zinc-100", "dark:text-zinc-900");
        btn.classList.remove("bg-zinc-100", "dark:bg-zinc-800", "text-zinc-600", "dark:text-zinc-400");

        currentSort = btn.getAttribute("data-sort");
        renderBhuvanStateChoropleth(states);
      });
    });
  }

  // Sector Impact Cards
  function renderSectorCards() {
    const sectors = [
      { name: "Banking & Financial Services (BFSI)", icon: "fa-building-columns", risk: "CRITICAL", loss: "₹24,800 Cr", threat: "Digital Arrest, Fake Demat Trading, AEPS Stencils", cve: "CVE-2023-38831", badge: "rose" },
      { name: "Healthcare & MedTech Infrastructure", icon: "fa-hospital", risk: "HIGH", loss: "₹6,400 Cr", threat: "AIIMS-Style Ransomware & EHR Database Leaks", cve: "CVE-2022-26923", badge: "rose" },
      { name: "Critical Power & Energy Dispatch Grids", icon: "fa-bolt", risk: "HIGH", loss: "₹8,200 Cr", threat: "RedEcho / ShadowPad State-Sponsored Probes", cve: "CVE-2021-44228", badge: "amber" },
      { name: "E-Commerce, Logistics & Retail", icon: "fa-cart-shopping", risk: "MEDIUM", loss: "₹11,500 Cr", threat: "Part-Time Task Fraud & Fake Courier Customs IVR", cve: "CVE-2023-36884", badge: "amber" },
      { name: "Government Digital Public Infrastructure", icon: "fa-landmark", risk: "HIGH", loss: "₹9,800 Cr", threat: "CoWIN / ICMR Scraping, Spear-Phishing", cve: "CVE-2023-23397", badge: "blue" },
      { name: "IT, Telecom & Cloud Service Providers", icon: "fa-server", risk: "CRITICAL", loss: "₹7,800 Cr", threat: "SIM-Box Bypass, Unauthorized IMEI Cloning", cve: "CVE-2024-1709", badge: "rose" }
    ];

    const container = document.getElementById("sectors-grid");
    if (!container) return;

    container.innerHTML = "";
    sectors.forEach(sec => {
      const card = document.createElement("div");
      card.className = "precision-card p-4 space-y-3 tilt-card";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center text-xs">
            <i class="fa-solid ${sec.icon}"></i>
          </div>
          <span class="status-badge ${sec.badge}">${sec.risk}</span>
        </div>
        <div>
          <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-display">${sec.name}</h4>
          <span class="text-xs font-mono font-bold text-black dark:text-white">${sec.loss} Total Loss</span>
        </div>
        <p class="text-xs text-zinc-500 font-sans leading-tight">Primary Vector: ${sec.threat}</p>
        <div class="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span>Observed CVE:</span>
          <strong class="text-zinc-700 dark:text-zinc-300">${sec.cve}</strong>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Landmark Breaches Grid
  function renderLandmarkIncidents(incidents) {
    const container = document.getElementById("landmark-incidents-grid");
    if (!container || !incidents) return;

    const landmarks = incidents.filter(i => i.severity === "CRITICAL").slice(0, 8);
    container.innerHTML = "";
    landmarks.forEach(inc => {
      const card = document.createElement("div");
      card.className = "precision-card-subtle p-3.5 flex flex-col justify-between space-y-2 cursor-pointer hover:border-zinc-400 transition group tilt-card";
      card.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded">${inc.id}</span>
            <span class="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">₹${inc.loss_cr.toFixed(2)} Cr</span>
          </div>
          <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors font-display">${inc.target}</h4>
          <p class="text-[11px] text-zinc-500 leading-tight font-sans">${inc.category} (${inc.threat_actor})</p>
        </div>
        <div class="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
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

  // Fraud Taxonomy Grid (Rich Visual Infographic Cards)
  function renderFraudTaxonomy(fraudList) {
    const container = document.getElementById("fraud-taxonomy-grid");
    if (!container || !fraudList) return;

    const categoryIcons = {
      "Digital Arrest Scams": { icon: "fa-user-ninja", color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)" },
      "UPI / QR Code Fraud": { icon: "fa-qrcode", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)" },
      "Part-time Job & Crypto Fraud": { icon: "fa-briefcase", color: "#10B981", bg: "rgba(16, 185, 129, 0.12)" },
      "Banking Trojans & Phishing": { icon: "fa-shield-virus", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)" },
      "Customer Support & KYC Spoofing": { icon: "fa-headset", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.12)" },
      "Aadhaar / AEPS Biometric Fraud": { icon: "fa-fingerprint", color: "#EC4899", bg: "rgba(236, 72, 153, 0.12)" }
    };

    const totalLoss = fraudList.reduce((acc, curr) => acc + curr.loss_cr, 0);
    container.innerHTML = "";

    fraudList.forEach(f => {
      const meta = categoryIcons[f.category] || { icon: "fa-triangle-exclamation", color: "#64748B", bg: "rgba(100, 116, 139, 0.12)" };
      const sharePct = totalLoss > 0 ? ((f.loss_cr / totalLoss) * 100).toFixed(1) : "0";

      const card = document.createElement("div");
      card.className = "precision-card p-4 space-y-3 tilt-card hover:border-zinc-400 transition";
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style="background-color: ${meta.bg}; color: ${meta.color}">
              <i class="fa-solid ${meta.icon}"></i>
            </div>
            <div>
              <h3 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-display">${f.category}</h3>
              <span class="text-[10px] font-mono text-zinc-500">${sharePct}% of Total Losses</span>
            </div>
          </div>
          <span class="text-sm font-mono font-bold text-black dark:text-white">₹${f.loss_cr.toLocaleString()} Cr</span>
        </div>

        <div class="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div class="h-1.5 rounded-full transition-all duration-500" style="width: ${sharePct}%; background-color: ${meta.color}"></div>
        </div>

        <p class="text-xs text-zinc-600 dark:text-zinc-400 font-sans line-clamp-2">${f.vector}</p>

        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500">
          <div class="bg-zinc-50 dark:bg-zinc-900 p-2 rounded border border-zinc-100 dark:border-zinc-800">
            <span class="block text-[9px] text-zinc-400">REPORTED CASES</span>
            <strong class="text-zinc-800 dark:text-zinc-200 text-xs">${f.cases.toLocaleString()}</strong>
          </div>
          <div class="bg-zinc-50 dark:bg-zinc-900 p-2 rounded border border-zinc-100 dark:border-zinc-800">
            <span class="block text-[9px] text-zinc-400">AVG VICTIM LOSS</span>
            <strong class="text-zinc-800 dark:text-zinc-200 text-xs">₹${Math.round(f.avg_loss_inr).toLocaleString()}</strong>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Timeline Milestones
  function renderTimelineMilestones(timeline) {
    const container = document.getElementById("timeline-container");
    if (!container || !timeline) return;

    container.innerHTML = "";
    timeline.forEach(m => {
      const item = document.createElement("div");
      item.className = "relative pl-6 pb-6 last:pb-0";
      item.innerHTML = `
        <div class="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100 border-2 border-white dark:border-zinc-900"></div>
        <div class="precision-card-subtle p-3.5 space-y-1 tilt-card">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-black dark:text-white">${m.date}</span>
            <span class="status-badge">${m.type}</span>
          </div>
          <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-display">${m.event}</h4>
          <p class="text-xs text-zinc-500 font-sans leading-tight">${m.impact}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // MITRE Matrix Table
  function renderMitreMatrix(mitreList) {
    const tbody = document.getElementById("mitre-table-body");
    if (!tbody || !mitreList) return;

    tbody.innerHTML = "";
    mitreList.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-mono text-xs font-bold">${m.tactic_id}: ${m.tactic}</td>
        <td class="font-mono text-xs">${m.technique_id} — ${m.technique_name}</td>
        <td class="text-center font-mono font-bold text-xs">${m.frequency}</td>
        <td class="text-xs text-zinc-600 dark:text-zinc-400 font-sans">${m.primary_vector}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Master Incident Repository Grid
  function renderRepositoryGrid(incidents) {
    const tbody = document.getElementById("incidents-table-body");
    if (!tbody || !incidents) return;

    tbody.innerHTML = "";
    incidents.slice(0, 50).forEach(inc => {
      const tr = document.createElement("tr");
      const badgeClass = inc.severity === "CRITICAL" ? "rose" : inc.severity === "HIGH" ? "amber" : "accent";

      tr.innerHTML = `
        <td class="font-mono font-bold text-xs">${inc.id}</td>
        <td class="font-mono text-xs text-zinc-500">${inc.date}</td>
        <td class="text-xs font-sans">${inc.state}</td>
        <td class="font-semibold text-xs font-sans">${inc.target}</td>
        <td class="text-xs text-zinc-600 dark:text-zinc-400 font-sans">${inc.sector}</td>
        <td class="text-xs font-sans">${inc.category}</td>
        <td class="text-xs text-zinc-500 font-mono">${inc.threat_actor}</td>
        <td class="text-right font-mono font-bold text-xs">₹${inc.loss_cr.toFixed(2)}</td>
        <td class="text-center"><span class="status-badge ${badgeClass}">${inc.severity}</span></td>
        <td class="text-center">
          <button class="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded font-medium text-[11px] transition view-detail-btn font-mono cursor-pointer" data-id="${inc.id}">View</button>
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
