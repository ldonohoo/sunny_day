import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useEffect } from "react";

function ListsSortable({list}) {
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

    return (
        <div className="lists-part"
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            key={list.id}>
          <button onClick={(e) => {setSelectedLists([...selectedLists, list.id])}}
          >[]</button>
          <div onClick={() => {handleLoadList(list.id, list.description)}}>
              {list.description}
          </div>
          <button onClick={() => {handleToggleShowOnOpen(list.id)}}>show</button>
        </div>
    )
}

export default ListsSortable;