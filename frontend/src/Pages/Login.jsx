import { useState, useContext } from 'react';
import { useAuth} from "../Contexts/AuthProvider.jsx";
import { useNavigate } from 'react-router-dom';
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import {API_URL} from "../Utils/Constants.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({ username: '', password: '', propertyName: '' });
    const [success, setSuccess] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [propertyName, setPropertyName] = useState('');
    const {handleError} = useContext(ErrorContext);

    const handleLogin = async () => {
        try {
            const loginResponse = await fetch(`${API_URL}/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!loginResponse.ok) {
                throw new Error('Bejelentkezés sikertelen');
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('token', loginData.token);

            const userDetailsResponse = await fetch(`${API_URL}/v1/auth/userDetails`, {
                headers: { 'Authorization': `Bearer ${loginData.token}` },
            });

            if (!userDetailsResponse.ok) {
                throw new Error('Felhasználói adatok lekérdezése sikertelen');
            }

            const userDetails = await userDetailsResponse.json();
            login(userDetails);
            setSuccess('Login successful');
            navigate('/app');
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleRegister = async () => {
        setErrors(null)
        const endpoint = `${API_URL}/v1/auth/register`;
        const newErrors = {
            username: !username ? "Kötelező kitölteni" : false,
            password: !password ? "Kötelező kitölteni" : false,
            propertyName: !propertyName ? "Kötelező kitölteni" : false,
        };
        setErrors(newErrors);
        if (newErrors.username || newErrors.password || newErrors.propertyName) {
            return;
        }
        if (password.length < 5) {
            setErrors({ password: 'A jelszónak legalább 5 karakter hosszúnak kell lennie.' });
            return;
        }


        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, propertyName })
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409 && data.label === "USERNAME_ALREADY_EXISTS") {
                    throw new Error('Ez a felhasználónév már foglalt');
                }
                throw new Error('Regisztráció sikertelen');
            }

            console.log('Regisztráció sikeres:', data);
            setSuccess("Regisztráció sikeres.");
            setIsLogin(true);
        } catch (error) {
            handleError(error.message);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-900">
            <div className="bg-base-800 p-8 rounded shadow-lg max-w-md w-full text-base-content relative">

                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white py-1 px-4 text-sm font-bold rounded-full shadow-lg">
                    BETA
                </div>
                <h1 className="text-4xl mb-6 text-center">NaptárAsszisztens</h1>

                <div className="mb-6 flex justify-center">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`btn ${isLogin ? 'btn-primary' : 'btn-ghost btn-accent'}`}
                    >
                        Bejelentkezés
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`btn ${!isLogin ? 'btn-primary' : 'btn-ghost btn-accent'}`}
                    >
                        Regisztráció
                    </button>
                </div>

                {error && <p className="text-error mb-4 text-center">{error}</p>}
                {success && <p className="text-success mb-4 text-center">{success}</p>}

                {isLogin ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Felhasználónév"
                            className="input input-bordered input-primary w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Jelszó"
                            className="input input-bordered input-primary w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-primary w-full"
                            onClick={handleLogin}
                        >
                            Bejelentkezés
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Felhasználónév"
                                className={`input input-bordered input-primary w-full ${errors.username ? 'input-error' : ''}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-xs italic">Felhasználónév megadása kötelező.</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Jelszó"
                                className={`input input-bordered input-primary w-full ${errors.password ? 'input-error' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Apartman neve"
                                className={`input input-bordered input-primary w-full ${errors.propertyName ? 'input-error' : ''}`}
                                value={propertyName}
                                onChange={(e) => setPropertyName(e.target.value)}
                                required
                            />
                            {errors.propertyName && <p className="text-red-500 text-xs italic">Apartman neve megadása kötelező.</p>}
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary w-full"
                            onClick={handleRegister}
                        >
                            Regisztráció
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
