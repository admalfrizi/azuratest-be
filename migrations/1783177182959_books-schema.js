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
     pgm.createTable('books', {
        id: 'id',
        title: { type: 'varchar(255)', notNull: true },
        author: { type: 'varchar(255)', notNull: true },
        publication_date: { type: 'date' },
        publisher: { type: 'varchar(255)' },
        number_of_pages: { type: 'integer' },
        category_id: {
            type: 'integer',
            notNull: true,
            references: 'categories',
            onDelete: 'CASCADE',
        },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    });

    pgm.createIndex('books', 'category_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('books');
};
