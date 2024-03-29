import defaultImg from "../../assets/default-image.png";
import chatgpt from "../../assets/chatgpt.svg";
import CategoriesSearch from "./../common/categoriesSearch/CategoriesSearch";
import ProductVariants from "./productVariants";
import {
  searchKeywordsPrompt,
  metaKeywordsPrompt,
  metaDescriptionPrompt,
  descriptionPrompt,
} from "../common/gpt-prompts.js";

const Product = (props) => {
  const productImg =
    props.product.images &&
    props.product.images.length &&
    props.product.images[0]
      ? props.product.images[0].image_url
      : defaultImg;

  const handleContentChange = (event) => {
    props.onHandleContentChange(event.target.id, event.target.value);
  };
  const handleChatgptContent = () => {
    props.onGetChatgptContent(props.product.name, props.product.description);
  };

  const handleChangeName = (event) => {
    props.onHandleChangeName(event.target.value);
  };
  const handleRemoveAdditionalImage = (event) => {
    props.onHandleRemoveAdditionalImage(event.target.dataset.url);
  };
  const handleSetProductCreateData = (event) => {
    props.onSetProductCreateData("search", event.target.value);
  };

  const handleOptimizeImages = (product) => {
    props.onHandleOptimizeImages(product);
  };
  return (
    <div className="container">
      {props.product.search_available && (
        <div className="bg-white shadow-lg mb-10 p-4 flex flex-col">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            <b>Combine by name.</b> Use the product name (no brands, no colors):
          </p>
          <form className="flex flex-col lg:flex-row items-start lg:items-center w-full">
            <input type="hidden" name="vendor" value={props.product.vendor} />
            <input
              type="text"
              name="search"
              className="flex w-full px-4 py-2 mr-2 mb-2 lg:mb-0 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              onChange={handleSetProductCreateData}
              value={props.create_value}
            />
            <button
              className="flex-shrink-0 px-6 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
              type="submit"
            >
              Refresh
            </button>
          </form>
        </div>
      )}
      <div className="lg:flex items-start mb-10">
        <div className="lg:w-1/2">
          <div className="bg-white shadow-lg mb-4 ml-1">
            <img
              className="p-4 w-full object-contain max-h-96"
              alt="main img"
              src={productImg || defaultImg}
            />
          </div>
          <div className="flex flex-wrap">
            {props.product.images &&
              props.product.images.map((image, i) => {
                if (!image.is_additional || image.image_url == productImg)
                  return;
                return (
                  <div key={i} className="bg-white shadow-lg p-1 m-1 relative">
                    <button
                      onClick={handleRemoveAdditionalImage}
                      data-url={image.image_url}
                      className="absolute right-0 top-0 px-2 text-white bg-red-600"
                    >
                      &times;
                    </button>
                    <a
                      className="block mt-2"
                      href={image.image_url}
                      target="_blank"
                    >
                      <img
                        src={image.image_url}
                        className="w-24 h-20 object-contain"
                      />
                    </a>
                  </div>
                );
              })}
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                handleOptimizeImages(props.product);
              }}
              className="disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white font-semibold bg-blue-800 py-4 px-2 hover:bg-gray-700"
            >
              Optimize images
            </button>
          </div>
        </div>
        <div className="lg:w-1/2  lg:ml-6 lg:mt-0 mt-6 bg-white shadow-lg px-4 lg:px-8 py-10">
          <div>
            <p className="mb-2">{props.product.brand_name}</p>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Title:
            </p>
            <input
              className="flex w-full mb-4 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              type="text"
              value={props.product.name}
              onChange={handleChangeName}
            />
          </div>
          <div className="mb-6 pb-2 border-b border-gray-200">
            <p className="font-bold text-lg">
              {props.product.price ? `$${props.product.price}` : ""}
            </p>
            <p>
              {props.product.weight ? `Weight: ${props.product.weight}` : ""}
            </p>
          </div>
          <div className="mb-6 overflow-hidden">
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Vendor description:
            </p>
            <div
              className="product-description"
              dangerouslySetInnerHTML={{
                __html: props.product.description,
              }}
            />
          </div>
          <CategoriesSearch
            categories={props.categories}
            current_categories={props.current_categories}
            onSearchCategories={props.onSearchCategories}
            onSetCategory={props.onSetCategory}
          />
          <button
            onClick={() => {
              props.pushToCatalog(props.product);
            }}
            disabled={
              props.current_categories && props.current_categories[0]
                ? false
                : true
            }
            className="
            disabled:opacity-50
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base
						flex
						items-center
						justify-center
						leading-none
						text-white
            font-semibold
						bg-blue-800
						w-full
						py-4
						hover:bg-gray-700
					"
          >
            Add To Catalog
          </button>
        </div>
      </div>
      <div className="bg-white shadow-lg px-4 lg:px-8 py-10 mb-10">
        <h3 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mb-6">
          SEO & Description
        </h3>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Search keywords (A comma-separated list of keywords that can be used
            to locate the product when searching the store.)
          </p>
          <input
            type="text"
            id="search_keywords"
            value={props.content.search_keywords}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Meta keywords
          </p>
          <input
            type="text"
            id="meta_keywords"
            value={props.content.meta_keywords}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Meta description
          </p>
          <textarea
            type="text"
            id="meta_description"
            value={props.content.meta_description}
            onChange={handleContentChange}
            className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          ></textarea>
        </label>
        <label className="block mb-4 cursor-pointer">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </p>
          <textarea
            id="description"
            onChange={handleContentChange}
            value={props.content.description}
            placeholder="No Description"
            className="flex-1 w-full h-56 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          ></textarea>
        </label>
        <button
          onClick={handleChatgptContent}
          className="flex items-center py-2 px-4 gpt-btn focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          <img className="w-6 h-6 mr-2" src={chatgpt} />
          <span>Chat GPT</span>
        </button>
      </div>
      <ProductVariants
        variants={props.product.variants}
        onFindAndReplace={props.onFindAndReplace}
        onHandleRemoveVariants={props.onHandleRemoveVariants}
        onHandleRemoveVariant={props.onHandleRemoveVariant}
        onHandleRemoveVariantImage={props.onHandleRemoveVariantImage}
        onHandleChangeVariantName={props.onHandleChangeVariantName}
        onHandleNormalizeNames={props.onHandleNormalizeNames}
      />
    </div>
  );
};

export default Product;
