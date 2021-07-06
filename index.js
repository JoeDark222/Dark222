var express = require('express');
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));
app.listen(3000);

//Connect Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbtoanprodx1:Tu7121993@@cluster0.ldiid.mongodb.net/Daohanmon?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false }, function(err)
    {
        if(err){
            console.log("Mongo connect error: " + err);
        }else{
            console.log("mongo connected successfull.");
        }
    }
);



// body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));
//Models
var DSKH = require("./Models/dbmongo");
var DSThe = require("./Models/dbcard");


app.get("/", function(req, res){
    res.render("daohan_login");
});
//Dang nhap
app.get("/Login", function(req, res){
    res.render("daohan_login");
});
app.get("/Dangky", function(req, res){
    res.render("dangkiadmin");
});
app.get("/ResetMK", function(req, res){
    res.render("Home");
});

//Trang chu
app.get("/Admin", function(req, res){
    DSKH.count(function(err, data){
        if(err)
        {}
        else{
            console.log(data);
            res.render("Home",{coun:data});
        }
    })
   
});


// Xu li Button
app.post('/addnew' , (req , res)=>{
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }
    var dskh =DSKH({
        
        NameKh: req.body.txtNameKh,
        EmailKH: req.body.txtEmailKH,
        SDTKH: req.body.txtSDTKH,
        Card: [],
        
    });
    var dscard =DSThe({            
        BankName:  req.body.txtBankName,
        STKH: req.body.txtSTKH,
        DateSK: formatDate(req.body.txtDateSK),
        DateTT: formatDate(req.body.txtDateTT),
        HanMuc: req.body.txtHanMuc,
    });
    dscard.save(function(err){});
    dskh.save(function(err,data){
        if(err){
           console.log("ancut")
        }else{
            console.log("ok baby")
            DSKH.findOneAndUpdate({_id:data._id}, {$push: {Card:dscard._id}},function(err, data){
                if(err){
                    console.log("chen the an cut roi")
                }else{
                    res.redirect("Khachhang");
                }
            })
        }
    });  

    })


   



app.post("/add", function(req, res){
    res.render("Home");
});


// Get Danh Sach
app.get('/Khachhang' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("Khachhang",{ danhsachKH:data})
        }
    });
  

})




app.get('/Card/:id' , (req , res)=>{
    var dskhach = DSKH.aggregate([{
        $lookup:{
            from: "dsthes",
            localField: "Card",
            foreignField: "_id",
            as:"DSTHE"
        }
    }], function(err, pris){
        console.log(pris)
        pris.forEach(function(dskh){ 
                           
                    if(dskh._id ==  req.params.id){
                      
                        res.render("Card",{ danhsachthe:dskh})
                    }
                   
                })
            
        })
   
    })
   

app.post('/Card' , (req , res)=>{ 
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }
    var dscard =DSThe({            
        BankName:  req.body.txtBankName,
        STKH: req.body.txtSTKH,
        DateSK: formatDate(req.body.txtDateSK),
        DateTT: formatDate(req.body.txtDateTT),
        HanMuc: req.body.txtHanMuc,
    });
    dscard.save(function(err){
        if(err){
            console.log("luu the an cut roi")
        }else{
            DSKH.findOneAndUpdate({_id:req.body.slcID}, {$push: {Card:dscard._id}},function(err, data){
                if(err){
                    console.log("chen the an cut roi")
                }else{
                    res.redirect("Khachhang");
                }
            })
        }
    })    
   
   
    })
