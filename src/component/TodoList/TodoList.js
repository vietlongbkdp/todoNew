import {useEffect, useState} from "react";

export default function TodoList(){
    const [update, setUpdate] = useState(false)
    const [user, setUser] = useState({
        id: 0,
        name: "",
        type: "Normal",
        isEdit: false
    })
    const [userList, setUserList] = useState([])
    useEffect(() => {
        let users = [];
        async function getDataUsers(){
            let data = await fetch("https://6582c12b02f747c8367a1e1a.mockapi.io/todolist")
            users = await data.json();
        }
        getDataUsers().then(r => setUserList(users))
    }, [update]);
    const handleInput =(event)=>{
        setUser(({
            id: user.id,
            name : event.target.value,
            type: user.type,
            isEdit: user.isEdit
        }))
    }
    const handleChange =(event)=>{
        setUser(({
            id: user.id,
            name: user.name,
            type: event.target.value,
            isEdit: user.isEdit
        }) )
    }
    const handleClickAddUpdate = (event) =>{
        if (!user.isEdit){
            async function creatUser(userNew){
                await fetch("https://6582c12b02f747c8367a1e1a.mockapi.io/todolist", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type if sending JSON data
                    },
                    body: JSON.stringify(userNew),
                });
            }
            if(user.name!==''){
                creatUser(user).then(r => {
                    setUser({
                        id: 0,
                        name: "",
                        type: "Normal",
                        isEdit: false
                    })
                    setUpdate(prevState => !prevState)
                })
            }
        }else {
            async function editUser(userEdit){
                await fetch("https://6582c12b02f747c8367a1e1a.mockapi.io/todolist/" + userEdit.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type if sending JSON data
                    },
                    body: JSON.stringify(userEdit),
                });
            }
            if(user.name!==''){
                editUser(user).then(r => {
                    setUser({
                        id: 0,
                        name: "",
                        type: "Normal",
                        isEdit: false
                    })
                    setUpdate(prevState => !prevState)
                })
            }
        }
    }
    const handleEdit = (idEdit) =>{
        let userEdit = userList.find(user => user.id === idEdit);
        setUser({
            ...userEdit,
            isEdit: true
        })
    }
    const handleDelete = (idDelete) =>{
        async function deleteUser(idUser){
            await fetch("https://6582c12b02f747c8367a1e1a.mockapi.io/todolist/" + idUser, {
                method: 'DELETE',
            });
        }
        deleteUser(idDelete).then(() =>{
            setUpdate(prevState => !prevState)
        }
        )
    }
    return (
        <div className={"container a form-control "}>
            <div className={"d-flex justify-content-sm-center"}><h1>To do App</h1></div>
            <div className={"d-flex justify-content-between mt-3"}>
                <label className={"fw-bold"} htmlFor={"inputName"}>Nhập họ và tên: </label>
                <input  className={"form-control w-50"} id="inputName" type={"text"}  value={user.name} onChange={handleInput}/>
            </div>
            <div className={"d-flex justify-content-between mt-3"}>
                <label className={"fw-bold"}>Chọn type: </label>
                <select className={"form-select w-50"} value={user.type} onChange={handleChange}>
                    <option value={"Important"}>Important</option>
                    <option value={"Vip"}>Vip</option>
                    <option value={"Normal"}>Normal</option>

                </select>
            </div>
            <div className={"d-flex justify-content-around mt-3"}>
                <button className={"btn btn-outline-primary w-25"} onClick={handleClickAddUpdate}>{user.isEdit===true ? "Update": "Add"}</button>
                {user.isEdit && <button className={"btn btn-outline-danger w-25"}>Cancel</button>}
            </div>
            <div>
                <table className={"table table-hover mt-5"}>
                    <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.type}</td>
                            <td>
                                <button className={"btn btn-warning mx-2"} onClick={()=>{
                                    handleEdit(user.id)
                                }}>Edit</button>
                                <button className={"btn btn-danger mx-2"} onClick={()=>{
                                    handleDelete(user.id)
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}