const organizeChoreData = (rawData, userID) => {
    // take all the chore data and organize it as 
    // userChores
    let userChores = [];
    // groups
    let groups = {};
    // created_groups 
    let createdGroups = {};
    //object with all three
    let organizedData = {};

    // only show completed chores for a week after they are done
    const now = Date.now();
    const WEEK = 604800000;

    for(let x = 0; x < rawData.length; x++){
        let data = rawData[x];
        const {chore_id, assign_name, assign_email, chore_name, assign_date, due_date, complete_date, description, group_name, created_by_email} = data;
        const sendData = {chore_id, assign_name, assign_email, chore_name,assign_date, due_date, complete_date,description, group_name, created_by_email};
        //check to see if chore was completed more than a week ago
        if(complete_date !== null){
            const com_date = new Date(complete_date).getTime();
            if(now - com_date > WEEK){
                // its over a week old dont send it
                continue;
            } 
        }
        // check if its the users chore
        if(data.user_id === userID){
            userChores.push(sendData)
        }
        // check if they created the group
        if(data.created_by === userID){
            if(createdGroups[group_name]){
                createdGroups[group_name].push(sendData)
            }
            else{
                createdGroups[group_name] = [];
                createdGroups[group_name].push(sendData);
            }
        }
        // organize into groups
        if(groups[group_name]){
            groups[group_name].push(sendData)
        }
        else{
            groups[group_name] = [];
            groups[group_name].push(sendData);
        }
    }
    organizedData = {userChores,groups,createdGroups};

    return organizedData;
}

module.exports= {
    organizeChoreData : organizeChoreData
}