var mongoose = require("mongoose");

var schemaKhachHang = new mongoose.Schema({
 
    NameKh: String,
    EmailKH: String,
    SDTKH: Number,
    Card: [{type:mongoose.Schema.Types.ObjectId}],

   
});

module.exports = mongoose.model("DSKH", schemaKhachHang);
