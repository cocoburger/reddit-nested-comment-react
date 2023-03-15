import { useState } from 'react';
import '../App.css';


export function CommentForm({ loading, error, autoFocus = false, initialValue = '', onSubmit }) {
  const [ message, setMessage ] = useState(initialValue);
  
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(''));
    
  }
  
  return (
      <form onSubmit={handleSubmit}>
        <div className='comment-form-row'>
          <textarea
              autoFocus={autoFocus}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='message-input'
          />
          <button className='btn'
                  type='submit'
                  disabled={loading}>
            {loading ? '로딩중' : '등록'}
          </button>
        </div>
        <div className='error-msg'>{error}</div>
      </form>
  );
}
