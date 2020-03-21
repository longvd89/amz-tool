// ==UserScript==
// @name         LONG V1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';

    // constant data
    let URL_UNSHIPPED_ODERS = 'https://sellercentral.amazon.com/order-reports-and-feeds/api/reportRequest';
    let URL_GET_ORDERS = 'https://sellercentral.amazon.com/order-reports-and-feeds/api/documentMetadata?referenceId='

    let dataSocket = { roomId: 'ROOM_AMZ_CRAWL_ORDER', userId: 'GENK_CLIENT' }
    let URL_SOCKET = 'https://amz-tooly.herokuapp.com/';


    // Your code here... test socket
    let socket = io.connect(URL_SOCKET);
    socket.on('connect', function (data) {
        socket.emit('JOIN_ROOM', dataSocket)
    });


    socket.on('JOINED_SUCCESS', function (data) {
        console.info('You are join success : ', data);
    })

    // get data and send to server
    socket.on('CRAWL_DATA', function (data) {
        console.info(data);
        getUnshippedOders();
        

    });


    function getUnshippedOders() {

        console.info('Run get report ID');

        $.ajax({
            url: URL_UNSHIPPED_ODERS,
            dataType: 'json',
            type: 'post',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify({
                "type": "unshippedOrdersReport",
                "numDays": "1",
                "numMonth": "0",
                "numYear": "2015",
                "reportVersion": "new",
                "includeSalesChannel": true
            }),
            success: function (data, textStatus, jQxhr) {
                console.info('DATA success: ', data);
                let reportRequestId = data.referenceId;
                console.info('ID: ', reportRequestId);
                getReportDatas(reportRequestId)
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });

    };


    function getReportDatas(reportRequestId) {

        let url = URL_GET_ORDERS + reportRequestId;
        console.info('run get data orders')

        $.ajax({
            url: url,
            //dataType: 'json',
            type: 'get',
            async: true,
            //contentType: 'application/json',
            success: function (data, textStatus, jQxhr) {
                console.info('DATA success: ', data);
                socket.emit('CRAWL_DATA_RESULT', { orders: data })

            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                socket.emit('CRAWL_DATA_RESULT', { error: errorThrown })
            }
        });
        console.info('run get data 2')

    };

    //getUnshippedOders();
    // getReportDatas('50877018335');

})();