// Data
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const SHOW_URL = INDEX_URL + '/'
const friendData = JSON.parse(localStorage.getItem('myFriendsList'))
let filteredFriends = []
const friendPerPage = 9
const pagePerPage = 5
let currentPage = ''
let currentPageRange = ''

// Variables
const friendList = document.querySelector('.render-friend-data')
const pagination = document.querySelector('.pagination')

// Function
// render data to friendList
function renderFriendList(data) {
  let rawHTML = ''

  for (const item of data) {
    rawHTML += `
    <div class="col-sm-4">
        <div class="py-3 friend overflow-auto">
          <div class="friend-image">
            <img src="${item.avatar}" alt="An image of a friend" class="rounded-3">
          </div>
          <h5 class="friend-name mt-2">${item.name + ' ' + item.surname}</h5>
          <button type="button" class="btn-about"><i class="fas fa-info-circle friend-info" data-bs-toggle="modal" data-bs-target="#about-friend" data-id="${item.id}"></i></button>
          <button type="button" class="button"><a href="mailto:${item.email}" target="_blank" class="contact">Contact</a></button>
          <button type="button" class="btn-remove-friend" data-id="${item.id}"> - </button>
        </div>
      </div>
  `
  }

  return friendList.innerHTML = rawHTML
}


// render pagination
function renderPagination(pageRange) {
  const amount = filteredFriends.length ? filteredFriends.length : friendData.length
  const totalPage = Math.ceil(amount / friendPerPage)
  const totalPageRange = Math.ceil(totalPage / pagePerPage)

  // 防止pageRange小於1情形
  if (pageRange < 1) return

  // 為了讓刪減friend後的頁碼能符合實際數量，做此設定
  if (pageRange > totalPageRange) {

    currentPageRange = pageRange - 1

    return renderPagination(currentPageRange)
  }

  const startPage = (pageRange - 1) * pagePerPage + 1

  let pageHTML = `<li class="page-item">
            <a class="page-link previous" aria-label="Previous" data-id="${pageRange}">
              <span class="previous" aria-hidden="true" data-id="${pageRange}">&laquo;</span>
            </a>
          </li>`


  // 位於最後一個頁碼範圍，但剩下的頁數小於5的情況。(若剩下的頁數為五頁，餘數等於0，無法適用此公式)
  if (pageRange === totalPageRange && totalPage % pagePerPage !== 0) {
    for (let page = startPage; page < startPage + totalPage % pagePerPage; page++) {
      pageHTML += `<li class="page-item"><a class="page-link page" href="#" data-id="${page}">${page}</a></li>`

    }

  } else {
    for (let page = startPage; page < startPage + pagePerPage; page++) {
      pageHTML += `<li class="page-item"><a class="page-link page" href="#" data-id="${page}">${page}</a></li>`
    }
  }


  pageHTML += `<li class="page-item">
            <a class="page-link next" aria-label="Next" data-id="${pageRange}">
              <span class="next" aria-hidden="true" data-id="${pageRange}">&raquo;</span>
            </a>
          </li>`

  currentPageRange = pageRange

  return pagination.innerHTML = pageHTML

}

// render page content 
function contentByPage(page) {
  currentPage = page
  const data = filteredFriends.length ? filteredFriends : friendData
  const startIndex = (page - 1) * friendPerPage

  return data.slice(startIndex, startIndex + friendPerPage)
}

// render modal
function renderModal(id) {
  const friendAvatar = document.querySelector('#about-friend-avatar')
  const friendName = document.querySelector('#about-friend-name')
  const friendAge = document.querySelector('#about-friend-age')
  const friendBD = document.querySelector('#about-friend-bd')
  const friendRegion = document.querySelector('#about-friend-region')
  const friendEmail = document.querySelector('#about-friend-email')

  friendAvatar.src = ''
  friendName.innerText = ''
  friendAge.innerText = ''
  friendBD.innerText = ''
  friendRegion.innerText = ''
  friendEmail.innerText = ''


  axios.get(SHOW_URL + id)
    .then((response) => {
      const data = response.data
      friendAvatar.src = data.avatar
      friendName.innerText = data.name + ' ' + data.surname
      friendAge.innerText = 'Age: ' + data.age
      friendBD.innerText = 'Birthday: ' + data.birthday
      friendRegion.innerText = 'Region: ' + data.region
      friendEmail.innerText = 'Email: ' + data.email

    }).catch((error) => {
      console.log(error)
    })
}

// reset page
function reset() {
  filteredFriends = []
  renderPagination(1)
  renderFriendList(contentByPage(1))
}

// remove friends
function removeMyFriends(id) {
  const removedFriendIndex = friendData.findIndex((item) => item.id === id)

  if (removedFriendIndex === -1) return alert('The person is not in My Friends.')

  friendData.splice(removedFriendIndex, 1)
  localStorage.setItem('myFriendsList', JSON.stringify(friendData))

  renderPagination(currentPageRange)
  renderFriendList(contentByPage(currentPage))

  // 若刪除完頁面為空的情況
  if (!contentByPage(currentPage).length) {
    renderPagination(currentPageRange)
    renderFriendList(contentByPage(currentPage - 1))
  }

}


// DOM events
// show page
pagination.addEventListener('click', function pageClicked(event) {
  const target = event.target
  const id = Number(event.target.dataset.id)
  if (target.matches('.previous')) {
    renderPagination(id - 1)
  } else if (target.matches('.next')) {
    renderPagination(id + 1)
  } else if (target.matches('.page')) {
    const activePage = document.querySelector('.pagination .active')
    if (activePage !== null) {
      activePage.classList.remove('active')
    }
    target.parentElement.classList.add('active')
    renderFriendList(contentByPage(id))
  }
})

// listen to buttons on friends
friendList.addEventListener('click', function modalClicked(event) {
  const target = event.target
  const id = Number(target.dataset.id)

  if (target.matches('.friend-info')) {
    renderModal(id)
  }

  if (target.matches('.btn-remove-friend')) {
    removeMyFriends(id)
  }

})


// Main Code
// render friend data & pagination
renderPagination(1)
renderFriendList(contentByPage(1))

