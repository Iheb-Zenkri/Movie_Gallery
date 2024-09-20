import React, { useState,useEffect } from "react";
import styled from "styled-components";

const MovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 280px;
  box-shadow: 0 3px 10px 0 #aaa;
  cursor: pointer;
`;
const CoverImage = styled.img`
  object-fit: cover;
  height: 362px;
`;
const MovieName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 15px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const InfoColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const MovieInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-transform: capitalize;
  text-overflow: ellipsis;
`;
const MovieComponent = (props) => {
  const { Title, Year, Genre, posterName } = props.movie;

  const [posterURL, setPosterURL] = useState(null);

  useEffect(() => {
    async function fetchPosterImage() {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/poster/${posterName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch poster image');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPosterURL(url);
      } catch (error) {
        console.error('Error fetching poster image:', error.message);
      }
    }

    fetchPosterImage();
    return () => {
      if (posterURL) {
        URL.revokeObjectURL(posterURL);
      }
    };
  }, [posterName]);

  
  return (
    <MovieContainer
      onClick={() => {
        props.onMovieSelect(props.movie);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <CoverImage src={posterURL} alt={Title} />
      <MovieName>{Title}</MovieName>
      <InfoColumn>
        <MovieInfo>Year : {Year}</MovieInfo>
        <MovieInfo>Genre : {Genre}</MovieInfo>
      </InfoColumn>
    </MovieContainer>
  );
};
export default MovieComponent;