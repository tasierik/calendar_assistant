import {useContext, useEffect, useState} from "react";
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import {useApiUtils} from "../Utils/ApiUtils.js";
import {API_URL} from "../Utils/Constants.jsx";

export default function Settings() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MAINTAINER');
    const {getRelatedUsers, deleteUser} = useApiUtils();
    const [relatedUsers, setRelatedUsers] = useState([]);

    const { handleError, handleInfo } = useContext(ErrorContext);
    const token = localStorage.getItem('token');
    const isHost = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'HOST';

    const handleRegisterAdditional = async () => {
        const endpoint = `${API_URL}/v1/auth/register/additional`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username, password, role })
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 409 && data.label === "USERNAME_ALREADY_EXISTS") {
                    throw new Error('Felhasználónév foglalt!');
                } else {
                    throw new Error('Regisztráció sikertelen');
                }
            }
            setRelatedUsers([...relatedUsers, data])
            handleInfo(username + ' sikeresen létrehozva!');
        } catch (error) {
            handleError(error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            handleInfo('Felhasználó sikeresen törölve!');
            setRelatedUsers(relatedUsers.filter(user => user.id !== id));
        } catch (error) {
            handleError('Hiba történt a felhasználó törlése közben. Próbálja meg később.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const relatedUsers = await getRelatedUsers();
            setRelatedUsers(relatedUsers);
        };
        fetchData();
    }, []);


    if (isHost) {
        return (
            <div className="space-y-4 max-w-5xl">
                <h1 className="text-2xl font-semibold mb-10">Beállítások</h1>

                <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                    <div className="collapse-title text-xl font-medium">Új felhasználó regisztrálása</div>
                    <div className="m-8">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Felhasználónév"
                                className="input input-primary w-full"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Jelszó"
                                className="input input-primary w-full"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="mb-6 flex justify-center">
                                <button
                                    onClick={() => setRole('MAINTAINER')}
                                    className={`btn ${role === 'MAINTAINER' ? 'btn-primary' : 'btn-ghost btn-accent'}`}
                                >
                                    Gondnok
                                </button>
                                <button
                                    onClick={() => setRole('GUEST')}
                                    className={`btn ${role === 'GUEST' ? 'btn-primary' : 'btn-ghost btn-accent'}`}
                                >
                                    Vendég
                                </button>
                            </div>

                            <button onClick={handleRegisterAdditional} className="btn btn-primary w-full">Létrehozás
                            </button>
                        </div>
                    </div>
                </div>

                <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 mt-8">
                    <div className="collapse-title text-xl font-medium">Hozzáadott felhasználók</div>
                    <div className="m-8">
                        <ul className="space-y-3">
                            {relatedUsers.length === 0 && (
                                <li className="flex justify-center items-center bg-base-100 shadow-md rounded-lg p-4">
                                    <span className="font-semibold">Nincs hozzáadott felhasználó</span>
                                </li>
                            )}
                            {relatedUsers.map(user => (
                                <li key={user.id}
                                    className="flex justify-between items-center bg-base-100 shadow-md rounded-lg p-4">
                                    <div>
                                        <span className="font-semibold">{user.username}</span>
                                        <span
                                            className={`ml-4 px-3 py-1 rounded-full text-sm ${user.role === 'MAINTAINER' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role === 'MAINTAINER' ? 'Gondnok' : 'Vendég'}
                            </span>
                                    </div>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Törlés
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}