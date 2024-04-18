import React, { useState, useRef } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const formRef = useRef();
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const { data } = await axios.post(loginUrl, { username, password });
      localStorage.setItem('token', data.token);
      setMessage(data.message);
      redirectToArticles();
      setSpinnerOn(false);
    } catch (err) {
      setMessage(err?.message)
      setSpinnerOn(false)
    }
  }

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(articlesUrl, { headers: { Authorization: token }})
      setArticles(response.data.articles)
      setMessage(response.data.message)
      setSpinnerOn(false)
    } catch (error) {
      if (error?.response?.status == 401) logout();
      setSpinnerOn(false)
    }
  }

  const postArticle = article => {
    setSpinnerOn(true)
    const token = localStorage.getItem('token');
    axios.post(articlesUrl, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles(prev => [...prev, res.data.article])
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        setMessage(err.response?.data?.message)
        setSpinnerOn(false)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setSpinnerOn(true)
    const token = localStorage.getItem('token');
    axios.put(`${articlesUrl}/${article_id}`, article, { headers: { Authorization: token } })
      .then(res => {
        setArticles(prev => {
          return prev.map(art => (art.article_id === article_id) ? res.data.article : art)
        })
        setMessage(res.data.message)
        setCurrentArticleId(null)
        setSpinnerOn(false)
      })
      .catch(err => {
        setMessage(err.response?.data?.message)
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    const token = localStorage.getItem('token');
    axios.delete(`${articlesUrl}/${article_id}`, { headers: { Authorization: token } })
      .then(res => {
        const updatedArticles = articles.filter(art => art.article_id !== article_id)
        setArticles(updatedArticles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        setMessage(err.message)
        setSpinnerOn(false)
      })
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
                ref={formRef}
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles} 
                deleteArticle={deleteArticle} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
