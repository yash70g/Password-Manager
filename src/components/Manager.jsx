import React, { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

uuidv4();
import 'react-toastify/dist/ReactToastify.css';
const Manager = () => {

    const [showPasswordField, setShowPasswordField] = useState(false);

    const showPassword = () => {
        setShowPasswordField(!showPasswordField);
    }

    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])
    const togglePasswordVisibility = (id) => {
        setpasswordArray(passwordArray.map(item => 
            item.id === id ? {...item, showPassword: !item.showPassword} : item
        ));
    }
    const getPasswords = async () => {
    try {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        setpasswordArray(passwords.map(pwd => ({...pwd, showPassword: false})));
    } catch (error) {
        console.error("Failed to fetch passwords:", error);
        toast.error('Failed to fetch passwords', {
            position: "top-right",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    }
}
    useEffect(() => {
        getPasswords()
    }, [])

    const savePassword = async () => {
        if (!form.site || !form.username || !form.password) {
            toast.error('Please fill all fields', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...form, id: uuidv4() }),
            });

            const result = await response.json();

            if (result.success) {
                setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
                setform({ site: "", username: "", password: "" }); // Reset form after saving
                toast.success('Password saved successfully!', {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            } else {
                throw new Error('Failed to save password');
            }
        } catch (error) {
            console.error("Failed to save password:", error);
            toast.error('Failed to save password', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const copyText = (e) => {
        navigator.clipboard.writeText(e);
        toast.success('Copied!', {
            position: "top-right",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    }

    const deletePassword = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (result.success) {
                setpasswordArray(passwordArray.filter((item) => item.id !== id));
                toast.success('Deleted!', {
                    position: "top-right",
                    autoClose: 700,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            } else {
                throw new Error('Failed to delete password');
            }
        } catch (error) {
            console.error("Failed to delete password:", error);
            toast.error('Failed to delete password', {
                position: "top-right",
                autoClose: 700,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark"
            });
        }
    }

    const editPassword = (id) => {
        console.log("Editing passord with id: ", id)
        setform(passwordArray.filter(i => i.id === id)[0])
        setpasswordArray(passwordArray.filter((item) => item.id !== id))
    }
    return (<>
        <ToastContainer
            position="top-right"
            autoClose={700}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            theme="dark"
        />
        <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>
        <div className="mx-auto mycontainer">
            <h1 className='text-3xl text-bold text-center'>
                <span className='bg-green-400'>&lt;</span>
                Pass
                <span className='bg-green-400'>OP/&gt;</span></h1>
            <p className='text-green-600 font-semibold text-center text-lg'>Your Own password Manager</p>
            <div className='text-white flex flex-col p-4 gap-8 '>
                <input onChange={handleChange} value={form.site} className='rounded-full border text-black px-4 py-1 border-green-500 w-full' placeholder='Enter Website Url' type="text" name='site' id='' />
                <div className="flex gap-3">
                    <input onChange={handleChange} value={form.username} className='w-full rounded-full border text-black px-4 py-1 border-green-500' type="text" name='username' id='' placeholder='Username' />
                    <div className="relative">
                        <input
                            onChange={handleChange}
                            value={form.password}
                            className='w-full rounded-full border text-black px-4 py-1 border-green-500'
                            type={showPasswordField ? "text" : "password"}
                            name='password'
                            id=''
                            placeholder='Password'
                        />
                        <span className='absolute right-3 text-black'>
                            <button onClick={showPassword} >
                                <lord-icon
                                    src="https://cdn.lordicon.com/vfczflna.json"
                                    trigger="click"
                                    stroke="light"
                                    state="hover-lashes"
                                    colors="primary:#848484,secondary:#30e849">
                                </lord-icon>
                            </button>
                        </span>
                    </div>
                </div>
                <button className='flex justify-center items-center px-4 bg-green-500 hover:bg-green-400 py-2 w-fit border gap-2 border-green-900 rounded-full' onClick={savePassword}>
                    <lord-icon
                        src="https://cdn.lordicon.com/hqymfzvj.json"
                        trigger="hover">
                    </lord-icon>Save
                </button>
            </div>
            <div className="passwords">
                <h2 className='text-xl font-bold py-3'>Your Passwords</h2>
                {passwordArray.length === 0 && <div className='text-md font-bold'>No Passwords to show</div>}
                {passwordArray.length !== 0 &&
                    <table className="table-fixed w-full rounded-md overflow-hidden">
                        <thead className=' bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100 '>
                            {passwordArray.map((item, index) => {
                                return (
                                    <tr className='' key={index}>
                                        <td className='py-2 px-2 text-center min-w-32'>
                                            <a className='visited:text-purple-600' href={item.site}>{item.site}</a>
                                        </td>
                                        <td className='py-2 px-2 text-center min-w-32'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.username}</span>
                                                <button onClick={() => copyText(item.username)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/lyrrgrsl.json"
                                                        trigger="click"
                                                        colors="primary:#545454"
                                                        className="ml-2">
                                                    </lord-icon>

                                                </button>
                                            </div>
                                        </td>
                                        <td className='py-2 px-2 text-center min-w-32'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.showPassword ? item.password : '••••••••'}</span>
                                                <button onClick={() => copyText(item.password)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/lyrrgrsl.json"
                                                        trigger="click"
                                                        colors="primary:#545454"
                                                        className="ml-2">
                                                    </lord-icon>
                                                </button>
                                                <button onClick={() => togglePasswordVisibility(item.id)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/vfczflna.json"
                                                        trigger="click"
                                                        stroke="bold"
                                                        state="hover-lashes"
                                                        colors="primary:#848484,secondary:#30e849">
                                                    </lord-icon>
                                                </button>
                                            </div>
                                        </td>
                                        <td className='justify-center border border-white text-center py-2'>
                                            <span className='cursor-pointer px-2'>
                                                <button onClick={() => editPassword(item.id)} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>
                                                </button>
                                            </span>

                                            <span>
                                                <button onClick={() => { deletePassword(item.id) }} className='text-red-600'>

                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>}
            </div>
        </div>
    </>
    )
}

export default Manager
