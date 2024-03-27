import {convertMongoDateToYMD, convertYMDToMongoDate, jsDateToYMD, minusDay, plusDay} from "../Utils/BookingUtils.jsx";

export const BookingForm = ({ formData, setFormData, formErrors, view, noRooms, rooms }) => {
    return (
        <table className="table table-lg table-zebra">
            <thead>
            <tr>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {/* title */}
            <tr>
                <th>Név</th>
                <td>
                    <input
                        type="text"
                        placeholder="Név"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.title ? 'input-error' : ''}`}
                        value={formData?.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        disabled={view}
                    />
                    {formErrors?.title && <label className="label text-error">{formErrors?.title}</label>}
                </td>
            </tr>
            {/* bookingPlatform */}
            <tr>
                <th>Foglaló felület</th>
                <td>
                    <select className={`select select-bordered w-full max-w-xs ${formErrors?.bookingPlatform ? 'input-error' : ''}`}
                            value={formData?.bookingPlatform}
                            onChange={(e) => {
                                const newBookingPlatform = e.target.value;
                                const newPaymentMethod = newBookingPlatform === 'booking' ? 'booking' : 'cash';
                                setFormData({ ...formData, bookingPlatform: newBookingPlatform, paymentMethod: newPaymentMethod });
                            }}
                            disabled={view}>
                        <option value="booking">Booking.com</option>
                        <option value="szallashu">Szállás.hu</option>
                        <option value="phone">Telefon</option>
                        <option value="other">Egyéb</option>
                    </select></td>
                {formErrors?.bookingPlatform && <label className="label text-error">{formErrors?.bookingPlatform}</label>}
            </tr>
            {/* room */}
            <tr>
                <th>Foglalt egység</th>
                <td>
                    { noRooms ?
                        <div className="badge badge-error gap-3"><span>NINCS ELÉRHETŐ SZOBA</span></div> :
                        <select
                            className={`select select-bordered w-full max-w-xs ${formErrors?.room ? 'input-error' : ''}`}
                            value={formData?.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            disabled={view}
                        >
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.displayName}
                                </option>
                            ))}
                        </select>
                    }
                </td>
                {formErrors?.room && <label className="label text-error">{formErrors?.room}</label>}
            </tr>
            {/* numberOfGuests */}
            <tr>
                <th>Vendégek száma</th>
                <td>
                    <input
                        type="number"
                        placeholder="0"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.numberOfGuests ? 'input-error' : ''}`}
                        value={formData?.numberOfGuests}
                        onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                        disabled={view}
                    />
                    {formErrors?.numberOfGuests && <label className="label text-error">{formErrors?.numberOfGuests}</label>}
                </td>
            </tr>
            {/* start */}
            <tr>
                <th>Érkezik</th>
                <td>
                    <input
                        type="date"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.start ? 'input-error' : ''}`}
                        value={formData && convertMongoDateToYMD(formData.start)}
                        onChange={(e) => {
                            e.target.value > formData?.end ? setFormData({ ...formData, start: convertYMDToMongoDate(e.target.value), end: convertYMDToMongoDate(jsDateToYMD(plusDay(e.target.value,1))) }) :
                                setFormData({ ...formData, start: convertYMDToMongoDate(e.target.value) })
                        }}
                        disabled={view}
                    />
                </td>
                {formErrors?.start && <label className="label text-error">{formErrors?.start}</label>}
            </tr>
            {/* end */}
            <tr>
                <th>Távozik</th>
                <td>
                    <input
                        type="date"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.end ? 'input-error' : ''}`}
                        value={formData && convertMongoDateToYMD(formData.end)}
                        onChange={(e) => {
                            e.target.value < formData?.start ? setFormData({ ...formData, end: convertYMDToMongoDate(e.target.value), start: convertYMDToMongoDate(jsDateToYMD(minusDay(e.target.value,1))) }) :
                                setFormData({ ...formData, end: convertYMDToMongoDate(e.target.value) })
                        }}
                        disabled={view}
                    />
                </td>
                {formErrors?.end && <label className="label text-error">{formErrors?.end}</label>}
            </tr>
            {/* paymentMethod */}
            <tr>
                <th>Fizetési mód</th>
                <td><select className={`select select-bordered w-full max-w-xs ${formErrors?.paymentMethod ? 'input-error' : ''}`}
                            value={formData?.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            disabled={view}>
                    <option value="booking">Booking.com</option>
                    <option value="cash">Készpénz</option>
                    <option value="transfer">Átutalás</option>
                    <option value="szep">SZÉP kártya</option>
                </select></td>
                {formErrors?.paymentMethod && <label className="label text-error">{formErrors?.paymentMethod}</label>}
            </tr>
            {/* totalPrice */}
            <tr>
                <th>Ár</th>
                <td>
                    <input
                        type="text"
                        placeholder="0"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.totalPrice ? 'input-error' : ''}`}
                        value={formData?.totalPrice}
                        onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                        disabled={view}
                    />
                    <select className="select select-bordered w-auto max-w-xs ml-2"
                            value={formData?.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            disabled={view}>
                        <option>HUF</option>
                        <option>EUR</option>
                    </select>
                    {formErrors?.totalPrice && <label className="label text-error">{formErrors?.totalPrice}</label>}
                </td>
            </tr>
            {/* contact */}
            <tr>
                <th>Elérhetőség</th>
                <td>
                    <input
                        type="text"
                        placeholder="+36 30 123 4567"
                        className={`input input-bordered w-full max-w-xs ${formErrors?.contact ? 'input-error' : ''}`}
                        value={formData?.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        disabled={view}
                    />
                    {formErrors?.contact && <label className="label text-error">{formErrors?.contact}</label>}
                </td>
            </tr>
            {/* paid */}
            <tr>
                <th>Fizetve?</th>
                <td>
                    <input type="checkbox"
                           className="checkbox checkbox-success"
                           onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                           checked={formData?.paid}
                    />
                </td>
            </tr>
            {/* comment */}
            <tr>
                <th>Megjegyzés</th>
                <td>
                        <textarea className="textarea textarea-bordered w-full max-w-xs"
                                  placeholder="Megjegyzés"
                                  value={formData?.comment}
                                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                  disabled={view}>
                        </textarea>
                </td>
            </tr>
            </tbody>
        </table>
    );
};