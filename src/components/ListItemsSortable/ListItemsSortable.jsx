import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory} from "react-router-dom/cjs/react-router-dom.min";


function ListItemsSortable({ item, 
                             handleCompleteItemToggle,
                             handleDeleteItem }) {

    const dispatch = useDispatch();
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


    const handleEditItem = () => {

    }


    return (
        <div id="list-item"
             className="list-item"
             ref={setNodeRef} 
             style={style} >
          <button onClick={handleEditItem}>edit</button>
          <button onClick={() => handleCompleteItemToggle(item.id, item.list_id)}
            >{item.completed_date === null ? '🔲' : '⬛️'}
          </button>
            {item.description}
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