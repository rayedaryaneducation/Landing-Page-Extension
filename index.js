chrome.windows.onCreated.addListener(function() {
  chrome.tabs.create({url:"index.html"});
})
function setFocusToTextBox(){
    document.getElementById("mytext").focus();
}
const accessKey = 'G3h4jjOce324fBCFgl2ozboTCTzr30cJ3lVQwl_5c4E';
const bodyImage = document.getElementById('myElement')
const userSearch = document.getElementById('user-search')
const defaultImage = ``
const timeDiv = document.getElementById('time-h1')
function render(){
    try{
        fetch(`https://api.unsplash.com/photos/random?query=&client_id=${accessKey}`)
            .then(res => res.json())
            .then(data => bodyImage.style.backgroundImage = `url('${data.urls.full}')`)
    } catch (error) {
        fetch(`https://api.unsplash.com/photos/random?query=nature&client_id=${accessKey}`)
            .then(res => res.json())
            .then(data => bodyImage.style.backgroundImage = `url('${data.urls.full}')`)
    }
}
render()
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0'); 
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeDiv.textContent = `${hours}:${minutes}`;
}
updateTime(); 
setInterval(updateTime, 1000);
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter'){
    window.open(`https://www.google.com/search?query=${userSearch.value}`, '_blank');
    userSearch.value =  ''
  }
});


