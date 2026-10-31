function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <span className="search__icon" aria-hidden="true">🔍</span>
      <input
        className="field search__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
      />
    </div>
  )
}

export default SearchBar
