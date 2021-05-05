import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

const Pagination = ({ items, pageSize, onPageChange }) => {
  // Part 2 code goes here
  if(items.length<=1)
  return null;
  let num = Math.ceil(items.length/pageSize);
  let pages = range(1, num+1);
  const list = pages.map(page=>{
    return(
      <button key={page} onClick={onPageChange} className='page-item'>
      {page}</button>
    );
  });
  return(
    <nav>
    <ul className='pagination'>
    {list}</ul>
    </nav>
  );
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      // Part 1, step 1 code goes here
      dispatch({type:'FETCH_INIT'});
      try{
        const result = await axios(url);
        dispatch({type: 'FETCH_SUCCESS', payload: result.data});
      }
       catch(error){
         dispatch({type: 'FETCH_FAILURE'});
       }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// App that gets data from Hacker News url

  const App =() => {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "https://biriyani.anoram.com/get",
  []
    
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data;
  console.log(page);
  if (page.length >= 0) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        // Part 1, step 2 code goes here
        <ul className="list-group">
          <img
          className="image"
          src={page.image}
          alt="new"
          />
        </ul>
      )}
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
