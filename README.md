# Udagram Image Filtering Microservice

Udagram: Your Own Instagram on AWS.  
Code base from Udacity - Cloud Developer Nanodegree Program. Fork from https://github.com/udacity/cloud-developer

## Udagram image filtering microservice

Code base from [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. 
It is a Node-Express application which runs a simple script to process images.

### Run Node Environment

Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

### Authentication - API Key

You need to create a file `.env` file in your root folder and add a entry with your api key value. i.e:
```
MACHINE_TOKEN=YourApiKeyValue
```
Then update the postman collection file with your api key value.

Note: If you don´t do that, the default api key is `YourApiKeyValue` for the service and the postman collection file in this repository.
