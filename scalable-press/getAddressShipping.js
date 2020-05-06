
function getStateOfCustomer(strState) {

    const {states} = require('../common/constrant');
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
    addressShipping.zip = orderItem['ship-postal-code'];
    addressShipping.state = getStateOfCustomer(orderItem['ship-state']);

    if (orderItem['ship-address-2'])
        addressShipping.address2 = orderItem['ship-address-2'];

    return addressShipping;

}

module.exports = {getAddressShipping : getAddressShipping};



// let address = getAddressShipping(order);
//Number(orderItem['ship-postal-code'].split("-")[0])
