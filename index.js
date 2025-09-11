chrome.windows.onCreated.addListener(function() {
  chrome.tabs.create({url:"index.html"});
})
const newsContent = document.getElementById('news-content')
const accessKey = 'G3h4jjOce324fBCFgl2ozboTCTzr30cJ3lVQwl_5c4E';
const bodyImage = document.getElementById('myElement')
const userSearch = document.getElementById('user-search')
const timeDiv = document.getElementById('time-h1')
const newsBtn = document.getElementById('news')
async function render(){
    try{
        const res = await fetch(`https://api.unsplash.com/photos/random?query=&client_id=${accessKey}`)
        const data = await res.json()
        bodyImage.style.backgroundImage = `url('${data.urls.full}')`
    } catch (error) {
      console.log(error)
    }
    
}
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeDiv.textContent = `${hours}:${minutes}`;
}    
setInterval(updateTime, 1000)
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter'){
    if (userSearch.value){
    window.open(`https://www.google.com/search?query=${userSearch.value}`, '_blank');
    userSearch.value =  ''
  }}
});
let dark = true;

let newsContentHidden = true
newsBtn.addEventListener('click', getNews)
async function getNews() {
  
  if (newsContentHidden === true){
    newsBtn.textContent = 'Hide News'
    newsContent.classList.remove('hidden')
    newsContentHidden = false
  } else {
    newsBtn.textContent = 'Get News'
    document.getElementById('news-content').classList.add('hidden')
    newsContentHidden = true
  }
  if (newsContentHidden === false){
    try{
    const res = await fetch(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=au&max=10&apikey=db900dfcc96ffd96a1f7ddf5b8c4fbd8`)
    const data = await res.json()
    let htmlString = ''
    console.log(data)
    data.articles.forEach(article => {
      htmlString += `
        <div class="article">
          <h3>${article.title}</h3>
          <p>${article.description || 'No description available.'}</p>
          ${article.image ? `<img src="${article.image}" alt="Article image" style="max-width: 100%; height: auto; margin-top: 10px;">` : ''}
          <p><a href="${article.url}" target="_blank">Read more</a></p>
          <p><small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small></p>
        </div>
      `})
      if (newsContent) {
        
        newsContent.innerHTML = `<i class="fa-solid fa-moon" id = 'mode'></i>` + htmlString 
        const modeIcon = document.getElementById('mode');
          if (!modeIcon.dataset.listenerAttached) {
            modeIcon.addEventListener('click', changeMode);
            modeIcon.dataset.listenerAttached = 'true';
          }
        
      } else {
        console.error('Element with ID "news-content" not found.');
      }
    }catch(error){
    console.log(error)
  }}}
  function changeMode() {
  dark = !dark; // Toggle dark state
  if (dark) {
    newsContent.classList.add('dark')
    newsContent.classList.remove('light')

    document.getElementById('mode').classList.remove('fa-sun')
    document.getElementById('mode').classList.add('fa-moon')
  } else {
    newsContent.classList.remove('dark')
    newsContent.classList.add('light')
    document.getElementById('mode').classList.remove('fa-moon')
    document.getElementById('mode').classList.add('fa-sun')
  }
}
render()
