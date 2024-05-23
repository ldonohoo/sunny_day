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
import ListItemsSortable from '../ListItemsSortable/ListItemsSortable';
import LocationSelect from '../LocationSelect/LocationSelect';


function ListItems() {

    const dispatch = useDispatch();
    const [inputFormData, setInputFormData] = useState({
              description: '',
              priority: 0,
              weatherType : 0,
              timeOfDay: 0,
              dueDate: ''
    });
    
    const [selectedWeatherType, setSelectedWeatherType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const listItems = useSelector(store => store.listsReducer.listItems);
    const locations = useSelector(store => store.locationsReducer.locations);
    const weatherTypes = useSelector(store => store.weatherReducer.weatherTypes);
    const timeOfDays = useSelector(store => store.timeOfDayReducer.timeOfDays)
    const { list_id, list_description } = useParams();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);

  useEffect(() => {
    dispatch({ type: 'GET_LIST_ITEMS', payload: { listId : list_id }});
    dispatch({ type: 'GET_WEATHER_TYPES' });
    dispatch({ type: 'GET_TIME_OF_DAYS' });
    dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
               payload: { listId: list_id }});
  }, []);

  const handleAddListItem = (event) => {
    event.preventDefault();
    const d = new Date();
    const currentYear = d.getFullYear();
    const newItem = {
      description: inputFormData.description, 
      priority: inputFormData.priority,
      weatherType: inputFormData.weatherType,
      timeOfDay: inputFormData.timeOfDay,
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
      timeOfDay: 0,
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
      // let listItemsIdOnly = listItems.map(item => item.id);
        // const activeIndex = listItemsIdOnly.indexOf(active.id);
        // const overIndex = listItemsIdOnly.indexOf(over.id);
        // console.log(arrayMove(listItemsIdOnly, activeIndex, overIndex));
        // arrayMove(listItemsIdOnly, activeIndex, overIndex);
        dispatch({ type: 'UPDATE_LIST_ITEMS_ORDER',
        payload: { indexToMove: active.id,
                   indexToReplace: over.id,
                   listId: list_id } });
    }
  } 

  // Handle input change and update state
  const handleChangeForm = (event) => {
    setInputFormData({...inputFormData, [event.target.name]: event.target.value});
  }

  const handleCompleteItemToggle = (listItemId, listId) => {
    console.log('toggle!!')
    dispatch({
        type: 'TOGGLE_COMPLETE_LIST_ITEM',
        payload: { listItemId : listItemId,
                   listId: listId }   
  });
}

  const handleDeleteItem = (listItemId) => {
    dispatch({
        type: 'DELETE_LIST_ITEM',
        payload: { listItemId: listItemId }
      })
  }

  const handleUpdateDescription = (listId, description) => {
    console.log('updating NOO change show on oopen!')
    dispatch({ type: 'UPDATE_LIST',
               payload: {listId: listId,
                         description: description,
                         changeShowOnOpen: false }
    });
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
            <select name="timeOfDay"
                    value={inputFormData.timeOfDay}
                    onChange={handleChangeForm}>
                      <option value="0">none</option>
                      <option name="morning"
                              value="morning">Morning
                      </option>
                      <option name="afternoon"
                              value="afternoon">Afternoon
                      </option>
                      <option name="evening"
                              value="evening">Evening
                      </option>
                      <option name="night"
                              value="night">Night
                      </option>
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
                items={listItems}
                strategy={verticalListSortingStrategy}>
            {listItems.map(item => {
              return ( <ListItemsSortable key={item.id}
                                          item={item}
                                          handleCompleteItemToggle=
                                            {handleCompleteItemToggle}
                                          handleDeleteItem={handleDeleteItem}
                                          handleUpdateDescription=
                                            {handleUpdateDescription}
                                          weatherTypes={weatherTypes}/> )
          })}
          </SortableContext>
        </section>
      </DndContext>
    </main>
    </>
  );
} 

export default ListItems;
