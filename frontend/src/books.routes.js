const express = require('express');
const router = express.Router();

let books = [];
let nextBookId = 1;
let comments = [];
let nextCommentId = 1;

function getLoginUser(req) {
	if (req.user) {
		return req.user;
	}
	if (req.session && req.session.user) {
		return req.session.user;
	}
	return null;
}


function sendServerError(res, error) {
	console.error(error);
	return res.status(500).json({
		status: 'error',
		message: '서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.',
	});
}

router.post('/api/v1/books', (req, res) => {
	try {
		const loginUser = getLoginUser(req);
		if (!loginUser) {
			return res.status(401).json({
				status: 'error',
				message: '로그인이 필요합니다.',
			});
		}

		const { title, content, user_id } = req.body;

		if (!title || !content) {
			return res.status(400).json({
				status: 'error',
				message: '제목과 내용을 모두 입력해야 합니다.',
			});
		}

		const bookId = nextBookId++;
		const createdAt = new Date().toISOString();

		const book = {
			bookId,
			title,
			content,
			user_id: user_id || loginUser.id,
			createdAt,
		};

		books.push(book);

		return res.status(201).json(book);
	} catch (error) {
		return sendServerError(res, error);
	}
});


router.patch('/api/v1/books/:bookId', (req, res) => {
	try {
		const loginUser = getLoginUser(req);
		if (!loginUser) {
			return res.status(401).json({
				status: 'error',
				message: '로그인이 필요합니다.',
			});
		}

		const bookId = Number(req.params.bookId);
		const book = books.find((b) => b.bookId === bookId);

		if (!book) {
			return res.status(404).json({
				status: 'error',
				message: '존재하지 않는 게시글입니다.',
			});
		}

		if (book.user_id !== loginUser.id) {
			return res.status(403).json({
				status: 'error',
				message: '게시글을 수정할 권한이 없습니다.',
			});
		}

		const { title, content } = req.body;

		if (title !== undefined) {
			book.title = title;
		}
		if (content !== undefined) {
			book.content = content;
		}

		const updatedAt = new Date().toISOString();
		book.updatedAt = updatedAt;

		return res.status(200).json({
			bookId: book.bookId,
			title: book.title,
			content: book.content,
			updatedAt: updatedAt,
		});
	} catch (error) {
		return sendServerError(res, error);
	}
});


router.delete('/api/v1/books/:bookId', (req, res) => {
	try {
		const loginUser = getLoginUser(req);
		if (!loginUser) {
			return res.status(401).json({
				status: 'error',
				message: '로그인이 필요합니다.',
			});
		}

		const bookId = Number(req.params.bookId);
		const index = books.findIndex((b) => b.bookId === bookId);

		if (index === -1) {
			return res.status(404).json({
				status: 'error',
				message: '존재하지 않는 게시글입니다.',
			});
		}

		if (books[index].user_id !== loginUser.id) {
			return res.status(403).json({
				status: 'error',
				message: '게시글을 삭제할 권한이 없습니다.',
			});
		}

		books.splice(index, 1);

		return res.status(204).send();
	} catch (error) {
		return sendServerError(res, error);
	}
});

module.exports = router;
