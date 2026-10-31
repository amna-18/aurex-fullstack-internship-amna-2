import SearchBar from './SearchBar'
import FilterSelect from './FilterSelect'
import { SORT_OPTIONS } from '../api/products'
import { titleCase } from '../utils/format'

function Toolbar({
  searchText,
  filters,
  categories,
  canReset,
  onSearch,
  onCategory,
  onSort,
  onReset,
}) {
  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((category) => ({ value: category.slug, label: titleCase(category.name) })),
  ]
  const sortOptions = SORT_OPTIONS.map((option) => ({ value: option.id, label: option.label }))

  return (
    <div className="toolbar">
      <SearchBar value={searchText} onChange={onSearch} />
      <FilterSelect
        id="category"
        label="Category"
        value={filters.category}
        options={categoryOptions}
        onChange={onCategory}
      />
      <FilterSelect
        id="sort"
        label="Sort by"
        value={filters.sortId}
        options={sortOptions}
        onChange={onSort}
      />
      {canReset && (
        <button className="btn btn--ghost" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  )
}

export default Toolbar
