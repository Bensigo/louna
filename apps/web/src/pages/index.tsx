import React, { useEffect } from "react"
import { Box, Container } from "@chakra-ui/react"

import Benefits from "~/components/Benfit"
import Footer from "~/components/Footer"
import Hero from "~/components/Hero"
import Navbar from "~/components/Navbar"
import SectionTitle from "~/components/SectionTitle"
import CardBox from "~/components/Card"
import FeaturesSection from "~/components/Feauture"

const data = [
    {
        title: "Group Classes",
        description:
            "Revolutionize your translation experience with MaxAI.me. With just a simple text selection and a click of the translate button, you'll receive instant, high-quality translations that rival professional translators. MaxAI.me leverages the power of advanced AI models like ChatGPT, Claude, and Gemini to deliver accurate, context-aware translations, ensuring you get the best results every time.",
        imageSrc: "/group-yoga.jpg",
        imageAlt: "Translation Screenshot",
        buttonText: "Join waiting list",
    },
    {
        title: "Community of women",
        description:
            "Revolutionize your translation experience with MaxAI.me. With just a simple text selection and a click of the translate button, you'll receive instant, high-quality translations that rival professional translators. MaxAI.me leverages the power of advanced AI models like ChatGPT, Claude, and Gemini to deliver accurate, context-aware translations, ensuring you get the best results every time.",
        imageSrc: "/community.jpg",
        imageAlt: "Translation Screenshot",
        buttonText: "Join waiting list",
    },
    {
        title: "100+ Recipes",
        description:
            "Revolutionize your translation experience with MaxAI.me. With just a simple text selection and a click of the translate button, you'll receive instant, high-quality translations that rival professional translators. MaxAI.me leverages the power of advanced AI models like ChatGPT, Claude, and Gemini to deliver accurate, context-aware translations, ensuring you get the best results every time.",
        imageSrc: "/cooking.jpg",
        imageAlt: "Translation Screenshot",
        buttonText: "Join waiting list",
    },
    {
        title: "Presonalize Daily Recommendation",
        description:
            "Revolutionize your translation experience with MaxAI.me. With just a simple text selection and a click of the translate button, you'll receive instant, high-quality translations that rival professional translators. MaxAI.me leverages the power of advanced AI models like ChatGPT, Claude, and Gemini to deliver accurate, context-aware translations, ensuring you get the best results every time.",
        imageSrc: "/group-yoga.jpg",
        imageAlt: "Translation Screenshot",
        buttonText: "Join waiting list",
    },
]

const Home = () => {
  

    return (
        <>
            <Navbar />
            <Hero />
            <SectionTitle pretitle="" title=" Why Solu">
                Nextly is a free landing page & marketing website template for
                startups and indie projects.
            </SectionTitle>
            {/* <Benefits data={data} /> */}
            <FeaturesSection data={data} />
            <Container maxW="container.xl" py={8}>
                <CardBox />
            </Container>
            <Footer />
        </>
    )
}

export default Home
