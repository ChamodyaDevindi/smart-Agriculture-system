const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists for JSON fallback
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Track if MongoDB is connected
let mongoConnected = false;

const setMongoConnected = (val) => {
  mongoConnected = val;
};

const getMongoConnected = () => {
  return mongoConnected;
};

// JSON Database Helper functions
const getFilePath = (modelName) => {
  return path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
};

const readJSON = (modelName) => {
  const file = getFilePath(modelName);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

const writeJSON = (modelName, data) => {
  const file = getFilePath(modelName);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Unified DB helper methods
const dbHelper = {
  getMongoConnected,
  setMongoConnected,

  findOne: async (modelName, query) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.findOne(query);
    } else {
      const list = readJSON(modelName);
      return list.find(item => {
        return Object.keys(query).every(key => {
          if (query[key] instanceof RegExp) {
            return query[key].test(item[key]);
          }
          return String(item[key]) === String(query[key]);
        });
      }) || null;
    }
  },

  find: async (modelName, query = {}) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.find(query);
    } else {
      const list = readJSON(modelName);
      if (Object.keys(query).length === 0) return list;
      return list.filter(item => {
        return Object.keys(query).every(key => {
          if (query[key] instanceof RegExp) {
            return query[key].test(item[key]);
          }
          return String(item[key]) === String(query[key]);
        });
      });
    }
  },

  findById: async (modelName, id) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.findById(id);
    } else {
      const list = readJSON(modelName);
      return list.find(item => String(item._id) === String(id)) || null;
    }
  },

  create: async (modelName, data) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.create(data);
    } else {
      const list = readJSON(modelName);
      const newDoc = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Special handling: Password hashing for User
      if (modelName === 'User' && newDoc.password) {
        const salt = await bcrypt.genSalt(10);
        newDoc.password = await bcrypt.hash(newDoc.password, salt);
      }

      list.push(newDoc);
      writeJSON(modelName, list);
      return newDoc;
    }
  },

  findOneAndUpdate: async (modelName, query, updateFields) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.findOneAndUpdate(query, updateFields, { new: true });
    } else {
      const list = readJSON(modelName);
      const index = list.findIndex(item => {
        return Object.keys(query).every(key => String(item[key]) === String(query[key]));
      });

      if (index === -1) return null;

      list[index] = {
        ...list[index],
        ...updateFields,
        updatedAt: new Date().toISOString()
      };

      writeJSON(modelName, list);
      return list[index];
    }
  },

  deleteOne: async (modelName, query) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.deleteOne(query);
    } else {
      const list = readJSON(modelName);
      const index = list.findIndex(item => {
        return Object.keys(query).every(key => String(item[key]) === String(query[key]));
      });

      if (index === -1) return { deletedCount: 0 };
      list.splice(index, 1);
      writeJSON(modelName, list);
      return { deletedCount: 1 };
    }
  },

  countDocuments: async (modelName, query = {}) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.countDocuments(query);
    } else {
      const list = await dbHelper.find(modelName, query);
      return list.length;
    }
  },

  insertMany: async (modelName, docs) => {
    if (mongoConnected) {
      const Model = mongoose.model(modelName);
      return await Model.insertMany(docs);
    } else {
      const list = readJSON(modelName);
      const formattedDocs = docs.map(doc => ({
        _id: new mongoose.Types.ObjectId().toString(),
        ...doc,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      list.push(...formattedDocs);
      writeJSON(modelName, list);
      return formattedDocs;
    }
  },

  // Helper helper to verify password outside mongoose
  comparePassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
};

module.exports = dbHelper;
