const fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadImage () {  
    console.info('bat dau')
  const url = 'https://zme-caps.amazon.com/t/TSDaCjM0oeLV/Aa7jv7gGgfSd3zStiPUPkY39uwIT9iQiMAk1Hv1nZAA/3'
  const path = Path.resolve(__dirname, 'images', 'test.zip')
  const writer = fs.createWriteStream(path)

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

// downloadImage();


var JSZip = require("jszip");
const path = Path.resolve(__dirname, 'images', 'test.zip') 
// read a zip file
fs.readFile(path, function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
      files = Object.keys(zip.files);
      console.log(files);

      // Read the contents of the 'Hello.txt' file
      zip.file("58132736175570.json").async("string").then(function (data) {
        // data is "Hello World!"
        console.log(data);
      });
    });
});