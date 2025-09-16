chrome.windows.onCreated.addListener(function() {
  chrome.tabs.create({url:"index.html"});
})

async function render(){
    try{
        const res = await fetch(`https://api.unsplash.com/photos/random?query=&client_id=G3h4jjOce324fBCFgl2ozboTCTzr30cJ3lVQwl_5c4E`)
        const data = await res.json()
        document.getElementById('myElement').style.backgroundImage = `url('${data.urls.full}')`
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

async function getGmail() {
  const gmailEmails = document.getElementById('gmail-emails');
  try {
    // Check if chrome.identity is available
    if (!chrome.identity) {
      throw new Error('chrome.identity API is not available. Ensure "identity" permission is in manifest.json and the extension is loaded correctly.');
    }

    // Get auth token
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });

    // Fetch unread emails (maxResults: 3)
    const res = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=3&q=is:unread`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.messages && data.messages.length > 0) {
      // Fetch details for each message
      const emails = await Promise.all(
        data.messages.slice(0, 3).map(async (msg) => {
          const msgRes = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From,Subject,Date`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const msgData = await msgRes.json();
          const headers = msgData.payload.headers.reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {});
          return {
            from: headers.From || 'Unknown Sender',
            subject: headers.Subject || '(No Subject)',
            snippet: msgData.snippet || '(No Preview)',
            link: `https://mail.google.com/mail/u/0/#inbox/${msg.id}`
          };
        })
      );

      // Display emails
      let htmlString = '';
      emails.forEach(email => {
        htmlString += `
          <div class="gmail-email">
            <h4>${email.from}</h4>
            <p><strong>${email.subject}</strong></p>
            <p>${email.snippet}</p>
            <a href="${email.link}" target="_blank">Open in Gmail</a>
          </div>
        `;
      });
      gmailEmails.innerHTML = htmlString;
    } else {
      gmailEmails.innerHTML = '<p>No unread emails.</p>';
    }
  } catch (error) {
    console.error('Gmail Error:', error);
    gmailEmails.innerHTML = '<p>Error loading emails. Check console.</p>';
  }
}

// Initialize DOM elements and event listeners
document.addEventListener('DOMContentLoaded', () => {
  const newsContent = document.getElementById('news-content');
  const newsBtn = document.getElementById('news');
  const gmailIcon = document.getElementById('gmail-icon');
  const gmailPopup = document.getElementById('gmail-popup');
  const gmailClose = document.getElementById('gmail-close');

  if (newsContent && newsBtn && gmailIcon && gmailPopup && gmailClose) {
    newsBtn.addEventListener('click', getNews);
    gmailIcon.addEventListener('click', () => {
      console.log('Gmail icon clicked');
      gmailPopup.classList.toggle('hidden');
      if (!gmailPopup.classList.contains('hidden')) {
        getGmail();
      }
    });
    gmailClose.addEventListener('click', () => {
      gmailPopup.classList.add('hidden');
    });
  } else {
    console.error('One or more DOM elements not found.');
  }
});

render()