
import React, { useState ,useEffect } from "react";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";
import AddMovie from './components/AddMovie'
import Micon from "./images/movie-icon.svg"
import Sicon from "./images/search-icon.svg"

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;
const Button = styled.button`
  align-self: center;
    padding: 10px 20px;
    background-color: #333428;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
`

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [trigger , setTrigger] = useState(false)

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movie data');
        }
        const movies = await response.json();
        updateMovieList(movies);
      } catch (error) {
        console.error('Error fetching movie data:', error.message);
        return [];
      }
    }

  useEffect( () => {
    fetchData(); 
  }, [trigger]);

  const handleSearchResults = async (e) => {
    const key = e.target.value
    updateSearchQuery(key)
    await fetchData().then(()=>{
      const filteredMovies = movieList.filter((movie) =>{
      const searchKeyLower = key.toLowerCase().trim();
      return  movie.Title.toLowerCase().includes(searchKeyLower)   
      });
      updateMovieList(filteredMovies);
    });
    
    if(key === ""){
      fetchData()
    }
  };


  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src={Micon} />
          React Movie App
        </AppName>
        <Button onClick={openModal}>Add Movie</Button>
        <AddMovie isOpen={modalIsOpen} onRequestClose={closeModal} />
        <SearchBox>
          <SearchIcon src={Sicon} />
          <SearchInput
            placeholder="Search for Movie..."
            value={searchQuery}
            onChange={handleSearchResults}
          />
        </SearchBox>
      </Header>
      {selectedMovie && <MovieInfoComponent selectedMovie={selectedMovie} onMovieSelect={onMovieSelect}/>}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src={Micon} />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;
