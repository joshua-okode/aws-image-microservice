import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage", async (req, res) => {

    try {
        const image_url = req.query.image_url.toString();

        //validate the image_url query
        if (!image_url) {
            res.status(404).send("[404] Image URL is not found.");
        } else {
            // call filterImageFromURL(image_url) to filter the image
            const filteredImage = await filterImageFromURL(image_url);

            //send the resulting file in the response
            res.status(200).sendFile(filteredImage);

            res.on('finish', function () {
                // clear local files on finish response
                deleteLocalFiles[filteredImage];
            });

        }
    } catch (error) {
        console.log('Error', error);
        res.status(500).send(`[${error.errno}] Unexpected error occurred, please check server logs. `);
    }

});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
});


// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
