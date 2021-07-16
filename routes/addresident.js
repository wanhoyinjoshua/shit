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




router.get('/addresident',isAuth,(req,res,next)=>{
 
   //should get req.body lfaiclity to get the correct residents

        //then now update the resident list...
        //need to check whether the length is more than 10 or not...)
        console.log(req.body.log_id)
        Resident.find({organization:req.user.Facility})
        .lean()
        .select('-interest -avoid -__v -_id')
        
        .exec((error,data)=>{



            res.render("getresident",{data1:JSON.stringify(data)})
        }



)
        //might be able to sort them in order...
        
       
       
        
           
    


    
})



router.post('/addresident',isAuth,(req,res,next)=>{
 
    const newresident = new Resident({
        residentname: req.body.residentname,
        residentfacility: req.body.residentfacility,
        organization:req.body.residentorganization

        
        
    });

    newresident.save()
        .then((user) => {
           res.redirect("/homepage")
        });
 
         
 
}
)
        
        
         
            
     
 

 


 
module.exports = router;