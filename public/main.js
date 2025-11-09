var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumb-down");
var trash = document.getElementsByClassName("fa-trash");

//create the thumbsdown functionality
//userr clicks thumbdonw ----> number goes down
//initialize thumbsdown variable in client
//copy/paste thumbsup and modify to thumbsdown in both server and client
// ----- LIKE -----
Array.from(document.getElementsByClassName("fa-thumbs-up")).forEach(function(element) {
  element.addEventListener('click', function(){
    const li = this.closest('li.message')
    const spans = li.querySelectorAll('span')
    const name = spans[0].innerText
    const msg = spans[1].innerText

    fetch('/messages', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, msg })
    })
    .then(response => response.ok && response.json())
    .then(() => window.location.reload(true))
    .catch(err => console.error('Thumbs Up Error:', err))
  })
})

// ----- DISLIKE -----
Array.from(document.getElementsByClassName("fa-thumbs-down")).forEach(function(element) {
  element.addEventListener('click', function(){
    const li = this.closest('li.message')
    const spans = li.querySelectorAll('span')
    const name = spans[0].innerText
    const msg = spans[1].innerText

    fetch('/messages/thumbDown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, msg })
    })
    .then(response => response.ok && response.json())
    .then(() => window.location.reload(true))
    .catch(err => console.error('Thumbs Down Error:', err))
  })
})

// ----- DELETE -----
Array.from(document.getElementsByClassName("fa-trash")).forEach(function(element) {
  element.addEventListener('click', function(){
    const li = this.closest('li.message')
    const spans = li.querySelectorAll('span')
    const name = spans[0].innerText
    const msg = spans[1].innerText

    fetch('/messages', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, msg })
    })
    .then(() => window.location.reload(true))
    .catch(err => console.error('Delete Error:', err))
  })
})
