import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import SideDrawer from "../components/SideDrawer";

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [apiDetails, setApiDetails] = useState<ApiDetails>({});
  const apiListRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (provider: string, apiDetails: any) => {
    navigate(`/details/${provider}`, { state: { apiDetails } });
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        apiListRef.current &&
        !apiListRef.current.contains(event.target as Node)
      ) {
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
          <SideDrawer
            providers={providers}
            handleProviderClick={handleProviderClick}
            expandedProvider={expandedProvider}
            apiDetails={apiDetails}
            handleNavigate={handleNavigate}
            toggleDrawer={handleClick}
          />
        )}
      </CenteredContainer>
    </AppContainer>
  );
};

export default HomePage;