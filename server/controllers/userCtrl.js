const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { access } = require('fs/promises');
const { get } = require('http');


const userCtrl = {
    register: async (req,res) => {
        try {
            const {name, email, password} = req.body;

            const user = await Users.findOne({email});
            if(user) return res.status(400).json({msg: "Email already exists."})

            if(password.length < 6) {
                return res.status(400).json({msg: "Password must be at least 6 characters."});
            }
            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name, email, password: passwordHash
            })

            // Save mongodb
            await newUser.save();

            // create jwt to authenticate user
            const accesstoken = createAccessToken({id:newUser._id})
            const refreshtoken = createRefreshToken({id:newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({accesstoken});

        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    refreshtoken: async (req, res) => {

        try {
            const rf_token = req.cookies.refreshtoken;

            if(!rf_token) return res.status(400).json({msg: "Please login or register."});

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(403).json({msg: "Refresh token is not valid."});

                const accesstoken = createAccessToken({id: user.id});
                res.json({accesstoken});
            });
        }
        catch(err) {
            return res.status(500).json({msg: err.message});
        }

    },
    login: async(req,res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg: "User does not exist."});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."});

            const accesstoken = createAccessToken({id: user._id});
            const refreshtoken = createRefreshToken({id: user._id});    

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true, 
                path: '/user/refresh_token'
            });
        
            res.json({accesstoken});
        }
        catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
            return res.json({ msg: "Logged out successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if(!user) return res.status(400).json({msg: "User does not exist."});
            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

module.exports = userCtrl;