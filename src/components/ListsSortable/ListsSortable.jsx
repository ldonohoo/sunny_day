import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ListsSortable({list, 
                        handleDeleteList,
                        handleToggleShowOnOpen

                        }) {

    const dispatch = useDispatch();
    const history = useHistory();
    
    // const lists = useSelector(state => state.lists);
    // if (lists) {
    //     let list = lists.find(item => item.id === list.id);
    // }

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
    

    
      const handleCopyList = () => { 
        // let/make user edit description, if the description
        //   changes/is different, then add the list with dispatch:
          dispatch({
            type: 'ADD_LIST',
            payload: { listId: list.id }
          })
      }
      const handleEditList = () => {
        // let user edit description ,
        //   if it changed, then dispatch:
        // 
        dispatch({
          type: 'UPDATE_LIST',
          payload: { listId: list.id,
                     description: list.description,
                     changeshowOnOpen: false }
        })
    }
    


    return (
        <div className="lists-part"
            ref={setNodeRef} 
            style={style} 
            key={list.id}>
          <button onClick={handleCopyList}>copy</button>
          <button onClick={handleEditList}>edit</button>
          <span onClick={handleLoadList}>
              {list.description}
          </span>
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