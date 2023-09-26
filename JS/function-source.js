const baseUrl = "https://tarmeezacademy.com/api/v1";
//// BOM elements
let closeBtn = document.getElementById("close-btn");
let newPostBtn = document.getElementById("new-post-btn");
const postsContainer = document.getElementById("posts");

///////////////////// fetching common HTML Elements ///////////////////////////////////

function fetchModals() {
  fetch("modals.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("modals-alerts").innerHTML = data;
    })
    .then(() => {
      setTheme();
    });
}

///////////////////// get last theme from local Storage ///////////////////////////////////

function setTheme() {
  let currentTheme = localStorage.getItem("social-theme");
  let themeBtn = document.querySelector(".theme-btn");

  if (currentTheme !== null) {
    if (currentTheme === "light") {
      document.body.classList.add("body-light");
      themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else {
      themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
  }
}

///////////////////// get last theme from local Storage ///////////////////////////////////

/////////////////////===== fetching common HTML Elements =====///////////////////////////////////

////////////////////////////////////// page posts /////////////////////////////////////////////////////////////////////////

function addPostToDOM(post, addToTopPosts = false) {
  let usrName = post["author"]["username"];
  let authorId = post["author"]["id"];
  let creationTime = post["created_at"];
  let profileImg = post["author"]["profile_image"];
  let postTitle = post["body"];
  let commentsNum = post["comments_count"];
  let postImg = post["image"];
  let postId = post["id"];
  let currentUsrId = 0;
  if (getCurrentUser() != undefined) {
    currentUsrId = getCurrentUser().id;
  }
  let hasToken = localStorage.getItem("login-token") != null;
  let showORHideEdit = authorId == currentUsrId ? "" : "display : none";
  let deleteBtnAction = "";
  if (currentUsrId == authorId) {
    deleteBtnAction = `deletePost(${postId} ,  ${authorId})`;
  } else {
    deleteBtnAction = `hidePost(${postId})`;
  }

  let card = document.createElement("div");
  card.classList = "card shadow py-2 rounded-3";
  card.setAttribute(
    "style",
    "background-color: #18191a; color: #eeee; margin-bottom: 40px"
  );
  card.id = `id-` + postId;

  if (postImg == undefined) {
    postImg = "http://tarmeezacademy.com/images/posts/IJbgWkHHIkJTc7N.jpg";
  }

  if (typeof profileImg == "object") {
    profileImg =
      "http://tarmeezacademy.com/images/users/HXURiL3BNd1n58h.jpg" ||
      "images/default-avatar.png";
  }

  card.innerHTML = `
          <div class="card-header px-3 d-flex justify-content-between">
            <div
              class="d-flex gap-2"
              style="max-height: 70px; align-items: center;cursor:pointer;"
              onclick="openUserProfile(${authorId})"
            >
              <img
                class="rounded-circle"
                src="${profileImg}"
                style="max-width: 100%; width: 40px; height: 40px"
                alt="Profile-image"
              />
              <div class="g-xl-0">
                <div class="__usr-name" style="font-size: 14px">
                  @${usrName}
                </div>
                <div class="__time" style="font-size: 12px; color: grey">
                  ${creationTime}
                </div>
              </div>
            </div>
            <div class="__actions d-flex" style="align-items: center">
              <i id = "edit-post-btn" onclick = "editPost('${encodeURIComponent(
                JSON.stringify(post)
              )}' , ${postId}, ${authorId})"  class="bi bi-three-dots rounded-circle" title="Edit" style="cursor: pointer; margin-right: 4px ; ${showORHideEdit}"></i>
              <i id = "delete-post-btn" onclick="${deleteBtnAction}" class="bi bi-x-lg rounded-circle" title="${
    authorId == currentUsrId ? "Delete" : "Hide"
  }" style="cursor: pointer"></i>
            </div>
          </div>
          <div class="card-body">
            <h4 class="__post-title mb-3" style="font-size: 18px">
              ${postTitle}
            </h4>
            <div
              class="body-image d-flex align-items-center rounded-3 "
              style="min-height: 315px"
              onclick="maximizeImg()"
            >
              <img
                src="${postImg}"
                class="w-100 rounded-1"
                alt="post-img"
              />
              <div id="img-close-btn" onclick="minimizeImg()">
                <i class="bi bi-x-lg rounded-circle"style="cursor: pointer"></i>
              </div>
            </div>
            <div class="__posts_count d-flex justify-content-between my-2">
              <div class="d-flex gap-1">
                <div
                  class="__reaction-number d-flex"
                  style="max-height: 30px; width: 50px"
                >
                  <img src="images/like_.svg" alt="reaction" />
                  <img src="images/love_.svg" alt="reaction" />
                  <img src="images/wow_.svg" alt="reaction" />
                </div>
                <div class="__count" id = "count-${postId}" style="color: grey">${
    commentsNum * 4 + Math.trunc(Math.random() * 100)
  }</div>
              </div>
              <div
                class="d-flex justify-content-between gap-3"
                style="font-size: 14px; color: grey"
              >
                <div class="__comments-number">${
                  commentsNum + Math.trunc(Math.random() * 100)
                } comments</div>
                <div class="__share-number">${Math.trunc(
                  Math.random() * 50
                )} share</div>
              </div>
            </div>
            <div class="__reactions d-flex" style="color: grey">
              <div class="__like" onclick="ToggleLike(${postId})">
                  <i
                    data-visualcompletion="css-img"
                    class="x1b0d499 xq8hly8"
                    id="thumb-up-btn-${postId}"
                  ></i>
                Like
              </div>
              <div class="__comment" onclick="focusOnComment(${postId})">
                <i class="bi bi-chat-left"></i>
                Comment
              </div>
              <div class="__share">
                <i class="bi bi-share"></i>
                Share
              </div>
            </div>
            <div class="__adding-comment w-100 d-flex gap-1 ${
              !hasToken ? " hide " : ""
            }" >
              <div class="image">
                  <i class="bi bi-person-circle fs-1" style="cursor: pointer"></i>  
              </div>
              <input
                type="text"
                class="px-3 py-2 rounded-5 w-100 input-comment"
                style="background-color: #242526; border: none; color: white"
                placeholder="Type a Comment..."
                name="post-comment"
                id="new-comm-input-${postId}"
              />
              <button onclick=" addNewAComment(${postId})" aria-label="Aria Name" title = "confirm adding comment">
                <i class="bi bi-caret-right-fill"></i>
              </button>
            </div>
            <div class="__other-comments w-100 d-flex gap-2 flex-column" id = "comm-${postId}">
            </div>
          </div>
  `;

  if (hasToken) {
    showAddingComments();
  } else {
    hideAddingComments();
  }

  if (addToTopPosts) {
    postsContainer.prepend(card);
  } else {
    postsContainer.appendChild(card);
  }
}

function getPosts(page) {
  return axios.get(`${baseUrl}/posts?limit=30&page=${page}`);
}

function postsAPI(page) {
  return getPosts(page).then((response) => {
    let posts = response.data.data;
    lastPostPage = response.data.meta.last_page;
    // console.log(posts);
    for (let i = 9; i < posts.length; i++) {
      if (posts[i]["image"].length == undefined) {
        continue;
      }

      addPostToDOM(posts[i], false);
    }
  });
}

async function show_data(authorIdOrPageNum) {
  await postsAPI(authorIdOrPageNum).then(() => {
    if (localStorage.getItem("user-info")) {
      loginUpdateUserInfo();
    }
  });
}

function getCurrentUser() {
  let user = undefined;
  const data = localStorage.getItem("user-info");
  if (data) {
    user = JSON.parse(data);
  }
  return user;
}

//////////////////////////////////////==  page posts  ==///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// register //////////////////////////////////////////////

function validateForm() {
  var name = document.getElementById("user-name-rg").value;
  var email = document.getElementById("email-rg").value;
  var password = document.getElementById("user-password-rg").value;

  // Regular expressions for name, email, and password validation
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!name.match(/.*[a-zA-Z].*/) || name.match(/[^a-zA-Z0-9]/)) {
    showStatusNow(
      "Name must contain only letters , numbers and spaces.❌",
      "danger",
      10
    );
    return false;
  }

  if (!email.match(emailRegex)) {
    showStatusNow("Invalid email address.❌", "danger", 5);
    return false;
  }

  if (!password.match(passwordRegex)) {
    showStatusNow(
      "Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter.❌ ",
      "danger",
      5
    );
    return false;
  }

  // If all validations pass, the form can be submitted
  return true;
}

async function registerRequest() {
  ////// run form validation
  // validateForm();

  if (!validateForm()) {
    return;
  }

  let userNameInput = document.getElementById("user-name-rg").value;
  let userPasswordInput = document.getElementById("user-password-rg").value;
  let accNameInput = document.getElementById("acc-name-rg").value;
  let emailInput = document.getElementById("email-rg").value;
  let userImgInput = document.getElementById("user-img").files[0];

  const formData = new FormData();
  formData.append("username", userNameInput);
  formData.append("password", userPasswordInput);
  formData.append("name", accNameInput);
  formData.append("email", emailInput);
  formData.append("image", userImgInput); // Get the selected file

  let registerRequestUrl = `${baseUrl}/register`;

  axios
    .post(registerRequestUrl, formData)
    .then((response) => {
      localStorage.setItem("login-token", response.data.token);
      localStorage.setItem("user-info", JSON.stringify(response.data.user));

      //// to close modal (my method)
      // closeBtn.click();

      // //// another way to close modal

      const registerModal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(registerModal);
      modalInstance.hide();

      changeUI();
      loginUpdateUserInfo();
      showStatusNow("User registered successfully ✅", "success");
    })
    .catch((response) => {
      showStatusNow(
        "Felid to Register user! ❌\n" + response.response.data.message,
        "danger"
      );
    });
}

//////////////////////////////////////==  register  ==////////////////////////////////////////////////

////////////////////////////////////// login ////////////////////////////////////////////////////

function loginRequest() {
  let userName = document.getElementById("user-name").value;
  let userPassword = document.getElementById("user-password").value;

  if (userName.length === 0 || userPassword.length === 0) {
    showSignInMsg("You can not login with empty data❌", "danger");
    return;
  }

  let prams = {
    username: `${userName}`,
    password: `${userPassword}`,
  };

  let loginRequestUrl = `${baseUrl}/login`;

  axios
    .post(loginRequestUrl, prams)
    .then((response) => {
      localStorage.setItem("login-token", response.data.token);
      localStorage.setItem("user-info", JSON.stringify(response.data.user));

      //// to close modal (my method)
      // closeBtn.click();

      //// another way to close modal
      const loginModal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      modalInstance.hide();

      changeUI();
      loginUpdateUserInfo();
      showStatusNow("Logged in successfully ✅", "success");
    })
    .catch((response) => {
      const errorMsg =
        "Felid to login! ❌: \n" + response.response.data.message;
      showStatusNow(errorMsg, "danger");
      console.log(response.response.data.message);
    });
}

//////////////////////////////////////==  login  ==////////////////////////////////////////////////////

////////////////////////////////////// logout //////////////////////////////////////////////////

function logoutRequest() {
  localStorage.removeItem("login-token");
  localStorage.removeItem("user-info");
  changeUI();
  logoutUpdateUserInfo();
  showStatusNow("Logged out successfully ✅", "success");
}

//////////////////////////////////////==  logout  ==/////////////////////////////////////////////////

////////////////////////////////////// change UI //////////////////////////////////////////////

function changeUI() {
  const token = window.localStorage.getItem("login-token");
  let loginBtn = document.getElementById("login-btn");
  let logoutBtn = document.getElementById("logout-btn");
  let registerBtn = document.getElementById("register-btn");
  let userImg = document.getElementById("usr-img");
  let profileLink = document.getElementById("profile-link");
  if (token == null) {
    // all var are in the top

    //// there is no user signed
    userImg.style.display = "none";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    if (newPostBtn !== null) {
      newPostBtn.style.display = "none";
    }
    profileLink.setAttribute("href", "#");
    hideAddingComments();
  } else {
    userImg.style.display = "block";
    logoutBtn.style.display = "block";
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    if (newPostBtn !== null) {
      newPostBtn.style.display = "block";
    }
    profileLink.setAttribute("href", "profile.html");
    showAddingComments();
  }
  ////// change active page

  let pages = Array.from(document.querySelectorAll(".nav-link"));
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  let HTMLName = document.location.pathname.slice(1);

  if (HTMLName == "index.html") {
    pages[0].classList.add("active");
  }

  if (HTMLName == "profile.html") {
    pages[1].classList.add("active");
    document.getElementById("home-btn").src = "images/svg/home.svg";
  }
}

function loginUpdateUserInfo() {
  let userImg = document.getElementById("usr-img");
  let navUserImg = document.getElementById("nav-profile-img");
  let userInfo = JSON.parse(localStorage.getItem("user-info"));
  let profileImagePath = userInfo["profile_image"];
  let userName = userInfo.username;

  let userNameContainer = document.getElementById("nav-user-name");

  // console.log(userName);

  if (userNameContainer != null) {
    userNameContainer.textContent = userName;
  }

  if (navUserImg != null) {
    if (profileImagePath != null) {
      navUserImg.src = profileImagePath;
    } else {
      navUserImg.src = "images/default-avatar.png";
    }
  }

  for (let i = 0; i < postsContainer.children.length; i++) {
    const imageDOM = `
      <div class="image">
      <img
      class="rounded-circle current-usr-img"
      id="current-usr"
      src="${profileImagePath}"
      style="max-width: 100%; width: 40px; height: 40px; cursor:pointer;"
      alt="Profile-image"
      title = "${userName}"
      />
      </div>`;
    if (profileImagePath != null) {
      postsContainer.children[i].children[1].children[4].children[0].innerHTML =
        imageDOM;
      userImg.innerHTML = imageDOM;
    } else {
      postsContainer.children[
        i
      ].children[1].children[4].children[0].innerHTML = `<i class="bi bi-person-circle fs-1" style="cursor: pointer"></i>`;
    }
  }
}

function logoutUpdateUserInfo() {
  let userImg = document.getElementById("usr-img");
  let navUserImg = document.getElementById("nav-profile-img");
  for (let i = 0; i < postsContainer.children.length; i++) {
    postsContainer.children[
      i
    ].children[1].children[4].children[0].innerHTML = `<i class="bi bi-person-circle fs-1" style="cursor: pointer"></i>`;
    navUserImg.src = "images/default-avatar.png";
    document.getElementById("nav-user-name").textContent = "Gest";
  }
}

function hideAddingComments() {
  document.querySelectorAll(".__adding-comment").forEach((comm) => {
    comm.classList.add("hide");
  });
}

function showAddingComments() {
  document.querySelectorAll(".__adding-comment").forEach((comm) => {
    comm.classList.remove("hide");
  });
}

function loginUpdateUsername() {
  let userName = getCurrentUser().username;
  console.log(userName);
}
function logoutUpdateUsername() {
  let userName = getCurrentUser().username;
  console.log(userName);
}

//////////////////////////////////////==  change UI  ==//////////////////////////////////////////

////////////////////////////////////// Login Alert  //////////////////////////////////////////

function showStatusNow(msg, msgType, time = 3) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} curr-alert alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close close-alert" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  appendAlert(msg, msgType);
  setTimeout(() => {
    document.querySelector(".curr-alert").style.opacity = " 0";
    document.querySelector(".close-alert").click();
  }, time * 1000);
}

