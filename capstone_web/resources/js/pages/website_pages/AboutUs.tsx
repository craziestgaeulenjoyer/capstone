import React, { useState } from 'react';
import { motion } from 'framer-motion'; 

function AboutUs() {
 const [openFaqs1, setOpenFaqs1] = useState(Array(5).fill(false)); 
const [openFaqs2, setOpenFaqs2] = useState(Array(5).fill(false)); 

  const toggleFaq1 = (index: number) => {
    setOpenFaqs1(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleFaq2 = (index: number) => {
    setOpenFaqs2(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData1 = [
    { question: "What is M's Green Cafe's mission?", answer: "Our mission is to provide a warm and inviting community space while offering high-quality, sustainably sourced coffee and delicious, wholesome food." },
    { question: "Do you offer catering services?", answer: "Yes, we offer a variety of catering options for events of all sizes. Please contact us for more details and menu customization." },
    { question: "Where are your locations?", answer: "We currently have one flagship location in the heart of the city. Check our 'Contact Us' page for the full address and directions." },
    { question: "What are your cafe hours?", answer: "We are open Monday to Friday from 7:00 AM to 6:00 PM, and Saturday to Sunday from 8:00 AM to 5:00 PM." },
    { question: "Do you have non-coffee options?", answer: "Absolutely! We offer a wide range of teas, hot chocolates, smoothies, and fresh juices, along with various food items." },
  ];

  const faqData2 = [
    { question: "Do you deliver?", answer: "Yes, we partner with local delivery services to bring our menu items right to your door. You can order through our mobile app or our website." },
    { question: "How do I order through the mobile app?", answer: "Our mobile app is available on both iOS and Android. Simply download it, create an account, browse our menu, and place your order for pickup or delivery." },
    { question: "Do you offer a loyalty program?", answer: "Yes, we have a fantastic loyalty program! Earn points with every purchase and redeem them for free drinks and exclusive discounts. Ask our baristas for details." },
    { question: "Can I customize my drink?", answer: "Of course! We encourage customization. Feel free to ask our baristas about different milk options, syrups, and add-ins to create your perfect drink." },
    { question: "Can I book a table or event space?", answer: "We offer limited table reservations for small groups and have a private event space available for booking. Please contact us in advance to discuss your needs." },
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }
  };

  const faqAnswerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white font-serif antialiased"> 
    
      <section className="relative h-64 md:h-96 flex items-center justify-center overflow-hidden">
  
  <img
    src="/images/img13.jpg"
   
    className="absolute inset-0 w-full h-full object-cover z-0" 
  />

 
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent rounded-b-lg z-10"></div>


<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.5 }}
  variants={staggerContainerVariants}
  className="relative z-20 text-white text-center"
>
  <motion.div variants={fadeInVariants} className="bg-[#8bc662] rounded-full p-1 inline-flex items-center justify-center mb-4 shadow-lg">
   
    <img
      src="/images/Miamore3.png"
      alt="Stylized m star logo" 
      className="w-40 h-40 object-contain" 
    />
  </motion.div>

</motion.div>
</section>

    

<section className="py-12 px-4 md:px-8 lg:px-16 text-center bg-white">
  
  <motion.h2
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={fadeInVariants}

    className="text-3xl md:text-4xl font-bold text-[#8bc662] mb-4 flex items-center justify-center"
  >
    Welcome
   
    <img
      src="/images/leaf-icon.png" 
      alt="Leaf icon"
      className="top-0 right-100 h-30 w-auto z-0 opacity-80" 
    />
  </motion.h2>
  <motion.p
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={fadeInVariants}
   
    className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed italic mb-8"
  >
    Established in 2019, Mi Amore Cafe was built on a passion for great flavors and warm
    connections. From our expertly brewed coffee and soothing teas to our freshly squeezed
    lemonade, every sip and bite is made with love. Whether you're here for a quick refreshment
    or a cozy gathering, Mi Amore is your go-to spot for quality drinks, delicious treats, and a
    welcoming ambiance.
  </motion.p>

 
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={fadeInVariants}
    className="flex justify-center items-center space-x-4 mt-6"
  >
    <a href="https://facebook.com/miamorecafe" target="_blank" rel="noopener noreferrer">
      <img
        src="https://placehold.co/40x40/8bc662/ffffff?text=f" 
        alt="Facebook"
        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
      />
    </a>
    <a href="https://instagram.com/miamorecafe" target="_blank" rel="noopener noreferrer">
      <img
        src="https://placehold.co/40x40/8bc662/ffffff?text=i" 
        alt="Instagram"
        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
      />
    </a>
    <a href="https://tiktok.com/@miamorecafe" target="_blank" rel="noopener noreferrer">
      <img
        src="https://placehold.co/40x40/8bc662/ffffff?text=t" 
        alt="TikTok"
        className="w-10 h-10 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
      />
    </a>
  </motion.div>
</section>

     
 <section className="py-12">
        <motion.div
          className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
         
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
              hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
            }}
            whileHover="hover"
            className="bg-[#D9B4A0] p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
          >
            <div className="absolute -top-12">
              <img
                src="/images/img8.png"
                alt="Hearty Platters"
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
              />
            </div>
         
            <h3 className="text-3xl font-bold text-white mb-2 mt-4">
              Hearty Platters
            </h3>
           
            <p className="text-white mb-4">
              Perfect for sharing, our platters are loaded with a variety of delicious
              bites, from savory snacks to crispy favorites. Whether you're dining
              solo or with friends, every bite is a treat to enjoy.
            </p>
            <button
              className="text-black px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer"
            >
              See more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </motion.div>

        
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
              hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
            }}
            whileHover="hover"
            className="bg-[#8CB874] p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
          >
            <div className="absolute -top-12">
              <img
                src="/images/img5.jpg"
                alt="Irresistible Croffles"
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
              />
            </div>
          
            <h3 className="text-3xl font-bold text-white mb-2 mt-4">
              Irresistible Croffles
            </h3>
            
            <p className="text-white mb-4">
              A delightful fusion of croissant flakiness and waffle crispiness, our
              croffles are golden, buttery, and simply irresistible. Enjoy them plain
              or with your favorite toppings!
            </p>
            <button className="text-black px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer">
              See more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </motion.div>

         
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
              hover: { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
            }}
            whileHover="hover"
            className="bg-[#9BBFC5] p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform duration-300 relative pt-24"
          >
            <div className="absolute -top-12">
              <img
                src="/images/img9.jpg"
                alt="Crispy Fries & Freshly Baked Breads"
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
              />
            </div>
           
            <h3 className="text-3xl font-bold text-white mb-2 mt-4">
              Crispy Fries & Freshly Baked Breads
            </h3>
           
            <p className="text-white mb-4">
              From golden, crispy fries to soft, warm bread, we serve the perfect
              combination of crunch and comfort. Enjoy them as a snack, side, or
              paired with your favorite drink!
            </p>
            <button className="text-black px-4 py-2 rounded-full flex items-center justify-center transition duration-300 cursor-pointer">
              See more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </section>

     
     <section

  className="py-12 px-4 md:px-8 lg:px-16 bg-[#F0F6F5] flex flex-col md:flex-row items-center justify-center gap-8"
