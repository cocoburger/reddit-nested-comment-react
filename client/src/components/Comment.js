import { useState } from 'react';
import { usePost } from '../context/PostContext';
import { CommentList } from './CommentList';
import { IconBtn } from './IconBtn';
import { FaEdit, FaHeart, FaReply, FaTrash } from 'react-icons/fa';


const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle:'medium',
  timeStyle:'short',
});

export function Comment({ id, message, user, createdAt }) {
  const { getReplies } = usePost();
  const childComments = getReplies(id);
  const [ areChildrenHidden, setAreChildrenHidden ] = useState(false);
  const [ isReplying, setIsReplying ] = useState(false);
  return (
      <>
        <div className='comment'>
          <div className='header'>
            <span className='name'></span>
            <span className='date'>{dateFormatter.format(Date.parse(createdAt))}</span>
          </div>
          <div className='message'>{message}</div>
          <div className='footer'>
            <IconBtn Icon={FaHeart}
                     aria-label='Like'>
              2
            </IconBtn>
            <IconBtn
                onClick={() => setIsReplying(prev => !prev)}
                isActive={isReplying}
                Icon={FaReply}
                aria-label={isReplying ? 'cancel Reply' : 'Reply'}/>
            
            <IconBtn Icon={FaEdit}
                     aria-label='Edit'>
              2
            </IconBtn>
            <IconBtn Icon={FaTrash}
                     aria-label='Trash'
                     color='danger'
            >
              2
            </IconBtn>
          </div>
        </div>
        {isReplying}
        {childComments?.length > 0 && (
            <>
              <div className={`nested-comments-stack ${areChildrenHidden ? 'hide' : ''}`}>
                <button className='collapse-line'
                        aria-label='Hide REPLIES'>
                  <div className='nested-comments'>
                    <CommentList comments={childComments}/>
                  </div>
                </button>
              </div>
              <button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`}
                      onClick={() => setAreChildrenHidden(false)}>
                > show Replies
              </button>
            </>
        )}
      </>
  );
}
