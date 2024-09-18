import React, { useState, useEffect, useRef } from "react";
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
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
`;

const CenteredContainer = styled.div`
  text-align: center;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const ExploreButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4ab8e0; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
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
  border-left: 2px solid #64d2ff;
  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
    top: auto;
    bottom: 0;
    border-left: none;
    border-top: 2px solid #64d2ff;
  }
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
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  padding: 10px 0 0 0;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ApiLogo = styled.img`
  object-fit: contain;
  width: 25px;
  height: 25px;
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const ApiTitleButton = styled.button`
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
  border: none;
  background: none;
  vertical-align: middle;
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
  }
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
          <ApiList ref={apiListRef}>
            <SelectProvider>Select Provider</SelectProvider>
            <ProviderList>
              {providers.length > 0 ? (
                providers.map((provider, index) => (
                  <ProviderItem
                    key={index}
                    style={{
                      backgroundColor:
                        expandedProvider === provider ? "#1c2025" : "",
                      borderRadius: expandedProvider === provider ? "5px" : "0",
                    }}
                  >
                    <ProviderHeader>
                      <span>{provider}</span>
                      <ArrowButton
                        onClick={() => handleProviderClick(provider)}
                      >
                        {expandedProvider === provider ? "▲" : "▼"}
                      </ArrowButton>
                    </ProviderHeader>
                    {expandedProvider === provider && apiDetails && (
                      <ApiDetailsContainer>
                        {apiDetails.logo && (
                          <ApiLogo
                            src={apiDetails.logo}
                            alt={apiDetails.title}
                          />
                        )}
                        {apiDetails.title && (
                          <ApiTitleButton
                            onClick={() => handleNavigate(provider, apiDetails)}
                          >
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