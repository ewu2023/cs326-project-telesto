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
  }

  async close() {
    await this.client.close();
  }

  async countDocuments() {
    const count = await this.collection.countDocuments();
    return count;
  }

  async addMedication(med_obj) {
    const res = await this.collection.insertOne(med_obj);
    return res;
  }

  async deleteMedication(med_name) {
    const res = await this.collection.deleteOne({"med-name": med_name});
    return res;
  }

  async updateMedication(target, fields) {
    const res = await this.collection.updateOne(
      target,
      {$set: fields}
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

  async getByName(med_name) {
    const res = await this.collection.findOne({"med-name": med_name});
    return res;
  }
}