//////////////////////////////////////==  Login Alert  ==//////////////////////////////////////////

////////////////////////////////////// Create a post //////////////////////////////////////

function prepareModalContentCreate() {
  document.getElementById("modal-post-title").innerHTML = "Create New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-description-input").innerHTML = "";
  document.getElementById("post-hashtag-input").innerHTML = "";
  document.querySelector(".create-or-edit").innerHTML = "Create";
  document.getElementById("is-new").value = "true";

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function openNewPostModal() {
  prepareModalContentCreate();
}

function createOrEditPost() {
  const postTitle = document.getElementById("post-title-input").value;
  const postDescription = document.getElementById(
    "post-description-input"
  ).value;
  const postImgInput = document.getElementById("post-img-input").files[0];
  //// todo : how to send tags correctly
  const postHashtagInput = document.getElementById("post-hashtag-input").value;

  const formData = new FormData();
  formData.append("title", postTitle);
  formData.append("body", postDescription);
  formData.append("image", postImgInput); // Get the selected file
  formData.append("tags", postHashtagInput);

  let apiUrl = "";
  const token = localStorage.getItem("login-token");
  let berarToken = {
    headers: {
      "Content-type": "multipart/form-data",
      " Authorization": `Bearer ${token}`,
    },
  };

  let isNew = document.getElementById("is-new").value == "true";
  let postId = document.getElementById("is-new").classList[0];
  let postUserId = document.getElementById("is-new").classList[1];
  let userId = getCurrentUser().id;

  if (!isNew && userId == postUserId) {
    apiUrl = baseUrl + "/posts/" + postId;
    formData.append("_method", "put");
    axios
      .post(apiUrl, formData, berarToken)
      .then((response) => {
        ////// remove the old post from DOM
        document.getElementById(`id-${postId}`).remove();
        ////// clear modal inputs
        clearModalInputs();
        console.log(response.data.data);
        addPostToDOM(response.data.data, true);
        const createPostModal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(createPostModal);
        modalInstance.hide();
        loginUpdateUserInfo();
        showStatusNow("Post was Edited successfully ✅", "success");
      })
      .catch((error) => {
        const errorMsg =
          "Felid to add a Edit post ! ❌ : " + error.response.data.message;
        showStatusNow(errorMsg, "danger");
      });
  } else if (isNew) {
    apiUrl = baseUrl + "/posts";
    axios
      .post(apiUrl, formData, berarToken)
      .then((response) => {
        // console.log(response);
        addPostToDOM(response.data.data, true);
        const createPostModal = document.getElementById("create-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(createPostModal);
        modalInstance.hide();
        loginUpdateUserInfo();
        showStatusNow("Post was added successfully ✅", "success");
      })
      .catch((error) => {
        const errorMsg =
          "Felid to add a new post ! ❌ : " + error.response.data.message;
        showStatusNow(errorMsg, "danger");
      });
  }
}

////////////////////////////////////// == Create a post == //////////////////////////////////////

////////////////////////////////////// Edit a post /////////////////////////////////////////////

function prepareModalContentEdit(post, postId, postUserId) {
  ///// changing post Title and fill section
  document.getElementById("modal-post-title").innerHTML = "Edit A post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-description-input").value = post.body;
  document.getElementById("post-hashtag-input").innerHTML = post.tags;
  document.querySelector(".create-or-edit").innerHTML = "Update post";
  document.getElementById("is-new").value = "false";
  document.getElementById("is-new").classList = `${postId} ${postUserId} `;

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function clearModalInputs() {
  document.getElementById("post-title-input").value = "f";
  document.getElementById("post-description-input").value = "";
  document.getElementById("post-hashtag-input").value = "";
  document.getElementById("post-img-input").value = "";
}

function editPost(postObject, postId, postUserId) {
  let post = JSON.parse(decodeURIComponent(postObject));
  prepareModalContentEdit(post, postId, postUserId);
  // createOrEditPost(false, post.id, post.author.id);
}

////////////////////////////////////// == Edit a post == //////////////////////////////////////

//////////////////////////////////////  Delete a post  //////////////////////////////////////

function deletePost(postId, authorId) {
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();

  document.getElementById(
    "delete-post-data"
  ).classList = `${postId} ${authorId}`;
}

function confirmDeletePost() {
  let currentUserId = getCurrentUser().id;
  let postId = document.getElementById("delete-post-data").classList[0];
  let authorId = document.getElementById("delete-post-data").classList[1];

  if (authorId == currentUserId) {
    let url = `${baseUrl}/posts/${postId}`;
    let token = localStorage.getItem("login-token");
    let berarToken = {
      headers: {
        "Content-type": "multipart/form-data",
        " Authorization": `Bearer ${token}`,
      },
    };
    axios
      .delete(url, berarToken)
      .then(() => {
        //// delete post from DOM
        document.getElementById(`id-${postId}`).remove();
        document.getElementById("hide-delete-post-modal").click();
        showStatusNow("Post was deleted successfully✅", "success");
      })
      .catch((error) => {
        const errorMsg =
          "Felid to delete post ! ❌ : " + error.response.data.message;
        showStatusNow(errorMsg, "danger");
      });
  }
}

////////////////////////////////////// == Delete a post == //////////////////////////////////////

//////////////////////////////////////  Hide a post  //////////////////////////////////////

function hidePost(postId) {
  document.getElementById(`id-${postId}`).style.display = "none";

  // console.log(postId);
}

////////////////////////////////////// == Hide a post == //////////////////////////////////////

////////////////////////////////////// maximize post image //////////////////////////////////////

function maximizeImg() {
  if (
    event.target.parentElement.parentElement.parentElement.classList.contains(
      "maximize"
    )
  ) {
    return 0;
  }

  if (
    event.target.parentElement.parentElement.parentElement.classList.contains(
      "card"
    )
  ) {
    event.target.parentElement.parentElement.parentElement.classList.toggle(
      "maximize"
    );
    let currentPostId = Number(
      event.target.parentElement.parentElement.parentElement.id.slice(3)
    );

    // hidePostComments(currentPostId);
    addPostComments(currentPostId);

    ////// decreasing header z index
    document.querySelector(".navbar").style.zIndex = "400";

    // ///// disable scrolling
    document.body.classList.add("disable-scroll");

    //// hide nav bar open button & new-post-btn
    document.querySelector(".open-btn").classList.add("hide");
    document.getElementById("new-post-btn").classList.add("hide");
  }
}

function minimizeImg() {
  if (event.target.parentElement.parentElement.parentElement.parentElement) {
    event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
      "maximize"
    );
    let currentPostId =
      event.target.parentElement.parentElement.parentElement.parentElement.id;
    currentPostId = Number(currentPostId.slice(3));

    hidePostComments(currentPostId);
  }

  ////// increasing header z index
  document.querySelector(".navbar").style.zIndex = "900";

  ///// enable scrolling
  document.body.classList.remove("disable-scroll");

  //// show nav bar open button & new-post-btn
  document.querySelector(".open-btn").classList.remove("hide");
  document.getElementById("new-post-btn").classList.remove("hide");
}

