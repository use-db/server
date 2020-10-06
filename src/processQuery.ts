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

function handleResponse(returnedData: any, resolve: any, reject: any) {
  if (returnedData) {
    return resolve({ success: true, data: JSON.stringify(returnedData) });
  } else {
    return reject({
      success: false,
      data: JSON.stringify("Data does not exist"),
    });
  }
}
module.exports = async function performQuery(query: any) {
  const CollectionModel = modelAlreadyDeclared(query.collection)
    ? mongoose.model(query.collection)
    : mongoose.model(query.collection, GenericSchema);

  return new Promise(async (resolve: any, reject: any) => {
    const { operation, payload } = query;
    switch (operation) {
      case "create":
        console.log("*** 🔥 payload", payload.data);
        CollectionModel.collection
          .insertOne(payload.data)
          .then((data: any) => handleResponse(data, resolve, reject));
        break;
      case "update":
        if (payload.hasOwnProperty("where") && payload.hasOwnProperty("data")) {
          CollectionModel.update(payload.where, { $set: payload.data })
            .then((data: any) => handleResponse(data, resolve, reject))
            .catch((err: any) => {
              reject({ success: false, data: JSON.stringify(err) });
            });
        }
        break;
      case "findOne":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.findOne(payload.where).then((data: any) =>
            handleResponse(data, resolve, reject)
          );
        }
        break;
      case "findMany":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.find(payload.where).then((data: any) =>
            handleResponse(data, resolve, reject)
          );
        }
        break;
      case "delete":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.findOneAndRemove(payload.where)
            .then((data: any) => handleResponse(data, resolve, reject))
            .catch((err: any) => {
              reject(err);
            });
        }
        break;
      case "deleteMany":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.remove(payload.where)
            .then((data: any) => handleResponse(data, resolve, reject))
            .catch((err: any) => {
              reject(err);
            });
        }
        break;
      case "count":
        if (payload.hasOwnProperty("where")) {
          CollectionModel.countDocuments(payload.where)
            .then((data: any) => handleResponse(data, resolve, reject))
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
