"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ModalMealInfos from "@/app/components/ModalMealInfos";
import SkeletonMeals from "@/app/components/skeleton/SkeletonMeals";

function Page() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("/api/meal/fetchMeals");
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        setMeals(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (!loading) {
    return <SkeletonMeals />;
  }

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

      <div className="border-b-[1px] border-gray-300 py-5 ">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Repas
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={2} // Default slides per view
          centeredSlides={true}
          breakpoints={{
            320: {
              slidesPerView: 1, // For widths 700px and up to 1024px
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2, // For widths 1024px and above
              spaceBetween: 30,
            },
          }}
          className="swiper-container"
        >
          {meals.map(
            (recipe) =>
              recipe.type === "repas" && (
                <SwiperSlide key={recipe.id} className="  w-[auto] p-[50px] ">
                  <div className=" flex justify-center items-center  ">
                    <div
                      className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden  cursor-pointer "
                      onClick={() => handleOpenModal(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className=" md:w-full md:h-[250px] h-[200px] object-cover"
                      />
                      <div className="text-center p-2">
                        <p className="font-semibold text-primary-800">
                          {recipe.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>

      <div className="border-b-[1px] border-gray-300 py-5 ">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Déjeuner
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={2} // Default slides per view
          centeredSlides={true}
          breakpoints={{
            320: {
              slidesPerView: 1, // For widths 700px and up to 1024px
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2, // For widths 1024px and above
              spaceBetween: 30,
            },
          }}
          className="swiper-container"
        >
          {meals.map(
            (recipe) =>
              recipe.type === "déjeuner" && (
                <SwiperSlide key={recipe.id} className="  w-[auto] p-[50px] ">
                  <div className=" flex justify-center items-center  ">
                    <div
                      className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden  cursor-pointer "
                      onClick={() => handleOpenModal(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className=" md:w-full md:h-[250px] h-[200px] object-cover"
                      />
                      <div className="text-center p-2">
                        <p className="font-semibold text-primary-800">
                          {recipe.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>

      <div className="border-b-[1px] border-gray-300 py-5 ">
        <h3 className="text-xl font-medium text-gray-700 mb-5 text-center">
          Pique-niques
        </h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={2} // Default slides per view
          centeredSlides={true}
          breakpoints={{
            320: {
              slidesPerView: 1, // For widths 700px and up to 1024px
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 2, // For widths 1024px and above
              spaceBetween: 30,
            },
          }}
          className="swiper-container"
        >
          {meals.map(
            (recipe) =>
              recipe.type === "pique-nique" && (
                <SwiperSlide key={recipe.id} className="  w-[auto] p-[50px] ">
                  <div className=" flex justify-center items-center  ">
                    <div
                      className="xl:w-[500px] md:w-[300px] w-[200px] bg-white shadow-md rounded-lg overflow-hidden  cursor-pointer "
                      onClick={() => handleOpenModal(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className=" md:w-full md:h-[250px] h-[200px] object-cover"
                      />
                      <div className="text-center p-2">
                        <p className="font-semibold text-primary-800">
                          {recipe.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
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
