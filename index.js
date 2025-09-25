chrome.windows.onCreated.addListener(function() {
  chrome.tabs.create({url:"index.html"});
})

async function render(){
    try{
        const cacheBuster = Date.now(); 
        const apiUrl = `https://api.unsplash.com/photos/random?query=&client_id=G3h4jjOce324fBCFgl2ozboTCTzr30cJ3lVQwl_5c4E&cache_buster=${cacheBuster}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        document.getElementById('myElement').style.backgroundImage = `url('${data.urls.full}')`;
        
    } catch (error) {
      console.log(error)
    }
}

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('time-h1').textContent = `${hours}:${minutes}`;
}    
setInterval(updateTime, 1000)
document.addEventListener('keydown', function(event) {
  const userSearch = document.getElementById('user-search');
  if (event.key === 'Enter' && userSearch.value){
    window.open(`https://www.google.com/search?query=${userSearch.value}`, '_blank');
    userSearch.value = ''
  }
});

let dark = true;
let newsContentHidden = true;

async function getNews() {
  const newsContent = document.getElementById('news-content');
  if (newsContentHidden) {
    document.getElementById('news').textContent = 'Hide News'
    newsContent.classList.remove('hidden')
    newsContentHidden = false
  } else {
    document.getElementById('news').textContent = 'Get News'
    newsContent.classList.add('hidden')
    newsContentHidden = true
  }
  if (!newsContentHidden) {
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
        `
      })
      if (newsContent) {
        newsContent.innerHTML = `<i class="fa-solid fa-moon" id="mode"></i>` + htmlString 
        const modeIcon = document.getElementById('mode');
        if (!modeIcon.dataset.listenerAttached) {
          modeIcon.addEventListener('click', changeMode);
          modeIcon.dataset.listenerAttached = 'true';
        }
      } else {
        console.error('Element with ID "news-content" not found.');
      }
    } catch(error){
      console.log(error)
    }
  }
}

function changeMode() {
  document.getElementById('news-content').classList.toggle('dark')
  dark = !dark;
  if (dark) {
    document.getElementById('mode').classList.remove('fa-sun')
    document.getElementById('mode').classList.add('fa-moon')
  } else {
    document.getElementById('mode').classList.remove('fa-moon')
    document.getElementById('mode').classList.add('fa-sun')
  }
}

  const newsContent = document.getElementById('news-content');


document.addEventListener('DOMContentLoaded', () => {
  render()
  const newsBtn = document.getElementById('news');
  newsBtn.addEventListener('click', getNews)

});


