import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ListsSortable({list, 
                        handleDeleteList,
                        handleToggleShowOnOpen,
                        handleUpdateDescription,
                        handleCopyList
                        }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const [inputDescription, setInputDescription] = useState(list.description);
    const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);

    useEffect(() => {
       dispatch({ type: 'GET_LISTS' });
      
    }, [])

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: list.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const handleLoadList = () => {
        history.push(`/list_items/${list.id}/${list.description}`);
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
        handleUpdateDescription(list.id, list.description);
        setIsDescriptionEditable(false);
        event.target.classList.toggle('lists-desc-editable');
      };

      const handleDescriptionClick = (event) => {
        setIsDescriptionEditable(true);
        event.target.classList.toggle('lists-desc-editable');
      };

      const handleProcessCopyList = (listId, description) => {
        handleCopyList(listId, description);
      }

    return (
        <div className="lists-part"
            ref={setNodeRef} 
            style={style} 
            key={list.id}>
          <button onClick={() => handleProcessCopyList(list.id, list.description)}>copy</button>
          <button onClick={handleLoadList}>load<br/>list</button>
          <input type="text"
                 value={inputDescription}
                 onChange={(e) => setInputDescription(e.target.value)}
                 onClick={handleDescriptionClick}
                 readOnly={!isDescriptionEditable}
                 className={`lists-desc-input  ${isDescriptionEditable ? 'lists-desc-editable' : ''}`}
                 onKeyDown={handleDescriptionKeyDown}
                 onBlur={handleDescriptionBlur}/>
          <button {...attributes} {...listeners}>drag me</button>
          <input type="radio" 
                 checked={list.show_on_open} 
                 onClick={() =>
                  handleToggleShowOnOpen(list.id, list.description)}></input>
          <button onClick={() => handleDeleteList(list.id)}>delete</button>   
        </div>
    )
}

export default ListsSortable;