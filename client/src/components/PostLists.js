import { Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getPosts } from "../services/posts";
import { v4 as uuidv4 } from 'uuid';


export function PostLists() {
  const { loading, error, value: posts } = useAsync(getPosts, []);
  if (loading) return <h1>loading</h1>;
  if (error) return <h1 className='error-msg'>{ error }</h1>;
  return posts.map(post => {
    return (
        <h1 key={ uuidv4() }>
          <Link to={ `/posts/${ post.id }` }>{ post.title }</Link>
        </h1>
    );
  });
}
