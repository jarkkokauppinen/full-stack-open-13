CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('Seppo(nimi muutettu)', 'https://www.google.fi/', 'kuukle');
insert into blogs (author, url, title) values ('Teppo(nimi muutettu)', 'https://www.akuankka.fi/', 'aku');