import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import { searchImages } from './services/api';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import css from './App.module.css';

const App = () => {
  const [searchWord, setSearchWord] = useState('');
  const [page, setPage] = useState(1);
  const [pics, setPics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bigImage, setBigImage] = useState('');

  useEffect(() => {
    if (!searchWord) {
      return;
    }
    const fetchPics = async () => {
      try {
        setIsLoading(true);
        const { data } = await searchImages(searchWord, page);

        if (data.hits.length === 0) {
          alert('Sorry, there are no images we have found. Please try again');

          setIsLoading(false);
          return;
        }
        if (page > data.totalHits / 12) {
          alert('Oops, you have already got all pictures we have))).');

          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        setPics(prevState => [...prevState, ...data.hits]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPics();
  }, [page, searchWord]);

  const handleSearchFormSubmit = searchItem => {
    setSearchWord(searchItem);
    setPics([]);
    setPage(1);
  };

  const openModal = image => {
    setShowModal(true);
    setBigImage(image);
  };

  const closeModal = () => {
    setShowModal(false);
    setBigImage('');
  };

  const onLoadMoreClick = () => setPage(prevPage => prevPage + 1);

  const seekWord = searchWord.toUpperCase();

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleSearchFormSubmit} />
      {searchWord && <h2 className={css.seekItem}>SEEKING FOR: {seekWord}</h2>}
      {<ImageGallery images={pics} onImageClick={openModal} />}
      {isLoading && <Loader />}
      {pics.length !== 0 && <Button onLoadMore={onLoadMoreClick} />}
      {showModal && (
        <Modal onClose={closeModal}>
          <img src={bigImage} alt={searchWord} />
        </Modal>
      )}
    </div>
  );
};

export default App;
