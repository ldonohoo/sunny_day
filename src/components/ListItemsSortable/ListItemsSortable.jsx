import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory} from "react-router-dom/cjs/react-router-dom.min";


function ListItemsSortable({ item, 
                             handleCompleteItemToggle,
                             handleUpdateDescription,
                             handleDeleteItem,
                             weatherTypes }) {
                             
    const dispatch = useDispatch();
    const [inputDescription, setInputDescription] = useState(item.description);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
    const [inputFormData, setInputFormData] = useState({
        priority: item.priority || 0,
        weatherType : item.preferred_weather_type || 0,
        timeOfDay: item.preferred_time_of_day || '0',
        dueDate: item.due_date || '' });

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
          handleUpdateDescription(item.id, inputDescription, item.list_id);
          setInputDescription(inputDescription);
          setIsDescriptionEditable(false);
          event.target.classList.toggle('lists-desc-editable');
        }
    };

    // blur is when item loses focus 
    //  (when lose input field focus, update the description)
    const handleDescriptionBlur = (event) => {
      console.log('item:', item)
    handleUpdateDescription(item.id, item.description, item.list_id);
    setIsDescriptionEditable(false);
    event.target.classList.toggle('lists-desc-editable');
    };

    const handleDescriptionClick = (event) => {
    setIsDescriptionEditable(true);
    event.target.classList.toggle('lists-desc-editable');
    };

    // Handle input change and update state
    const handleChangeForm = (event) => {
      const { name, value } = event.target;
      setInputFormData({ ...inputFormData, [name]: value });
      dispatch({ type: 'UPDATE_LIST_ITEM',
                 payload: { changeItem: { ...inputFormData,
                                          [name]: value,
                                          listId: item.list_id,
                                          listItemId: item.id }}
      });
    };

    return (
        <div id="list-item"
             className="list-item"
             ref={setNodeRef} 
             style={style} >
          <span className={ item.completed_date === null ? 
                        "list-item-bar" : "list-item-bar checked-off"}>
            <button id="list-item-complete-checkbox" 
                    className={item.completed_date === null ? '' : 'list-item-complete'}
                    onClick={() => handleCompleteItemToggle(item.id, item.list_id)}
              >
            </button>
            <input type="text"
                   required
                   value={inputDescription}
                   onChange={(e) => setInputDescription(e.target.value)}
                   onClick={handleDescriptionClick}
                   readOnly={!isDescriptionEditable}
                   className={`list-item-desc-input ${isDescriptionEditable ? 
                              'list-item-desc-editable' : ''} ${ item.completed_date === null ? 
                                "list-item-bar" : "list-item-bar checked-off"}`}              
                   onKeyDown={handleDescriptionKeyDown}
                   onBlur={handleDescriptionBlur}/>
            <input className={ item.completed_date === null ? 
                "list-item-priority" : "list-item-priority checked-off"}
                    name="priority"
                    type="number" 
                    min="0"
                    max="5"
                    value={inputFormData.priority}
                    onChange={handleChangeForm}/>
            <select className={ item.completed_date === null ? 
                        "list-item-weathertype" : "list-item-weathertype checked-off"}
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
            <select className={ item.completed_date === null ? 
                        "list-item-select-timeofday" : "list-item-select-timeofday checked-off"}
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
            <input className="list-item-input-delete" 
                    name="dueDate"
                    type="date" 
                    value={inputFormData.dueDate ? inputFormData.dueDate.slice(0,10) : ''}
                    onChange={handleChangeForm}/>
              <button id="list-item-drag-bar" 
                      {...attributes} 
                      {...listeners}>::::</button>
            </span>
            <span className="list-item-delete-button" 
                  onClick={() => handleDeleteItem(item.id, item.list_id)}><pre> 🗑️</pre></span>
        </div>
    )
}

export default ListItemsSortable;