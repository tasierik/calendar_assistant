import {useEffect, useState} from "react";
import "../App.css";
import Room from "./Room.jsx";
import {useApiUtils} from "../Utils/ApiUtils.js";
import {Link} from "react-router-dom";
export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState(false);
    const [modifyRoom, setModifyRoom] = useState(null);
    const isHost = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')).role === 'HOST';

    const { getRooms } = useApiUtils();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getRooms();
            setRooms(data);
        };
        fetchData();
    }, [getRooms]);

    const handleBackClick = () => {
        setNewRoom(false);
        setModifyRoom(null);
    };


    if (newRoom || modifyRoom) {
        return <Room
            rooms={rooms}
            modifyRoom={modifyRoom}
            onBackClick={handleBackClick} />
    }

    return (
        <>
            <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold mb-5">Apartmanok</h1>
                { isHost && <div className="navbar bg-base-200 rounded-box">
                    <div className="buttons">
                        <Link to="/app/rooms/new" className="btn btn-outline normal-case text-xl mr-3">Új apartman</Link>
                    </div>
                </div> }
                <div className="flex flex-wrap -mx-4">
                    {!rooms ? <span className="loading loading-spinner loading-lg"></span> : null}
                    {rooms.length === 0 ?
                        <p className="text-xl m-8">Nincs még apartman hozzáadva.</p>
                        :
                    rooms.map(room => {
                        const cardStyle = {
                            border: `5px solid ${room.color}`,
                            borderRadius: '8px',
                            padding: '16px',
                            margin: '16px',
                        };
                        const svgStyle = {
                            fill: room.color,
                        };
                        return (
                            <div key={room.id} className="card card-compact w-96 bg-base-200 shadow-xl ml-5 mt-5" style={cardStyle}>
                                <figure className="pr-48 pl-10 pt-10">
                                    <img src="/house.svg" className="rounded-xl" style={svgStyle} />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{room.displayName}</h2>
                                    <div className="room-details mb-5">
                                        <p><strong>Férőhely:</strong> {room.capacity}</p>
                                        <p><strong>Ár (HUF):</strong> {room.priceInHuf.toLocaleString('hu-HU')} Ft</p>
                                        <p><strong>Ár (EUR):</strong> €{room.priceInEur.toLocaleString('hu-HU')}</p>
                                    </div>
                                    <div className="card-actions justify-end">
                                        {isHost && <Link to={`/app/rooms/${room.id}/edit`} className="btn btn-neutral">Szerkesztés</Link>}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}