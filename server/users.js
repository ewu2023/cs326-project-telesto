import 'dotenv/config';
import {MongoClient, ObjectId, ServerApiVersion} from 'mongodb';

export class UserDatabase {
    // Use singleton design pattern to ensure only one
    // user database is created
    constructor(dburl) {
        if (!this.instance) {
            this.dburl = dburl;
            this.instance = this;
        }
        return this.instance;
    }

    // Establish connection to user database in mongodb
    async connect() {
        const client = new MongoClient(this.dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        });

        this.client = await client.connect();
        this.db = this.client.db("user_database");

        await this.init();
    }

    async init() {
        this.users = this.db.collection("users");
    }

    // Find user in database
    async findUser(name) {
        const res = await this.users.findOne({"name": name});
        if (res) {
            return res;
        }
        return undefined;
    }

    // Find user by id
    async findUserById(uid) {
        // Create ObjectId from uid
        const objId = new ObjectId(uid);
        const res = await this.users.findOne({"_id": objId});
        return res;
    }

    // Validate password
    async validatePassword(name, password) {
        const user = await this.findUser(name);
        if (user === undefined) {
            return false;
        }

        // User exists in the database
        // Check if the given password matches
        const userPassword = user.password;
        return userPassword === password;
    }

    // Add user to database
    async addUser(name, password) {
        // Check if given username is unique
        const userExists = await this.findUser(name);
        if (userExists) {
            return false;
        }

        // If username is unique, add it to db
        const userObj = {
            "name": name,
            "password": password
        };
        const res = await this.users.insertOne(userObj);
        console.log(res);
        return res.acknowledged;
    }
}

const users = new UserDatabase(process.env.DATABASE_URL);
users.connect();
export default users;