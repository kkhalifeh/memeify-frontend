document.addEventListener('DOMContentLoaded', () => {
  console.log('Content Loaded');;
});

//Get elements
const container = document.querySelector('.container')

const memes = []
//Get memes
function getMemes(){
  fetch('http://localhost:3000/memes')
  .then(resp => resp.json())
  .then((data) => {
    data.forEach((meme) => {
      memes.push(meme)
    })
    renderMemes()
  })
}

function renderMemes() {
  let output = ''
  memes.forEach((meme) => {
    console.log('meme', meme);
    output +=
    `
    <div class="card mb-3">
      <h3 class="card-header">${meme.title}</h3>
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <h6 class="card-subtitle text-muted">Support card subtitle</h6>
      </div>
      <img style="height: 70%; width: 70%; display: block;" src="${meme.url}" alt="Card image">
      <div class="card-body">
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      </div>
      <div class="card-body">
        <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </div>
      <div class="card-footer text-muted">
        2 days ago
      </div>
    </div>
    `
    container.innerHTML = output
  })
}

getMemes()
