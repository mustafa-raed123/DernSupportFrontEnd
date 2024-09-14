import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CustomerDetails from './components/CustomerManagement/CustomerDetails';
import SupportRequestList from './components/SupportRequestManagement/SupportRequestList';
import KnowledgeBaseList from './components/KnowledgeBase/KnowledgeBaseList';
import InventoryList from './components/InventoryManagement/InventoryList';
import JobDetails from './components/JobScheduling/JobDetails';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import Home from './components/Home/Home';
import AppHeader from './components/Header/Header';
import SupportRequestForm from './components/SupportRequestManagement/SupportRequestForm';
import KnowledgeBaseArticle from './components/KnowledgeBase/KnowledgeBaseArticle';
import CustomerList from './components/KnowledgeBase/KnowledgeBaseList';
import CreateKnowledgeBaseArticle from './components/KnowledgeBase/KnowledgeBaseArticleForm';


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState();

  useEffect(() => {
  setLoggedIn(localStorage.getItem("account"));
  setRole(localStorage.getItem("role"));
  }, []);
  return (
    <div>
    <Router>
      <AppHeader/>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                backgroundImage:
                  "url()",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "91vh",
              }}
            ></div>
          }
        />

        {isLoggedIn ? (
          <>
            {role === "User" ? (
              <>
              <Route path="/" element={<Home />} />
              <Route path="/CreateKnowledgeBaseArticle" element={<CreateKnowledgeBaseArticle />} />
              <Route path="/support-request-management" element = {<SupportRequestForm/>}/>
              <Route path="/knowledge-base" element={<KnowledgeBaseList />} />
              <Route path="/article/:id" element={<KnowledgeBaseArticle />} />

            </>

            ) : null}
            {role === "Admin" ? (
              <>
              <Route path="/customer-management" element = {<CustomerDetails/>}/>
              <Route path="/customers" element = {<CustomerList/>}/>
                <Route path="/support-request-management" element={<SupportRequestList />} />
                <Route path="/inventory-management" element={<InventoryList />} />
                <Route path="/JobDetails" element={<JobDetails />} />
              </>
            ) : null}
            {role === "Technician"}
            <>
            <Route path="/JobDetails" element={<JobDetails />} />
            <Route path="/support-request-management" element = {<SupportRequestForm/>}/>
            <Route path="/knowledge-base" element={<KnowledgeBaseList />} />
              <Route path="/article/:id" element={<KnowledgeBaseArticle />} />
                        
            <Route path="/CreateKnowledgeBaseArticle" element={<CreateKnowledgeBaseArticle />} />

            </>
          </>
        ) 
        
        
        : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </Router>
  </div>
  );
}

export default App;
