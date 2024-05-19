import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

// import { Draggable, Droppable } from 'pragmatic-dnd';
import LocationSelect from '../LocationSelect/LocationSelect';


function ListItems() {

    // const draggable = new Draggable(document.getElementById('draggable'));
    // const droppable = new Droppable(document.getElementById('droppable'));
    
    const [inputFormData, setInputFormData] = useState({
              description: '',
              priority: NULL,
              preferred_weather_type : NULL,
              due_date: NULL,
              year_to_complete: 0,
              list_id: NULL });
              


    const [selectedLocation, setSelectedLocaation] = useState('');
    const listItems = useSelector(store => store.currentListItems);
    const locations = useSelector(store => store.locations);
    const dispatch = useDispatch();

    const { list_id } = useParams();
    console.log('list_id:', list_id);


//   draggable.on('drag:start', () => {
//     console.log('Drag started');
//   });
  
//   droppable.on('drop', () => {
//     console.log('Dropped');
//   });

  useEffect(() => {
    dispatch({ type: 'FETCH_LIST_ITEMS',
               payload: {id : list_id}
    });
  }, []);

  

  const handleAddList = (event) => {
    event.preventDefault();
    const d = new Date();
    const currentYear = d.getFullYear();
    const newItem = {
      description: inputDescription, 
      priority: inputPriority,
      preferred_weather_type: inputWeatherType,
      due_date: inputDueDate,
      year_to_complete: currentYear,
      list_id: list_id
    }
    dispatch({
        type: 'ADD_LIST_ITEM',
        payload: { newItem }
    })
  }

  // Handle input change and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Add your form submission logic here
  }


  return (
    <>
    {/* <LocationSelect isMasterLocation={true}/> */}
    <main>
      <h1>Your list items here:</h1>
      <h2>{JSON.stringify(listItems)}</h2>
      <section>
        <form onSubmit={handleAddList}>
            <input type="text" 
                   value={inputDescription}
                   onChange={(e) => setInputDescription(e.target.value)}/>
            <button type="submit">+</button>
        </form>
      </section>
      {/* <section className="lists">
        {lists.map(list => {
          return (
            <div key={list.id}>
              <h3>{list.description}</h3>
            </div>
          );
        })}
      </section> */}
    </main>
    </>
  );
}

export default ListItems;
