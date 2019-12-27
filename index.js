const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
function print(data)
{
    // const device  = new escpos.RawBT();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
    const escpos = require('escpos')
    const device  = new escpos.USB(0x04b8,0x0202);
    const printer = new escpos.Printer(device);
    device.open(function(err){
    printer
    .align('CT')
    .text('OMAH DHUWUR \n')
    .text(`\n`)
    .align('LT')
    .text(`Customer     : ${data.orders.behalf_of}\n`)
    .text(`Table        : Meja ${data.orders.tables}`)
    .text("======================================")
    .tableCustom([ 
        { text:"Left", align:"LEFT", width:0.33 },
        { text:"Center", align:"CENTER", width:0.33},
        { text:"Right", align:"RIGHT", width:0.33 }
      ]) 
    .cut()
    .close()
    });
}

io.on('connection',(socket) => {
    console.log("socket connected !!")
    socket.on('print_orders_food',(data,callback) => {
        print(data)
        return callback({
            message:'success'
        })
    })
})
http.listen(4500,(listen) => {
    console.log("Server run on 4500")
})



