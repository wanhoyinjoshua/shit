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

 


///////////////////////////////




router.get('/addactivitygenre',isAuth,(req,res,next)=>{
    //generate a uniqque activity code...
    //append userid,date,residentname and 10digit random code...
    //then append this code to the profile database to keep it up to 10 activies...
  

        //then now update the resident list...
        //need to check whether the length is more than 10 or not...)
        console.log(req.body.log_id)
        Useractivity.deleteOne({_id:`${req.body.log_id}`})
        .then(function(){
            console.log("Data deleted");
            res.redirect("/homepage")
             // Success
        }).catch(function(error){
            console.log(error); // Failure
        });
        //might be able to sort them in order...
        
       
       
        
           
    


    
})



router.get('/deleteuserlog',isAuth,(req,res,next)=>{
    //generate a uniqque activity code...
    //append userid,date,residentname and 10digit random code...
    //then append this code to the profile database to keep it up to 10 activies...
  

        //then now update the resident list...
        //need to check whether the length is more than 10 or not...)
        console.log(req.body.log_id)
        Useractivity.deleteOne({_id:`${req.body.log_id}`})
        .then(function(){
            console.log("Data deleted");
            res.redirect("/homepage")
             // Success
        }).catch(function(error){
            console.log(error); // Failure
        });
        //might be able to sort them in order...
        
       
       
        
           
    


    
})

 
module.exports = router;