const FilterButtons = ({ onChange, selected }: any) => (
  <div className="flex gap-2">
    {["daily", "weekly", "monthly"].map((filter) => (
      <button
        key={filter}
        onClick={() => onChange(filter)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selected === filter
            ? "bg-[var(--sidebar-primary)] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </button>
    ))}
  </div>
);

export default FilterButtons;
