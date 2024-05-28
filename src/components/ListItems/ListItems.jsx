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
import WeatherForecast from '../WeatherForecast/WeatherForecast';


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
    const [showCompleted, setShowCompleted] = useState(true);
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
  }, [list_id]);

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

  const handleDeleteItem = (listItemId, listId) => {
    dispatch({
        type: 'DELETE_LIST_ITEM',
        payload: { listItemId: listItemId,
                   listId: listId }
      })
  }

  const handleUpdateDescription = (listItemId, description, listId) => {
    console.log('updating NOO change show on oopen!')
    console.log('handleUpdateDescription', listItemId, ' ', description, 'df', listId)
    dispatch({ type: 'UPDATE_LIST_ITEM_DESCRIPTION',
               payload: { listItemId: listItemId,
                          description: description,
                          listId: listId }
    });
  }


  return (  
    <>
    <main>
      <section className="list-item-forecast-section">
        <h2>Weather Forecast</h2>
        <WeatherForecast />
      </section>
      <h2 className="list-item-main-description"><span>LIST</span>  {list_description}</h2>
      <section className="list-item-location-section">
        <LocationSelect isMasterLocation={false}
                        listId={list_id} />
      </section>
      <section className="list-item-options-section">
        <h2>show completed</h2>
        <button className="show-completed yes" 
                type="button" 
                onClick={() => setShowCompleted(true)}>yes</button>
        <button className="show-completed no" 
                type="button" 
                onClick={() => setShowCompleted(false)}>no</button>
      </section>
      <section className="list-items-add-section">
        <form onSubmit={handleAddListItem}>
            <input className="list-items-add-input-desc"
                   name="description"
                   type="text" 
                   value={inputFormData.description}
                   onChange={handleChangeForm}/>
            <input className="list-items-add-input-priority"
                   name="priority"
                   type="number" 
                   value={inputFormData.priority}
                   onChange={handleChangeForm}/>
            <select className="list-items-add-input-weathertype"
                    name="weatherType"
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
            <select className="list-items-add-input-timeofday"
                    name="timeOfDay"
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
            <input className="list-items-add-input-duedate"
                   name="dueDate"
                   type="date" 
                   value={inputFormData.dueDate}
                   onChange={handleChangeForm}/>
            <button className="list-items-add-submit-button"
                    type="submit">+</button>
        </form>
      </section>
      <DndContext collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}> 
        <section className="list-items">
          <SortableContext
                items={listItems}
                strategy={verticalListSortingStrategy}>
            {listItems.map(item => {
              return ( 
                (showCompleted || (!showCompleted && ! item.completed_date)) ?
                      <ListItemsSortable key={item.id}
                                          item={item}
                                          handleCompleteItemToggle=
                                            {handleCompleteItemToggle}
                                          handleDeleteItem={handleDeleteItem}
                                          handleUpdateDescription=
                                            {handleUpdateDescription}
                                          weatherTypes={weatherTypes}/> 
                : null )
          })}
          </SortableContext>
        </section>
      </DndContext>
      <section>
        <h3>{!showCompleted ? 'completed items:' : ''}</h3>
        {listItems.map(item => {
          return (
            <span key={item.id}>
              {!showCompleted && item.completed_date ? 
                item.description + ' completed on: ' + item.completed_date : ''}
            </span>
          );
        })}
      </section>
    </main>
    </>
  );
} 

export default ListItems;
