import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import validator from 'validator'
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //CORS Should be restricted
  const clientServer = process.env.CLIENT_SERVER;
  app.use(function (req, res, next) {
    if (clientServer) {
      res.header("Access-Control-Allow-Origin", clientServer);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // Valid the api-key
  async function validApiKey(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization) {
      return res.status(401).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
      return res.status(401).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];
    const apiKey = process.env.MACHINE_TOKEN || 'YourApiKeyValue'
    if (token !== apiKey) {
      return res.status(403).send({ message: 'Forbidden: incorrect api key' });
    }
    return next()
  }


  // GET /filteredimage?image_url={{URL}} - endpoint to filter an image from a public url.
  //  1. validate the image_url query
  //  2. call filterImageFromURL(image_url) to filter the image
  //  3. send the resulting file in the response
  //  4. deletes any files on the server on finish of the response
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get("/filteredimage", validApiKey, async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(400)
        .send({ message: 'The image_url query param is required.' })
    }
    if (!validator.isURL(image_url as string)) {
      return res.status(400)
        .send({ message: 'The image_url must be a valid URL.' })
    }
    let filterImagePath: string;
    try {
      filterImagePath = await filterImageFromURL(image_url as string);
      return res.sendFile(filterImagePath);
    } catch (err) {
      return res.status(500)
        .send({ message: 'Internal Server error', detail: err?.message })
    } finally {
      if (filterImagePath) {
        res.on('finish', () => deleteLocalFiles([filterImagePath]));
      }
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
