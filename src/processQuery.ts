var mongoose = require("mongoose");

function modelAlreadyDeclared(modelName: string) {
  try {
    mongoose.model(modelName);
    return true;
  } catch (e) {
    return false;
  }
}
const Schema = mongoose.Schema;
const GenericSchema = new Schema();

module.exports = async function performQuery(query: any) {
  const CollectionModel = modelAlreadyDeclared(query.collection)
    ? mongoose.model(query.collection)
    : mongoose.model(query.collection, GenericSchema);

  return new Promise(async (resolve: any, reject: any) => {
    const { operation, payload } = query;
    switch (operation) {
      case "create":
        CollectionModel.collection
          .insert([new CollectionModel(payload.data)])
          .then((data: any) => {
            if (data) {
              resolve({ success: true, data: JSON.stringify(data) });
            } else {
              reject({
                success: false,
                data: JSON.stringify("no such user exist"),
              });
            }
          });
        break;
      case "update":
        if (payload.hasOwnProperty("where") && payload.hasOwnProperty("data")) {
          CollectionModel.update(payload.where, { $set: payload.data })
            .then((data: any) => {
              if (data) {
                resolve({ success: true, data: JSON.stringify(data) });
              } else {
                reject({
                  success: false,
                  data: JSON.stringify("no such user exist"),
                });
              }
            })
            .catch((err: any) => {
              reject({ success: false, data: JSON.stringify(err) });
            });
        }
        break;
      case "findOne":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.findOne(payload.where).then((docs: any) => {
            if (docs) {
              resolve({ success: true, data: JSON.stringify(docs) });
            } else {
              reject({
                success: false,
                data: JSON.stringify("no such user exist"),
              });
            }
          });
        }
        break;
      case "findMany":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.find(payload.where).then((docs: any) => {
            if (docs) {
              resolve({ success: true, data: JSON.stringify(docs) });
            } else {
              reject({
                success: false,
                data: JSON.stringify("no such user exist"),
              });
            }
          });
        }
        break;
      case "delete":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.findOneAndRemove(payload.where)
            .then((docs: any) => {
              if (docs) {
                resolve({
                  success: true,
                  data: JSON.stringify(`${docs.deletedCount} Records deleted`),
                });
              } else {
                reject({
                  success: false,
                  data: JSON.stringify("no such user exist"),
                });
              }
            })
            .catch((err: any) => {
              reject(err);
            });
        }
        break;
      case "deleteMany":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.remove(payload.where)
            .then((docs: any) => {
              if (docs) {
                resolve({
                  success: true,
                  data: JSON.stringify(`${docs.deletedCount} Records deleted`),
                });
              } else {
                reject({
                  success: false,
                  data: JSON.stringify("no such user exist"),
                });
              }
            })
            .catch((err: any) => {
              reject(err);
            });
        }
        break;
      case "count":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.countDocuments(payload.where)
            .then((docs: any) => {
              resolve({
                success: true,
                data: JSON.stringify(docs),
              });
            })
            .catch((err: any) => {
              reject(err);
            });
        }
        break;
      default:
        break;
    }
  });
};
