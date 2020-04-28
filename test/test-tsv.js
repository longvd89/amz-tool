/**
 * Created by vulong on 04/03/2020.
 */

let d3Tsv = require('d3-dsv');
const fs = require('fs');


try {
    let data = fs.readFileSync(__dirname + '/test-2.txt', 'utf8');
    // console.log(data.toString());
    let text = data.toString();
    let tsvData = d3Tsv.tsvParse(text);

    console.info(tsvData)
	
	fs.writeFileSync('file.json', JSON.stringify(tsvData, null,2));
} catch(e) {
    console.log('Error:', e.stack);
}



