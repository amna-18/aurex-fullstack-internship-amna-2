const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

function FilterBar({ filter, onChangeFilter }) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {FILTERS.map((item) => (
        <button
          key={item.id}
          className={`pill${filter === item.id ? ' pill--active' : ''}`}
          onClick={() => onChangeFilter(item.id)}
          aria-pressed={filter === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default FilterBar