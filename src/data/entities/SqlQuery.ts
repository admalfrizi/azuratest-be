export const BOOK_COLUMNS = `
  books.id, books.title, books.author, categories.name AS category, books.publication_date,
  books.publisher, books.number_of_pages, books.created_at, books.updated_at
`;

export const BOOKS_QUERY = `
  SELECT ${BOOK_COLUMNS}
  FROM books
  JOIN categories ON books.category_id = categories.id
`