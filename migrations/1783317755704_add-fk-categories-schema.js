/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addConstraint('books', 'fk_books_category', {
        foreignKeys: {
            columns: 'category_id',
            references: 'categories(id)',
            onDelete: 'RESTRICT',
        },
    });

    pgm.createIndex('books', 'publication_date', {
        name: 'idx_books_publication_date',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('books', 'fk_books_category');

    pgm.addConstraint('books', 'fk_books_category', {
        foreignKeys: {
        columns: 'category_id',
        references: 'categories(id)',
        },
    });

    pgm.dropIndex('books', 'publication_date', {
        name: 'idx_books_publication_date',
    });
};
