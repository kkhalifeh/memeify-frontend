

getMemes()

//Get elements
const container = document.querySelector('.container')
const memeCard = document.querySelector('.card')
const addMeme = document.querySelector('.add-meme')
const logo = document.querySelector('.navbar-brand')
const navbar = document.querySelector('.navbar-toggler')
const memes = []
 gif = true

//Search input
const searchMeme = document.querySelector('#search-meme')

//Event listeners
//Click on next meme
container.addEventListener('click', memeActions);
addMeme.addEventListener('click', addNewMeme);
logo.addEventListener('click', getMemes);
navbar.addEventListener('click', addNewMeme);

//Search meme by key stroke
searchMeme.addEventListener('keyup', (e) => {
  //Get input text
  let userText = e.target.value

  if (userText !== '') {
    findMeme(userText)
  } else {
    getMemes()
  }

});

//Get memes
function getMemes(){
  fetch('http://localhost:3000/memes')
  .then(resp => resp.json())
  .then((data) => {
    container.innerHTML = ""
    data.forEach((meme) => {
      createMemeCard(meme)
    })
  })
}

// Fetch meme by title
function findMeme(title) {
  fetch('http://localhost:3000/memes')
  .then(resp => resp.json())
  .then((data) => {
    container.innerHTML = ''
    data.forEach((meme) => {
      if (meme.title.toLowerCase().includes(title.toLowerCase())) {
        createMemeCard(meme)
      }
    })
  })
}

//Create meme card
function createMemeCard(meme){
  container.innerHTML +=
  `
  <div class="card mb-3" data-id="${meme.id}">
    <h3 class="card-header">${meme.title}</h3>
    <div class="card-body">
    </div>

    <div class="img-container">
      <img id="still-image" class="rounded mx-auto d-block" style="height: 70%; width: 70%; display: block;" src="${gif ? meme.url : meme.gif_url}" alt="Card image">
      <div class="image-caption" id="img-${meme.id}"></div>
      <div class="share-meme"> Save Meme </div>
    </div>
    <div class="card-body" id="caption-list">
      <ul id="list-group-${meme.id}" data-id="${meme.id}" style="display:block; padding-inline-start: 0px">
      </ul>
        <div class="form-group" style="display:none">
        <form data-id="${meme.id}">
          <label class="col-form-label" for="inputDefault">Add Caption</label>
          <input type="text" class="form-control" placeholder="Caption" id="captionInput">
          <br>
          <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
    </div>
    <div class="card-body">
      <button type="button" class="btn btn-success btn-block add-caption">Add Caption</button>
    </div>
    <div class="card-footer text-muted">
      ${parseTwitterDate(meme.created_at)}
    </div>
  </div>
  `

  memes.push(meme)
  memeCaptions(meme)
  mostPopularCaptions(memes)
}

//Render caption for meme
function memeCaptions(meme) {
  const listGroup = document.querySelector(`#list-group-${meme.id}`)
  meme.captions.forEach((caption) => {
    const li = document.createElement('li')

    const btn = document.createElement('button')
    li.className = "list-group-item d-flex justify-content-between align-items-center"
    li.innerHTML = `<h6 class="img-text"> ${caption.text} </h6>`

    btn.className = 'btn btn-primary like-btn'
    btn.dataset.id = `${caption.id}`
    btn.style = "white-space: nowrap"
    btn.innerHTML = `<i class="far fa-thumbs-up"></i> <span> ${caption.likes} </span>`

    li.appendChild(btn)

    listGroup.appendChild(li)
  })
  likeBtns = Array.from(document.querySelectorAll('.like-btn'))
  likeBtns.forEach((btn) => {
    btn.addEventListener('click', addLike, {once : true});
  })
}


//Add Caption to meme
function memeActions(e) {
  e.preventDefault()
  if (e.target.className === 'btn btn-success btn-block add-caption') {

      //Grab caption list and set display to none
      const captionList = e.target.parentElement.parentElement.querySelector('#caption-list')
      captionList.firstElementChild.style.display = "none"

      //Grab caption form and set display to block
      const captionForm = e.target.parentElement.parentElement.querySelector('.form-group')
      captionForm.style.display = "block"
    } else if (e.target.className === 'btn btn-primary'){

      const newCaption = e.target.parentElement.querySelector("#captionInput").value
      if (newCaption === '') {
        const addCaptionForm = e.target.parentElement.querySelector("#captionInput")
        showAlert('Field cannot be empty', 'alert alert-danger', addCaptionForm)
      } else {
        const memeId = parseInt(e.target.parentElement.dataset.id)
        createCaption(newCaption, memeId)
    }

  } else if (e.target.className === "list-group-item d-flex justify-content-between align-items-center"){
    const memeCard = e.target.parentElement.parentElement.parentElement
    memeCard.querySelector('img').innerText = e.target.innerHTML
  } else if (e.target.className === 'img-text') {
    console.log('here');
    const memeId = e.target.parentElement.parentElement.dataset.id
    const thisCaption = e.target.innerText
    const imgCaption = document.getElementById(`img-${memeId}`)
    // debugger

    imgCaption.innerText = thisCaption.toUpperCase()

  } else if (e.target.className === 'share-meme') {
    let selectedMeme = e.target.parentElement

    html2canvas(selectedMeme, {letterRendering: 1, allowTaint : true}).then(canvas => {
        console.log('canvas', canvas);
        shareMeme(canvas)
    })
  }else if (e.target.querySelector('img')){
      gif =! gif
      getMemes()
  }
}

