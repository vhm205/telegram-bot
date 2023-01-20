import Pexels from 'pexels';

async function getRandomImage(query, limit = 10) {
	try {
		const client = Pexels.createClient(process.env.PEXELS_API_KEY);
    let sources;

		await client.photos.search({ query, per_page: limit }).then((res) => {
			const images = res.photos;
      sources = images.map(img => img.src.medium);
		});

		return sources;
	} catch (error) {
		console.log('error downloading image', error);
    getRandomImage(query);
	}
}

export { getRandomImage }
