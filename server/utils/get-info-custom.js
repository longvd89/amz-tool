const fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const JSZip = require("jszip");

async function downloadFileZip (url, path) {
    console.info('Download file zip custom of order!');

    const writer = fs.createWriteStream(path);

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    })
}

const readDataCustom = function (fileCustom, path) {

    return new Promise( (resolve, reject)  => {
        // read a zip file
        fs.readFile(path,function (err, data){
            if (err) throw err;
            JSZip.loadAsync(data).then(function (zip) {

                // Read the contents of the 'Hello.txt' file
                zip.file(fileCustom).async("string").then(function (data) {
                    console.info('READ FILE JSON CUSTOM SUCCESS');
                    resolve (data);
                });
            });
        });
    })
}



let order = {
    "order-id": "111-9661625-5974662",
    "order-item-id": "33216691230338",
    "purchase-date": "2020-04-20T23:18:15-07:00",
    "payments-date": "2020-04-20T23:18:15-07:00",
    "buyer-email": "k0j19pk1pdvt4dx@marketplace.amazon.com",
    "buyer-name": "sunday garcia",
    "buyer-phone-number": "+1 347-448-3190 ext. 70484",
    "sku": "ARTHUONGTSHIRT213",
    "product-name": "Quarantine and Cats 2020 T-Shirt,Unisex",
    "quantity-purchased": "1",
    "currency": "USD",
    "item-price": "21.80",
    "item-tax": "0.00",
    "shipping-price": "6.99",
    "shipping-tax": "0.00",
    "ship-service-level": "Standard",
    "recipient-name": "sunday garcia3",
    "ship-address-1": "3507 BURTON COVE RD",
    "ship-address-2": "",
    "ship-address-3": "",
    "ship-city": "COOKEVILLE",
    "ship-state": "TN",
    "ship-postal-code": "38506-6130",
    "ship-country": "US",
    "ship-phone-number": "+1 347-448-3190 ext. 70484",
    "delivery-start-date": "",
    "delivery-end-date": "",
    "delivery-time-zone": "",
    "delivery-Instructions": "",
    "is-business-order": "false",
    "purchase-order-number": "",
    "price-designation": "",
    "customized-url": "https://zme-caps.amazon.com/t/TocXF7GPKp3k/hbNiGhGUZyE-cvOCag7lMS5HC5JlBTXPdQbKIG2BbAQ/3",
    "customized-page": "https://a.co/aFI6KNv"
};

async function getInfoCustomized(order) {

    let fileName = order['order-id'] + '.zip';

    const path = Path.resolve(__dirname, 'data-custom', fileName);

    const url = order['customized-url'];
    await downloadFileZip(url, path);

    const fileJson  = order['order-item-id'] + '.json';
    let dataCustom = await readDataCustom(fileJson, path);

    //remove file zip
    fs.unlinkSync(path);

    dataCustom = JSON.parse(dataCustom);

    // console.info('DATA CUSTOM : ', dataCustom);

    let infoCustoms = dataCustom.customizationData.children[0].children[0].children;

    for (const item of infoCustoms) {

        if (item.label === 'Please Select Size')
            order.orderSize = item.optionSelection.label.replace(/Size /, '');

        if (item.label === 'Please Select Color')
            order.orderColor = item.optionSelection.label;
    }

    return order;

}

// getInfoCustomized(order);

module.exports = { getInfoCustomized : getInfoCustomized};