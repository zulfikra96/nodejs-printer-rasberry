const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const player = require('play-sound')();


function print(data)
{
    // const device  = new escpos.RawBT();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
    const escpos = require('escpos')
    const device  = new escpos.USB(0x0416,0x5011);
    const printer = new escpos.Printer(device);
    if(device){
        device.open(function(err){
        printer
        .align('CT')
        .text('OMAH DHUWUR \n')
        .align('LT')
        .text(`Customer     : ${data.orders.behalf_of}`)
        .text(`Table        : ${data.orders.tables}`)
        .text("================================");
            for(let i = 0; i < data.carts.length; i++){
                printer.tableCustom([
                    {text:`* ${data.carts[i]["product_name"]}`, align:'LEFT', width:0.4 },
                    {text:`${data.carts[i]["quantity"]}`, align:'RIGHT', width:0.2}
                ])
        }
        printer.cut();
        printer.close();
        });
    }
    player.play('./nada.mp3', (err) => {
        if (err) console.log(`Could not play sound: ${err}`);
    });
}
//print();
//
function testPrint()
{
   const escpos = require('escpos');
   const device  = new escpos.USB(0x0416,0x5011);
   const printer = new escpos.Printer(device);
   device.open(() => {
   	printer
	   .align("CT");

	printer.table(['hello world','hello world']);
	printer.table(['hello world','hello world']);
	printer.close();
   })
}
//testPrint();

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



