document.addEventListener('DOMContentLoaded', () => {
  console.log('Content Loaded');;


});

getMemes()

function getMemes(){
  fetch('http://localhost:3000/memes')
  .then(resp => resp.json())
  .then(function(memes){
    memes.forEach(function(meme){
      console.log(meme.url)
    })
  })
}
