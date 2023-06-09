import { makeRequest } from './makeRequest';


export function createComment({ postId, message, parentId }) {
  
  return makeRequest(`posts/${postId}/comments`, {
    method:'POST',
    data:{ message, parentId }
  });
}


export function updateComment({ postId, message, id }) {
  
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method:'PUT',
    data:{ message }
  });
}

export function deleteComment({ postId, id }) {
  
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method:'DELETE',
  });
}


export function toggleCommentLiked({ postId, id }) {
  return makeRequest(`posts/${postId}/comments/${id}/like`, {
    method:'POST',
  });
}
