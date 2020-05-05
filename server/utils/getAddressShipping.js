
function getStateOfCustomer(strState) {

    const {states} = require('../../common/constrant');
    let state = "";

    if(strState.length === 2)
        state = strState;
    else {
        state = states.filter( item => item.name.toLocaleUpperCase() === strState.toLocaleUpperCase())[0].code;
    }

    return state;

}

function getAddressShipping(orderItem) {

    let addressShipping = {};
    // addressShipping.country = "US";
    addressShipping.name = orderItem['recipient-name'];
    addressShipping.address1 = orderItem['ship-address-1'];
    addressShipping.city = orderItem['ship-city'];
    addressShipping.zip = Number(orderItem['ship-postal-code'].replace(/-/, ""));
    addressShipping.state = getStateOfCustomer(orderItem['ship-state']);

    if (orderItem['ship-address-2'])
        addressShipping.address2 = orderItem['ship-address-2'];

    return addressShipping;

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
    "recipient-name": "Joseph Repetti",
    "ship-address-1": "2415 E 72ND ST",
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

let address = getAddressShipping(order);

console.info(address);
//Number(orderItem['ship-postal-code'].split("-")[0])
