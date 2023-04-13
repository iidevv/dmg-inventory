import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import WpsProductPage from "./WpsProductPage";
import withRouter from "../../hoc/withRouter";
import Preloader from "../common/preloader/Preloader";
import Notifications from "../common/notifications/Notifications";
import {
  getProduct,
  setProduct,
  createBigcommerceProduct,
  setToggleIsFetching,
  searchCategories,
  setCategories,
  setCategory,
  resetCategories,
  setHandleContentChange,
  changeName,
  removeVariantImage,
  removeVariant,
  removeVariants,
  changeVariantName,
  getChatgptContent,
  findAndReplace,
} from "../../redux/reducers/wps-product-reducer";

class WpsProductContainer extends React.Component {
  componentDidMount() {
    let id = this.props.params.id;
    if (!id) id = 1;
    this.props.getProduct(id);
    this.props.setCategory(
      localStorage.getItem("category_name"),
      localStorage.getItem("category_id")
    );
  }
  pushToCatalog = (data) => {
    data.page_title = this.props.content.page_title;
    data.search_keywords = this.props.content.search_keywords;
    data.meta_keywords = this.props.content.meta_keywords.split(", ");
    data.meta_description = this.props.content.meta_description;
    data.description = this.props.content.description;
    data.categories = {
      id: +localStorage.getItem("category_id"),
    };

    // remove duplicates
    data.images = data.images.filter((image, index, array) => {
      const firstIndex = array.findIndex(
        (item) => item.image_url === image.image_url
      );
      return firstIndex === index;
    });
    // remove variant_id
    data.images = data.images.map((image, i) => {
      delete image.variant_id;
      if (i == 0) image.is_thumbnail = true;
      image.sort_order = i;
      return image;
    });
    this.props.createBigcommerceProduct(data);
  };
  onSearchCategories = (query) => {
    this.props.searchCategories(query);
  };
  onSetCategory = () => {
    this.props.setCategory(
      localStorage.getItem("category_name"),
      localStorage.getItem("category_id")
    );
    this.props.resetCategories();
  };
  onHandleContentChange = (id, value) => {
    this.props.setHandleContentChange(id, value);
  };
  onHandleChangeName = (name) => {
    this.props.changeName(name);
  };
  onHandleRemoveVariant = (id, variant_id) => {
    this.props.removeVariant(id, variant_id);
  };
  onHandleRemoveVariants = (idsToRemove, variantIdsToRemove) => {
    this.props.removeVariants(idsToRemove, variantIdsToRemove);
  };
  onHandleRemoveVariantImage = (id, variant_id) => {
    this.props.removeVariantImage(id, variant_id);
  };
  onHandleChangeVariantName = (id, name) => {
    this.props.changeVariantName(id, name);
  };
  onGetChatgptContent = (contentField, text) => {
    this.props.getChatgptContent(contentField, text);
  };
  onFindAndReplace = (find, replace) => {
    this.props.findAndReplace(find, replace);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <WpsProductPage
          product={this.props.productData}
          content={this.props.content}
          pushToCatalog={this.pushToCatalog}
          onSearchCategories={this.onSearchCategories}
          onSetCategory={this.onSetCategory}
          onHandleChangeName={this.onHandleChangeName}
          onHandleContentChange={this.onHandleContentChange}
          onFindAndReplace={this.onFindAndReplace}
          onHandleRemoveVariant={this.onHandleRemoveVariant}
          onHandleRemoveVariants={this.onHandleRemoveVariants}
          onHandleRemoveVariantImage={this.onHandleRemoveVariantImage}
          onHandleChangeVariantName={this.onHandleChangeVariantName}
          onGetChatgptContent={this.onGetChatgptContent}
          categories={this.props.categories}
          current_category={this.props.current_category}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    productData: state.wpsProduct.productData,
    content: state.wpsProduct.content,
    info: state.wpsProduct.info,
    isFetching: state.wpsProduct.isFetching,
    categories: state.wpsProduct.categories,
    current_category: state.wpsProduct.current_category,
  };
};

export default compose(
  connect(mapStateToProps, {
    setProduct,
    getProduct,
    createBigcommerceProduct,
    setToggleIsFetching,
    searchCategories,
    setCategories,
    setCategory,
    resetCategories,
    setHandleContentChange,
    changeName,
    removeVariantImage,
    removeVariant,
    removeVariants,
    changeVariantName,
    getChatgptContent,
    findAndReplace
  }),
  withRouter
)(WpsProductContainer);
