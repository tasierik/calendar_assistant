import './components.css';

export default function PopUp({ isOpen, onClose, message, isError = false }) {
    if (isOpen) {
        return (
            <>
                <dialog open={isOpen} className="modal modal-centered">
                    <div className="modal-box">
                        {isError ? <h3 className="font-bold text-lg text-red-500">Hiba</h3>
                        : <h3 className="font-bold text-lg text-white-500">Infó</h3>}
                        <div className="ml-3 mt-6 my-4">
                            <span className="text-white">{message}</span>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-md" onClick={onClose}>Bezár</button>
                        </div>
                    </div>
                </dialog>
            </>
        );
    }
    return null;
}