export default function TextField(props) {
    const { value, bgSecondary, input, placeholder, fieldType } = props;
    const cName = bgSecondary ? "alert bg-[#272935]" : "alert";
    const type = fieldType ? "text" : fieldType;

    if (input) {
        return <input type={type} value={value} placeholder={placeholder} className="input input-bordered w-full max-w-xs" />
    }

    return <div className={cName}>{value}</div>

}