////////////////////////////////////// maximize post image //////////////////////////////////////

////////////////////////////////////// add post's comments  //////////////////////////////////////

function getPostCommentsFromApi(postId) {
  return axios
    .get(baseUrl + `/posts/${postId}`)
    .then((response) => {
      let comments = response.data.data.comments;
      return comments;
    })
    .catch((error) => {
      const errorMsg =
        "Felid to show post comments ! ❌ : " + error.response.data.message;
      showStatusNow(errorMsg, "danger");
    });
}

async function addPostComments(postId) {
  let comments = await getPostCommentsFromApi(postId);

  if (comments.length === 0) {
    let randomValidId = Math.trunc(Math.random() * 50);
    comments = await getPostCommentsFromApi(randomValidId);
  }

  if (comments.length > 10) {
    comments.length = 10;
  }

  let otherCommentContainer = document.getElementById(`comm-${postId}`);
  otherCommentContainer.innerHTML = "";

  for (comm of comments) {
    let profile_image = comm["author"]["profile_image"];
    if (typeof profile_image !== "string") {
      profile_image = "images/default-avatar.png";
    }
    let authorName = comm.author.username;

    let currentComment = document.createElement("div");
    currentComment.classList = "__other-users-comment";
    currentComment.innerHTML = `
          <div class="image">
            <img class="rounded-circle current-usr-img" id="current-usr"
            src="${profile_image}"
            style="max-width: 100%; width: 40px; height: 40px; cursor:pointer; min-width: 40px;"
            alt="Profile-image"
            >
          </div>
          <div class="__usr-comm-info" >
            <h6 id="__usr-comm-name" class="mb-0" style="font-size: 15px;">
              ${authorName}
            </h6>
            <p id="__usr-comm-body" class="mb-0">
              ${comm.body}
            </p>
          </div>`;
    otherCommentContainer.appendChild(currentComment);
  }
}

