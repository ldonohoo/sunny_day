import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './ListItems.css'
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ListItemsSortable from '../ListItemsSortable/ListItemsSortable';
import LocationSelect from '../LocationSelect/LocationSelect';
import WeatherForecast from '../WeatherForecast/WeatherForecast';
import getWeekNumber from '../../utilities/utilities';

function ListItems() {

    const dispatch = useDispatch();
    const [inputFormData, setInputFormData] = useState({
              description: '',
              priority: 0,
              weatherType : 0,
              timeOfDay: 0,
              dueDate: ''
    });
    
    // const [selectedWeatherType, setSelectedWeatherType] = useState('');
    // const [selectedLocation, setSelectedLocation] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);
    const [selectedGroupBy, setSelectedGroupBy] = useState('week');
    const [headerCounter, setHeaderCounter] = useState(-1);
    const [currentGroupValue, setCurrentGroupValue] = useState('');
    const listItems = useSelector(store => store.listsReducer.listItems);
    const locations = useSelector(store => store.locationsReducer.locations);
    const weatherTypes = useSelector(store => store.weatherReducer.weatherTypes);
    // const timeOfDays = useSelector(store => store.timeOfDayReducer.timeOfDays);
    const { list_id } = useParams();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);

    // const groupBy = { 
    //   shouldDisplayHeader,
    //   selectedGroupBy,
    //   setSelectedGroupBy,
    //   headerCounter,
    //   setHeaderCounter };

  useEffect(() => {
    console.log('useeffectlistitems:', list_id, showCompleted, selectedGroupBy)
    dispatch({ 
      type: 'GET_LIST_ITEMS', 
      payload: { listId : list_id,
                 group: selectedGroupBy
       }});
    dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
               payload: { listId: list_id }});
    dispatch({ type: 'GET_WEATHER_TYPES' });
    dispatch({ type: 'GET_TIME_OF_DAYS' });
  }, []);

  const handleAddListItem = (event) => {
    event.preventDefault();
    const d = new Date();
    const currentYear = d.getFullYear();
    const d2 = new Date();
    const currentMonth = d2.getMonth();
    const d3 = new Date();
    const currentWeek = getWeekNumber(d3);
    console.log('year month week', currentYear, currentMonth, currentWeek)
    const newItem = {
      description: inputFormData.description, 
      priority: inputFormData.priority,
      weatherType: inputFormData.weatherType,
      timeOfDay: inputFormData.timeOfDay,
      dueDate: inputFormData.dueDate,
      currentYear: currentYear,
      currentMonth: currentMonth,
      currentWeek: currentWeek,
      listId: list_id,
      group: selectedGroupBy
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

  /**
   * Handle the end of a drag event:
   *    find the active item info (item being dragged)
   *    find the over item info (item hovering over that slides down)
   *    use these two to send a request to re-sort the database and 
   *    update any week/month/year to work on information
   */
  const handleDragEnd = (event) => {
    console.log("Drag end called");
    //selectedGroupBy
    const {active, over} = event;
    console.log("ACTIVE: " + active.id);
    console.log("OVER :" + over.id);
    //    Don't complete drag if:
    //    - Drag didn't move item (same spot)
    //       or
    //    - If dragging before first header (header of 'CURRENT WEEK')
    if(active.id !== over.id && 
       over.data.current.item.group_header !== 'CURRENT WEEK') {
      console.log('Here is active.data.current', active.data.current.item);
      console.log('Here is the over.data.current', over.data.current.item);
      // re-order sortorder in database, reset week/month/year to work on
        dispatch({ type: 'UPDATE_LIST_ITEMS_ORDER',
        payload: { itemToMove: active.data.current.item,
                   itemToReplace: over.data.current.item,
                   listId: list_id,
                   group: selectedGroupBy } });
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
                   listId: listId,
                   group: selectedGroupBy }   
    });
  } 

  const handleDeleteItem = (listItemId) => {
    dispatch({
        type: 'DELETE_LIST_ITEM',
        payload: { listItemId: listItemId,
                   group: selectedGroupBy }
      })
  }

  const handleUpdateDescription = (listItemId, description, listId) => {
    console.log('updating NOO change show on oopen!')
    console.log('handleUpdateDescription', listItemId, ' ', description, 'df', listId)
    dispatch({ type: 'UPDATE_LIST_ITEM_DESCRIPTION',
               payload: { listItemId: listItemId,
                          description: description,
                          listId: listId,
                          group: selectedGroupBy }
    });
  }


  return (  
    <>
    <main>
      <section>
        <h2>Weather Forecast</h2>
        <WeatherForecast />
      </section>
      <h2>{listItems[0]?.list_description}:</h2>
      <section>
        <LocationSelect isMasterLocation={false}
                        listId={list_id} />
      </section>
      <section>
        <h2>show completed</h2>
        <button className="show-completed yes" 
                type="button" 
                onClick={() => setShowCompleted(true)}>yes</button>
        <button className="show-completed no" 
                type="button" 
                onClick={() => setShowCompleted(false)}>no</button>
        <select name="group-by"
              value={selectedGroupBy}
              onChange={(e) => setSelectedGroupBy(e.target.value)}>
                <option name="week"
                        value="week">Week
                </option>
                <option name="month"
                        value="month">Month
                </option>
                <option name="year"
                        value="year">Year
                </option>
      </select>
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
              return ( 
                (showCompleted || (!showCompleted && ! item.completed_date)) ?
                      <ListItemsSortable key={item.id}
                                          item={item}
                                          handleCompleteItemToggle=
                                            {handleCompleteItemToggle}
                                          handleDeleteItem={handleDeleteItem}
                                          handleUpdateDescription=
                                            {handleUpdateDescription}
                                          selectedGroupBy={selectedGroupBy}
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
