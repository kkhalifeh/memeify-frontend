document.addEventListener('DOMContentLoaded', () => {
  console.log('Content Loaded');;
});

getMemes()

//Get elements
const container = document.querySelector('.container')
const memeCard = document.querySelector('.card')
const memes = []

//Event listeners

//Click on next meme
container.addEventListener('click', memeActions);


//Get memes
function getMemes(){
  fetch('http://localhost:3000/memes')
  .then(resp => resp.json())
  .then((data) => {
    data.forEach((meme) => {
      createMemeCard(meme)
    })
  })
}

function createMemeCard(meme){
  container.innerHTML +=
  `
  <div class="card mb-3" data-id="${meme.id}">
    <h3 class="card-header">${meme.title}</h3>
    <div class="card-body">
      <h6 class="card-subtitle text-muted">Support card subtitle</h6>
    </div>
    <img class="rounded mx-auto d-block" style="height: 70%; width: 70%; display: block;" src="${meme.url}" alt="Card image">
    <div class="card-body" id="caption-list">
      <ul id="list-group-${meme.id}" data-id="${meme.id}" style="display:block">
      </ul>
      <div class="form-group" style="display:none">
        <label class="col-form-label" for="inputDefault">Add Caption</label>
        <input type="text" class="form-control" placeholder="Caption" id="inputDefault">
      </div>
    </div>
    <div class="card-body">
      <button type="button" class="btn btn-success next-meme">Next Meme</button>
      <button type="button" class="btn btn-success add-caption">Add Caption</button>
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
    const span = document.createElement('span')
    li.className = "list-group-item d-flex justify-content-between align-items-center"
    li.innerHTML = caption.text

    span.className = "badge badge-primary badge-pill"
    span.dataset.id = `${caption.id}`
    span.innerHTML = caption.likes

    li.appendChild(span)

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
  if (e.target.className === 'btn btn-success next-meme') {
    renderMeme()
  } else if (e.target.className === 'badge badge-primary badge-pill') {
    const captionId = parseInt(e.target.dataset.id)
    const memeId = parseInt(e.target.parentElement.parentElement.dataset.id)
    // updateLikes(captionId,newLikes,memeId)
    // debugger
    let likeBar = e.target
    likes = parseInt(likeBar.innerText++)
    updateLikes(captionId, likes, memeId)
  } else if (e.target.className === 'btn btn-success add-caption') {

    //Grab caption list and set display to none
    const captionList = e.target.parentElement.parentElement.querySelector('#caption-list')
    captionList.firstElementChild.style.display = "none"

    //Grab caption form and set display to block
    const captionForm = e.target.parentElement.parentElement.querySelector('.form-group')
    captionForm.style.display = "block"
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