>

  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={fadeInVariants}
    className="md:w-1/3 flex justify-center relative overflow-hidden" 
  >
 
    <img
      src="/images/img2.jpg" 
      alt="Mi Amore Cafe product cup with green leaves" 
     
      className="rounded-tl-[3rem] rounded-br-[3rem] shadow-lg w-auto h-auto max-w-full max-h-64 object-cover"
    />
  </motion.div>


  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.5 }}
    variants={staggerContainerVariants}
 
    className="md:w-2/3 text-center md:text-left pl-8 md:pl-16 pr-4 md:pr-8 py-8"
  >
 
    <motion.p variants={itemVariants} className="text-7xl text-[#8bc662] mb-4">“</motion.p>

    <motion.p variants={itemVariants} className="text-xl md:text-2xl italic text-gray-800 leading-relaxed">
      At Mi Amore Cafe, every brew tells a story one of passion, freshness, and heartfelt moments.
    </motion.p>
  
    <motion.p variants={itemVariants} className="text-7xl text-[#8bc662] mt-4 text-right">”</motion.p>
  </motion.div>
</section>


     <section className="bg-[#8CB874] pt-12 pb-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">

  <img
    src="/images/leaf-icon.png"
    alt="Mint Leaf"
    className="absolute top-0 right-100 h-40 w-auto z-0 opacity-80"
  />

  <div className="pt-10 relative z-10 max-w-6xl mx-auto">
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      className="text-3xl md:text-4xl font-bold text-white text-center mb-20 flex items-center justify-center gap-4"
    >
      Any questions <span className="text-[#365314]">We got you.</span>
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
        }}
        className="flex flex-col pr-8"
      >
        <p className="text-sm font-semibold text-[#365314] mb-2 uppercase">
          About
        </p>
        <h3 className="text-3xl font-bold text-white mb-4">
          General Questions
        </h3>
        <p className="text-white text-lg mb-8 leading-relaxed">
          Get to know more about Mi Amore Café what we offer, where we are, and
          what makes us special. Here are the basics you might be curious about
          before your visit or order.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#8CB874] text-lg font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg flex items-center justify-center self-start"
        >
          Contact Us
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </motion.button>
      </motion.div>

      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, staggerChildren: 0.1 },
          },
        }}
        className="space-y-4"
      >
 
        {faqData1.map((faq, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
               onClick={() => toggleFaq1(index)}
            >
              <p className="text-gray-700 font-medium">
                {index + 1}. {faq.question}
              </p>
             <button
  className={`focus:outline-none h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
    index % 2 === 0 ? "bg-[#44B2E4]" : "bg-[#8CB874]"
  }`}
>
  {openFaqs1[index] ? ( 
  
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 12H4" 
      />
    </svg>
  ) : (

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4" 
      />
    </svg>
  )}
</button>
            </div>
           
             <motion.div
              initial="hidden"
              animate={openFaqs1[index] ? "visible" : "hidden"}
              variants={faqAnswerVariants}
              className="overflow-hidden"
            >
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            </motion.div> 

          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</section>


<section className="bg-[#A7D7E0] py-12 px-4 md:px-8 lg:px-16 ">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.8, staggerChildren: 0.1 },
        },
      }}
      className="space-y-4"
    >

     {faqData2.map((faq, index) =>  (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
             onClick={() => toggleFaq2(index)} 
          >
            <p className="text-gray-700 font-medium">
              {index + 1}. {faq.question}
            </p>
            <button
  className={`focus:outline-none h-6 w-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
    index % 2 === 0 ? "bg-[#44B2E4]" : "bg-[#8CB874]"
  }`}
>
  {openFaqs2[index] ? (
   
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 12H4" 
      />
    </svg>
  ) : (
    
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4" 
      />
    </svg>
  )}
</button>
          </div>
      
           <motion.div
            initial="hidden"
            animate={openFaqs2[index] ? "visible" : "hidden"}
            variants={faqAnswerVariants}
            className="overflow-hidden"
          >
            <p className="mt-4 text-gray-600">{faq.answer}</p>
          </motion.div> 
        </motion.div>
      ))}
    </motion.div>

    
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
      }}
      className="flex flex-col justify-center pl-8"
    >
      <p className="text-sm font-semibold text-[#0C5460] mb-2 uppercase">
        Information
      </p>
      <h3 className="text-3xl font-bold text-[#0C5460] mb-4">
        Frequently Asked Questions (FAQs)
      </h3>
      <p className="text-[#0C5460] text-lg mb-8 leading-relaxed">
        Here are answers to the most common questions we receive about ordering,
        delivery, rewards, and more. We want your experience with Mi Amore Cafe
        to be smooth and sweet.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#44B2E4] text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-[#3d9cd0] transition duration-300 shadow-lg flex items-center justify-center self-start"
      >
        Contact Us
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </motion.button>
    </motion.div>
  </div>
</section>
    </div>
  );
}

export default AboutUs;