//Update likes in the database
function updateLikes(id, likes, memeId){
  fetch(`http://localhost:3000/captions/${id}`, {
    method: 'PATCH',
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({likes: likes})
  })
  .then(res => res.json())
}

//Create a new caption, POST to database
function createCaption(caption, memeId){
  fetch(`http://localhost:3000/captions`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({meme_id: memeId, text: caption, likes: 0})
  })
  .then(res => res.json())
  .then(function(){
    getMemes()
  })
}

//Add Meme to database
function createMeme(url, gif_url, title, caption){
  fetch(`http://localhost:3000/memes`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({url: url, gif_url: gif_url, title: title})
  })
  .then(res => res.json())
  .then(function(newMeme){
    getMemes()
    createCaption(caption, newMeme.id)
  })
}

//Add new meme from user
function addNewMeme(e) {
  e.preventDefault()
  console.log('e.target', e.target);
  container.innerHTML = ''
  const form = document.createElement('form')
  form.innerHTML =
  `
  <div class="form-group">
    <h2> Add Meme </h2>
    <label for="InputMeme">Meme Title</label>
    <input type="text" class="form-control" id="InputMeme" placeholder="Enter Meme Title">
  </div>
  <div class="form-group">
    <label for="InputMemeURL">URL</label>
    <input type="text" class="form-control" id="InputMemeURL" placeholder="Enter Meme URL">
  </div>
  <div class="form-group">
    <label for="InputGifURL">GIF URL</label>
    <input type="text" class="form-control" id="InputGifURL" placeholder="Enter Gif URL">
  </div>
  <div class="form-group">
    <label for="InputMemeCaption">Caption</label>
    <input type="text" class="form-control" id="InputMemeCaption" placeholder="Caption">
  </div>
  <button type="submit" class="btn btn-primary submit-new-meme">Submit</button>
  `
  container.appendChild(form)
  const submitMeme = document.querySelector('.submit-new-meme')
  submitMeme.addEventListener('click', function(e){
    e.preventDefault()
    const memeTitle = document.querySelector('#InputMeme').value
    const memeUrl = document.querySelector('#InputMemeURL').value
    const gifUrl = document.querySelector('#InputGifURL').value
    const memeCaption = document.querySelector('#InputMemeCaption').value

    if (memeTitle === '' || memeUrl === '' || memeCaption === '') {
      memeField = document.querySelector('.submit-new-meme')
      showAlert('Please fill in all fields', 'alert alert-danger', memeField)
    } else {
      createMeme(memeUrl, gifUrl, memeTitle, memeCaption)
    }
  })
}

//Add like function, which renders the UI and sends data to the updateLikes function
function addLike(e) {
  e.preventDefault()

  //Grab elements
  const captionId = parseInt(this.dataset.id)
  const memeId = parseInt(this.parentElement.parentElement.dataset.id)

  //Add likes to element
  this.className = 'btn btn-secondary disabled like-btn'
  this.textContent = parseInt(this.textContent) + 1
  likes = parseInt(this.innerText)

  //Update likes function
  updateLikes(captionId, likes, memeId)
}

//Get random number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



// Code from Stack Overflow
function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();

//Show alerts
function showAlert(message, className, element) {
  const div = document.createElement('div')
  //Add class
  div.className = className

  //Add text
  div.appendChild(document.createTextNode(message))

  const formContainer = element.parentElement
  //Insert the alert
  formContainer.insertBefore(div,element)

  //Timeout after specific time
  setTimeout(() => {clearAlert()},2000)
}

//Clear alert message
function clearAlert() {
  const currentAlert = document.querySelector('.alert')
  if (currentAlert) {
    currentAlert.remove()
  }
}

function shareMeme(img) {
  container.innerHTML =
  `
  <div class="card mb-3">
    <h3 class="card-header">Download Image</h3>
  </div>
  `
  container.appendChild(img)
}

function mostPopularCaptions(arr) {
  const popularContainer = document.querySelector('.most-popular')
  const topMemes = arr.slice(0,4)
  let output = ''
  topMemes.forEach((meme, index) => {
    let topCaption = meme.captions[0]
    let memeId = meme.id
    output +=
    `
      <div class="img-container">
        <img class="rounded" height="100%" width="100%" src="${meme.url}" alt="Card image">
        <div class="image-caption-popular">${topCaption.text}</div>
      </div>
    `
  })
  popularContainer.innerHTML = output
}
