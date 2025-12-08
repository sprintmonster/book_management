const express = require('express');
const router = express.Router();

let books = [];
let nextId = 1;

router.post('/api/v1/books', (req, res) => {
  const { title, content, user_id } = req.body;

  if (!title || !content || !user_id) {
    return res.status(400).json({ message: 'title, content, user_id는 필수입니다.' });
  }

  const newBook = {
    id: nextId++,
    title,
    content,
    user_id,
  };

  books.push(newBook);

  return res.status(201).json(newBook);
});


router.patch('/api/v1/books/:bookId', (req, res) => {
  const bookId = Number(req.params.bookId);
  const { title, content } = req.body;

  const book = books.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: '존재하지 않는 글입니다.' });
  }

  if (title !== undefined) {
    book.title = title;
  }
  if (content !== undefined) {
    book.content = content;
  }

  return res.status(200).json(book);
});


router.delete('/api/v1/books/:bookId', (req, res) => {
  const bookId = Number(req.params.bookId);

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return res.status(404).json({ message: '존재하지 않는 글입니다.' });
  }

  books.splice(index, 1);

  return res.status(204).send();
});

module.exports = router;