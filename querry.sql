-- Active: 1690780015370@@127.0.0.1@5432@recipes
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    password VARCHAR(255),
    confirmpassword VARCHAR(255),
    photo VARCHAR(255)
);

CREATE TABLE recipes
(
    id VARCHAR PRIMARY KEY,
    title VARCHAR(255),
    ingredients VARCHAR(255) ,
    photo VARCHAR(255),
    title_video VARCHAR(255),
    video VARCHAR(255),
    video2 VARCHAR(255),
    video3 VARCHAR(255),
    users_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE likeds
(
    id VARCHAR PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks
(
    id VARCHAR PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments
(
    id VARCHAR PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id UUID,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


