export {getImages};

import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

async function getImages(query, page, perPage) {
 
    const response = await axios.get(`?key=29711203-05eaaaab908cc3e1419fc45fb=${query}&image_type=photo&orientation=horizontal&safeSearch=true&page=${page}&per_page=${perPage}`);
    return response;
 
}

