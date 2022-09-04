export {getImages};

import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function getImages(query, page, perPage) {
 
    const response = await axios.get(`?key=20030683-6dee36cad7bf99771c158b063&q=${query}&image_type=photo&orientation=horizontal&safeSearch=true&page=${page}&per_page=${perPage}`);
    return response;
 
}

