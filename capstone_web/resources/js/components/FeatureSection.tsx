import React from 'react';
import { GiCoffeeCup, GiCupcake, GiGlassCelebration } from 'react-icons/gi';

const FeaturesSection: React.FC = () => {
    return (
        <section className="relative overflow-hidden">
            <div className="relative bg-[#B4D9DD] pt-20 pb-32 px-4 sm:px-6 lg:px-24">

                <img
                    src="/images/green-cup.png"
                    alt="Green Cup"
                    className="absolute top-0 left-0 w-72 md:w-56 lg:w-95 -rotate-[-35deg] -translate-y-1/4 -translate-x-1/3 z-0"
                />

                <div className="text-left right-40 max-w-3xl mx-auto mb-14 z-10 relative">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-black">
                        Discover. Delight. Mi Amore.
                    </h2>
                    <p className="mt-2 text-gray-700 text-base sm:text-md">
                        Experience the perfect blend of coffee, cuisine, and unforgettable moments at Mi Amore Café.
                    </p>
                </div>
            </div>

            <div className="bg-white h-60 sm:h-72 lg:h-80 w-full absolute bottom-0 left-0 z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-28">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 ">
                    <div className="bg-gray-200 border border-gray-400 h-70 w-70 p-8 text-center shadow-xl hover:bg-[#76B13A] transition-all duration-300">
                        <GiCoffeeCup className="text-[#8a6d23] mx-auto w-11 h-11 mb-4" />
                        <h3 className="font-bold text-gray-800 text-xl">Coffee</h3>
                        <p className="text-sm text-gray-800 mt-2">
                            From rich hot coffee to refreshing iced blends, Mi Amore Café offers creamy frappes, flavorful milk teas, and fruity infusions perfect for every mood.
                        </p>
                    </div>

                    <div className="bg-gray-200 border border-gray-400 h-70 w-70 p-8 text-center shadow-xl hover:bg-[#76B13A] transition-all duration-300">
                        <GiCupcake className="text-[#8a6d23] mx-auto w-11 h-11 mb-4" />
                        <h3 className="font-bold text-gray-800 text-xl">Meals</h3>
                        <p className="text-sm text-gray-800 mt-2">
                            Indulge in a variety of savory dishes and satisfying meals, thoughtfully prepared to complement your favorite drink.
                        </p>
                    </div>

                    <div className="bg-gray-200 border border-gray-400 h-70 w-70 p-8 text-center shadow-xl hover:bg-[#76B13A] transition-all duration-300">
                        <GiGlassCelebration className="text-[#8a6d23] mx-auto w-11 h-11 mb-4" />
                        <h3 className="font-bold text-gray-800 text-xl">Mini Events</h3>
                        <p className="text-sm text-gray-800 mt-2">
                            Celebrate life’s special moments at Mi Amore Café—a cozy space perfect for intimate gatherings, casual meetups, or memorable celebrations.
                        </p>
                    </div>
                </div>

                <img
                    src="/images/choco-cup.png"
                    alt="Choco Cup"
                    className="absolute left-245 w-52 md:w-50 lg:w-60 -rotate-[15deg] translate-x-1/4 -top-35 z-20"
                />
            </div>
        </section>
    );
};

export default FeaturesSection;







