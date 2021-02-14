const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchField = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");

// selected image
let sliders = [];

const key = "20264296-53f22ab187689f2f025535ebc";

// images fetching API function
const getImages = (query) => {
  loadSpinner();

  fetch(
    `https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits)) /////// BUG:1
    .catch((err) => console.log(err));
};

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";

  // show gallery title
  galleryHeader.style.display = "flex";

  if (images.length !== 0) {
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  } else {
    ///// EXTRA FEATURE 1: NO IMAGES FOUND //////
    let div = document.createElement("div");
    div.className = "no-result";
    div.innerHTML = `No Image Found!`;
    gallery.appendChild(div);
    imagesArea.style.display = "none";
  }

  loadSpinner();
};

let slideIndex = 0;

const selectItem = (event, img) => {
  let element = event.target;

  /////////////////// FEATURE 1: TOGGLE IMAGE & UPDATING ARRAY ISSUE //////////////
  element.classList.toggle("added");
  let item = sliders.indexOf(img);

  if (item === -1) {
    sliders.push(img);
  } else {
    const updateSliders = sliders.filter((singleImg) => singleImg !== img);
    sliders = updateSliders;
  }
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }

  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";

  // hide image aria
  imagesArea.style.display = "none";
  gallery.style.display = "none";

  ////// BUG 3: FIXING NEGATIVE DURATION ISSUE ///////
  const durationValue = document.getElementById("duration").value; /////// BUG: 3
  let duration;

  if (durationValue < 0) {
    duration = 1000;
  } else {
    duration = durationValue || 1000;
  }

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
});

/////// FEATURE 2: ADDING KEY 'ENTER' TO SEARCH BUTTON /////////
searchField.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    searchBtn.click();
  }
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

//////// EXTRA FEATURE 2: SPINNER TOGGLE ///////
const loadSpinner = () => {
  const spinnerId = document.getElementById("spinner-circle");
  const imageBox = document.getElementById("image-box");
  spinnerId.classList.toggle("d-none");
  imageBox.classList.toggle("d-none");
};
