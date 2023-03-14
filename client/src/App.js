import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Post } from './components/Post';
import { PostLists } from './components/PostLists';
import { PostProvider } from './context/PostContext';


function App() {
  return (
      <div className='container'>
        <Routes>
          <Route path='/'
                 element={ <PostLists/> }/>
          <Route path='/posts/:id'
                 element={ <PostProvider><Post/></PostProvider> }/>
        </Routes>
      </div>
  );
}

export default App;
