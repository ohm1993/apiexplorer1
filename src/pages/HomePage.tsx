// src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

interface ApiDetails {
  logo?: string;
  title?: string;
  link?: string;
}

const AppContainer = styled.div<{ isOpen: boolean }>`
  background-color: ${(props) => (props.isOpen ? "#1e1e1e" : "#395b74")};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CenteredContainer = styled.div`
  text-align: center;
`;

const ExploreButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4ab8e0; /* Button color similar to the image */
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ApiList = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #395b74;
  color: white;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
`;

const SelectProvider = styled.h2`
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 20px;
`;

const ProviderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProviderItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #2d3e4f;
  margin-bottom: 10px;
  &.highlighted {
    background-color: #1c2025;
    display: flex;
    align-items: center;
  }
`;

const ProviderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const ApiDetailsContainer = styled.div`
  display: flex;
  align-items: center; 
  justify-content: center;
  height: 100%; 
`;

const ApiLogo = styled.img`
  height: 24px;
  margin-right: 8px;
`;

const ApiTitleButton = styled.button`
  color: white;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 5px;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
  border: none;
  background: none;
  vertical-align: middle; 
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [apiDetails, setApiDetails] = useState<ApiDetails>({});
  const apiListRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleNavigate = (provider: string, apiDetails: any) => {
    navigate(`/details/${provider}`, { state: { apiDetails } });
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
        if (apiListRef.current && !apiListRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
    document.addEventListener("click", handleClickOutside);
    return () => {
    document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/providers.json`)
        .then((response) => {
          setProviders(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOpen]);

  const handleProviderClick = (provider: string) => {
    if (expandedProvider === provider) {
      setExpandedProvider(null);
      setApiDetails({});
    } else {
      setExpandedProvider(provider);
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/${provider}.json`)
        .then((response) => {
          const apiData = response.data.apis;
          const apiKey = Object.keys(apiData)[0];
          const apiInfo = apiData[apiKey];
          setApiDetails({
            logo: apiInfo.info["x-logo"] ? apiInfo.info["x-logo"].url : "",
            title: apiInfo.info.title,
            link: apiInfo.link,
          });
        })
        .catch((error) => {
          setApiDetails({});
        });
    }
  };

  return (
    <AppContainer isOpen={isOpen}>
      <CenteredContainer>
        <ExploreButton onClick={handleClick}>Explore web APIs</ExploreButton>
        {isOpen && (
          <ApiList ref={apiListRef}>
            <SelectProvider>Select Provider</SelectProvider>
            <ProviderList>
              {providers.length > 0 ? (
                providers.map((provider, index) => (
                  <ProviderItem key={index}>
                    <ProviderHeader>
                      <span>{provider}</span>
                      <ArrowButton onClick={() => handleProviderClick(provider)}>
                        {expandedProvider === provider ? "▲" : "▼"}
                      </ArrowButton>
                    </ProviderHeader>
                    {expandedProvider === provider && apiDetails && (
                      <ApiDetailsContainer>
                        {apiDetails.logo && (
                          <ApiLogo src={apiDetails.logo} alt={apiDetails.title} />
                        )}
                        {apiDetails.title && (
                         <ApiTitleButton onClick={() => handleNavigate(provider, apiDetails)}>
                         {apiDetails.title}
                       </ApiTitleButton>
                        )}
                      </ApiDetailsContainer>
                    )}
                  </ProviderItem>
                ))
              ) : (
                <li>No providers available</li>
              )}
            </ProviderList>
          </ApiList>
        )}
      </CenteredContainer>
    </AppContainer>
  );
};

export default HomePage;
