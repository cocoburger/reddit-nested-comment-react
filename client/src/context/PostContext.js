import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getPost } from '../services/posts';


const Context = React.createContext();


export function usePost() {
  return useContext(Context);
}

export function PostProvider({ children }) {
  const { id } = useParams();
  const { loading, error, value:post } = useAsync(() => getPost(id), [ id ]);
  
  const [ comments, setComments ] = useState([]);
  
  const commentsByParentId = useMemo(() => {
    if (post?.comments == null) return [];
    const group = {};
    post.comments.forEach(comment => {
      group[comment.parentId] = group[comment.parentId] || [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [ comments ]);
  
  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [ post?.comments ]);
  
  useEffect(() => {
    console.log(comments);
  }, [ comments ]);
  
  
  function createLocalComment(comment) {
    setComments(prevComments => {
      return [ comment, ...prevComments ];
    });
  }
  
  function updateLocalComment(id, message) {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  }
  
  function deleteLocalComment(id) {
    setComments((prevComments) => {
      return prevComments.filter(comment => comment.id !== id);
    });
  }
  
  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }
  
  return (
      <Context.Provider
          value={{
            post:{ id, ...post },
            rootComments:commentsByParentId[null],
            getReplies,
            createLocalComment,
            updateLocalComment,
            deleteLocalComment
          }}>
        {loading ? (<h1>로딩중입니다....</h1>) : error ? (<h1 className='error-msg'>{error}</h1>) : (children)}
      </Context.Provider>);
}
