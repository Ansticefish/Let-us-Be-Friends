// add data to friend-list
// add data to modal
// Variables
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const SHOW_URL = INDEX_URL + '/'
const friendData = []
const friendList = document.querySelector('.render-friend-data')
const friendAvatar = document.querySelector('#about-friend-avatar')
const friendName = document.querySelector('#about-friend-name')
const friendEmail = document.querySelector('#about-friend-email')
const friendBD = document.querySelector('#about-friend-bd')
const friendRegion = document.querySelector('#about-friend-region')

// Function
let rawHTML = ''
function renderFriendList(friendData) {
  let rawHTML = ''
  for (const item of friendData) {
    rawHTML += `
    <div class="col">
        <div class="py-3 friend overflow-auto">
          <div class="friend-image">
            <img src="${item.avatar}" alt="An image of a friend">
          </div>
          <h3 class="friend-name">${item.name + ' ' + item.surname}</h3>
          <button type="button" class="btn-about" data-bs-toggle="modal" data-bs-target="#about-friend" data-id="${item.id}">About</button>
        </div>
      </div>
  `
  }


  return friendList.innerHTML = rawHTML
}

function renderModal(id) {
  axios.get(SHOW_URL + id)
    .then((response) => {
      const data = response.data
      friendAvatar.src = data.avatar
      friendName.innerText = data.name + ' ' + data.surname
      friendEmail.innerText = 'Email: ' + data.email
      friendBD.innerText = 'Birthday: ' + data.birthday
      friendRegion.innerText = 'Region: ' + data.region
    }).catch((error) => {
      console.log(error)
    })
}

// Main Code
// render friend data

axios.get(INDEX_URL)
  .then((response) => {
    friendData.push(...response.data.results)
    renderFriendList(friendData)
  }).catch((error) => {
    console.log(error)
  })


// render modal data
friendList.addEventListener('click', function modalClicked(event) {
  if (event.target.matches('.btn-about')) {
    const id = Number(event.target.dataset.id)
    renderModal(id)
  }

})