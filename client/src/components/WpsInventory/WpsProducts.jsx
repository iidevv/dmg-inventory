import React from "react";
import WpsProduct from "./WpsProduct";

const WpsProducts = (props) => {
  const handleInputChange = (event) => {
    props.onSearch(event.target.value);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formElements = event.target.elements;

    const search_by = formElements.search_by.value;
    const search_value = formElements.search_value.value;

    console.log(search_by);
    console.log(search_value);

  }

  return (
    <div className="container">
      <div>
        <h2 className="text-2xl leading-tight mb-4">Catalog</h2>
        <div className="flex">
          <div className="w-1/2 mr-4 pr-4 border-r">
            <input
              type="text"
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Search by product name"
              value={props.searchKeyword}
              onChange={handleInputChange}
            />
          </div>
          <form onSubmit={handleFormSubmit} className="w-1/2 flex relative">
            <select name="search_by" className="rounded-lg border-transparent mr-2 border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
              <option value="name">Name</option>
              <option value="sku">SKU</option>
            </select>
            <input
              type="text"
              name="search_value"
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Search by variants"
            />
            <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span className="sr-only">Search</span>
            </button>
            <div className="absolute overflow-hidden top-full left-0 w-full rounded-lg mt-2 bg-white shadow-lg">
              <a href="/wps-product/" className="block px-4 py-2 border-t transition hover:bg-gray-100">
                <span className="inline-block w-1/3 pl-2">SKU</span>
                <span className="inline-block w-1/3 pl-2">Name</span>
                <span className="inline-block w-1/3">Stock</span>
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="py-4 overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Product name
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                >
                  Variants
                </th>
              </tr>
            </thead>
            <tbody>
              {props.products.map((m, i) => {
                return (
                  <WpsProduct
                    key={i}
                    id={m.id}
                    name={m.name}
                    updated_at={m.updated_at}
                    items={m.items ? m.items.data : null}
                  />
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
            <div className="flex items-center">
              <button
                onClick={() => props.onCursorChanged(props.cursor.prev)}
                type="button"
                disabled={props.cursor.prev ? false : true}
                className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
              >
                <svg
                  width="9"
                  fill="currentColor"
                  height="8"
                  className=""
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                </svg>
              </button>
              <button
                onClick={() => props.onCursorChanged(props.cursor.next)}
                type="button"
                disabled={props.cursor.next ? false : true}
                className="disabled:opacity-50 w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
              >
                <svg
                  width="9"
                  fill="currentColor"
                  height="8"
                  className=""
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WpsProducts;
