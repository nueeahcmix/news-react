import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './NewsReact.css';
import './Megaphone.png';
import { TbPigMoney, TbSocial } from "react-icons/tb";
import { BsGlobe2, BsStar } from "react-icons/bs";
import { MdOutlineLocalPolice, MdGTranslate, MdOutlineSportsTennis, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";


function NewsReact() {
  const [category, setCategory] = useState('경제'); // 초기값으로 경제 설정
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const handleChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // 카테고리 변경 시 현재 페이지 번호를 1로 초기화
  };

  const handlerPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlerNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlerStartPage = () => {
    setCurrentPage(1);
  };

  const handlerEndPage = () => {
    setCurrentPage(totalPages);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/news/${category}?page=${currentPage}`);
        setNews(response.data.items);
        setTotalPages(Math.min(Math.ceil(response.data.total / 10), 50)); // 전체 페이지 수를 50페이지로 제한
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [category, currentPage]);

  const getPageButtons = () => {
    let pageButtons = [];
    const startPage = Math.max(1, currentPage - 2); // 현재 페이지 기준으로 2 페이지 전부터 시작
    const endPage = Math.min(totalPages, currentPage + 2); // 현재 페이지 기준으로 2 페이지 이후까지 끝
    if (startPage > 1) {
      pageButtons.push(
        <button key={1} onClick={() => setCurrentPage(1)}>1</button>
      );
      if (startPage > 2) {
        pageButtons.push(<span key="dots1">...</span>);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={i === currentPage ? 'current' : ''}>{i}</button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="dots2">...</span>);
      }
      pageButtons.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }

    return (
      <div className="page-buttons">
        <MdKeyboardDoubleArrowLeft className='pageicon' onClick={handlerStartPage} />
        <MdKeyboardArrowLeft className='pageicon' onClick={handlerPrevPage} />
        {pageButtons}
        <MdKeyboardArrowRight className='pageicon' onClick={handlerNextPage} />
        <MdKeyboardDoubleArrowRight className='pageicon' onClick={handlerEndPage} />
      </div>
    );
  };

  return (
    <div className="all">
      <div className="top">
        <div className="logo"></div>
        <div className="category">
          <label>
            <input type="radio" value="경제" checked={category === '경제'} onChange={handleChange} />
            <span className='category-title'>경제 <TbPigMoney id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="세계" checked={category === '세계'} onChange={handleChange} />
            <span className='category-title'>세계 <BsGlobe2 id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="사회" checked={category === '사회'} onChange={handleChange} />
            <span className='category-title'>사회 <TbSocial id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="정치" checked={category === '정치'} onChange={handleChange} />
            <span className='category-title'>정치 <MdOutlineLocalPolice id='icons' /></span>
          </label>
          <br />
          <label>
            <input type="radio" value="IT" checked={category === 'IT'} onChange={handleChange} />
            <span className='category-title' >IT <BiCodeBlock id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="문화" checked={category === '문화'} onChange={handleChange} />
            <span className='category-title'>문화 <MdGTranslate id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="연예" checked={category === '연예'} onChange={handleChange} />
            <span className='category-title'>연예 <BsStar id='icons' /></span>
          </label>
          <label>
            <input type="radio" value="스포츠" checked={category === '스포츠'} onChange={handleChange} />
            <span className='category-title'>스포츠 <MdOutlineSportsTennis id='icons' /></span>
          </label>
        </div>
      </div>

      <div className="container">
        <table width="80%" className='news_list'>
          <colgroup>
            <col width="5%" />
            <col width="*" />
            <col width="10%" />
            <col width="12%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">제목</th>
              <th scope="col">카테고리</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            {news.map((article, index) => (
              <tr key={article.link}>
                <td>{(currentPage - 1) * 10 + index + 1}</td> {/* 번호 출력 */}

                <td><a href={article.link} target="_blank" rel="noreferrer">
                  <p dangerouslySetInnerHTML={{ __html: article.title }}></p>
                </a></td>
                <td>{category}</td>
                <td>{moment(article.pubDate).format('YYYY-MM-DD HH:mm')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {getPageButtons()}
        </div>
      </div>
    </div>
  );
}

export default NewsReact;

