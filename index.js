// Data
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const SHOW_URL = INDEX_URL + '/'
const friendData = []
let filteredFriends = []
const friendPerPage = 9
const pagePerPage = 5
let currentPage = ''
let currentPageRange = ''

// Variables
const friendList = document.querySelector('.render-friend-data')
const pagination = document.querySelector('.pagination')
const searchBtn = document.querySelector('#search-btn')
const searchInput = document.querySelector('#search-input')
const quickSearch = document.querySelector('.dropdown')
const matchFriend = document.querySelector('#match-friend')
const saveBtn = document.querySelector('#match-save')

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
          <button type="button" class="button" id="${item.like}"><i class="far fa-grin-hearts btn-like-friend" data-id="${item.id}"></i></button>
          <button type="button" class="button"><i class="far fa-frown-open btn-dislike-friend" data-id="${item.id}" ></i></button>
          <button type="button" class="btn-add-friend" data-id="${item.id}"> + </button>
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

  // 防止pageRange小於1或超出totalPageRange情形
  if (pageRange < 1 || pageRange > totalPageRange) return

  // 記錄現在的頁碼範圍
  currentPageRange = pageRange

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

  return pagination.innerHTML = pageHTML

}

// render page content 
function contentByPage(page) {
  // 記錄現在的頁數
  currentPage = page
  const data = filteredFriends.length ? filteredFriends : friendData

  // searchInput 的結果沒有設頁碼
  if (page === 0) return data

  const startIndex = (page - 1) * friendPerPage

  return data.slice(startIndex, startIndex + friendPerPage)
}


// render match modal
function renderMatchModal(id) {
  const friendAvatar = document.querySelector('#match-friend-avatar')
  const friendName = document.querySelector('#match-friend-name')
  const friendAge = document.querySelector('#match-friend-age')
  const friendBD = document.querySelector('#match-friend-bd')
  const friendRegion = document.querySelector('#match-friend-region')
  const friendEmail = document.querySelector('#match-friend-email')


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
      saveBtn.dataset.id = id

    }).catch((error) => {
      console.log(error)
    })
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

// render initial page
function renderInitialPage() {
  renderPagination(1)
  renderFriendList(contentByPage(1))
}

// filter friends
function filterFilteredFriendsResult(filteredValue) {
  filteredFriends = friendData.filter(function (item) {
    const name = item.name.toLowerCase()
    const surname = item.surname.toLowerCase()

    return name.includes(filteredValue) || surname.includes(filteredValue)
  })
}


// check contents in like
function checkContentInLike(id, newContent) {

  const targetIndex = friendData.findIndex((item) => item.id === id)
  const targetIndex2 = filteredFriends.findIndex((item) => item.id === id)

  friendData[targetIndex].like = newContent

  if (targetIndex2 !== -1) {
    filteredFriends[targetIndex2].like = newContent
  }

  renderFriendList(contentByPage(currentPage))

}

// add data to My Friends
function addToMyFriend(id) {
  const myFriendsData = JSON.parse(localStorage.getItem('myFriendsList')) || []

  const thisFriendData = friendData.find((item) => item.id === id)

  if (myFriendsData.some((item) => item.id === id)) {
    return alert('The person is already your friend!')
  }

  myFriendsData.push(thisFriendData)
  localStorage.setItem('myFriendsList', JSON.stringify(myFriendsData))

  alert('Congratulations! The person is now your friend!')
}


// DOM events
// listen to searchBtn
searchBtn.addEventListener('click', function onSearch(event) {
  event.preventDefault()
  const value = searchInput.value.trim().toLowerCase()

  // 防止沒輸入或輸入空白的情況
  if (!value.length) {
    alert('Please enter a valid name!')
    renderInitialPage()
  }

  filterFilteredFriendsResult(value)

  // 無相關資料的情況
  if (!filteredFriends.length) {
    alert('Sorry, we could not find such person.')
    renderInitialPage()
  } else {
    renderPagination(1)
    renderFriendList(contentByPage(1))
  }

})


// listen to searchInput
searchInput.addEventListener('input', function onInput(event) {
  currentPage = 0
  const keyword = searchInput.value.trim().toLowerCase()
  const inputValue = event.data

  // 排除未輸入內容或只按空白鍵的情況
  if (!keyword.length) return reset()

  // 按刪除鍵的情況
  if (inputValue === 'null') {

    if (!keyword.substring(0, keyword.length - 2).length) {
      reset()
    }

    filterFilteredFriendsResult(keyword.substring(0, keyword.length - 2))

  }

  filterFilteredFriendsResult(keyword)

  renderFriendList(filteredFriends)
})

// listen to quick search
quickSearch.addEventListener('click', function quickSearchClicked(event) {
  const id = event.target.id

  if (id === 'female') {
    filteredFriends = friendData.filter((item) => item.gender === 'female')

    renderInitialPage()
  }

  if (id === 'male') {
    filteredFriends = friendData.filter((item) => item.gender === 'male')

    renderInitialPage()
  }

  if (id === 'liked') {
    filteredFriends = friendData.filter((item) => item.like === 'like')

    if (!filteredFriends.length) {
      alert('You have not liked anyone!')

      return renderFriendList(filteredFriends)
    }

    renderInitialPage()
  }


})


//listen to match friend
matchFriend.addEventListener('click', function matchClicked() {
  const firstNum = friendData[0].id
  const lastNum = friendData[friendData.length - 1].id
  const selectedId = firstNum + Math.floor(Math.random() * (lastNum - firstNum + 1))

  renderMatchModal(selectedId)
})

// listen to save btn
saveBtn.addEventListener('click', function saveClicked(event) {
  const id = Number(event.target.dataset.id)
  addToMyFriend(id)
})


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

  // open modal
  if (target.matches('.friend-info')) {
    renderModal(id)
  }

  // like btn
  if (target.matches('.btn-like-friend')) {
    alert('You have liked this person! Go find him/her in QUICK SEARCH!')
    checkContentInLike(id, 'like')
  }

  // dislike btn
  if (target.matches('.btn-dislike-friend')) {
    alert('You have disliked this person. He/she could no longer be found in LIKED.')
    checkContentInLike(id, '')
  }

  // add to My friends
  if (target.matches('.btn-add-friend')) {
    addToMyFriend(id)
  }

})



// Main Code
// render friend data & pagination
axios.get(INDEX_URL)
  .then((response) => {
    friendData.push(...response.data.results)
    friendData.forEach((item) => {
      item.like = ''
    })
    renderPagination(1)
    renderFriendList(contentByPage(1))
  }).catch((error) => {
    console.log(error)
  })