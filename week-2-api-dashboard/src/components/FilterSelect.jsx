// One reusable dropdown - used for both the category filter and the sort order.
function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div className="control">
      <label className="control__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect
