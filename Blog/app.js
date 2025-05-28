import express from 'express'
import * as db from "./util/database.js"
import cors from "cors"

const PORT = 2025;
const app = express();
app.use(express.json());

app.use(cors());

app.get("/users", (req, res) => {
    try{
        const users = db.getUsers();
    res.status(200).json(users);
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.post("/users", (req, res) => {
    try{
        const {name} = req.body;
        if(!name)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const savedUser = db.saveUser(name);
        if(savedUser.changes != 1)
        {
            return res.status(501).json({message: "Failed to save user"});
        }
        res.status(201).json({id: savedUser.lastInsertRowid, name});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.put("/users/:id", (req, res) => {
    try{
        const {name} = req.body;
        if(!name)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const id = +req.params.id;
        const updatedUser = db.updateUser(id, name);
        if(updatedUser.changes != 1)
        {
            return res.status(501).json({message: "Failed to update user"});
        }
        res.status(200).json({id, name});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.delete("/users/:id", (req, res) => {
    try{
        const id = +req.params.id;
        const deleteUser = db.deleteUser(id);
        if(deleteUser.changes != 1)
        {
            return res.status(501).json({message: "Failed to delete user"});
        }
        res.status(200).json({message : "User deleted"});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.get("/blogs", (req, res) => {
    try{
        const blogs = db.getBlogs();
    res.status(200).json(blogs);
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.post("/blogs", (req, res) => {
    try{
        const {userId, title,category,content,created, lastModified} = req.body;
        if(!userId || !title || !category || !content ||!created || !lastModified)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const savedBlog = db.saveBlog(userId, title,category,content,created, lastModified);
        if(savedBlog.changes != 1)
        {
            return res.status(501).json({message: "Failed to save blog"});
        }
        res.status(201).json({id: savedBlog.lastInsertRowid, userId, title,category,content,created, lastModified});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.put("/blogs/:id", (req, res) => {
    try{
        const {userId, title,category,content,created, lastModified} = req.body;
        if(!userId || !title || !category || !content ||!created || !lastModified)
        {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const id = +req.params.id;
        const updatedBlog = db.updateBlog(id, userId, title,category,content,created, lastModified);
        if(updatedBlog.changes != 1)
        {
            return res.status(501).json({message: "Failed to update blog"});
        }
        res.status(200).json({id, userId, title,category,content,created, lastModified});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})

app.delete("/blogs/:id", (req, res) => {
    try{
         const id = +req.params.id;
        const deleteBlog = db.deleteBlog(id);
        if(deleteBlog.changes != 1)
        {
            return res.status(501).json({message: "Failed to delete blog"});
        }
        res.status(200).json({message : "Blog deleted"});
    }
    catch(err)
    {
        res.status(500).json({message : `${err}`});
    }
})


app.listen(PORT, () => {
    console.log(`A szerver fut a(z) ${PORT} porton.`);
})