CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    article VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    brand_id INTEGER REFERENCES brands(id),
    category_id INTEGER REFERENCES categories(id),
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parts_article ON parts(article);
CREATE INDEX idx_parts_brand ON parts(brand_id);
CREATE INDEX idx_parts_category ON parts(category_id);

INSERT INTO categories (name, description) VALUES
('Фильтры', 'Масляные, воздушные, топливные фильтры'),
('Тормоза', 'Тормозные колодки, диски, суппорты'),
('Двигатель', 'Запчасти для двигателя'),
('Подвеска', 'Амортизаторы, пружины, стойки'),
('Электрика', 'Стартеры, генераторы, аккумуляторы');

INSERT INTO brands (name, country) VALUES
('Bosch', 'Германия'),
('Brembo', 'Италия'),
('NGK', 'Япония'),
('Sachs', 'Германия'),
('Mann', 'Германия'),
('Valeo', 'Франция');