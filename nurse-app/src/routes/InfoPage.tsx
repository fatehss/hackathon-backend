import React from 'react'
import Markdown from 'react-markdown'

export default function InfoPage() {
  return (
    <>

    <Markdown> 
        {`
# Medisync: Empowering Medical Professionals with Seamless Database Interaction

## Problem Statement:
Many medical professionals lack technical backgrounds, which poses a significant challenge when they need to interact with large medical databases. Navigating complex data structures and conducting analyses becomes daunting, impeding efficient patient care and medical research.

## Solution:
Medisync bridges the gap between medical professionals and large medical databases by offering an intuitive platform for seamless interaction. Our solution enables medical practitioners, regardless of their technical proficiency, to effortlessly access, analyze, and visualize patient history data. Leveraging cutting-edge Natural Language Processing (NLP) and vector database technologies, Medisync simplifies complex data queries and provides actionable insights in a user-friendly interface.

## Key Features:
1. **Intuitive Interface:** Medisync offers a user-friendly interface designed specifically for medical professionals, minimizing the learning curve associated with database interaction.
  
2. **NLP-Powered Querying:** Our NLP engine allows users to input queries in natural language, eliminating the need for complex database query languages.

3. **Advanced Data Analysis:** Medisync utilizes sophisticated algorithms to analyze patient history data, identifying trends, correlations, and anomalies to aid medical decision-making.

4. **Visualizations:** Interactive visualizations present data in a comprehensible format, facilitating rapid insights and informed decision-making.

5. **Security and Compliance:** Medisync prioritizes data security and compliance with medical regulations, ensuring confidentiality and integrity of patient information.

## Team:
- **Mohammed Balfaqih:** Frontend Developer and Devops
- **Ripudaman Singh:** Backend Developer (Vector Database)
- **Hoang Nguyen:** Vector Database Professional
- **Ping Qiu:** Backend Developer
- **Fateh Sandhu:** Backend Developer (Open AI)

## How It Works:
1. **Input Query:** Users input their queries using natural language or predefined templates.
2. **NLP Processing:** The NLP engine interprets the query and translates it into database commands.
3. **Data Retrieval:** Medisync retrieves relevant data from the medical databases based on the query.
4. **Analysis and Visualization:** The retrieved data is analyzed and presented through intuitive visualizations.
5. **Insights and Recommendations:** Medisync provides actionable insights and recommendations based on the analysis, assisting medical professionals in decision-making processes.

## Benefits:
- **Efficiency:** Streamlines data interaction processes, saving time and effort for medical professionals.
- **Accessibility:** Democratizes access to complex medical data, empowering non-technical users.
- **Insightful Analysis:** Facilitates in-depth analysis of patient history data, enabling personalized patient care and medical research.

## Get Started:
Interested in revolutionizing the way medical professionals interact with large medical databases? Contact us to schedule a demo or learn more about Medisync.`}
    </Markdown>
    
    </>

  )
}
