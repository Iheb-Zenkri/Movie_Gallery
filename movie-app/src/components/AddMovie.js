import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './style.css'


axios.defaults.baseURL = 'http://localhost:5000';
Modal.setAppElement('#root');

const AddMovie = ({ isOpen, onRequestClose }) => {
  const [movieData, setMovieData] = useState({
    Title: '',
    Year: '',
    Rated: '',
    Released: '',
    Runtime: '',
    Genre: '',
    Director: '',
    Actors: '',
    Plot: '',
    Language: '',
    imdbRating: '',
    posterName : ''
  });
  const [poster, setPoster] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value,
    });
  };

  const handlePosterChange = (e) => {
    setPoster(e.target.files[0]);
    setMovieData({
        ...movieData,
        posterName : e.target.files[0].name,
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const movieResponse = await axios.post('/api/movies', movieData);
        if (movieResponse.status !== 201) {
            throw new Error('Failed to add movie data');
        }

        const formData = new FormData();
        formData.append('poster', poster);
        const posterResponse = await axios.post('/api/movies/poster', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (posterResponse.status !== 201) {
            throw new Error('Failed to add poster data');
        }

        onRequestClose();
        window.location.reload();

    } catch (error) {
        console.error('Error adding movie', error);
        alert('Failed to add movie. Please try again.');
    }
};

  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Add New Movie"
        className="modal"
        overlayClassName="overlay"
        shouldCloseOnOverlayClick={false}
        >
    <div className="modal-header">
        <h2>Add a Movie</h2>
        <button className="close-button" onClick={onRequestClose}>×</button>
    </div>

        <div>
        <form onSubmit={handleSubmit}>
            {Object.keys(movieData).filter(key => key !== 'posterName').map((key) => (
            <div key={key}>
                <label>{key}</label>
                {key === 'Genre' ? (
                <select
                    name={key}
                    value={movieData[key]}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Science Fiction">Science Fiction</option>
                </select>
                ) : (
                <input
                    type="text"
                    name={key}
                    value={movieData[key]}
                    onChange={handleInputChange}
                    required
                />
                )}
            </div>
            ))}
            <div>
            <label>Poster</label>
            <input type="file" name="poster" onChange={handlePosterChange} required/>
            </div>
            <button type="submit">Add Movie</button>
        </form>
        </div>
    </Modal>
  );
};

export default AddMovie;
