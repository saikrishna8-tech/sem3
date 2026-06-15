-- AuraBuy / Search Platform - PostgreSQL Database Design
-- Run: psql -U postgres -f schema.sql

CREATE DATABASE search_system;
\c search_system;

-- Users (JWT auth + role-based access: ADMIN | USER)
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
);

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
    id            BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE
);

-- E-commerce products
CREATE TABLE IF NOT EXISTS products (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price       DOUBLE PRECISION NOT NULL,
    rating      DOUBLE PRECISION,
    category    VARCHAR(255) NOT NULL,
    image_url   VARCHAR(500)
);

-- Learning courses (search & filter platform extension)
CREATE TABLE IF NOT EXISTS courses (
    id          BIGSERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    difficulty  VARCHAR(50)  NOT NULL,
    category    VARCHAR(255) NOT NULL
);

CREATE INDEX idx_products_name ON products (name);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_courses_name ON courses (course_name);
CREATE INDEX idx_users_email ON users (email);
