let currentPostPage = 1;
let lastPostPage = 129;

///////////////////// fetching common HTML Elements ///////////////////////////////////

// Fetch and insert the header
window.addEventListener("load", async function () {
  await fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("nav").innerHTML = data;
    })
    .then(() => {
      show_data(currentPostPage);
      fetchModals();
      changeUI();
    });
});
/////////////////////===== fetching common HTML Elements =====///////////////////////////////////

////////////////////////////////////// page posts /////////////////////////////////////////////////////////////////////////

function getAllPosts(page) {
  return axios.get(`${baseUrl}/posts?limit=30&page=${page}`);
}

function postsAPI(page) {
  return getAllPosts(page).then((response) => {
    let posts = response.data.data;
    lastPostPage = response.data.meta.last_page;
    for (let i = 9; i < posts.length; i++) {
      if (posts[i]["image"].length == undefined) {
        continue;
      }

      let hasToken = localStorage.getItem("login-token") !== undefined;

      addPostToDOM(posts[i], false, hasToken);
    }
  });
}

//////////////////////////////////////  infinite scrolling  //////////////////////////////////////

window.addEventListener("scroll", () => {
  let endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 10;
  if (endOfPage && currentPostPage <= lastPostPage) {
    show_data(++currentPostPage);
  }
});

//////////////////////////////////////==  infinite scrolling  ==//////////////////////////////////////
