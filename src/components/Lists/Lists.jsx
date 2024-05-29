import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Lists.css';
import LocationSelect from '../LocationSelect/LocationSelect';
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
      // let indexToMove = active.id;
      // let indexToReplace = over.id;
      // let newLists = [...lists];
      // // let listsIdOnly = lists.map(list => list.id);
      // console.log('BEFORE:',JSON.stringify(newLists));
      //   // console.log(arrayMove(lists, active.id, over.id));
      //   newLists = arrayMove(newLists, indexToMove, indexToReplace);
        dispatch({ type: 'UPDATE_LIST_ORDER',
        payload: { indexToMove: active.id,
                   indexToReplace: over.id } });
    }
  } 

  const handleDeleteList = (listId) => {
    dispatch({
      type: 'DELETE_LIST',
      payload: { listId: listId }
    })
  }

  const handleToggleShowOnOpen = (listId, description) => {
    console.log('updating change show on open YES')
    dispatch({
        type: 'UPDATE_LIST',
        payload: { listId: listId,
                   description: description,
                   changeShowOnOpen: true } });
  }

  const handleUpdateDescription = (listId, description) => {
    console.log('updating NOO change show on oopen!')
    dispatch({ type: 'UPDATE_LIST',
               payload: {listId: listId,
                         description: description,
                         changeShowOnOpen: false }
    });
  }

  const handleCopyList = (listId, description) => { 
    // create the new list with same description + 'COPY' 
    const newDescription = description + ' COPY'
      dispatch({
        type: 'COPY_LIST',
        payload: { listId: listId,
                   newDescription: newDescription }
      })
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
        <label>ADD LIST</label>
        <form onSubmit={handleAddList}>
            <input className="list-add-description" 
                   type="text" 
                   placeholder="Enter description..."
                   value={inputDescription}
                   onChange={(e) => setInputDescription(e.target.value)}/>
            <button type="submit">+</button>
        </form>
      </section>
      <DndContext collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}>           
        <section className="lists">
          <label className="list-show-on-open-label">SHOW ON OPEN</label>
          <SortableContext
              items={lists}
              strategy={verticalListSortingStrategy}>
            {lists.map(list => {
                return ( <ListsSortable key={list.id}
                                        list={list} 
                                        handleDeleteList={handleDeleteList}
                                        handleToggleShowOnOpen=
                                          {handleToggleShowOnOpen}
                                        handleUpdateDescription=
                                          {handleUpdateDescription}
                                        handleCopyList={handleCopyList}/> )
              })}
          </SortableContext>
        </section>
      </DndContext>
    </main>
    </>
  );
}

export default Lists;
