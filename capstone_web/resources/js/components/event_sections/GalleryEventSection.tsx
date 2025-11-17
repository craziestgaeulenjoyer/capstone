import React from "react";
import { motion, Variants, easeOut } from "framer-motion";

const galleryImages = {
  topLeft: "/images/Event-Images3.jpg",
  small1: "/images/Event-Images4.jpg",
  small2: "/images/Event-Images2.jpg",
  rightTall: "/images/Event-Images1.jpg",
};

const fadeZoom: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: easeOut },
  },
};

const GalleryEventSection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Top Left Image */}
          <motion.img
            src={galleryImages.topLeft}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeZoom}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          {/* Small Images */}
          <div className="grid grid-cols-2 gap-4">
            <motion.img
              src={galleryImages.small1}
              className="w-full h-40 md:h-65 object-cover rounded-xl shadow-md"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeZoom}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            />
            <motion.img
              src={galleryImages.small2}
              className="w-full h-40 md:h-65 object-cover rounded-xl shadow-md"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeZoom}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <motion.img
          src={galleryImages.rightTall}
          className="lg:col-span-2 w-full h-[420px] md:h-[600px] object-cover rounded-2xl shadow-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeZoom}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </section>
  );
};

export default GalleryEventSection;

