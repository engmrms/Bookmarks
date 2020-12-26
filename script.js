const showModalEl = document.getElementById("show-modal");
const modal = document.getElementById("modal");
const closeModalEle = document.getElementById("close-modal");

const bookmarkForm = document.getElementById("bookmark-form");
const websiteName = document.getElementById("website-name");
const websiteUrl = document.getElementById("website-url");
const btn = document.querySelector("button");

const bmContainer = document.getElementById("bm-container");

let bookmarks = [];
// Show Modal , focus on Input

function showModal() {
  modal.classList.add("show-modal");
  websiteName.focus();
}
showModalEl.addEventListener("click", showModal);

// /close Modal

function closeModal() {
  modal.classList.remove("show-modal");
}
closeModalEle.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  e.target === modal ? closeModal() : false;
});

// display  html bookmarks
function buildBookmarks() {
  //Reset bookmark container
  bmContainer.innerHTML = "";
  //Start draw html dom
  bookmarks.forEach((boomatk) => {
    const { name, url } = boomatk;

    const item = document.createElement("div");
    item.classList.add("item");

    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    const linkInfo = document.createElement("div");
    linkInfo.classList.add(name);

    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bmContainer.append(item);
  });
}

// Fetch bookmarks
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "google",
        url: "https://google.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) bookmarks.splice(i, 1);
  });
  //update bookmarks array in localstorage;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// handaling data from bookmark form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteName.value;
  let urlValue = websiteUrl.value;
  if (!urlValue.includes("http://") && !urlValue.includes("https://"))
    urlValue = `https://${urlValue}`;

  if (!validateForm(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteUrl.focus();
}

function validateForm(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit value for both fields");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please Provide a valid web site address");
    return false;
  }
  return true;
}

bookmarkForm.addEventListener("submit", storeBookmark);

// onLoad
fetchBookmarks();
