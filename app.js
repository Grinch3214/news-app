// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function() {
	const apiKey = '07d99b6e3dde4089879599ae36da0ff2';
	const apiUrl = 'https://newsapi.org/v2';

	return {
		topHeadLines(country = 'ua', cb) {
			http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, cb);
		},
		everything(query, cb) {
			http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
		}
	}
})();

// Elements
const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
	e.preventDefault();
	loadNews();
});

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
	loadNews();
});

function loadNews() {
	const country = countrySelect.value;
	const searchText = searchInput.value;

	if (!searchText) {
		newsService.topHeadLines(country, onGetResponse);
	} else {
		newsService.everything(searchText, onGetResponse);
	}
	
};

function onGetResponse(err, res) {
	console.log(res);
	renderNews(res.articles);
}

//render news
function renderNews(news) {
	const newsContainer = document.querySelector('.news-container .row');
	let fragment = '';

	news.forEach(item => {
		const el = newsTemplate(item);
		fragment += el;
	});

	newsContainer.insertAdjacentHTML('afterbegin', fragment);
};

//news item template
function newsTemplate({ urlToImage, title, url, description }) {
	const noImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJX_eeDPL64HX3GM8TnLhjWkhk3K-XysfYvg&usqp=CAU';
	return `
		<div class="col s12">
			<div class="card">
				<div class="card-image">
					<img src="${urlToImage || noImage}">
					<span class="card-title">${title || ''}</span>
				</div>
				<div class="card-content">
					<p>${description || title}</p>
				</div>
				<div class="card-action">
					<a class="blue-grey-text text-darken-1" href="${url}" target="_blank">Read more</a>
				</div>
			</div>
		</div>
	`;
};
