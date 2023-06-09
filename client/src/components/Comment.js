import { useState } from 'react';
import { usePost } from '../context/PostContext';
import { useAsyncFn } from '../hooks/useAsync';
import { useUser } from '../hooks/useUser';
import { createComment, deleteComment, toggleCommentLiked, updateComment } from '../services/comments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { IconBtn } from './IconBtn';
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from 'react-icons/fa';


const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle:'medium',
  timeStyle:'short',
});

export function Comment({ id, message, user, createdAt, likeCount, likedByMe }) {
  const [ areChildrenHidden, setAreChildrenHidden ] = useState(false);
  const [ isReplying, setIsReplying ] = useState(false);
  const [ isEditing, setIsEditing ] = useState(false);
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();
  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLiked);
  const childComments = getReplies(id);
  const curUser = useUser();
  
  function onCommentReply(message) {
    return createCommentFn.execute({ postId:post.id, message, parentId:id }).then((comment) => {
          setIsReplying(false);
          createLocalComment(comment);
        }
    );
  }
  
  function onCommentUpdate(message) {
    return updateCommentFn.execute({ postId:post.id, message, id }).then((comment) => {
          setIsEditing(false);
          updateLocalComment(id, comment.message);
        }
    );
  }
  
  function onCommentDelete() {
    return deleteCommentFn.execute({ postId:post.id, id }).then(() => {
          deleteLocalComment(id);
        }
    );
  }
  
  
  function onToggleCommentLike() {
    return toggleCommentLikeFn
        .execute({ id, postId:post.id })
        .then(({ addLike }) => toggleLocalCommentLike(id, addLike));
  }
  
  return (
      <div>
        <div className='comment'>
          <div className='header'>
            <span className='name'></span>
            <span className='date'>{dateFormatter.format(Date.parse(createdAt))}</span>
          </div>
          {isEditing ? (
              <CommentForm autoFocus
                           initialValue={message}
                           onSubmit={onCommentUpdate}
                           loading={updateCommentFn.loading}
                           error={updateCommentFn.error}
              />
          ) : (
              <div className='message'>{message}</div>
          )}
          <div className='footer'>
            <IconBtn
                disabled={toggleCommentLikeFn.loading}
                Icon={likeCount ? FaHeart : FaRegHeart}
                onClick={onToggleCommentLike}
                aria-label={likedByMe ? 'unlike' : 'Like'}>
              {likeCount}
            </IconBtn>
            <IconBtn
                onClick={() => setIsReplying(prev => !prev)}
                isActive={isReplying}
                Icon={FaReply}
                aria-label={isReplying ? 'Cancel Reply' : 'Reply'}
            />
            {user.id === curUser.id && (
                <>
                  <IconBtn
                      onClick={() => setIsEditing(prev => !prev)}
                      isActive={isEditing}
                      Icon={FaEdit}
                      aria-label={isEditing ? 'Cancel Edit' : 'Edit'}
                  />
                  <IconBtn
                      disabled={deleteCommentFn.loading}
                      onClick={onCommentDelete}
                      Icon={FaTrash}
                      aria-label='Trash'
                      color='danger'
                  />
                </>
            )}
            
            
            {deleteCommentFn.error && (
                <div className='error-msg'>{deleteCommentFn.error}</div>
            )}
          
          </div>
        </div>
        {isReplying && (
            <div className='mt-1 ml-3'>
              <CommentForm
                  autoFocus
                  onSubmit={onCommentReply}
                  loading={createCommentFn.loading}
                  error={createCommentFn.error}
              />
            </div>
        )}
        {childComments?.length > 0 && (
            <>
              <div
                  className={`nested-comments-stack ${
                      areChildrenHidden ? "hide" : ""
                  }`}
              >
                <button
                    className='collapse-line'
                    aria-label='Hide Replies'
                    onClick={() => setAreChildrenHidden(true)}
                />
                <div className='nested-comments'>
                  <CommentList comments={childComments}/>
                </div>
              </div>
              <button
                  className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
                  onClick={() => setAreChildrenHidden(false)}
              >
                Show Replies
              </button>
            </>
        )}
      </div>
  );
}
