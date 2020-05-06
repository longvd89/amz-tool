const URL_API_SCALABLE = 'https://api.scalablepress.com/v2/';
const API_KEY_LIVE = "live_io2W8YRQVrp9OZrz2dyOXw";
const API_KEY_TEST = "test_6FiGCOVpdSuDTn-b_y6URQ";
const axios = require('axios');
const {getAddressShipping} = require('./getAddressShipping');


async function createDesignId(sku) {

    //todo: get designId if store in DB or get url image of design from SKU

    let apiDesign = URL_API_SCALABLE + 'design';
    let designUrl = "https://i.ibb.co/ckR1GS7/My-21st-birthday-the-one-where-one-where-i-was-quarantine-2020-06.png";

    try {
        let response = await axios.post(apiDesign,
            {
                name: 'TSHIRT_2020_LONGVD',
                type: 'dtg',
                sides: {
                    front: {
                        artwork: designUrl,
                        // aspect: 1,
                        dimensions: {
                            width: '10'
                        },
                        position: {
                            horizontal: 'C',
                            offset: {
                                top: '2.5'
                            }
                        }
                    }
                }
            },
            {
                withCredentials: true,
                auth: {
                    // user: scalableConfig.userName,
                    password: API_KEY_LIVE,
                    sendImmediately: true
                }
                ,
                headers: {
                    'content-type': 'application/json',
                }
            }
        );

        let designID = response.data.designId;
        console.info(" CREATE DESIGN SUCCESS: ", designID);
        return designID;

    } catch (error) {
        console.error('ERROR CREATE DESIGN :', error);
    }

}

async function createQuote(orderAmz, designId) {

    const sizeScalable = {
        'S': "sml",
        'M': "med",
        'L': "lrg",
        'XL': "xlg",
        '2XL': "xxl",
        '3XL': "xxxl",
        '4XL': "xxxxl",
        '5XL': "xxxxxl"
    };

    let apiQuote = URL_API_SCALABLE + 'quote';

    let product = {};
    product.id = "gildan-sweatshirt-crew";
    product.color = orderAmz.orderColor;
    product.size = sizeScalable[orderAmz.orderSize];
    product.quantity = Number(orderAmz['quantity-purchased']);

    console.info('PRODUCT: ', product);

    let addressShipping = getAddressShipping(orderAmz);

    try {
        let response = await axios.post(apiQuote, {
                designId: designId,
                type: 'dtg',
                products: [product],
                address: addressShipping
            }, {
                withCredentials: true,
                auth: {
                    // user: scalableConfig.userName,
                    password: API_KEY_LIVE,
                    sendImmediately: true
                }
                ,
                headers: {
                    'content-type': 'application/json',
                }
            }
        );

        let orderToken = response.data;

        console.info("CREATE QUOTE SUCCESS: ", orderToken);

        return orderToken;

    } catch (error) {
        console.error('ERROR CREATE QUOTE :', JSON.stringify(error.response.data));
    }

}


async function placeOrder(orderToken) {
    let apiPlaceOrder = URL_API_SCALABLE + 'order';

    try {
        let response = await axios.post(apiPlaceOrder, {
                orderToken: orderToken

            }, {
                withCredentials: true,
                auth: {
                    // user: scalableConfig.userName,
                    password: API_KEY_LIVE,
                    sendImmediately: true
                }
                ,
                headers: {
                    'content-type': 'application/json',
                }
            }
        );

        let orderData = response.data;

        console.info("PLACE ORDER SUCCESS: ", orderData);
        return orderData;

    } catch (error) {
        console.error('ERROR PLACE ORDER :', error);
    }
}

// create order
async function fulfillOrders(orderAmz) {

    // ----- # STEP1 : Create a design ID ----------------------
    let designID = await createDesignId(orderAmz.sku);

    // ----- # STEP2 : Create a quote ----------------------
    let dataQuote = await createQuote(orderAmz, designID);

    // ----- # STEP3 : Place an order ----------------------
    let orderToken = dataQuote.orderToken;
    let dataOrder = await placeOrder(orderToken);

    return dataOrder.orderId;
}

// get status order
async function getOrderStatus (orderId) {
    let apiPlaceOrder = URL_API_SCALABLE + 'order/' + orderId;

    try {
        let response = await axios.get(apiPlaceOrder, {
                // withCredentials: true,
                auth: {
                    // user: scalableConfig.userName,
                    password: API_KEY_LIVE,
                    sendImmediately: true
                }
                ,
                headers: {
                    'content-type': 'application/json',
                }
            }
        );

        return response.data;;

    } catch (error) {
        console.error('ERROR GET ORDER STATUS :', error);
    }
}

async function main() {
    let order = {
        "order-id": "112-2086552-0099424",
        "order-item-id": "19160163530970",
        "purchase-date": "2020-04-20T22:47:59-07:00",
        "payments-date": "2020-04-20T22:47:59-07:00",
        "buyer-email": "f4ck283ynt6p0gg@marketplace.amazon.com",
        "buyer-name": "Joseph Repetti",
        "buyer-phone-number": "+1 314-282-9402 ext. 08889",
        "sku": "ARRTHAMTANK51",
        "product-name": "My 38th Birthday The one Where one Where i was Quarantine 2020 Tank top.Unisex.",
        "quantity-purchased": "1",
        "currency": "USD",
        "item-price": "26.80",
        "item-tax": "0.00",
        "shipping-price": "6.99",
        "shipping-tax": "0.00",
        "ship-service-level": "Standard",
        "recipient-name": "Joseph Repetti",
        "ship-address-1": "2415 E 72ND ST",
        "ship-address-2": "",
        "ship-address-3": "",
        "ship-city": "BROOKLYN",
        "ship-state": "NEW YORK",
        "ship-postal-code": "11234-6619",
        "ship-country": "US",
        "ship-phone-number": "+1 314-282-9402 ext. 08889",
        "delivery-start-date": "",
        "delivery-end-date": "",
        "delivery-time-zone": "",
        "delivery-Instructions": "",
        "is-business-order": "false",
        "purchase-order-number": "",
        "price-designation": "",
        "customized-url": "https://zme-caps.amazon.com/t/Fm1h3hbRepi6/71lQoCFAwWHri_CHY3WkzIYUe2xygTQNNMJC6wnR8nQ/3",
        "customized-page": "https://a.co/7St1txf",
        "orderSize": "M",
        "orderColor": "Black"
    };

    // let orderId = await fulfillOrders(order);
    // console.info('id:         ', orderId);
    //orderId: '5eb2524fa356e95fcc266d74',

    let orderStatus = await getOrderStatus('5eb26b74e3b6c15344027985');

    console.info(orderStatus)
}

main();
