import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory} from "react-router-dom/cjs/react-router-dom.min";


function ListItemsSortable({ item, 
                             handleCompleteItemToggle,
                             handleUpdateDescription,
                             handleDeleteItem }) {

    const dispatch = useDispatch();
    const [inputDescription, setInputDescription] = useState(item.description);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
    const [inputFormData, setInputFormData] = useState({
        description: '',
        priority: 0,
        weatherType : 0,
        dueDate: ''
});

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: item.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const handleDescriptionKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleUpdateDescription(list.id, list.description);
          setIsDescriptionEditable(false);
          event.target.classList.toggle('lists-desc-editable');
        }
    };

    // blur is when item loses focus 
    //  (when lose input field focus, update the description)
    const handleDescriptionBlur = (event) => {
    handleUpdateDescription(item.id, item.description);
    setIsDescriptionEditable(false);
    event.target.classList.toggle('lists-desc-editable');
    };

    const handleDescriptionClick = (event) => {
    setIsDescriptionEditable(true);
    event.target.classList.toggle('lists-desc-editable');
    };


    return (
        <div id="list-item"
             className="list-item"
             ref={setNodeRef} 
             style={style} >
          <button onClick={() => handleCompleteItemToggle(item.id, item.list_id)}
            >{item.completed_date === null ? '🔲' : '⬛️'}
          </button>
          <input type="text"
                 value={inputDescription}
                 onChange={(e) => setInputDescription(e.target.value)}
                 onClick={handleDescriptionClick}
                 readOnly={!isDescriptionEditable}
                 className={`lists-desc-input  ${isDescriptionEditable ? 'lists-desc-editable' : ''}`}
                 onKeyDown={handleDescriptionKeyDown}
                 onBlur={handleDescriptionBlur}/>
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
  
            |priority: {item.priority}
            |due date: {item.due_date}
            |time of day to do: {item.time_of_day_to_complete}
            |preferred weather: {item.preferred_weather_type}
            <button {...attributes} {...listeners}>drag me</button>
            <button onClick={() => handleDeleteItem(item.id)}>delete</button>
        </div>
    )

}

export default ListItemsSortable;