function hidePostComments(postId) {
  let otherCommentContainer = document.getElementById(`comm-${postId}`);
  otherCommentContainer.innerHTML = "";
}

////////////////////////////////////// == add post's comments == //////////////////////////////////////

//////////////////////////////////////  add new comment  //////////////////////////////////////

function addNewAComment(postId) {
  let postUrl = baseUrl + `/posts/${postId}/comments`;
  let postInput = document.getElementById(`new-comm-input-${postId}`);
  let otherCommentContainer = document.getElementById(`comm-${postId}`);
  if (postInput.value.length === 0) {
    showStatusNow("You can't send an empty comment !! ❌ ", "danger");
    return 0;
  }

  const token = localStorage.getItem("login-token");
  let commentContent = {
    body: postInput.value,
  };
  let berarToken = {
    headers: {
      "Content-type": "multipart/form-data",
      " Authorization": `Bearer ${token}`,
    },
  };

  axios
    .post(postUrl, commentContent, berarToken)
    .then((response) => {
      let currentUser = getCurrentUser();
      let currentComment = document.createElement("div");
      currentComment.classList = "__other-users-comment";
      currentComment.innerHTML = `
            <div class="image">
              <img class="rounded-circle current-usr-img" id="current-usr"
              src="${currentUser.profile_image}"
              style="max-width: 100%; width: 40px; height: 40px; cursor:pointer; min-width: 40px;"
              alt="Profile-image"
              >
            </div>
            <div class="__usr-comm-info">
              <p id="__usr-comm-name" class="mb-0" style="font-size: 15px">
                ${currentUser.username}
              </p>
              <p id="__usr-comm-body" class="mb-0">
                ${postInput.value}
              </p>
            </div>`;
      otherCommentContainer.prepend(currentComment);
      postInput.value = "";

      ///// show success msg
      showStatusNow("comment has been added successfully  : ✅", "success");
    })
    .catch((error) => {
      const errorMsg =
        "Felid to add a new comment ! ❌ : " + error.response.data.message;
      showStatusNow(errorMsg, "danger");
    });
}

