const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../helpers/jsonwebtoken");

// UPDATE   ***********************
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        await Users.update(req.body, { where: { userId: req.params.id } })
        res.status(200).json({ message: "User updated successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// GET USERS  **************************
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await Users.findAll()
        res.status(200).json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


// GET USER BY ID  **************************
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await Users.findOne({ where: { userId: req.params.id } })
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})


// DELETE/DEACTIVATE USER  **************************
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const users = await Users.destroy({
            where: {
                userId: req.params.id
            }
        })
        res.status(200).json("Deleted")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router;