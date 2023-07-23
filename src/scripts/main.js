(function () {
  "use strict";

  // Preloader js
  // ------------------------------------------------------------
  window.addEventListener("load", (e) => {
    document.querySelector(".preloader").style.display = "none";
  });

  //sticky header
  // ------------------------------------------------------------
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 0) {
      header.classList.add("header-sticky");
    } else {
      header.classList.remove("header-sticky");
    }
  });

  // Navbar Toggler
  // ------------------------------------------------------------
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarMenu = document.querySelector("#nav-menu");

  navbarToggler?.addEventListener("click", () => {
    navbarToggler.classList.toggle("active");
    navbarMenu.classList.toggle("active");
  });

  // Dropdown Menu Toggler For Mobile
  // ------------------------------------------------------------
  const dropdownMenuToggler = document.querySelectorAll(
    ".nav-dropdown > .nav-link"
  );

  dropdownMenuToggler.forEach((toggler) => {
    toggler?.addEventListener("click", (e) => {
      e.target.parentElement.classList.toggle("active");
    });
  });

  // Swiper Sliders
  // ------------------------------------------------------------
  const reviewCarouselSwiper = new Swiper(".reviews-carousel", {
    loop: true,
    spaceBetween: 20,
    pagination: {
      el: ".reviews-carousel-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
  const authBannerCarouselSwiper = new Swiper(".auth-banner-carousel", {
    slidesPerView: 1,
    pagination: {
      el: ".auth-banner-carousel .pagination",
      type: "bullets",
      clickable: true,
    },
  });

  // Tab Component
  // ------------------------------------------------------------
  // Get all the tab groups on the page
  const tabGroups = document.querySelectorAll("[data-tab-group]");

  // Function to set the active tab for a given tab group
  function setActiveTab(tabGroup, tabName) {
    // Get the tabs nav and content for this tab group
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsContent = tabGroup.querySelector("[data-tab-content]");

    // Remove the active class from all tab nav items and content panes
    tabsNav.querySelectorAll("[data-tab]").forEach((tabNavItem) => {
      tabNavItem.classList.remove("active");
    });
    tabsContent.querySelectorAll("[data-tab-panel]").forEach((tabPane) => {
      tabPane.classList.remove("active");
    });

    // Add the active class to the selected tab nav item and content pane
    const selectedTabNavItem = tabsNav.querySelector(`[data-tab="${tabName}"]`);
    selectedTabNavItem.classList.add("active");
    const selectedTabPane = tabsContent.querySelector(
      `[data-tab-panel="${tabName}"]`
    );
    selectedTabPane.classList.add("active");
  }

  // Loop through each tab group
  tabGroups.forEach((tabGroup) => {
    // Get the tabs nav and content for this tab group
    const tabsNav = tabGroup.querySelector("[data-tab-nav]");
    const tabsNavItem = tabsNav.querySelectorAll("[data-tab]");

    // Get the active tab index from local storage, or default to 0 if not set
    const activeTabName =
      localStorage.getItem(`activeTabName-${tabGroup.dataset.tabGroup}`) ||
      tabsNavItem[0].getAttribute("data-tab");

    // Set the active tab
    setActiveTab(tabGroup, activeTabName);

    // Add a click event listener to each tab nav item
    tabsNavItem.forEach((tabNavItem) => {
      tabNavItem.addEventListener("click", (e) => {
        e.preventDefault();
        // Get the index of the clicked tab nav item
        const tabName = tabNavItem.dataset.tab;
        setActiveTab(tabGroup, tabName);

        // Save the active tab index to local storage
        localStorage.setItem(
          `activeTabName-${tabGroup.dataset.tabGroup}`,
          tabName
        );
      });
    });
  });

  // Counter
  // ------------------------------------------------------------
  function counter(el, duration) {
    const endValue = Number(el.innerText.replace(/\D/gi, ""));
    const text = el.innerText.replace(/\W|\d/gi, "");
    const timeStep = Math.round(duration / endValue);
    let current = 0;
    const timer = setInterval(() => {
      if (current > endValue) {
        current = endValue;
      } else {
        current += 1;
      }
      el.innerText = current + text;
      if (current === endValue) {
        clearInterval(timer);
      }
    }, timeStep);
  }

  document.querySelectorAll(".counter .count").forEach((count) => {
    counter(count, 500);
  });

  // Play Youtube Video
  // ------------------------------------------------------------
  const videoPlayBtn = document.querySelector(".video-play-btn");
  if (videoPlayBtn) {
    videoPlayBtn.addEventListener("click", function () {
      const videoPlayer = this.closest(".video").querySelector(".video-player");
      videoPlayer.classList.remove("hidden");
    });
  }

  // Accordion component
  // ------------------------------------------------------------
  const accordion = document.querySelectorAll("[data-accordion]");
  accordion.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionItem = header.parentElement;
      accordionItem.classList.toggle("active");
    });
  });

  // Shuffle
  // ------------------------------------------------------------
  const filterItems = document.querySelector(".filter-items");
  if (filterItems) {
    const myShuffle = new Shuffle(filterItems, {
      itemSelector: ".filter-items > *",
      sizer: ".filter-items > *",
      buffer: 1,
    });
    const tabLinks = document.querySelectorAll(".filter-btn");
    tabLinks.forEach((tabItem) => {
      tabItem.addEventListener("click", function (e) {
        e.preventDefault();
        let filter;
        const group = tabItem.getAttribute("data-group");
        filter = group;
        if (filter === "all") {
          filter = Shuffle.ALL_ITEMS;
        }
        tabLinks.forEach((link) => link.classList.remove("filter-btn-active"));
        this.classList.add("filter-btn-active");
        myShuffle.filter(filter);
      });
    });
  }
})();
