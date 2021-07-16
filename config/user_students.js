
 function createNewResident(name,facility,interest,avoid,organization){

        //generate unique id 
        let uniqueid= name.concat(`_${facility}`)



        const newresident = new Resident({
            _id: unniqueid,
            residentname: name,
        residentfacility: facility,
        residentinterest: interest,
        residentavoid: avoid,
        organization: organization
        });

        newresident.save()
        .then((user) => {
            console.log(user);
        });

    }
    
