import React, { useState, useEffect } from "react";
import defaultImg from "../../assets/default-image.png";
import { NavLink } from "react-router-dom";

const WpsProduct = (props) => {
  const stock = props.stock;
  // Состояние для отслеживания загрузки изображения
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Сброс состояния загрузки изображения при изменении идентификатора продукта
    setIsImageLoaded(false);
  }, [props.id]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  const image = props.image[0] ? `https://${props.image[0].domain}${props.image[0].path}${props.image[0].filename}` : defaultImg;
  const in_stock =
    stock > 0
      ? "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-green-500"
      : "flex items-start justify-center w-10 px-2 text-base  rounded-lg text-white bg-red-500";
  return (
    <tr>
      <td className="px-2 w-24 lg:w-auto lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        <img
          className="w-32 h-24 object-contain mx-auto"
          src={isImageLoaded ? image : defaultImg}
          alt="img"
          onLoad={handleImageLoad}
        />
      </td>
      <td className="px-2 hidden lg:table-cell lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.sku}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        {props.id ? (
          <NavLink
            to={"/wps-product/" + props.id}
            target="_blank"
            className="text-gray-900 whitespace-no-wrap underline hover:text-blue-600"
          >
            {props.name}
          </NavLink>
        ) : (
          <span>{props.name}</span>
        )}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        ${props.price}
      </td>
      <td className="px-2 lg:px-5 py-5 text-sm bg-white border-b border-gray-200">
        <span className={in_stock}>{stock}</span>
      </td>
    </tr>
  );
};

export default WpsProduct;
