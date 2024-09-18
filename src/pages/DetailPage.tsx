import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const DetailPageContainer = styled.div`
  padding: 40px;
  background-color: #34495e;
  color: white;
  width: 100%;
  height: 100vh;
  margin: 0;
  font-family: "Arial", sans-serif;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const ContentSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: 20px;
`;

const Section = styled.div`
  margin-left: 80px;
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Link = styled.a`
  color: #1abc9c;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Paragraph = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;

const ExploreButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4ab8e0; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface ApiDetails {
  info: {
    title: string;
    description: string;
    contact: {
      email?: string;
      name?: string;
      url?: string;
    };
    "x-logo": {
      url: string;
    };
  };
  swaggerUrl: string;
}

const DetailPage: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const [apiDetails, setApiDetails] = useState<ApiDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/${provider}.json`)
      .then((response) => {
        const apis = response.data.apis;
        const selectedProvider =
          provider && apis[provider]
            ? apis[provider]
            : apis[Object.keys(apis)[0]];
        setApiDetails(selectedProvider);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [provider]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiDetails) {
    return <div>No API details available</div>;
  }

  return (
    <DetailPageContainer>
      <Header>
        <Logo src={apiDetails.info["x-logo"].url} alt="Logo" />
        <Title>{apiDetails.info.title}</Title>
      </Header>
      <ContentSection>
        <Section>
          <SectionTitle>Description</SectionTitle>
          <Paragraph>{apiDetails.info.description}</Paragraph>
        </Section>
        <Section>
          <SectionTitle>Swagger</SectionTitle>
          <Link
            href={apiDetails.swaggerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {apiDetails.swaggerUrl}
          </Link>
        </Section>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <Paragraph>
            <strong>Email:</strong>{" "}
            {apiDetails?.info?.contact?.email ? (
              <Link href={`mailto:${apiDetails.info.contact.email}`}>
                {apiDetails.info.contact.email}
              </Link>
            ) : (
              ""
            )}
          </Paragraph>
          <Paragraph>
            <strong>Name:</strong> {apiDetails?.info?.contact?.name || ""}
          </Paragraph>
          <Paragraph>
            <strong>URL:</strong>{" "}
            {apiDetails?.info?.contact?.url ? (
              <Link
                href={apiDetails.info.contact.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {apiDetails.info.contact.url}
              </Link>
            ) : (
              ""
            )}
          </Paragraph>
        </Section>
      </ContentSection>
      <ExploreButton onClick={() => navigate("/")}>
        Explore more APIs
      </ExploreButton>
    </DetailPageContainer>
  );
}

export default DetailPage;