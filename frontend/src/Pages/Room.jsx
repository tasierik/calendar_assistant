import React, {useContext, useEffect, useState} from "react";
import ColorSelector from "../Components/ColorSelector.jsx";
import {useNavigate, useParams, useResolvedPath} from 'react-router-dom';
import {useApiUtils} from "../Utils/ApiUtils.js";
import {today} from "../Utils/BookingUtils.jsx";
import {ErrorContext} from "../Contexts/ErrorContext.jsx";


export default function Room() {
    const navigate = useNavigate();
    const backToRooms = () => { navigate('/app/rooms');};
    let { id } = useParams();
    id = isNaN(parseInt(id)) ? null : id
    const isEdit = useResolvedPath().pathname.includes('edit')
    const [view, setView] = useState(id && !isEdit);
    const { getRooms, patchRoom, postRoom, deleteRoom } = useApiUtils();
    const { handleError, handleInfo } = useContext(ErrorContext);
    const [rooms, setRooms] = useState(null);
    const [room, setRoom] = useState(null);
    const [disabledColors, setDisabledColors] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const rooms = await getRooms();
            setRooms(rooms);
            setDisabledColors( await rooms.map(room => room.color))
            if (id) {
                const room = await rooms.find(room => room.id === id)
                setRoom(room)
            }
        };
        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        displayName: '',
        color: '',
        priceInHuf: '',
        priceInEur: '',
        capacity: ''
    });

    useEffect(() => {
        if (room) {
            setFormData({
                displayName: room.displayName,
                color: room.color,
                priceInHuf: room.priceInHuf,
                priceInEur: room.priceInEur,
                capacity: room.capacity
            });
        }
    }, [room]);

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        let errors = {};
        for (const key in formData) {
            if (formData[key] === '') {
                errors[key] = 'Kötelező kitölteni!';
            }
        }
        if (formData.priceInHuf && isNaN(formData.priceInHuf)) {
            errors.priceInHuf = 'Érvénytelen szám!';
        }
        if (formData.priceInEur && isNaN(formData.priceInEur)) {
            errors.priceInEur = 'Érvénytelen szám!';
        }
        if (formData.capacity && isNaN(formData.capacity)) {
            errors.capacity = 'Érvénytelen szám!';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePost = async () => {
        if (validateForm()) {
            try {
                await postRoom(formData);
                handleInfo('Apartman sikeresen létrehozva!');
                backToRooms()
            } catch (error) {
                console.error('Error creating booking:', error);
                handleError('Hiba történt a Apartman létrehozása közben. Próbálja meg később.');
            }
        }
    };

    const handlePatch = async () => {
        if (validateForm()) {
            const modifiedFields = {};
            for (const key in formData) {
                if (formData[key] !== room[key]) {
                    modifiedFields[key] = formData[key];
                }
            }
            try {
                await patchRoom(Object.keys(modifiedFields), formData, id);
                handleInfo('Apartman sikeresen módosítva!');
                backToRooms()
            } catch (error) {
                console.error('Error modifying booking:', error);
                handleError('Hiba történt a apartman módosítása közben. Próbálja meg később.');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteRoom(id);
            handleInfo('Apartman sikeresen törölve!');
            backToRooms();
        } catch (error) {
            handleError('Hiba történt a apartman törlése közben. Próbálja meg később.');
        }
    };
    return (
        <>

            <div className="overflow-x-auto">
                <div className="navbar bg-base-200 rounded-box">
                    <div className="buttons">
                        <button className="btn btn-outline normal-case text-xl btn-neutral" onClick={backToRooms}>Vissza</button>
                        { isEdit ? <button className="btn btn-outline normal-case text-xl btn-error ml-3" onClick={() => handleDelete(id)}>Törlés</button> : null}
                    </div>
                </div>
                {
                    isEdit &&
                    <div role="alert" className="alert alert-warning mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Figyelmeztetés: Apartman törlése esetén a hozzá tartozó foglalások is törlődnek!</span>
                    </div>
                }
                <table className="table table-lg table-zebra">
                    <thead>
                    <tr>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Apartman neve</th>
                        <td>
                            <input
                                type="text"
                                placeholder="I. Apartman"
                                className={`input input-bordered w-full max-w-xs ${formErrors.displayName ? 'input-error' : ''}`}
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                disabled={view}
                            />
                            {formErrors.displayName && <label className="label text-error">{formErrors.displayName}</label>}
                        </td>
                    </tr>
                    <tr>
                        <th>Jelző szín</th>
                        <td>
                            { disabledColors && disabledColors.length === 5 ?
                                <div className="badge badge-error gap-3"><span>NINCS ELÉRHETŐ SZÍN</span></div> :
                            <ColorSelector
                                selectedColor={formData.color}
                                onChange={(newColor) => setFormData({...formData, color: newColor})}
                                disabledColors={disabledColors}
                                disabled={view}
                            />
                            }
                            {formErrors.color && <label className="label text-error">{formErrors.color}</label>}
                        </td>
                    </tr>
                    <tr>
                        <th>Éjszakánkénti ár</th>
                        <td>
                            <label className="input-group">
                                <input
                                    type="number"
                                    placeholder="8000"
                                    className={`input input-bordered w-full max-w-xs ${formErrors.priceInHuf ? 'input-error' : ''}`}
                                    value={formData.priceInHuf}
                                    onChange={(e) => setFormData({ ...formData, priceInHuf: e.target.value })}
                                    disabled={view}
                                />
                                <span>HUF</span>
                            </label>
                                {formErrors.priceInHuf && <label className="label text-error">{formErrors.priceInHuf}</label>}
                            <label className="input-group mt-3">
                                <input
                                    type="number"
                                    placeholder="50"
                                    className={`input input-bordered w-full max-w-xs ${formErrors.priceInEur ? 'input-error' : ''}`}
                                    value={formData.priceInEur}
                                    onChange={(e) => setFormData({ ...formData, priceInEur: e.target.value })}
                                    disabled={view}
                                />
                                <span>EUR</span>
                            </label>
                            {formErrors.priceInEur && <label className="label text-error">{formErrors.priceInEur}</label>}
                        </td>
                    </tr>
                    <tr>
                        <th>Férőhely</th>
                                <td><input
                                    type="number"
                                    placeholder="0"
                                    className={`input input-bordered w-full max-w-xs ${formErrors.capacity ? 'input-error' : ''}`}
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    disabled={view}
                                />
                                {formErrors.priceInHuf && <label className="label text-error">{formErrors.priceInHuf}</label>}
                            </td>
                    </tr>

                    </tbody>
                </table>
                <div className="divider"></div>
                { view ? null :
                    (room ?
                        <>
                            <button type="button" className="btn btn-outline btn-warning text-xl mr-3 mt-3" onClick={handlePatch}>Módosítás</button>
                            <button type="button" className="btn btn-outline btn-error text-xl mr-3 mt-3" onClick={() => navigate('/app/rooms')}>Elvetés</button>
                        </>
                        :
                        disabledColors && disabledColors.length === 5 ?
                            <button type="button" disabled="disabled" className="btn btn-outline btn-success text-xl mr-3 mt-3">Mentés</button> :
                        <button type="button" className="btn btn-outline btn-success text-xl mr-3 mt-3" onClick={handlePost}>Mentés</button>)}
            </div>

        </>
    )
}