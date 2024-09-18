import { useRef } from "react";
import styled from "styled-components";

const ApiList = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #395b74;
  color: white;
  padding: 0 20px 20px 20px;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  border-left: 2px solid #64d2ff;
  @media (max-width: 768px) {
    position: block;
    width: 95%;
    border-left: none;
    overflow-y: scroll;
  }
`;

const SelectProvider = styled.h2`
  position: sticky;
  top: 0;
  font-size: 18px;
  padding: 10px 0 10px 0;
  background-color: #395b74;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
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
`;

const ApiLogo = styled.img`
  object-fit: contain;
  width: 25px;
  height: 25px;
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
`;
const SideDrawer = ({
  providers,
  handleProviderClick,
  expandedProvider,
  apiDetails,
  handleNavigate,
  toggleDrawer,
}: {
  providers: string[];
  handleProviderClick: (provider: string) => void;
  expandedProvider: string | null;
  apiDetails: any;
  handleNavigate: (provider: string, apiDetails: any) => void;
  toggleDrawer: () => void;
}) => {
  const apiListRef = useRef<HTMLDivElement | null>(null);

  return (
    <ApiList ref={apiListRef}>
      <SelectProvider>
        Select Provider
        <CloseButton onClick={toggleDrawer}>X</CloseButton>
      </SelectProvider>
      <ProviderList>
        {providers.length > 0 ? (
          providers.map((provider, index) => (
            <ProviderItem
              key={index}
              style={{
                backgroundColor: expandedProvider === provider ? "#1c2025" : "",
                borderRadius: expandedProvider === provider ? "5px" : "0",
              }}
            >
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
  );
};

export default SideDrawer;