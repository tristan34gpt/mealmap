"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import recipes from "@/data/recipes.json";
import ModalMealInfos from "@/app/components/ModalMealInfos"; // Assurez-vous que le chemin est correct

function Page() {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="p-4">
      <h1 className="font-semibold mb-8 text-2xl text-gray-900 text-center">
        Choisissez votre repas et régalez-vous.
      </h1>

      <div className="border-b-[1px] border-gray-300 py-5">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Repas
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={40}
          slidesPerView={3}
          centeredSlides={true}
          breakpoints={{
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            600: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          className="swiper-container"
        >
          {recipes.map(
            (recipe, index) =>
              recipe.types === "Repas" && (
                <SwiperSlide
                  key={index}
                  className="flex justify-around items-center"
                >
                  <div
                    className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden m-4 cursor-pointer"
                    onClick={() => handleOpenModal(recipe)}
                  >
                    <img
                      src={recipe.img}
                      alt={recipe.name}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="text-center p-2">
                      <p className="font-semibold text-primary-800">
                        {recipe.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
          <div className="swiper-button-prev hidden md:block"></div>
          <div className="swiper-button-next hidden md:block"></div>
          <div className="swiper-pagination mt-5"></div>{" "}
        </Swiper>
      </div>

      <div className="border-b-[1px] border-gray-300 py-5">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Desserts
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          breakpoints={{
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            600: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          className="swiper-container py-10"
        >
          {recipes.map(
            (recipe, index) =>
              recipe.types === "Petit Déjeuner" && (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center"
                >
                  <div
                    className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden m-4 cursor-pointer"
                    onClick={() => handleOpenModal(recipe)}
                  >
                    <img
                      src={recipe.img}
                      alt={recipe.name}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="text-center p-2">
                      <p className="font-semibold text-gray-800">
                        {recipe.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
          <div className="swiper-button-prev hidden md:block"></div>
          <div className="swiper-button-next hidden md:block"></div>
        </Swiper>
      </div>

      <div className="py-5">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Pic nique
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides={true}
          breakpoints={{
            1024: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            600: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          className="swiper-container py-10"
        >
          {recipes.map(
            (recipe, index) =>
              recipe.types === "Repas" && (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center"
                >
                  <div
                    className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden m-4 cursor-pointer"
                    onClick={() => handleOpenModal(recipe)}
                  >
                    <img
                      src={recipe.img}
                      alt={recipe.name}
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="text-center p-2">
                      <p className="font-semibold text-gray-800">
                        {recipe.name}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
          <div className="swiper-button-prev hidden md:block"></div>
          <div className="swiper-button-next hidden md:block"></div>
        </Swiper>
      </div>

      {selectedMeal && (
        <ModalMealInfos
          isOpen={Boolean(selectedMeal)}
          onClose={handleCloseModal}
          meal={selectedMeal}
        />
      )}
    </div>
  );
}

export default Page;
