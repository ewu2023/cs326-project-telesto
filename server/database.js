import 'dotenv/config';
import {MongoClient, ServerApiVersion} from "mongodb";

export class database {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    const localClient = new MongoClient(this.dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });

    this.client = await localClient.connect();
    this.db = this.client.db('medications');

    await this.init();
  }

  async init() {
    // Initialize the collection if it is not there, or retrieve it
    this.collection = this.db.collection('medications');

    // Count how many documents are in the collection
    this.docCount = await this.collection.countDocuments();
  }

  async close() {
    await this.client.close();
  }

  async addMedication(med_obj) {
    const res = await this.collection.insertOne(med_obj);
    return res;
  }

  async deleteMedication(id) {
    const res = await this.collection.deleteOne({_id: id});
    return res;
  }

  async updateMedication(med_obj) {
    const no_id = {};
    for (let key in med_obj) {
      if (key !== '_id') {
        no_id[key] = med_obj[key];
      }
    }

    const res = await this.collection.updateOne(
        {_id: med_obj["_id"]},
        {$set: no_id}
    );

    return res;
  }

  async readAllMedication() {
    const res = await this.collection.find({}).toArray();
    return res;
  }

  async getMedication(id) {
    const res = await this.collection.findOne({_id: id});
    return res;
  }
}