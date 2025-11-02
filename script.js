let list = document.getElementById("dropdownMenu");

function dropdownMenu() {
    list.classList.toggle("show");

}
const LOCAL_JSON_URL = "example.json";
const REMOTE_JSON_URL = "https://api.npoint.io/ceb07bdd51bbfee906db"; 
const USE_REMOTE = true; 
// Date
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("et-EE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Fetch-fuction
async function fetchPosts() {
  const url = USE_REMOTE ? REMOTE_JSON_URL : LOCAL_JSON_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Local fetch failed");
  return await response.json();
}

// post creation
function createPost(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";

  const header = document.createElement("div");
  header.className = "post-header";
  const profileImg = document.createElement("img");
  profileImg.src = post.ownerProfilePicture;
  profileImg.alt = "profile";
  profileImg.className = "profile";
  const username = document.createElement("span");
  username.className = "username";
  username.textContent = post.owner;
  const date = document.createElement("span");
  date.className = "date";
  date.textContent = formatDate(post.timeCreated);
  header.append(profileImg, username, date);

  const imgDiv = document.createElement("div");
  imgDiv.className = "post-image";
  if (post.image) {
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = "post image";
    imgDiv.appendChild(img);
  }

  const text = document.createElement("p");
  text.textContent = `❤️ ${post.likeCount} meeldimist`;

  const likeDiv = document.createElement("div");
  likeDiv.className = "like";
  const btn = document.createElement("button");
  btn.textContent = "👍";
  likeDiv.appendChild(btn);

  postDiv.append(header, imgDiv, text, likeDiv);
  return postDiv;
}

async function renderFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  try {
    const posts = await fetchPosts();
    posts.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
    posts.forEach(p => feed.appendChild(createPost(p)));
  } catch (err) {
    feed.innerHTML = `<p style="color:red">Error in loading posts ${err.message}</p>`;
  }
}

renderFeed();
renderFeed();


