import axios from 'axios';

const fetchBooks = async (keyword) => {
	if (!keyword || keyword.trim() === '') {
		return [];
	}

	try {
		const response = await axios.get('/api/v1/books/search', {
			params: { keyword },
		});

		const { items } = response.data;

		return (items || []).map((item) => ({
			id: item.bookId,
			title: item.title,
			content: item.content,
			author: item.author,
			isRecommended: item.isRecommended || false,
			coverImageUrl: item.coverImageUrl,
			aiCoverUrl: item.aiCoverUrl,
			viewCount: item.viewCount,
			createdAt: item.createdAt,
		}));
	} catch (error) {
		console.error('도서 검색 실패:', error);
		throw error;
	}
};

export default { fetchBooks };