const Realm = require('realm');

module.exports = class Task extends Realm.Object {
    static schema = {
        name: "sampleTaskDataDatas",
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            name: "string",
            status: "string?",
            owner_id: "string?",
            age: "int?",
        },
        primaryKey: "_id",
    };
}
