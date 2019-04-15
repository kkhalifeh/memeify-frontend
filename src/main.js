document.addEventListener('DOMContentLoaded', () => {
  console.log('Content Loaded');;
});

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
      memes.push(meme)
    })
    renderMeme()
  })
}


//Render one random meme
function renderMeme() {
  let output = ''
  let n = getRandomInt(memes.length)
  console.log('n', n);
  output +=
  `
  <div class="card mb-3" data-id="${memes[n].id}">
    <h3 class="card-header">${memes[n].title}</h3>
    <div class="card-body">
      <h6 class="card-subtitle text-muted">Support card subtitle</h6>
    </div>
    <img class="rounded mx-auto d-block" style="height: 70%; width: 70%; display: block;" src="${memes[n].url}" alt="Card image">
    <div class="card-body">
      <ul class="list-group" data-id="${memes[n].id}">
      </ul>
    </div>
    <div class="card-body">
      <button type="button" class="btn btn-success next-meme">Next Meme</button>
      <button type="button" class="btn btn-success">Add Caption</button>
    </div>
    <div class="card-footer text-muted">
      2 days ago
    </div>
  </div>
  `
  container.innerHTML = output
  memeCaptions(memes[n])
}

//Render caption for meme
function memeCaptions(meme) {
  const listGroup = document.querySelector('.list-group')
  console.log(listGroup.innerHTML);
  // debugger
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
  }
}

getMemes()

function updateLikes(id, likes, memeId){
  fetch(`http://localhost:3000/captions/${id}`, {
    method: 'PATCH',
    headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({likes: likes})
  })
  .then(res => res.json())
  .then(function(){
    const findCaption = memes.find((meme) => {return meme.id === memeId})
    console.log(findMeme)
  })
}
