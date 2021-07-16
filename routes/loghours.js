const router = require('express').Router();
const passport = require('passport');

const connection = require('../config/database');
const User = connection.models.User;

const connectionactivity = require('../config/loghourform');

const Useractivity = connectionactivity.models.Useractivity;

const connectionresident = require('../config/residentlist');
const Resident = connectionresident.models.ResidentList;
const isAuth = require('./authmiddleware').isAuth;
const isAdmin = require('./authmiddleware').isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

 router.get('/protected-route', isAuth, (req, res, next) => {

    //connect to datasebase to fetch residentlist
    getresident()

async function getresident(){

     
    await Resident.find({}, '_id residentname', function (err, docs) {

        
        
        

          docskeyvalue= JSON.stringify(docs)

          



          res.render('loghours',{resident:docskeyvalue,user:req.user})
    });
};
 
});
///////////////////////////////




router.post('/protected-route',isAuth,(req,res,next)=>{
    //generate a uniqque activity code...
    //append userid,date,residentname and 10digit random code...
    //then append this code to the profile database to keep it up to 10 activies...
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    
    let randomid= makeid(10)
    let activityid=randomid.concat( req.body.date)
    function datetransform(datestring,format){
        const myArr = datestring.split("-");
        var convertono1= parseInt(myArr[format], 10);
        if(format==1){
             convertono1=parseInt(`0${convertono1}`)
        }
        return convertono1

        

    }
    
    let year_form = datetransform(req.body.date,0)
    let month_form = datetransform(req.body.date,1)
    let day_form = datetransform(req.body.date,2)
    const newUser = new Useractivity({
        activitygen: req.body.activity_genre,
        activitydes:req.body.activity_description,
        outcomegen: req.body.outcome_genre,
        outcomedes: req.body.outcome_description,
        resident:req.body.residentname,
        Duration:req.body.Duration,
        starttime:req.body.starttime,
        
        year:year_form,
        month:month_form,
        Date:day_form,
        fulldate:req.body.date,
        personresponsible:req.body.Personresponsible,
        _id:activityid,
        resident_id:req.body.residentid.split(",")
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });

        //then now update the resident list...
        //need to check whether the length is more than 10 or not...)
        
        User.findOneAndUpdate({_id: req.body.Personresponsible},  { $push: { recentlog: activityid} }, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            else{
                
              
            }
        
           
        });


    res.redirect(`/homepage`);
})

 
module.exports = router;