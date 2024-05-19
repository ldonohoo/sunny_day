import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Lists.css';

// import { Draggable, Droppable } from 'pragmatic-dnd';

import LocationSelect from '../LocationSelect/LocationSelect';


function Lists() {

    // const draggable = new Draggable(document.getElementById('draggable'));
    // const droppable = new Droppable(document.getElementById('droppable'));
    
    const [inputDescription, setInputDescription] = useState('');
    const [selectedLocation, setSelectedLocaation] = useState('');
    const [selectedLists, setSelectedLists] = useState([]);
    const lists = useSelector(store => store.listsReducer.lists);
    const locations = useSelector(store => store.locationsReducer.locations);
    
    const dispatch = useDispatch();
    const history = useHistory();

//   draggable.on('drag:start', () => {
//     console.log('Drag started');
//   });
  
//   droppable.on('drop', () => {
//     console.log('Dropped');
//   });

  useEffect(() => {
    dispatch({ type: 'GET_LISTS',
               payload: {id : 1}
    });
  }, []);


  const handleAddList = (event) => {
    event.preventDefault();
    dispatch({
        type: 'ADD_LIST',
        payload: { description: inputDescription,
                   location: 1 }
    })
    setInputDescription('');
  };

  const handleLoadList = (listId, listDescription) => {
    history.push(`/list_items/${listId}/${listDescription}`);
  }

  const handleDeleteSelectLists = () => {
    dispatch({
      type: 'DELETE_LISTS',
      payload: selectedLists
    })
    setSelectedLists([]);
  }

  const handleCopyList = () => {
    if (selectedLists.length > 1) {
      alert('Please select only one list at a time to copy!');
    } else {
      // popup new list name box, then dispatch:
      dispatch({
        type: 'COPY_LIST',
        payload: selectedLists[0]
      })
      setSelectedLists([]);
    }
  }

  const handleToggleShowOnOpen = () => {
    console.log('toggling!');
  }

  return (
    <>
    {/* <LocationSelect isMasterLocation={true}/> */}
    <main>
      <h1>Your lists</h1>

      <section>
        <form onSubmit={handleAddList}>
            <input type="text" 
                   value={inputDescription}
                   onChange={(e) => setInputDescription(e.target.value)}/>
            <button type="submit">+</button>
        </form>
      </section>
      <section className="lists">
        {lists.map(list => {
          return (
            <div className="list"
                 key={list.id}>
              <button onClick={(e) => {setSelectedLists([...selectedLists, list.id])}}>[]</button>
              <div onClick={() => {handleLoadList(list.id, list.description)}}>
                  {list.description}
              </div>
              <button onClick={() => {handleToggleShowOnOpen(list.id)}}>show</button>
            </div>
          );
        })}
      </section>
    </main>
    </>
  );
}

export default Lists;
