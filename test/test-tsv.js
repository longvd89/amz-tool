/**
 * Created by vulong on 04/03/2020.
 */

let d3Tsv = require('d3-dsv');
const fs = require('fs');

let { getInfoCustomized } = require('../server/utils/get-info-custom');

async function testData() {

    try {
        let data = fs.readFileSync(__dirname + '/20254309451018373.txt', 'utf8');
        // console.log(data.toString());
        let textOrder = data.toString();
        let orders = d3Tsv.tsvParse(textOrder);

        let results = [];

        for (const itemOrder of orders) {

            let orderNew = await getInfoCustomized(itemOrder);
            results.push(orderNew)
        }


        fs.writeFileSync('file.json', JSON.stringify(results, null,2));
    } catch(e) {
        console.log('Error:', e.stack);
    }

}

testData();






