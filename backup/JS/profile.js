const urlParams = new URLSearchParams(window.location.search);
const clickedPostId = urlParams.get("postId") || getCurrentUser().id;

///////////////////// fetching common HTML Elements ///////////////////////////////////

// Fetch and insert the header
window.addEventListener("load", async function () {
  await fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("nav").innerHTML = data;
    })
    .then(() => {
      changeProfileData(clickedPostId);
      changeUI();
      show_data(clickedPostId);
      fetchModals();
    });
});

/////////////////////===== fetching common HTML Elements =====///////////////////////////////////

////////////////////////////////////// current user posts /////////////////////////////////////////////////////////////////////////

function getUserPosts(userId) {
  if (getCurrentUser() != undefined && userId == undefined) {
    userId = getCurrentUser().id;
  }
  // console.log(userId)
  return axios.get(`${baseUrl}/users/${userId}/posts`);
}

function postsAPI(clickPostAuthorId) {
  return getUserPosts(clickPostAuthorId).then((response) => {
    let posts = response.data.data;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i]["image"].length == undefined) {
        continue;
      }

      let hasToken = localStorage.getItem("login-token") !== undefined;

      addPostToDOM(posts[i], true, hasToken);
    }
  });
}

//////////////////////////////////////==  current user posts  ==///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////  changing profile data  //////////////////////////////////////

function changeProfileData(currentUser) {
  let userImg = document.getElementById("user-image");
  let uerName = document.getElementById("user-profile-name");
  let userEmail = document.getElementById("user-email");
  let postsNum = document.getElementById("posts-num");
  let commNum = document.getElementById("comm-num");

  axios.get(`${baseUrl}/users/${currentUser}`).then((response) => {
    let user = response.data.data;

    if (typeof user.profile_image == "object") {
      userImg.src = "images/default-avatar.png";
    } else {
      userImg.src = user.profile_image;
    }
    uerName.textContent = user.username;
    userEmail.textContent = user.email;
    postsNum.textContent = user.posts_count;
    commNum.textContent = user.comments_count;
  });
}

////////////////////////////////////// == changing profile data == //////////////////////////////////////
