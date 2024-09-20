import React, { useEffect, useState } from "react";
import styled from "styled-components";
import './style.css'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px;
  justify-content: center;
  border-bottom: 1px solid lightgray;
`;
const CoverImage = styled.img`
  object-fit: cover;
  height: 400px;
`;
const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;
const MovieName = styled.span`
  font-size: 26px;
  font-weight: 600;
  color: black;
  margin-bottom : 15px ;
  white-space: nowrap;
  overflow: hidden;
  text-transform: capitalize;
  text-overflow: ellipsis;
  & span {
    opacity: 0.8;
  }
`;
const MovieInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
  overflow: hidden;
  margin: 4px 0;
  text-transform: capitalize;
  text-overflow: ellipsis;

  & span {
    opacity: 0.5;
  }
`;
const Close = styled.span`
  font-size: 16px;
  width : 30px ;
  text-align: center;
  font-weight: 600;
  color: #3e3e3e;
  background: #e3e3e3;
  height: fit-content;
  padding: 8px ;
  border-radius: 100%;
  cursor: pointer;
  opacity: 0.8;
`;
const MovieInfoComponent = (props) => {
  const [movieInfo, setMovieInfo] = useState();
  const { selectedMovie } = props;
  const [posterURL, setPosterURL] = useState(null);

  useEffect(() => {
    setMovieInfo(selectedMovie)
    console.log(selectedMovie)
    async function fetchPosterImage() {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/poster/${selectedMovie.posterName}`);
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
  }, [selectedMovie,posterURL]);

  
  return (
    <div className="info">
      <Container>
        {movieInfo ? (
          <>
            <CoverImage src={posterURL} alt={movieInfo?.Title} />
            <InfoColumn>
              <MovieName>
                <span>{movieInfo?.Title}</span>
              </MovieName>
              <MovieInfo>
                IMDB Rating: <span>{movieInfo?.imdbRating}</span>
              </MovieInfo>
              <MovieInfo>
                Year: <span>{movieInfo?.Year}</span>
              </MovieInfo>
              <MovieInfo>
                Language: <span>{movieInfo?.Language}</span>
              </MovieInfo>
              <MovieInfo>
                Rated: <span>{movieInfo?.Rated}</span>
              </MovieInfo>
              <MovieInfo>
                Released: <span>{movieInfo?.Released}</span>
              </MovieInfo>
              <MovieInfo>
                Runtime: <span>{movieInfo?.Runtime}</span>
              </MovieInfo>
              <MovieInfo>
                Genre: <span>{movieInfo?.Genre}</span>
              </MovieInfo>
              <MovieInfo>
                Director: <span>{movieInfo?.Director}</span>
              </MovieInfo>
              <MovieInfo>
                Actors: <span>{movieInfo?.Actors}</span>
              </MovieInfo>
              <MovieInfo>
                Plot: <span>{movieInfo?.Plot}</span>
              </MovieInfo>
            </InfoColumn>
            <Close onClick={() => props.onMovieSelect()}>X</Close>
          </>
        ) : (
          "Loading..."
        )}
      </Container>
    </div>
  );
};
export default MovieInfoComponent;