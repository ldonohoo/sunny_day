import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory} from "react-router-dom/cjs/react-router-dom.min";

function ListsSortable({list}) {

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log('in listsSortable')
    })
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

    const handleLoadList = (listId, listDescription) => {
        history.push(`/list_items/${listId}/${listDescription}`);
      }
    
    const handleDeleteList = (listId) => {
        dispatch({
          type: 'DELETE_LIST',
          payload: listId
        })
      }
    
      const handleCopyList = (listId) => { 
          dispatch({
            type: 'COPY_LIST',
            payload: listId
          })
      }
      const handleEditList = (listId) => {
        dispatch({
          type: 'EDIT_LIST',
          payload: listId
        })
    }
    
      const handleToggleShowOnOpen = () => {
        console.log('toggling!');
      }

    return (
        <div className="lists-part"
            ref={setNodeRef} 
            style={style} 
            key={list.id}>

          <button onClick={() => {handleEditList(list.id, list.description)}}
            >edit</button>
          <span onClick={() => {handleLoadList(list.id, list.description)}}>
              {list.description}
          </span>
          <button onClick={() => {handleToggleShowOnOpen(list.id)}}>show on open</button>
          <button {...attributes} {...listeners}>drag me</button>
          <button onClick={(e) => {handleDeleteList(list.id)}}>delete</button>

        
        </div>
    )
}

export default ListsSortable;