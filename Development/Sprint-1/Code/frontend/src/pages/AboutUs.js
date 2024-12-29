import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Target, Building } from 'lucide-react';
import Navbar from '../components/LandingNavbar';

const AboutUs = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Student-Led Innovation",
      description: "Developed by five senior Computer Science majors at LUMS"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-emerald-600" />,
      title: "Visionary Approach",
      description: "Revolutionizing online marketplaces through interactive buyer-seller relationships"
    },
    {
      icon: <Target className="h-8 w-8 text-emerald-600" />,
      title: "Mission-Driven",
      description: "Committed to innovation, collaboration, and excellence"
    },
    {
      icon: <Building className="h-8 w-8 text-emerald-600" />,
      title: "Community Focus",
      description: "Building more than a marketplace - creating a thriving community"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
        </motion.div>

        <motion.section 
          className="prose prose-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gray-700 leading-relaxed">
            Welcome to Minar Market, a visionary project developed by a team of five senior Computer Science 
            majors at LUMS (Lahore University of Management Sciences). As part of our senior year project (SProj), 
            we set out to revolutionize the concept of online marketplaces.
          </p>
        </motion.section>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm"
              variants={fadeIn}
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.section 
          className="prose prose-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-700 leading-relaxed">
            Our journey began with a simple yet profound idea: to create a platform that fosters a truly 
            interactive and dynamic relationship between buyers and sellers. Unlike traditional e-commerce 
            platforms, Minar Market empowers buyers to post their specific needs while enabling sellers to 
            respond with personalized offers. This dual functionality bridges the gap between supply and 
            demand, ensuring a seamless, tailored experience for both parties.
          </p>
          <p className="text-gray-700 leading-relaxed">
            At the heart of our mission lies a commitment to innovation, collaboration, and excellence. 
            By leveraging cutting-edge technologies, intuitive design principles, and our passion for 
            creating impactful solutions, we aim to set a new standard for online commerce in Pakistan 
            and beyond.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe in empowering individuals, small businesses, and enterprises to connect, collaborate, 
            and thrive. With Minar Market, we are not just building a marketplace; we are building a community.
          </p>
        </motion.section>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-emerald-600 mb-4">
            Join us as we embark on this exciting journey to reshape the future of e-commerce!
          </h2>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutUs;
