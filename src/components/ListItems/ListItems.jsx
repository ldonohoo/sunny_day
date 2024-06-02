import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
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
import formatDate from '../../utilities/utilities.js';

function ListItems() {

    const dispatch = useDispatch();
    const history = useHistory();
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
    const recommendations = useSelector(store => store.weatherReducer.recommendations);
    const weatherTypes = useSelector(store => store.weatherReducer.weatherTypes);
    const timeOfDays = useSelector(store => store.timeOfDayReducer.timeOfDays)
    const { list_id, item_id } = useParams();
    const currentLocation = 
      useSelector(store => store.locationsReducer.currentLocation);
    const [recsAvailable, setRecsAvailable] = useState(false);

    useEffect(() => {
      dispatch({ type: 'GET_LIST_ITEMS', payload: { listId : list_id }});
      dispatch({ type: 'GET_WEATHER_TYPES' });
      dispatch({ type: 'GET_TIME_OF_DAYS' });
      dispatch({ type: 'GET_CURRENT_LIST_LOCATION',
                payload: { listId: list_id } });
      dispatch({ type: 'GET_RECOMMENDATIONS',
                payload: { listId: list_id } });
  
    }, [list_id]);

  useEffect(() => {
    if (recommendations.length > 0) {
      setRecsAvailable(true);
    } else {
      setRecsAvailable(false);
    }
  }, [recommendations])

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

  const getRecommendations = (listId) => {
    if (!currentLocation || currentLocation === null || currentLocation === 0) {
      alert('Please select a location for your list to get recommendations!');
      setRecsAvailable(false);
    } else {
      dispatch({
        type: 'CREATE_RECOMMENDATIONS',
        payload: { listId: listId } })
    }
  }

  const seeRecommendations = (listId) => {

      history.push(`/recommendations/${listId}`)
  }

  return (  
    <>
    <main>
      <section className="list-item-forecast-section">
        <h2>Weather Forecast {currentLocation?.name}</h2>
        <WeatherForecast />
      </section>
      <h2 className="list-item-main-description"><span className="med-lg-font">LIST:</span>{listItems[0]?.list_description}</h2>
      <section className="list-item-location-section">
        <LocationSelect isMasterLocation={false}
                        listId={list_id} />
      </section>
      <section className="list-items-add-section">
        <label className="list-item-add-title">ADD NEW ITEM</label>
        <form onSubmit={handleAddListItem}>
          <div>
            <label className="label list-item-add-label">DESCRIPTION<br></br></label>
            <input className="list-items-add-input-desc"
                   name="description"
                   type="text" 
                   value={inputFormData.description}
                   onChange={handleChangeForm}/>
            </div>
            <div>
            <label className="label list-item-add-label">PRIORITY<br></br></label>        
            <input className="list-item-add-input-priority"
                   name="priority"
                   type="number" 
                   value={inputFormData.priority}
                   onChange={handleChangeForm}/>
            </div>
            <div id="list-items-add-label-weathertype">
            <label className=" label list-item-add-label preferred-weather">PREFERRED<br></br>WEATHER TYPE<br></br></label>
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
            </div>
            <div id="list-items-add-label-timeofday">
            <label className="label list-item-add-label preferred-time">PREFERRED<br></br>TIME OF DAY<br></br></label>
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
          </div>
          <div>
            <label className=" label list-item-add-label">DUE DATE<br></br></label>
            <input className="list-items-add-input-duedate"
                   name="dueDate"
                   type="date" 
                   value={inputFormData.dueDate}
                   onChange={handleChangeForm}/>
            <button className="list-items-add-submit-button"
                    type="submit">+</button>
          </div>
        </form>
      </section>
      <section className="list-item-options-section">
        <h2 className="show-completed-heading">SHOW COMPLETED</h2>
        <button className={showCompleted ?
                           "hightlight show-completed-yes" :
                          "show-completed-yes"}
                type="button" 
                onClick={() => setShowCompleted(true)}>YES</button>
        <button className={!showCompleted ?
                           "hightlight show-completed-no" :
                          "show-completed-no"}
                type="button" 
                onClick={() => setShowCompleted(false)}>NO</button>
        <button className="get-recommendations-button" 
                onClick={() => getRecommendations(list_id)}>GET RECOMMENDATIONS
        </button>
        <button className={`see-recommendations-button ${recsAvailable ? 'recs-available' : ''}`}
                onClick={() => seeRecommendations(list_id)}>SEE RECOMMENDATIONS
        </button>
      </section>
      <div className="work-on bar1 inline-block"></div>
      <h4 className="work-on title inline-block sm-med-font">work on first</h4>
      <div className="work-on bar2 inline-block"></div>
      <label className="label list-item-desc-label">DESCRIPTION</label>
      <label className="label list-item-priority-label">PRIORITY</label>
      <label className="label list-item-weather-label">PREF. WEATHER</label>
      <label className="label list-item-timeofday-label">PREF. TIME OF DAY</label>
      <label className="label list-item-duedate-label">DUE DATE</label>
      <DndContext collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}> 
        <section className="list-items">
          <SortableContext
                id="list-items-container"
                items={listItems}
                strategy={verticalListSortingStrategy}>
            {listItems.map(item => {
              return ( 
                (showCompleted || (!showCompleted && ! item.completed_date)) ?
                      <ListItemsSortable key={item.id}
                                          id="list-items-top"
                                          item={item}
                                          highlightItem={item_id}
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
      <div className="work-on bar1 inline-block"></div>
      <h4 className="work-on title inline-block sm-med-font">work on last</h4>
      <div className="work-on bar2 inline-block"></div>
      <section>
      <h3>{!showCompleted ? 'completed items:' : ''}</h3>
      {listItems.map(item => (
        <article key={item.id}>
          {!showCompleted && item.completed_date ? (
            <span>
              {` COMPLETED ON ${formatDate(item.completed_date)}: ${item.description}`}
            </span>
          ) : (
            ''
          )}
        </article>
      ))}
    </section>
    </main>
    </>
  );
} 

export default ListItems;
