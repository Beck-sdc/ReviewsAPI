# ReviewsAPI
API for handling requests from the ratings and reviews section of project catwalk

1. In the terminal, navigate to the root directory for this repo.
2. Type "npm install" into terminal.
3. Import raw data from SDC Google Drive. You will need (1) characteristic_reviews, (2) reviews, (3) reviews_photos, (4) characteristics. Make sure to put them in the "data_transformed" directory.
4. Run the scripts "npm transform-meta" and "npm transform-photos" to generate products.csv file and photos.csv files.
5. Execute schema.sql file to load database.
6. Due to data dump, you will likely have to reset the primary key sequence. Commands to reset are commented out at the bottom of the schema.sql file.