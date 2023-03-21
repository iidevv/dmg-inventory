const categoriesSearch = (props) => {
  const handleInputChange = (event) => {
    if (event.target.value.length > 2)
      props.onSearchCategories(event.target.value);
  };
  const handleButtonClick = (event) => {
    localStorage.setItem("category_id", event.target.id);
    localStorage.setItem("category_name", event.target.textContent);
    props.onSetCategory();
  };
  return (
    <>
      <span className="text-sm text-gray-600">Current category:</span>
      <div className="flex mb-3 relative">
        <div className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-2 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
          {props.current_category.name
            ? props.current_category.name
            : "None"}
        </div>
        <div
          id="dropdown-search-city"
          className="z-10 absolute top-full bg-white divide-y divide-gray-100 shadow w-96 dark:bg-gray-700"
        >
          <ul
            className="text-sm text-gray-700 dark:text-gray-200 max-h-96 overflow-y-auto"
            aria-labelledby="dropdown-button-2"
          >
            {props.categories.map((m, i) => {
              return (
                <li key={i}>
                  <button
                    type="button"
                    className="inline-flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    id={m.id}
                    onClick={handleButtonClick}
                  >
                    {m.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="Category search"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default categoriesSearch;
