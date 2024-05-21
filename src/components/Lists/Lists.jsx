import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Lists.css';
import LocationSelect from '../LocationSelect/LocationSelect';
// import { Draggable, Droppable } from 'pragmatic-dnd';
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import ListsSortable from '../ListsSortable/ListsSortable';

function Lists() {

    const [inputDescription, setInputDescription] = useState('');
    const [selectedLists, setSelectedLists] = useState([]);
    const lists = useSelector(store => store.listsReducer.lists);
    
    const dispatch = useDispatch();
    const history = useHistory();

  useEffect(() => {
    dispatch({ type: 'GET_LISTS',
               payload: {id : 1} });
  }, []);


  const handleAddList = (event) => {
    event.preventDefault();
    dispatch({
        type: 'ADD_LIST',
        payload: { description: inputDescription }
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

  const handleDragEnd = (event) => {
    console.log("Drag end called");
    const {active, over} = event;
    console.log("ACTIVE: " + active.id);
    console.log("OVER :" + over.id);

    if(active.id !== over.id) {
      // re-order sortorder in database
      // ***** NOTE: indicies are specified by list id!!
      // active is index to move
      console.log('Active is:', active.id);
      // over is index to move to
      console.log('Over is:', over.id);
      // get list of id's only 
      let listsIdOnly = lists.map(list => list.id);
        const activeIndex = listsIdOnly.indexOf(active.id);
        const overIndex = listsIdOnly.indexOf(over.id);
        console.log(arrayMove(listsIdOnly, activeIndex, overIndex));
        arrayMove(listsIdOnly, activeIndex, overIndex);
        dispatch({ type: 'UPDATE_LIST_ORDER',
        payload: { indexToMove: active.id,
                   indexToReplace: over.id } });
    }
  } 


  return (
    <>
    {/* <LocationSelect isMasterLocation={true}/> */}
    <main>
      <h1>Your lists</h1>
      <section>
        <LocationSelect isMasterLocation={true} />
      </section>
      <section>
        <form onSubmit={handleAddList}>
            <input type="text" 
                   value={inputDescription}
                   onChange={(e) => setInputDescription(e.target.value)}/>
            <button type="submit">+</button>
        </form>
      </section>
      <DndContext collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}>           
        <section className="lists">
          <SortableContext
              items={lists}
              strategy={verticalListSortingStrategy}>
            {lists.map(list => {
                return (
                  <ListsSortable key={list.id} list={list}/> 
                )
              })}
          </SortableContext>
        </section>
      </DndContext>
    </main>
    </>
  );
}

export default Lists;
