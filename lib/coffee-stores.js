//initialize unsplash
import { createApi } from 'unsplash-js';

// on your node server
const unsplashApi = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
	//...other fetch options
});

const getListOfCoffeeStorePhotos = async () => {
	const photos = await unsplashApi.search.getPhotos({
		query: 'coffee shop',
		perPage: 10,
	});

	const unsplashResults = photos.response.results
	return unsplashResults.map(result => result.urls['small'])

}

export const fetchCoffeeStores = async (latLong = "43.653833032607096%2C-79.37896808855945") => {
	const photos = await getListOfCoffeeStorePhotos()
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: process.env.NEXT_PUBLIC_API_KEY
		}
	};

	const response = await fetch(`https://api.foursquare.com/v3/places/search?limit=6&ll=${latLong}`, options)
	const data = await response.json()

	return data.results.map((venue, idx) => {
		return {
			...venue,
			imgUrl: photos[idx]
		}
	})
}