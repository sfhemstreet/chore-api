const organizeChoreData = (rawData, email) => {
    /* take all the chore data and organize it as */
    // userChores
    // groups
    // created_groups 
    // authorization
    let userChores = [];
    let groups = {};
    let createdGroups = [];
    let authorization = {};

    // object to hold organized data
    let organizedData = {};

    // only show completed chores for a week after they are done
    const now = Date.now();
    const WEEK = 604800000;

    for(let x = 0; x < rawData.length; x++){
        const data = rawData[x];
        const {chore_id, assign_name, assign_email, chore_name, assign_date, due_date, complete_date, description, group_name, created_by_email, group_id, score, auth} = data;
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
        if(assign_email === email){
            if(chore_id !== null){
                userChores.push(userData)    
            }  
            authorization[g_name] = auth;
        }
        // check if they created the group
        if(created_by_email === email){
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
    organizedData = { userChores, groups, createdGroups, authorization };
    
    return organizedData;
}

module.exports= {
    organizeChoreData : organizeChoreData
}