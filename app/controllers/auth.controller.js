const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const { sendEmail } = require("../helpers/mailer");
const Joi = require("joi");
const Token = require("../models/token");
const crypto = require("crypto");
let nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user } = require("../models");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles },
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map((role) => role._id);
                    user.save((err) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send(user);
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send(user);
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .populate("roles", "-__v")
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            let passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }

            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration,
            });

            let refreshToken = await RefreshToken.createToken(user);

            let authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
            });
        });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.ForgotPassword = async (req, res) => {
    try {
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "leslie89@ethereal.email", // generated ethereal user
                pass: "uHF6dNVJadF55DmQVB", // generated ethereal password
            },
        });

        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `http://localhost:8080/password-reset/${user._id}/${token.token}`;
        await transporter.sendMail({
            from: "maleksouissi751@gmail.com", // sender address
            to: user.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: link, // plain text body
            html: link, // html body
        });
        //await transporter.sendMail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
};

exports.ResetPassword = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
        const hash = await bcrypt.hashSync(req.body.password, 8);
        user.password = hash;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
};