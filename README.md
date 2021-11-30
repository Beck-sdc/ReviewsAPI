# ReviewsAPI
API for handling requests from the ratings and reviews section of project catwalk

1. In the terminal, navigate to the root directory for this repo.
2. Type "npm install" into terminal.
3. Rename dbpassword.example.js to dbpassword and enter your postgres password.
4. Use pg_dump/pg_restore to load databases.

If working with raw data files, load data via the following steps:

1. Import raw data from SDC Google Drive. You will need (1) characteristic_reviews, (2) reviews, (3) reviews_photos, (4) characteristics. Make sure to put them in the "data_transformed" directory.
2. Run the scripts "npm transform-meta" and "npm transform-photos" to generate products.csv file and photos.csv files.
3. Execute schema.sql file to load database.
4. Due to data dump, you will likely have to reset the primary key sequence. Commands to reset are commented out at the bottom of the schema.sql file.
