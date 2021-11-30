const db = require('./index.js');

module.exports = {

  getReviews (product_id, callback) {
    db.query('SELECT\
                      reviews.reported,\
                      reviews.id AS review_id,\
                      reviews.rating,\
                      reviews.summary,\
                      reviews.recommend,\
                      reviews.response,\
                      reviews.body,\
                      reviews.date,\
                      reviews.reviewer_name,\
                      reviews.helpfulness,\
                      photos.id AS photo_id,\
                      photos.review_id AS origin_id,\
                      photos.url\
                    FROM reviews\
                    LEFT JOIN photos\
                    ON reviews.product_id = photos.product_id\
                    WHERE reviews.product_id = $1\
                    ORDER BY review_id, photo_id;', [product_id],
      (error, reviews) => {
        if (error) { callback (error); }
        callback (null, reviews);
    })
  },

  async getMetadata (product_id, callback) {
    await db.query('SELECT * FROM products \
              WHERE id = $1', [product_id],
      (error, meta) => {
        if (error) { callback (error); }
        callback (null, meta);
    })
  },

  async addReview (body, callback) {
    var date = Date.now();
    await db.query('INSERT INTO reviews\
                    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)\
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [body.product_id, body.rating, `"${date}"`, body.summary, body.body, body.recommend, false, body.name, body.email, null, 0],
      (error, response) => {
        if (error) { callback (error); }
        callback (null, response);
    })
  },

  async updateMetadata (data, callback) {
    await db.query('UPDATE products\
                    SET\
                    rating_1 = $2,\
                    rating_2 = $3,\
                    rating_3 = $4,\
                    rating_4 = $5,\
                    rating_5 = $6,\
                    recommend_true = $7,\
                    recommend_false = $8,\
                    fit_id = $9,\
                    fit_value = $10,\
                    fit_counter = $11,\
                    size_id = $12,\
                    size_value = $13,\
                    size_counter = $14,\
                    width_id = $15,\
                    width_value = $16,\
                    width_counter = $17,\
                    quality_id = $18,\
                    quality_value = $19,\
                    quality_counter = $20,\
                    comfort_id = $21,\
                    comfort_value = $22,\
                    comfort_counter = $23,\
                    length_id = $24,\
                    length_value = $25,\
                    length_counter = $26\
                    WHERE id = $1', [...data],
      (error, response) => {
        if (error) { callback (error); }
        callback (null, response);
    })
  },

  async addPhoto (review_id, product_id, url, callback) {
      await db.query('INSERT INTO photos\
                      (review_id, product_id, url)\
                       VALUES ($1, $2, $3);', [review_id, product_id, url],
        (error, response) => {
          if (error) { callback (error); }
          callback (null, response);
      })
  },

  async updateHelpful (review_id, callback) {
      await db.query('UPDATE reviews\
                      SET helpfulness = helpfulness + 1\
                      WHERE id = $1;', [review_id],
        (error, response) => {
          if (error) { callback (error); }
          callback (null, response);
      })
  },

  async report (review_id, callback) {
    await db.query('UPDATE reviews\
                    SET reported = true\
                    WHERE id = $1;', [review_id],
      (error, response) => {
        if (error) { callback (error); }
        callback (null, response);
    })
  }

}