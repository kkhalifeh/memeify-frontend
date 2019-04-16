document.addEventListener('DOMContentLoaded', () => {
  console.log('Content Loaded');;
});

getMemes()

//Get elements
const container = document.querySelector('.container')
const memeCard = document.querySelector('.card')
const memes = []

//Search input
const searchMeme = document.querySelector('#search-meme')

//Event listeners
//Click on next meme
container.addEventListener('click', memeActions);

//Search meme by key stroke
searchMeme.addEventListener('keyup', (e) => {
  //Get input text
  let userText = e.target.value
  
  findMeme(userText)

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

//Create meme
function createMemeCard(meme){
  container.innerHTML +=
  `
  <div class="card mb-3" data-id="${meme.id}">
    <h3 class="card-header">${meme.title}</h3>
    <div class="card-body">
    </div>
    <img class="rounded mx-auto d-block" style="height: 70%; width: 70%; display: block;" src="${meme.url}" alt="Card image">
    <div class="card-body" id="caption-list">
      <ul id="list-group-${meme.id}" data-id="${meme.id}" style="display:block">
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
      2 days ago
    </div>
  </div>
  `

  memes.push(meme)
  memeCaptions(meme)

}

//Render caption for meme
function memeCaptions(meme) {
  const listGroup = document.querySelector(`#list-group-${meme.id}`)
  meme.captions.forEach((caption) => {
    const li = document.createElement('li')
    // const span = document.createElement('span')
    const btn = document.createElement('button')
    li.className = "list-group-item d-flex justify-content-between align-items-center"
    li.innerHTML = caption.text


    btn.className = 'btn btn-primary like-btn'
    btn.dataset.id = `${caption.id}`
    // span.className = "badge badge-primary badge-pill"
    // span.dataset.id = `${caption.id}`
    // span.innerHTML = caption.likes
    btn.innerHTML = `<i class="far fa-thumbs-up"></i> <span> ${caption.likes} </span>`


    // li.appendChild(span)
    li.appendChild(btn)

    listGroup.appendChild(li)
  })

}

//Get random number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Render next meme
function memeActions(e) {
  e.preventDefault()
  if (e.target.className === 'btn btn-primary like-btn') {
    //Grab elements for like
    const captionId = parseInt(e.target.dataset.id)
    const memeId = parseInt(e.target.parentElement.parentElement.dataset.id)

    let likeBar = e.target

    //Add likes to element
    likeBar.className = 'btn btn-secondary disabled like-btn'
    likeBar.textContent = parseInt(likeBar.textContent) + 1
    likes = parseInt(likeBar.innerText)

    //Update likes function
    updateLikes(captionId, likes, memeId)
  } else if (e.target.className === 'btn btn-success btn-block add-caption') {

      //Grab caption list and set display to none
      const captionList = e.target.parentElement.parentElement.querySelector('#caption-list')
      captionList.firstElementChild.style.display = "none"

      //Grab caption form and set display to block
      const captionForm = e.target.parentElement.parentElement.querySelector('.form-group')
      captionForm.style.display = "block"
    } else if (e.target.className === 'btn btn-primary'){

      const newCaption = e.target.parentElement.querySelector("#captionInput").value
      const memeId = parseInt(e.target.parentElement.dataset.id)
      createCaption(newCaption, memeId)

  }
}



function updateLikes(id, likes, memeId){
  fetch(`http://localhost:3000/captions/${id}`, {
    method: 'PATCH',
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({likes: likes})
  })
  .then(res => res.json())
  .then((data) => {
    const foundCaption = memes.find((meme) => {
      meme.captions.find((caption) => {return caption.id === id})
    })
    console.log('foundCaption', foundCaption);
  })
}

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
