import fs from 'fs';
import Jimp = require('jimp');

/**
 * Helper function to download, filter, and save the filtered image locally returns the absolute path to the local image
 * @param inputURL string: A publicly accessible url to an image file
 * @returns Promise<string>: An absolute path to a filtered image locally saved file
 */
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async resolve => {
    const photo = await Jimp.read(inputURL);
    const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
    photo.resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(__dirname + outPath, () => {
        resolve(__dirname + outPath);
      });
  });
}

/**
 * Helper function to delete files on the local disk useful to cleanup after tasks
 * @param files Array<string>: An array of absolute paths to files
 */
export async function deleteLocalFiles(files: Array<string>): Promise<void[]> {
    const promises = new Array<Promise<void>>();
    let deleteAction;
    for (let file of files) {
      deleteAction = new Promise<void>((resolve, reject) => {
        fs.unlink(file, (err) => {
          if (err) {
            reject(err)
          }
        });
        resolve()
      });
      promises.push(deleteAction);
    }
    return Promise.all(promises);
}