const router = require('express').Router();
const passport = require('passport');

const connection = require('../config/database');
const User = connection.models.User;
const connectionactivity = require('../config/loghourform');

const Useractivity = connectionactivity.models.Useractivity;

const connectionresident = require('../config/residentlist');
const Resident = connectionresident.models.ResidentList;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

const genPassword = require('../lib/passwordUtils').genPassword;
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');

/**
 * -------------- POST ROUTES ----------------
 */

 router.get('/protected-route2',isAuth, (req, res, next) => {
    
  /*  function createNewResident(name,facility,interest,avoid){

        //generate unique id 
        let uniqueid= name.concat(`_${facility}`)



        const newresident = new Resident({
            _id: unniqueid,
            residentname: name,
        residentfacility: facility,
        residentinterest: interest,
        residentavoid: avoid,
        });

        newresident.save()
        .then((user) => {
            console.log(user);
        });

    }
    
*/
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var d = new Date();
var actualmonth = month[d.getMonth()];

var m = d.getMonth()+1;
console.log(m)
var y = d.getFullYear();

Useractivity.find({personresponsible:`${req.user._id}`,month:{$all:[m]},year:{$all : [y]}})
//might be able to sort them in order...
.lean()
.select('-_id -_v')
.sort({Date: 'asc'})
.exec((error,data)=>{

    if(!error){
        //have data , a list of objects
        //then generate unique resident list and make up the head row
        //generate a time list basically just compare the date will be fine..
        //then generte the row...
        var activehours=0
        var passivehours=0
        var badoutcome=0


        for (i=0;i<data.length;i++){

            if(data[i].outcomegen=='active engagement'){

                activehours+=data[i].Duration;

            }
            
            if(data[i].outcomegen=='pasive engagement'){

                passivehours+=data[i].Duration;

            }
            else if(data[i].outcomegen=='nil'){
                badoutcome+=data[i].Duration
            }
            
           
        }

        console.log(data)
        var timelist= []
        for (i=0;i<data.length;i++){

            if(data[i].fulldate!=undefined){

                timelist.push(data[i].fulldate)

            }
            
           
        }
        var residentlist=[]
        for (i=0;i<data.length;i++){
            
            residentlist.push(data[i].resident)
        }

        let uniqueresident = [...new Set(residentlist)];
        //take out group activites
        const groupactivityindex = uniqueresident.indexOf("Group_activities");
        
        if (groupactivityindex > -1) {
            uniqueresident.splice(groupactivityindex, 1);
        }

        const adminactivityindex = uniqueresident.indexOf("Admin");
        if (adminactivityindex > -1) {
            uniqueresident.splice(adminactivityindex, 1);
        }

        
        let uniquetimelist = [...new Set(timelist)];
        console.log(uniqueresident)
        uniqueresident.unshift("Date","Admin","Group_activities")
        console.log(uniqueresident)
        console.log(uniquetimelist)
        //have uniqueresident and timelist and data(list of objects)
        //now generate a list of lists [[one row],[next row]]
        var maincontent=[]
        
       
     
      for(i=0;i<uniquetimelist.length;i++){
          var subrow=[]
          subrow.push(uniquetimelist[i])
          for(j=1;j<uniqueresident.length;j++){

            var newArray = data.filter(function (el) {
                return el.resident == uniqueresident[j] &&
                       el.fulldate == uniquetimelist[i] 
              });
            console.log(JSON. stringify(newArray[0]))
            subrow.push(newArray[0])
           

           
            }
            maincontent.push(subrow)
              //declare fucntion

             

              
              
           
             
             
             
          

          


      }

        console.log(maincontent)
        //have uniqueresident and timelist and data(list of objects)
        //might be able to use maincontent and uniques resident to render the table.

        //now generate csv 
        const csvFromArrayOfArrays = convertArrayToCSV(maincontent, {
            header:uniqueresident,
            separator: ','
          });

          
          console.log(maincontent);
          console.log(JSON.stringify(maincontent))
          //how can the browser read this...
          
  


        res.render("monthlyreport",{name:req.user.username,csv:csvFromArrayOfArrays,bodyoftable:JSON.stringify(maincontent),header:JSON.stringify(uniqueresident),month:m,y:y,active:activehours,passive:passivehours,badhours:badoutcome})


        

    }
})


 })


 router.post('/monthlyreport',isAuth, (req, res, next) => {

    //everytime post redirectback to /monthlyreport but inject different data accordingly...
    
    //get list of activities by the person...
    //get unique resident list with no duplicates 
    //const names = ['John', 'Paul', 'George', 'Ringo', 'John'];

/*let unique = [...new Set(names)];
console.log(unique); // 'John', 'Paul', 'George', 'Ringo'*/

//figure out a date unique list ...
//so now we have both the row and column. 
//so now for each date and each resident, if yes populate.
//even for group activites.......um....well...treated as individual cases...
// so this is for generation of excel sheet...
//but for analysis...
//need to have resident list.... then have unique activity lsit...

//query item : person id , month tag , year tag, if year and month is empty default as dat object
//list of all activites , then list of resident name and list of time .
//shoudl have three list; dates, residents and combiend . 
//need header [group, admin, resident, resident, resident]
Useractivity.find({personresponsible:`${req.user._id}`,month:{$all:[req.body.month]},year:{$all : [req.body.year]}})
//might be able to sort them in order...
.lean()
.select('-_id -_v')
.sort({Date: 'asc'})
.exec((error,data)=>{

    if(!error){
        //have data , a list of objects
        //then generate unique resident list and make up the head row
        //generate a time list basically just compare the date will be fine..
        //then generte the row...

        //calculate hours 
        var activehours=0
        var passivehours=0
        var badoutcome=0


        for (i=0;i<data.length;i++){

            if(data[i].outcomegen=='active engagement'){

                activehours+=data[i].Duration;

            }
            
            if(data[i].outcomegen=='pasive engagement'){

                passivehours+=data[i].Duration;

            }
            else{
                badoutcome+=data[i].Duration
            }
            
           
        }

        console.log(data)
        var timelist= []
        for (i=0;i<data.length;i++){

            if(data[i].fulldate!=undefined){

                timelist.push(data[i].fulldate)

            }
            
           
        }
        var residentlist=[]
        for (i=0;i<data.length;i++){
            
            residentlist.push(data[i].resident)
        }

        let uniqueresident = [...new Set(residentlist)];
        let uniquetimelist = [...new Set(timelist)];
        console.log(uniqueresident)

        const groupactivityindex = uniqueresident.indexOf("Group_activities");
        
        if (groupactivityindex > -1) {
            uniqueresident.splice(groupactivityindex, 1);
        }

        const adminactivityindex = uniqueresident.indexOf("Admin");
        if (adminactivityindex > -1) {
            uniqueresident.splice(adminactivityindex, 1);
        }



        ///////////////////////
        uniqueresident.unshift("Date","Admin","Group_activities")
        console.log(uniqueresident)
        console.log(uniquetimelist)
        //have uniqueresident and timelist and data(list of objects)
        //now generate a list of lists [[one row],[next row]]

        
        var maincontent=[]
        
       
     
      for(i=0;i<uniquetimelist.length;i++){
          var subrow=[]
          subrow.push(uniquetimelist[i])
          for(j=1;j<uniqueresident.length;j++){

            var newArray = data.filter(function (el) {
                return el.resident == uniqueresident[j] &&
                       el.fulldate == uniquetimelist[i] 
              });
            console.log(JSON. stringify(newArray[0]))
            subrow.push(newArray[0])
           

           
            }
            maincontent.push(subrow)
              //declare fucntion

             

              
              
           
             
             
             
          

          


      }

        console.log(maincontent)
        //have uniqueresident and timelist and data(list of objects)
        //might be able to use maincontent and uniques resident to render the table.

        //now generate csv 
        const csvFromArrayOfArrays = convertArrayToCSV(maincontent, {
            header:uniqueresident,
            separator: ','
          });

          
          console.log(maincontent);
          console.log(JSON.stringify(maincontent))
          //how can the browser read this...

        res.render("monthlyreport",{name:req.user.username,csv:csvFromArrayOfArrays,bodyoftable:JSON.stringify(maincontent),header:JSON.stringify(uniqueresident),month:req.body.month,y:req.body.year,active:activehours,passive:passivehours,badhours:badoutcome})


        

    }
})
//next somehow chain it save a copy of these activity list. then get a 

//need the row: date: resident, resident. resident.



 });


 
module.exports = router;