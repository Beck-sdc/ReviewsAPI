TRUNCATE photos, reviews, products;

CREATE TABLE "photos" (
  "id" SERIAL PRIMARY KEY,
  "review_id" int,
  "product_id" int,
  "url" text
);

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int,
  "rating" int,
  "date" text,
  "summary" text,
  "body" text,
  "recommend" boolean,
  "reported" boolean,
  "reviewer_name" text,
  "reviewer_email" text,
  "response" text,
  "helpfulness" int
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "rating_1" decimal,
  "rating_2" decimal,
  "rating_3" decimal,
  "rating_4" decimal,
  "rating_5" decimal,
  "recommend_true" int,
  "recommend_false" int,
  "fit_id" int,
  "fit_value" decimal,
  "fit_counter" int,
  "size_id" int,
  "size_value" decimal,
  "size_counter" int,
  "width_id" int,
  "width_value" decimal,
  "width_counter" int,
  "quality_id" int,
  "quality_value" decimal,
  "quality_counter" int,
  "comfort_id" int,
  "comfort_value" decimal,
  "comfort_counter" int,
  "length_id" int,
  "length_value" decimal,
  "length_counter" int
);

-- ALTER TABLE "reviews" ADD FOREIGN KEY ("id") REFERENCES "photos" ("review_id");
-- ALTER TABLE "products" ADD FOREIGN KEY ("id") REFERENCES "reviews" ("product_id");

CREATE INDEX product_id_reviews ON reviews USING hash (product_id);
CREATE INDEX product_id_photos ON photos USING hash (product_id);

\COPY photos FROM '/Users/brettroberts/Desktop/hackreactor/ReviewsAPI/data_transformed/photos.csv'  WITH delimiter ',' NULL AS 'null' csv header;
\COPY reviews FROM '/Users/brettroberts/Desktop/hackreactor/ReviewsAPI/data_transformed/reviews.csv' WITH delimiter ',' NULL AS 'null' csv header;
\COPY products FROM '/Users/brettroberts/Desktop/hackreactor/ReviewsAPI/data_transformed/products.csv'  WITH delimiter ',' NULL AS 'null' csv header;

--If primary keys become out of sync during data dump:
-- psql postgres
-- \c sdc;
-- SELECT pg_catalog.setval(pg_get_serial_sequence('photos', 'id'), MAX(id)) FROM photos;


-- start instance of PostgreSQL
-- psql postgres

-- execute file on command line:
-- psql -U  brettroberts sdc  -W < database/schema.sql