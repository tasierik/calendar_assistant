import {useContext, useState} from "react";
import {useApiUtils} from "../Utils/ApiUtils.js";
import {ErrorContext} from "../Contexts/ErrorContext.jsx";
import {MONTH_MAP} from "../Utils/Constants.jsx";


const years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(String);
const months = Array.from(MONTH_MAP.keys());
const monthMap = MONTH_MAP;

function getEnglishMonth(hungarianMonth) {
    return monthMap.get(hungarianMonth);
}

export default function Report({ title, mode }) {
    const options = mode === 'monthly' ? months : years;
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [report, setReport] = useState(null);
    const {fetchYearlyIncome, fetchMonthlyIncome} = useApiUtils();
    const { handleError } = useContext(ErrorContext);
    const isYearly = mode === 'yearly';
    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleYearlyReport = async (option) => {
        try {
            const report = await fetchYearlyIncome(option);
            setReport(report);
        } catch (error) {
            console.error('Error deleting booking:', error);
            handleError('Hiba történt a fizetési státusz módosítása közben. Próbálja meg később.');
        }
    };
    const handleMonthlyReport = async (option) => {
        try {
            const report = await fetchMonthlyIncome(option);
            setReport(report);
        } catch (error) {
            console.error('Error deleting booking:', error);
            handleError('Hiba történt a fizetési státusz módosítása közben. Próbálja meg később.');
        }
    };

    return (
        <div
            tabIndex={0}
            className="collapse collapse-close border border-base-300 bg-base-200 rounded-md mb-12"
        >
            <div className="collapse-title text-xl font-medium p-4">
                {title}
            </div>
            <div className="p-4 space-y-4">
                {options && options.length > 0 && (
                    <div>
                        <select
                            id="options"
                            defaultValue={selectedOption}
                            onChange={handleSelectChange}
                            className="select select-bordered w-full max-w-xs"
                        >
                            <option disabled value="">
                                Válassz!
                            </option>
                            {options.map((option, index) => (
                                <option
                                    key={index}
                                    value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className="p-4">
                <button className="btn btn-accent w-full" onClick={() => isYearly ? handleYearlyReport(selectedOption) : handleMonthlyReport(getEnglishMonth(selectedOption))}>Számol</button>
            </div>
            {report && (
                <div className="income-data-container mt-4 p-6 bg-base shadow-lg rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {isYearly ? selectedOption + 'adatok:' : new Date().getFullYear() + '. ' + selectedOption + ' havi adatok:'}
                    </h3>
                    <div className="m-8">
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center bg-base-100 shadow-md rounded-lg p-4">
                                <div>
                                    <span className="font-semibold">Összeg HUF-ban:</span>
                                </div>
                                <span className="font-semibold">{report.amountInHuf.toLocaleString().replace(/,/g, ' ')} HUF</span>
                            </li>
                            <li className="flex justify-between items-center bg-base-100 shadow-md rounded-lg p-4">
                                <div>
                                    <span className="font-semibold">Összeg EUR-ban:</span>
                                </div>
                                <span className="font-semibold">{report.amountInEur.toLocaleString().replace(/,/g, ' ')} EUR</span>
                            </li>
                        </ul>
                    </div>
                </div>


            )}
        </div>
    );
}
