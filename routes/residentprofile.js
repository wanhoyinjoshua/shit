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


//display list of residents//// then can click on it to post to another route.....

// to use resident's id --> to pull from actirtivites list with the id-
// so wil have collection of all activities....sort by month can have filter...
//and then gebenrate uniquye actitivy list--> then map each activity genre with the 
//activity details.... then analyze... analyze outcome genere, no fo active enegagement.4
//and pull all the outcome description as a blob for summary....good idea
// format: resident name : activuty genre: active hours: passive : others:
//then list of outcome descriptions as dotpoints....analyze which day of the week it is...
//overall recommendation for that if proportion of active > passove and others then yes
//the big picture will hv name , then list of activity genre(this is combining all of gsp)
//then recommendation will include which actitifvy shd do more and on which day of the week. 
//need to include time when logging the activites

//resident name : lucy 
//outcome generes: 1 on 1 pampers
//active engagement : 12 hours passive engagement: 20 hours others: 12 hours 
//Outcome for the resident: . she enjoyed it very well, she likd it , always smile...
//Details of the activities:----
//Analysis: this activity is appropriate for lucy because there are __ of active engagemenmt/not
//Recommendation: This activity is usually perfomred on wed/ what time(starttime)(just the highest freqyuency)


//for actitivy analysis: actiivy genre: identify who likes it and who doesnt like it. 
//timm cost , what time of the day , if its a group what day of the week. 

router.get("/residentprofile",(req,res,next)=>{

    Useractivity.find({resident_id:"60eaa158b537555d207a2844"})
    .lean()
    .sort({year: 'asc'})
    .sort({month: 'asc'})
    .sort({Date: 'asc'})


    .exec((err,data)=>{

        var residentname=[]
        for(i=0;i<data.length;i++){
            console.log(data[i].resident)
            residentname.push(data[i].resident)

        }
        //should be in req.body .input...
        var newresidentlist = [...new Set(residentname)];
        console.log(newresidentlist)
        var newnewresidentlist=[]
        for(j=0;j<newresidentlist.length;j++){
            if(newresidentlist[j]=='Group_activities'){
                console.log("dup")

            }
            else{
                newnewresidentlist.push(newresidentlist[j])
            }


            
        }

        
        //generate unqiue list of activites
        var uniquelistofactivites=[]
        for(i=0;i<data.length;i++){
            console.log(data[i].activitygen)
            uniquelistofactivites.push(data[i].activitygen)

        }

        let newactiviteslist = [...new Set(uniquelistofactivites)];
        console.log(newactiviteslist)
        var outcomedescription=[];
        var activityinsight=[];
        for(i=0;i<newactiviteslist.length;i++){
            var detailsarray= data.filter(x=>x.activitygen==newactiviteslist[i])
            var pureoutcome= detailsarray.map(x=>`${x.outcomedes}(${x.fulldate})`)
            var outcomesgenr=detailsarray.map(x=>[x.outcomegen,x.Duration,x.starttime,new Date(x.fulldate).getUTCDay()])
            var activitydetials= detailsarray.map(x=>`${x.activitydes} (${x.fulldate})`)
           const activityobject ={activitytime:newactiviteslist[i],outcomedescription:pureoutcome,timestats:outcomesgenr,actualstuff:activitydetials}

       
            //i should make tis into an object....
            outcomedescription.push(activityobject)
        }
        console.log(outcomedescription)
        var datatodom=[]

        for(i=0;i<outcomedescription.length;i++){

            var listofdays=[]
            var listoftime=[]
            var listofactivehours=[]
            var listofpassivehours=[]
            var listofdisengaged=[]
            
            var m = outcomedescription[i].timestats.length
            
            for(j=0;j<outcomedescription[i].timestats.length;j++){
                listofdays.push(outcomedescription[i].timestats[j][3])
                listoftime.push(outcomedescription[i].timestats[j][2])
                if(outcomedescription[i].timestats[j][0]=="active engagement"){
                    listofactivehours.push(outcomedescription[i].timestats[j][1])
                } else if(outcomedescription[i].timestats[j][0]=="pasive engagement"){
                    listofpassivehours.push(outcomedescription[i].timestats[j][1])

                }
                else{
                    listofdisengaged.push(outcomedescription[i].timestats[j][1])
                }

            }
            console.log(listofdays);
            console.log(listoftime)
            console.log(listofactivehours)
            console.log(listofdisengaged)
            console.log(listofpassivehours)
            outcomedescription[i].timestats=[listofdays,listoftime,listofactivehours,listofpassivehours,listofdisengaged]
           

            
            

        }

        console.log(outcomedescription)

        
        

        res.render("residentprofile",{data:JSON.stringify(outcomedescription),actilist:JSON.stringify(newactiviteslist),name:JSON.stringify(newnewresidentlist)})

       

        



        
        




    })

})

module.exports = router;