////////////////////////////////////// == add new comment == //////////////////////////////////////

//////////////////////////////////////  open user profile //////////////////////////////////////

function openUserProfile(postId) {
  window.location = `profile.html?postId=${postId}`;
}

function checkOpenUserProfile(postId = null) {
  if (getCurrentUser() == null) {
    showStatusNow("You have to sign in first to see your profile", "danger");
    return 0;
  } else {
    window.location = `profile.html`;
  }
}

////////////////////////////////////// == open user profile == //////////////////////////////////////

//////////////////////////////////////   when click  profile btn  //////////////////////////////////////

function showSignInMsg() {
  let token = window.localStorage.getItem("login-token");
  if (token == null || token == undefined) {
    showStatusNow("You have to sign in first to see your profile", "danger");
  }
  return;
}

////////////////////////////////////// == when click profile btn == //////////////////////////////////////

//////////////////////////////////////  when click like btn  //////////////////////////////////////

function ToggleLike(postId) {
  let like = document.getElementById(`thumb-up-btn-${postId}`);
  like.classList.toggle("active");
  let numOfReacts = Number(
    document.getElementById(`count-${postId}`).textContent
  );

  if (like.classList.contains("active")) {
    document.getElementById(`count-${postId}`).textContent = `${++numOfReacts}`;
  } else {
    document.getElementById(`count-${postId}`).textContent = `${--numOfReacts}`;
  }
}

function focusOnComment(postId) {
  let commentInput = document.getElementById(`new-comm-input-${postId}`);

  if (getCurrentUser() == null) {
    showStatusNow("You have to sign in to add comments ❌\n", "danger");
    return;
  } else {
    commentInput.focus();
  }
}

////////////////////////////////////// == when click  like btn == //////////////////////////////////////

function openNavBar() {
  document.getElementById("nav-list").classList.add("active");
}

function closeNavBar() {
  document.getElementById("nav-list").classList.remove("active");
}

//////////////////////////////////////  toggle theme  //////////////////////////////////////

function toggleTheme() {
  let themeBtn = document.querySelector(".theme-btn");
  if (themeBtn.classList.contains("dark")) {
    themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    themeBtn.classList.remove("dark");
    document.body.classList.add("body-light");
    localStorage.setItem("social-theme", "light");
  } else {
    themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    themeBtn.classList.add("dark");
    document.body.classList.remove("body-light");
    localStorage.setItem("social-theme", "dark");
  }
}
////////////////////////////////////// == toggle theme == //////////////////////////////////////
