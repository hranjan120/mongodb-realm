const Realm = require('realm');

const Task = require('./dataModel');

/*
*--------------------------
*/
const handleSyncError = async (session, error) => {
    console.log(session);
    console.log(error);
};

const realmListener = (tasks, changes) => {
    changes.deletions.forEach((index) => {
        console.log(`A task was deleted at the ${index} index.`);
    });

    changes.insertions.forEach((index) => {
        const insertedTasks = tasks[index];
        console.log(`insertedTasks: ${JSON.stringify(insertedTasks, null, 2)}`);
    });

    changes.newModifications.forEach((index) => {
        const modifiedTask = tasks[index];
        console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
    });
};

// const sunscribeRealm = async () => {
//     const completedTasks = await realmConn.objects(Task).filtered('status != "completed"').subscribe({
//         name: "realmSubsName",
//     });
//     console.log(completedTasks.length);
//     const completedTasksSubscription = realmConn.subscriptions.findByName(
//         "realmSubsName"
//     );
//     console.log(completedTasksSubscription);
// }

let realmConn;
let realmUser = null;
exports.initRealmConnection = async () => {
    console.log('Realm Init Called');
    const app = new Realm.App({ id: "testapplication-pnswd", timeout: 10000 });
    const credentials = Realm.Credentials.apiKey('6A3ZQ1G94J631re3GFeGzhnmz1fC54wTFbaYQcJCnWXZvaS27IELFvpUiGftab3T');
    realmUser = await app.logIn(credentials);
    realmConn = await Realm.open({
        schema: [Task],
        sync: {
            user: app.currentUser,
            flexible: true,
            onError: handleSyncError,
            // initialSubscriptions: {
            //     update: (subs, realm) => {
            //         subs.add(realmConn.objects(Task).filtered("status != 'in progress'"), {
            //             name: "In progress tasks",
            //         });
            //     },
            //     rerunOnOpen: true,
            // },
        },
    });
    //sunscribeRealm();
    // const tasks = realmConn.objects("sampleTaskDataDatas");
    // tasks.addListener(realmListener);
    // const query = realmConn.objects("sampleTaskDataDatas").filtered("truepredicate");
    // await realmConn.subscriptions.update((mutableSubs) => {
    //     mutableSubs.add(query, { name: "realmSubsName" });
    // });
}


/*
*
*/
exports.writeNewData = async () => {
    console.log('writeNewData');
    realmConn.write(() => {
        realmConn.create(Task, {
            name: `Task Name ${(Math.random() + 1).toString(36).substring(7)}`,
            status: "Open",
            age: Math.floor(10 + Math.random() * 90)
        });
    });
};

exports.updateData = async () => {
    console.log('updateData');
    const taskData = realmConn.objectForPrimaryKey("sampleTaskDataDatas", 1);

    taskData.owner_id = "Maximilian";
    taskData.status = 'close';
};

exports.getSingleData = async () => {
    console.log('getSingleData');
    const myTask = realmConn.objectForPrimaryKey("sampleTaskDataDatas", 1);
    return myTask;
};

exports.getAllData = async () => {
    console.log('getAllData');
    const tasks = realmConn.objects("sampleTaskDataDatas");
    return tasks;
};

exports.deleteData = async () => {
    console.log('deleteData');
    realmConn.write(() => {
        let taskData = realmConn.objectForPrimaryKey("sampleTaskDataDatas", 1);
        realmConn.delete(taskData);
        taskData = null;
    });
};

/*---Sort tasks by name in ascending order---*/
// const tasksByName = tasks.sorted("name");

/*---Sort tasks by name in descending order---*/
// const tasksByNameDescending = tasks.sorted("name", true);

// const allTasks = realm.objects(Task);
// const task1 = allTasks.find((task) => task._id != 1);
// const task2 = allTasks.find((task) => task._id == 2);
// console.log(task1);
// console.log(task2);