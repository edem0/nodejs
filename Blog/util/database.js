import Database from 'better-sqlite3'

const db = new Database('./data/database.sqlite');

db.prepare(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, title STRING, category STRING, content STRING, created DATE, lastModified DATE, FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE )`).run();


export const getUsers = () => db
    .prepare('SELECT * FROM users').all();

export const saveUser = (name) => db
    .prepare('INSERT INTO users (name) VALUES (?)').run(name);

export const updateUser = (id, name) => db
    .prepare('UPDATE users SET name = ? WHERE id = ?').run(name, id);

export const deleteUser = (id) => db
    .prepare('DELETE FROM users WHERE id =?').run(id);

export const getBlogs = () => db
    .prepare('SELECT * FROM blogs').all();

export const saveBlog = (userId, title,category,content,created, lastModified) => db
    .prepare('INSERT INTO blogs (userId, title,category,content,created, lastModified) VALUES (?,?,?,?,?,?)').run(userId, title,category,content,created, lastModified);

export const updateBlog = (id, userId, title,category,content,created, lastModified) => db
    .prepare('UPDATE blogs SET userId = ?, title = ?,category = ?,content = ?,created = ?, lastModified = ? WHERE id = ?').run(userId, title, category, content, created, lastModified, id);

export const deleteBlog = (id) => db
    .prepare('DELETE FROM blogs WHERE id =?').run(id);


const users = [
    { name: 'Péter'},
    { name: 'János'},
    { name: 'Anna'}
];

const d = new Date();
const dateString = `${d.getFullYear()}.${d.getMonth()}.${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

const blogs = [
    {userId : 1, title : "Utam a hegyen", category: "Utazás", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`},

    {userId : 1, title : "Magyar konyha", category: "Gasztro", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`},

    {userId : 2, title : "Helyi versenyek", category: "Szórakozás", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`},

    {userId : 2, title : "Esti élet", category: "Szórakozás", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`},

    {userId : 3, title : "Szeged ma", category: "Utazás", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`},

    {userId : 3, title : "Új üzletek", category: "Vásárlás", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus distinctio, maiores animi dolorem obcaecati molestiae repudiandae sed nobis deleniti architecto blanditiis rerum tenetur expedita vitae officiis, nemo quae repellat ipsa. Qui aut labore sit minus ea at, repudiandae a, quos neque porro, magnam sint molestiae consectetur provident sequi beatae! Expedita inventore, a sunt aliquam doloremque incidunt officia adipisci consectetur laboriosam.", created : `${dateString}`, lastModified:`${dateString}`}
];

// const userIds = {};
// for (const user of users) {
//     const result = saveUser(user.name);
//     userIds[user.name] = result.lastInsertRowid;
// }

// for (const blog of blogs) {
//     const actualUserId = userIds[
//         users.find(u => u.name === (users[blog.userId - 1]?.name))?.name
//     ];
//     saveBlog(actualUserId, blog.title, blog.category, blog.content, blog.created, blog.lastModified);
// }
