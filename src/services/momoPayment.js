const crypto = require('crypto')

exports.paymentConfig = (order, userId) => {
    const partnerCode = "MOMO6K0Y20210317"
    const accessKey = "8oZLaYOOTAswDt0O"
    const secretkey = "MHxk2u6eOXitCarGbCsGXmpydjn0wCAk"
    const requestId = partnerCode + new Date().getTime()
    const orderId = requestId
    const orderInfo = "Thanh toán giày tại DoubleT"
    const redirectUrl = "https://doublet.vercel.app/cart"
    const ipnUrl = "https://api-sportswear.herokuapp.com/api/order/addOrderByPaymentMomo"
    const amount = order.totalAmount
    const requestType = "captureWallet"
    const extraData = JSON.stringify({ ...order, userId: userId }) + "@" //pass empty value if your merchant does not have stores
    const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    const signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex')
    //json object send to MoMo endpoint
    const body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        orderObj: order,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    })
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    }
    return { body, options }
}