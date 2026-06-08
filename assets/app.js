const DATA_URL = "data/site-data.json";

const routeName = document.body.dataset.page || "home";

async function loadSiteData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error("Site data could not be loaded.");
  }
  return response.json();
}

function setText(selector, text) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
}

function renderShell(data) {
  setText("[data-site-name]", data.site.name);
  setText("[data-logo-text]", data.site.logoText);
  setText("[data-copyright]", data.site.copyright);

  document.querySelectorAll("[data-nav]").forEach((nav) => {
    nav.innerHTML = data.navigation
      .map((item) => {
        const current = item.url.includes(routeName === "home" ? "index" : routeName);
        return `<a href="${item.url}" ${current ? 'aria-current="page"' : ""}>${item.label}</a>`;
      })
      .join("");
  });
}

function albumCard(album) {
  return `
    <article class="album-card">
      <img src="${album.coverImageUrl}" alt="${album.coverImageAlt}" loading="lazy">
      <div class="album-card-body">
        <p class="album-meta">${album.date} / ${album.photoCount} 张照片</p>
        <h3>${album.title}</h3>
        <p>${album.summary}</p>
      </div>
    </article>
  `;
}

function renderAlbums(data) {
  const latestAlbumGrid = document.querySelector("[data-latest-albums]");
  const albumsPageGrid = document.querySelector("[data-albums-page]");

  if (latestAlbumGrid) {
    latestAlbumGrid.innerHTML = data.latestAlbums.map(albumCard).join("");
  }

  if (albumsPageGrid) {
    albumsPageGrid.innerHTML = data.latestAlbums.map(albumCard).join("");
  }
}

function renderHero(data) {
  const hero = document.querySelector("[data-hero]");
  const dots = document.querySelector("[data-hero-dots]");
  if (!hero || !dots) return;

  hero.innerHTML = data.heroSlides
    .map((slide, index) => `
      <article class="hero-slide ${index === 0 ? "is-active" : ""}">
        <img src="${slide.imageUrl}" alt="${slide.imageAlt}">
        <div class="hero-copy">
          <p class="eyebrow">${slide.date} / ${slide.location}</p>
          <h1>${slide.title}</h1>
          <p>${slide.caption}</p>
        </div>
      </article>
    `)
    .join("");

  dots.innerHTML = data.heroSlides
    .map((_, index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" aria-label="查看第 ${index + 1} 张照片"></button>`)
    .join("");

  const slides = [...hero.querySelectorAll(".hero-slide")];
  const dotButtons = [...dots.querySelectorAll("button")];
  let activeIndex = 0;

  function activateSlide(index) {
    slides[activeIndex].classList.remove("is-active");
    dotButtons[activeIndex].classList.remove("is-active");
    activeIndex = index;
    slides[activeIndex].classList.add("is-active");
    dotButtons[activeIndex].classList.add("is-active");
  }

  dotButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateSlide(index));
  });

  window.setInterval(() => {
    activateSlide((activeIndex + 1) % slides.length);
  }, 5200);
}

function renderFeatured(data) {
  const list = document.querySelector("[data-featured]");
  if (!list) return;

  list.innerHTML = data.featuredPhotos
    .map((photo) => `
      <article class="feature-item">
        <div class="feature-image">
          <img src="${photo.imageUrl}" alt="${photo.imageAlt}" loading="lazy">
        </div>
        <div class="feature-copy">
          <p class="album-meta">${photo.date} / ${photo.location}</p>
          <h3>${photo.title}</h3>
          <p>${photo.description}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderProfile(data) {
  const profile = document.querySelector("[data-profile-card]");
  if (!profile) return;

  profile.innerHTML = `
    <img src="${data.profile.avatarUrl}" alt="${data.profile.avatarAlt}" loading="lazy">
    <div>
      <p class="album-meta">${data.profile.role}</p>
      <h2>${data.profile.name}</h2>
      <p>${data.profile.bio}</p>
    </div>
    <a class="button-link" href="about.html">关于</a>
  `;
}

function renderAbout(data) {
  const aboutTitle = document.querySelector("[data-about-title]");
  const aboutDescription = document.querySelector("[data-about-description]");
  const aboutDetails = document.querySelector("[data-about-details]");
  const aboutInterests = document.querySelector("[data-about-interests]");
  if (!aboutTitle) return;

  aboutTitle.textContent = data.about.title;
  aboutDescription.textContent = data.about.description;
  aboutDetails.innerHTML = `
    <p>${data.about.owner}</p>
    <p>${data.about.location}</p>
    <p>${data.about.email}</p>
  `;
  aboutInterests.innerHTML = data.about.interests.map((item) => `<li>${item}</li>`).join("");
}

loadSiteData()
  .then((data) => {
    renderShell(data);
    renderHero(data);
    renderAlbums(data);
    renderFeatured(data);
    renderProfile(data);
    renderAbout(data);
  })
  .catch((error) => {
    console.error(error);
  });
