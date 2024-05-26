import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useState } from "react";
import { useDispatch } from "react-redux";
import getWeekNumber from "../../utilities/utilities";



function ListItemsSortable({ item, 
                             handleCompleteItemToggle,
                             handleUpdateDescription,
                             handleDeleteItem,  
                             selectedGroupBy,   
                             weatherTypes }) { 


    // console.log('shoulddisphead', groupBy.shouldDisplayHeader);                         
    const dispatch = useDispatch();
    // const [headerText, setHeaderText] = useState(assignHeader);
    const [inputDescription, setInputDescription] = useState(item.description);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
    const [inputFormData, setInputFormData] = useState({
        priority: item.priority || 0,
        weatherType : item.preferred_weather_type || 0,
        timeOfDay: item.preferred_time_of_day|| '0',
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

    const assignHeader = () => {
      // group header is the week/month/year to work on 
      //    assume 1 is current week, 2 is next week, etc.
      console.log('assigning header (selectedGroupBy, item.group_header ',
            selectedGroupBy, item.group_header);
    
      let numberFromCurrent = 0;
      const currentDate = new Date();
      console.log('selectedGroupby', selectedGroupBy);
      console.log('numberfromcurrent:', numberFromCurrent);
      switch (Number(item.group_header)) {
        case 0:
          return `Current ${selectedGroupBy}`;
          break;
        case 1:
          return `Next ${selectedGroupBy}`;
          break;
        case 2:
          return `${selectedGroupBy} After Next`;
          break;
        default:
          return `Current ${selectedGroupBy} plus ${item.group_header}`;
          break;
      }
    }


    // if (item.group_header !== null) {
    //   headerText = assignHeader();
    //   console.log('HEADERTEXT:::::', headerText);
    // }


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
        // conditionally return a header row whenever the selected group 
        //    header type changes

        <>
        { (item.group_header && item.group_header < 4) ? <div id="list-item"
                                   className="list-item"
                                   ref={setNodeRef} 
                                   style={style} >{assignHeader()} sort:{item.sort_order} grphead:{item.group_header} weektowork:{item.week_to_work_on}</div> : 
        (
          <div id="list-item"
              className="list-item"
              ref={setNodeRef} 
              style={style} >
            {/* <span>{JSON.stringify(item)}</span> */}
            sort:{item.sort_order} grphead:{item.group_header} weektowork:{item.week_to_work_on}
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
                    value={inputFormData.dueDate ? inputFormData.dueDate.slice(0,10) : ''}
                    onChange={handleChangeForm}/>
              <button {...attributes} {...listeners}>drag me</button>
              <button onClick={() => handleDeleteItem(item.id)}>delete</button>
          </div> 
        )}
      </>
    )

}

export default ListItemsSortable;