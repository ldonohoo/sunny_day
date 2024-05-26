import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


function ListItemSortableHeader({item}) {


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
        if (item.group_header) {  
          switch (item.group_header_number) {
            case '1':
              return `This ${item.group_header}`;
            case '2':
              return `Next ${item.group_header}`;
            default:
              return `Next ${item.group_header} + ${item.group_header_number -2}`;
          }
        }
      }
      let headerText = assignHeader();   
    


return (
    // return a header row whenever the selected group 
    //    header type changes
    <div id="list-item-header"
         className="list-item-header"
         ref={setNodeRef} 
         style={style}>{ item.group_header ? <div>{headerText}</div> : null }
    </div>
    )

}

export default ListItemSortableHeader;