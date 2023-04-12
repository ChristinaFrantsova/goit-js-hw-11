import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const USER_KEY = '35263698-bb6689a1185842e54787b1a49';

export async function fetchImages(inputValue, pageNumber) {
  console.log(pageNumber);
  const url = await axios.get(
    `${BASE_URL}?key=${USER_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  );
  console.log(url);
  return url.data;
}
