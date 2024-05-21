import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './ListItems.css'
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


import LocationSelect from '../LocationSelect/LocationSelect';


function ListItems() {

    const dispatch = useDispatch();
    const [inputFormData, setInputFormData] = useState({
              description: '',
              priority: 0,
              weatherType : 0,
              dueDate: ''
    });
    
    const [selectedWeatherType, setSelectedWeatherType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const listItems = useSelector(store => store.listsReducer.listItems);
    const locations = useSelector(store => store.locationsReducer.locations);
    const weatherTypes = useSelector(store => store.weatherReducer.weatherTypes);
    const { list_id, list_description } = useParams();


  useEffect(() => {
    dispatch({ type: 'GET_LIST_ITEMS', payload: { list_id }});
    dispatch({ type: 'GET_WEATHER_TYPES' });
  }, []);

  const handleAddListItem = (event) => {
    event.preventDefault();
    const d = new Date();
    const currentYear = d.getFullYear();
    const newItem = {
      description: inputFormData.description, 
      priority: inputFormData.priority,
      preferredWeatherType: inputFormData.weatherType,
      dueDate: inputFormData.dueDate,
      yearToComplete: currentYear,
      listId: list_id
    }
    dispatch({
        type: 'ADD_LIST_ITEM',
        payload: { newItem }
    })
    setInputFormData({
      description: '',
      priority: 0,
      weatherType : 0,
      dueDate: ''
    });
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
      let listsItemsIdOnly = listsItems.map(item => item.id);
        const activeIndex = listsItemsIdOnly.indexOf(active.id);
        const overIndex = listsItemsIdOnly.indexOf(over.id);
        console.log(arrayMove(listsItemsIdOnly, activeIndex, overIndex));
        arrayMove(listsIdOnly, activeIndex, overIndex);
        dispatch({ type: 'UPDATE_LIST_ORDER',
        payload: { indexToMove: active.id,
                   indexToReplace: over.id } });
    }
  } 

  // Handle input change and update state
  const handleChangeForm = (event) => {
    setInputFormData({...inputFormData, [event.target.name]: event.target.value});
  }


  return (
    <>
    <main>
      <h1>{list_description}:</h1>
      <section>
        <LocationSelect isMasterLocation={false}
                        listId={list_id} />
      </section>
      <section className="form list-items-form">
        <form onSubmit={handleAddListItem}>
            <input name="description"
                   type="text" 
                   value={inputFormData.description}
                   onChange={handleChangeForm}/>
            <input name="priority"
                   type="number" 
                   value={inputFormData.priority}
                   onChange={handleChangeForm}/>
            <select name="weatherType"
                    value={inputFormData.weatherType}
                    onChange={handleChangeForm}>
                      <option value="0">none
                      </option>{weatherTypes.map(type => (
                      <option key={type.id}
                              name={type.title} 
                              value={type.id}>{type.title}
                      </option>
                    ))}
            </select>
            <input name="dueDate"
                   type="date" 
                   value={inputFormData.dueDate}
                   onChange={handleChangeForm}/>
            <button type="submit">+</button>
        </form>
      </section>
      <DndContext collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}> 
        <section className="list-items">
          <SortableContext
                items={lists}
                strategy={verticalListSortingStrategy}>
            {listItems.map(item => {
              return ( <ListItemsSortable key={listItems.id} item={item}/> )
          })}
          </SortableContext>
        </section>
      </DndContext>
    </main>
    </>
  );
}

export default ListItems;
