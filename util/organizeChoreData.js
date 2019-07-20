const organizeChoreData = (rawData, userID) => {
    // take all the chore data and organize it as 
    // userChores
    let userChores = [];
    // groups
    let groups = {};
    // created_groups 
    let createdGroups = [];
    //object with all three
    let organizedData = {};

    // only show completed chores for a week after they are done
    const now = Date.now();
    const WEEK = 604800000;

    for(let x = 0; x < rawData.length; x++){
        let data = rawData[x];
        const {chore_id, assign_name, assign_email, chore_name, assign_date, due_date, complete_date, description, group_name, created_by_email, group_id, score} = data;
        const g_name = group_name.replace(' ','_');
        const userData = {chore_id, assign_name, assign_email, chore_name,assign_date, due_date, complete_date,description, group_name, created_by_email, group_id, score};
        const groupData = {chore_id, assign_name, assign_email, chore_name,assign_date, due_date, complete_date,description, g_name, created_by_email, group_id, score};
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
            userChores.push(userData)
        }
        // check if they created the group
        if(data.created_by === userID){
            // only add if its not added to array yet
            if(!createdGroups.includes(group_name)){
                createdGroups.push(group_name)    
            }
        }
        // organize into groups
        if(groups[g_name]){
            if(groups[g_name][assign_name]){
                groups[g_name][assign_name].push(groupData)
            }
            else{
                groups[g_name][assign_name] = [];
                groups[g_name][assign_name].push(groupData)
            }
        }
        else{
            groups[g_name] = {};
            groups[g_name][assign_name] = [] 
            groups[g_name][assign_name].push(groupData);
        }
        
    }
    
    console.log(groups)
     
    organizedData = {userChores, groups,createdGroups};

    return organizedData;
}

module.exports= {
    organizeChoreData : organizeChoreData
}