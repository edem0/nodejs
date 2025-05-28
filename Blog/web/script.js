async function getAllUserFunction() {
    try {
        const res = await fetch(`http://localhost:2025/users`, {
            method: 'GET',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}
async function postUserFunction(test) {
    try {
        const res = await fetch(`http://localhost:2025/users`, {
            method: 'POST',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: test,
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function putUserFunction(test, id) {
    try {
        const res = await fetch(`http://localhost:2025/users/${id}`, {
            method: 'PUT',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: test,
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function deleteUserFunction(id) {
    try {
        const res = await fetch(`http://localhost:2025/users/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllBlogFunction() {
    try {
        const res = await fetch(`http://localhost:2025/blogs`, {
            method: 'GET',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}
async function postBlogFunction(test) {
    try {
        const res = await fetch(`http://localhost:2025/blogs`, {
            method: 'POST',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: test,
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function putBlogFunction(test, id) {
    try {
        const res = await fetch(`http://localhost:2025/blogs/${id}`, {
            method: 'PUT',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: test,
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

async function deleteBlogFunction(id) {
    try {
        const res = await fetch(`http://localhost:2025/blogs/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data.description);
            return;
        }

        return data;
    }
    catch (error) {
        console.log(error);
    }
}

let blogs = [];
let users = [];
let selectedBlogId =0;
const tartalom = document.getElementById("tartalom");

function addUser(){
    tartalom.innerHTML = "<label for='userName'>Felhasználónév:</label> <input type='text' id='userName'>";
    tartalom.innerHTML+= "<button id='letrehoz' onclick='saveUser()'>Létrehozás</button>";
    tartalom.innerHTML+= "<p id='message'></p>";
}

async function saveUser() {
    if(document.getElementById("message").innerHTML != "")
    {
        document.getElementById("message").innerHTML = "";
    }
    const userName = document.getElementById("userName").value.trim();
    users = await getAllUserFunction();
    if(userName != undefined && userName.length > 0)
    {
        for(let i = 0; i < users.length; i++)
        {
            if(userName.trim() == users[i].name)
            {
                document.getElementById("message").innerHTML = "ilyen felhasználónév már létezik!";
                return
            }
        }
        let test = {
            "name": `${userName}`
        }
        await postUserFunction(JSON.stringify(test));
        tartalom.innerHTML = "";
    }
    else {
        document.getElementById("message").innerHTML = "Adjon meg egy felhasználónevet!";
    }
}

async function updateUser(){
    users = await getAllUserFunction();
    if(users.length != 0)
    {
        tartalom.innerHTML = "<label for='user'>Módosítandó felhasználó: </label> <select name='user' id='user'>";
        const menu= document.getElementById("user");
        for(let i = 0; i<users.length; i++ )
        {
            menu.innerHTML +=`<option value='${users[i].id}'>${users[i].name}</option>`;
        }
        tartalom.innerHTML += "</select>";
        tartalom.innerHTML += "<label for='newUserName'>Új felhasználónév:</label> <input type='text' id='newUserName'>";
        tartalom.innerHTML += "<button id='submit' onclick='saveUpdatedUser()'>Mentés</button>";
        tartalom.innerHTML+= "<p id='message'></p>";
    }
    else
    {
        tartalom.innerHTML = "<p id='message'> Nincs ilyen felhasználó!</p>";
    }
}

async function saveUpdatedUser() {
    if(document.getElementById("message").innerHTML != "")
    {
        document.getElementById("message").innerHTML = "";
    }
    const userName = document.getElementById("newUserName").value.trim();
    
    users = await getAllUserFunction();
    if(userName != undefined && userName.length > 0)
    {
        for(let i = 0; i < users.length; i++)
        {
            if(userName.trim() == users[i].name)
            {
                document.getElementById("message").innerHTML += "ilyen felhasználónév már létezik!";
                return
            }
        }
        const listOfSelects = document.getElementsByTagName("option");
        let id;
        for(let i = 0; i <listOfSelects.length; i++)
        {
            if(listOfSelects[i].selected)
            {
                id = listOfSelects[i].value;
            }
        }
        let test = {
            "name": `${userName}`
        }
        await putUserFunction(JSON.stringify(test), id);
        tartalom.innerHTML = "";
    }
    else {
        document.getElementById("message").innerHTML += "Kérem válasszon felhasználót, és töltsön ki minden mezőt!";
    }
}

async function deleteUser(){
    users = await getAllUserFunction();
    if(users.length != 0)
    {
        tartalom.innerHTML = "<label for='user'>Törlendő felhasználó:</label> <select name='user' id='user'>";
        const menu= document.getElementById("user");
        for(let i = 0; i<users.length; i++ )
        {
            menu.innerHTML +=`<option value='${users[i].id}'>${users[i].name}</option>`;
        }
        tartalom.innerHTML += "</select>";
        tartalom.innerHTML += "<button id='felhasznalotorles' onclick='deleteSelectedUser()'>Törlés</button>";
    }
    else
    {
        tartalom.innerHTML = "<p id='message'> Nincs ilyen felhasználó!</p>";
    }
}

async function deleteSelectedUser() {
    users = await getAllUserFunction();
    blogs = await getAllBlogFunction();
        const listOfSelects = document.getElementsByTagName("option");
        let id;
        for(let i = 0; i <listOfSelects.length; i++)
        {
            if(listOfSelects[i].selected)
            {
                id = listOfSelects[i].value;
            }
        }
        await deleteUserFunction(id);
        tartalom.innerHTML = "";
    
}

async function addBlog(){
    users = await getAllUserFunction();
    if(users.length != 0)
    {
        tartalom.innerHTML = "<label for='user'>Szerző:</label> <select name='user' id='user'>";
        const menu= document.getElementById("user");
        for(let i = 0; i<users.length; i++ )
        {
            menu.innerHTML +=`<option value='${users[i].id}'>${users[i].name}</option>`;
        }
        tartalom.innerHTML += "</select>";
         tartalom.innerHTML += "<label for='title'>Cím:</label> <input type='text' id='title'>";
    tartalom.innerHTML += "<label for='category'>Kategória:</label> <input type='text' id='category'>";
    tartalom.innerHTML += "<label for='content'>Tartalom:</label> <input type='text' id='content'>";

    tartalom.innerHTML+= "<button id='letrehoz' onclick='saveBlog()'>Bejegyzés létrehozása</button>";
    tartalom.innerHTML+= "<p id='message'></p>";
    }
    else
    {
        tartalom.innerHTML = "<p id='message'> Nincs ilyen felhasználó!</p>";
    }
   
}

async function saveBlog() {
    if(document.getElementById("message").innerHTML != "") {
        document.getElementById("message").innerHTML = "";
    }
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const content = document.getElementById("content").value.trim();
    users = await getAllUserFunction();
    if(title && category && content) {
        const listOfSelects = document.getElementsByTagName("option");
        let userId;
        for(let i = 0; i < listOfSelects.length; i++) {
            if(listOfSelects[i].selected) {
                userId = listOfSelects[i].value;
            }
        }
        const d = new Date();
        const dateString = `${d.getFullYear()}.${d.getMonth()}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        let test = {
            "userId": userId,
            "title": title,
            "category": category,
            "content": content,
            "created": dateString,
            "lastModified": dateString
        };
        await postBlogFunction(JSON.stringify(test));
        tartalom.innerHTML = "";
        await listBlogs(); 
    } else {
        document.getElementById("message").innerHTML = "Töltsön ki minden mezőt!";
    }
}

async function listBlogs() {
    tartalom.innerHTML = "";
    users =await getAllUserFunction();
    blogs =await getAllBlogFunction();
    if(blogs.length == 0)
    {
            tartalom.innerHTML = "<p id='message'> Nincsenek blogok!</p>";
            return
        }
    for(let i = 0; i < blogs.length; i++)
    {
        let selectedUser;
        for(const user of users)
        {
            if(user.id == blogs[i].userId)
            {
                selectedUser = user;
                break
            }
        }

        tartalom.innerHTML += `<div class='lista' >`;
        let elemSzam =document.getElementsByClassName('lista').length;
        const elem = document.getElementsByClassName('lista')[elemSzam-1];
        elem.innerHTML += `<h2> ${blogs[i].title} - (${blogs[i].created})</h2>` ;
        elem.innerHTML += `<p> Szerző: ${selectedUser.name}</p>`; 
        elem.innerHTML += `<p> Kategória: ${blogs[i].category}</p>` ;
        elem.innerHTML += `<p> Utolsó módosítás: ${blogs[i].lastModified}</p>` ;
        elem.innerHTML += `<p>${blogs[i].content}</p>`;
        elem.innerHTML += `<button class='modify' onclick='updateBlog()' value='${blogs[i].id}'>Szerkesztés</button>`;
        elem.innerHTML += `<button class='deleteButton' onclick='deleteBlog()' value='${blogs[i].id}'>Törlés</button>`;
        tartalom.innerHTML += `</div>`;
    }

     const modifyButtons = document.getElementsByClassName('modify');
     const deleteButtons = document.getElementsByClassName('deleteButton');
     for(let i = 0; i< modifyButtons.length; i++)
     {
        modifyButtons[i].addEventListener("click", (event) => { selectedBlogId = event.target.value });
     }
     for(let i = 0; i< deleteButtons.length; i++)
     {
        deleteButtons[i].addEventListener("click", (event) => { selectedBlogId = event.target.value });
     }
    
}

async function updateBlog(){
    tartalom.innerHTML = "";
        blogs = await getAllBlogFunction();
        let blog;
        for(const temp of blogs)
        {
            if(selectedBlogId == temp.id)
            {blog = temp;
                break;
            }
        }
        tartalom.innerHTML += `<label for='title'>Cím:</label> <input type='text' id='title' value='${blog.title}'>`;
        tartalom.innerHTML += `<label for='category'>Kategória:</label> <input type='text' id='category' value='${blog.category}'>`;
        tartalom.innerHTML += `<label for='content'>Tartalom:</label> <input type='text' id='content'value='${blog.content}'>`;
        tartalom.innerHTML += `<button id='submit' onclick='saveUpdatedBlog()'>Mentés</button>`;
        tartalom.innerHTML+= "<p id='message'></p>";

}

async function saveUpdatedBlog() {
    blogs = await getAllBlogFunction();
    let blog;
    for(const temp of blogs) {
        if(selectedBlogId == temp.id) {
            blog = temp;
            break;
        }
    }
    if(document.getElementById("message").innerHTML != "") {
        document.getElementById("message").innerHTML = "";
    }
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const content = document.getElementById("content").value.trim();

    if(title && category && content) {
        const d = new Date();
        const dateString = `${d.getFullYear()}.${d.getMonth()}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        let test = {
            "userId": blog.userId,
            "title": title,
            "category": category,
            "content": content,
            "created": blog.created,
            "lastModified": dateString
        };
        await putBlogFunction(JSON.stringify(test), blog.id);
        tartalom.innerHTML = "";
        await listBlogs();
    } else {
        document.getElementById("message").innerHTML += "Töltsön ki minden mezőt!";
    }
}

async function deleteBlog() {
    blogs = await getAllBlogFunction();
        await deleteBlogFunction(selectedBlogId);
        tartalom.innerHTML = "";
        listBlogs();

}