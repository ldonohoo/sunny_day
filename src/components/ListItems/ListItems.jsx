import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './ListItems.css'

// import { Draggable, Droppable } from 'pragmatic-dnd';
import LocationSelect from '../LocationSelect/LocationSelect';


function ListItems() {

    const dispatch = useDispatch();
    // const draggable = new Draggable(document.getElementById('draggable'));
    // const droppable = new Droppable(document.getElementById('droppable'));
    
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
//   draggable.on('drag:start', () => {
//     console.log('Drag started');
//   });
  
//   droppable.on('drop', () => {
//     console.log('Dropped');
//   });

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

  // Handle input change and update state
  const handleChangeForm = (event) => {
    setInputFormData({...inputFormData, [event.target.name]: event.target.value});
  }


  return (
    <>
    {/* <LocationSelect isMasterLocation={true}/> */}
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
      <section className="list-items">
        {listItems.map(item => {
          return (
            <div id="list-item"
                 className="list-item"
                 key={item.id}>
              {item.description}
              |priority: {item.priority}
              |due date: {item.due_date}
              |time of day to do: {item.time_of_day_to_complete}
              |preferred weather: {item.preferred_weather_type}
            </div>
          );
        })}
      </section>
    </main>
    </>
  );
}

export default ListItems;
