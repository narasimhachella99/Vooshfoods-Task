import { CLOUD_SDK_CLIENT_ID } from "google-auth-library/build/src/auth/googleauth.js";
import User from "../models/user.js";


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLOUD_SDK_CLIENT_ID); 


export const loginByGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLOUD_SDK_CLIENT_ID,  
    });

    const payload = ticket.getPayload();
    const userId = payload.sub;  
    const email = payload.email;

    res.json({ msg: 'Login successful', userId, email });
  } catch (error) {
    res.status(400).json({ msg: 'Invalid Google token' });
  }
};



export const register = async (req, res) => {
  try {
    const data = req.body;
    if ((data.email === "" || data.password === "", data.name === "")) {
      res.status(401).send({ msg: "Please fill all the fields" });
    }
    const check = await User.findOne({ email: data.email });
    if (check) {
      res.status(400).send({ msg: "User already exists" });
    } else {
      const user = new User(data);

      await user.save();
      res.status(200).send({ msg: "Registered successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const data = await User.findOne({ email: email });
    if ((data.email === "" || data.password === "")) {
      res.status(400).send({ msg: "Please fill all the fields" });
    } else {
      if (data) {
        const result = password === data.password;
        if (result) {
          data.msg = "user login successful";
          res.status(200).send(data);
        } else {
          res.status(400).send({ msg: "Password mismatched" });
        }
      } else {
        res.status(400).send({ msg: "Invalid details please try again" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
export const getUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.status(200).send({ msg: "Deleted success" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
