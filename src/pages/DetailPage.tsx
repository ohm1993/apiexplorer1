import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Styled components
const DetailPageContainer = styled.div`
  padding: 40px;
  color: white;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-beween;
  align-items: center;
  height: 100vh;
  background-color: #34495e;
  @media (max-width: 768px) {
    padding: 20px;
  }
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 80px;
  margin-bottom: 25px;
  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Link = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  word-break: break-all;
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

  &:hover {
    background-color: #3a9bc3;
  }
`;

const Danger = styled.div`
  font-size: 16px;
  margin: 5px 0;
  word-break: break-all;
`;

// Define types for props and state
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

function DetailPage() {
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
    <>
      <DetailPageContainer>
        <Header>
          <Logo src={apiDetails.info["x-logo"].url} alt="Logo" />
          <Title>{apiDetails.info.title}</Title>
        </Header>
        <ContentSection>
          <Section>
            <SectionTitle>Description</SectionTitle>
            <Danger
              dangerouslySetInnerHTML={{ __html: apiDetails.info.description }}
            />
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
    </>
  );
}

export default DetailPage;