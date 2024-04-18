import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle } = props;

  useEffect(() => {
    setValues(currentArticle ? { ...currentArticle } : initialFormValues)
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues(prev => ({ ...prev, [id]: value }));
  }

  const onSubmit = evt => {
    evt.preventDefault()
    currentArticle
      ? updateArticle({ article_id: currentArticle.article_id, article: values })
      : postArticle(values)
  }

  const onCancel = () => {
    setCurrentArticleId(null);
    setValues(initialFormValues);
  }

  const isDisabled = () => {
    const { title, text, topic } = values;
    return ((title.trim().length < 1) || (text.trim().length < 1) || (topic === ""))
  }

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit" : "Create"} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button type="submit" disabled={isDisabled()} id="submitArticle">Submit</button>
        <button type="button" hidden={!currentArticle} onClick={onCancel}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
