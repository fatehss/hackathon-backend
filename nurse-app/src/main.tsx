import React from 'react';
import ReactDOM from 'react-dom/client';
import modal from 'react-modal';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './index.css';


import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ChatPage from './routes/ChatPage.tsx';
import HomePage from './routes/HomePage.tsx';
import InfoPage from './routes/InfoPage.tsx';
import NewPatient from './routes/NewPatient.tsx';
import PatientPage from './routes/PatientPage.tsx';
import PatientsList from './routes/PatientsList.tsx';
import MainPage from './routes/index.tsx';


modal.setAppElement("#root")
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage></MainPage>,
        children: [
            {
                path: "/",
                element: <HomePage></HomePage>,
                children: [
                    {
                        path: "/new",
                        element: <NewPatient></NewPatient>
                    },
                    {
                        path: "/patients",
                        element: <PatientsList></PatientsList>,
                    },
                    {
                        path: "/patients/:id",
                        element: <PatientPage></PatientPage>
                    },
                    {
                        path: "/chat",
                        element: <ChatPage></ChatPage>
                    },
                    {
                        path: "/",
                        element: <InfoPage></InfoPage>
                    }
                ]
            }
        ]
        
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
